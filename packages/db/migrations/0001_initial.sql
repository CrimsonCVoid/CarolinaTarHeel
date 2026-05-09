-- ============================================================
-- Tar Heel Web Co. — Initial Schema (0001)
-- ============================================================

create extension if not exists pgcrypto;

-- Organizations: one per client business ----------------------------
create table organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  plan text not null default 'standard' check (plan in ('starter','standard','premium')),
  stripe_customer_id text,
  stripe_subscription_id text,
  stripe_subscription_status text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index on organizations(slug);
create index on organizations(stripe_customer_id);

-- Org membership ----------------------------------------------------
create table org_members (
  org_id uuid references organizations(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  role text not null check (role in ('owner','editor','operator')),
  invited_by uuid references auth.users(id),
  joined_at timestamptz default now(),
  primary key (org_id, user_id)
);

-- Sites -------------------------------------------------------------
create table sites (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references organizations(id) on delete cascade,
  domain text unique not null,
  template_id text not null,
  vercel_project_id text,
  vercel_deployment_url text,
  revalidation_secret text not null default encode(gen_random_bytes(32), 'hex'),
  preview_secret text not null default encode(gen_random_bytes(32), 'hex'),
  status text not null default 'draft' check (status in ('draft','live','archived')),
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index on sites(org_id);
create index on sites(domain);

-- Site-wide settings ------------------------------------------------
create table site_settings (
  site_id uuid primary key references sites(id) on delete cascade,
  brand jsonb not null default '{}'::jsonb,
  contact jsonb not null default '{}'::jsonb,
  hours jsonb not null default '{}'::jsonb,
  social jsonb not null default '{}'::jsonb,
  seo jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);

-- Pages -------------------------------------------------------------
create table pages (
  id uuid primary key default gen_random_uuid(),
  site_id uuid references sites(id) on delete cascade,
  slug text not null,
  title text,
  meta_description text,
  og_image_url text,
  draft_content jsonb not null default '{}'::jsonb,
  published_content jsonb,
  status text not null default 'draft' check (status in ('draft','published')),
  published_at timestamptz,
  updated_at timestamptz default now(),
  unique(site_id, slug)
);
create index on pages(site_id);

-- Version history ---------------------------------------------------
create table page_versions (
  id uuid primary key default gen_random_uuid(),
  page_id uuid references pages(id) on delete cascade,
  content jsonb not null,
  edited_by uuid references auth.users(id),
  reason text,
  created_at timestamptz default now()
);
create index on page_versions(page_id, created_at desc);

-- Media library -----------------------------------------------------
create table media (
  id uuid primary key default gen_random_uuid(),
  site_id uuid references sites(id) on delete cascade,
  storage_path text not null,
  public_url text not null,
  alt_text text,
  width int,
  height int,
  size_bytes bigint,
  mime_type text,
  uploaded_by uuid references auth.users(id),
  created_at timestamptz default now()
);
create index on media(site_id);

-- Audit log ---------------------------------------------------------
create table audit_log (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references organizations(id) on delete cascade,
  site_id uuid references sites(id) on delete cascade,
  user_id uuid references auth.users(id),
  action text not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);
create index on audit_log(org_id, created_at desc);
create index on audit_log(site_id, created_at desc);

-- Form submissions --------------------------------------------------
create table form_submissions (
  id uuid primary key default gen_random_uuid(),
  site_id uuid references sites(id) on delete cascade,
  form_id text not null,
  data jsonb not null,
  ip_hash text,
  user_agent text,
  status text not null default 'new' check (status in ('new','read','archived','spam')),
  created_at timestamptz default now()
);
create index on form_submissions(site_id, created_at desc);

-- updated_at triggers ----------------------------------------------
create or replace function set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger orgs_updated      before update on organizations  for each row execute function set_updated_at();
create trigger sites_updated     before update on sites          for each row execute function set_updated_at();
create trigger settings_updated  before update on site_settings  for each row execute function set_updated_at();
create trigger pages_updated     before update on pages          for each row execute function set_updated_at();

-- ============================================================
-- Row-Level Security
-- ============================================================
alter table organizations    enable row level security;
alter table org_members      enable row level security;
alter table sites            enable row level security;
alter table site_settings    enable row level security;
alter table pages            enable row level security;
alter table page_versions    enable row level security;
alter table media            enable row level security;
alter table audit_log        enable row level security;
alter table form_submissions enable row level security;

create or replace function is_operator(uid uuid) returns boolean as $$
  select exists(select 1 from org_members where user_id = uid and role = 'operator');
$$ language sql security definer stable;

create or replace function user_org_ids(uid uuid) returns setof uuid as $$
  select org_id from org_members where user_id = uid;
$$ language sql security definer stable;

-- Organizations ----
create policy "members read org" on organizations for select
  using (id in (select user_org_ids(auth.uid())) or is_operator(auth.uid()));
create policy "operator writes org" on organizations for all
  using (is_operator(auth.uid())) with check (is_operator(auth.uid()));

-- Org members ------
create policy "members see own membership" on org_members for select
  using (user_id = auth.uid() or org_id in (select user_org_ids(auth.uid())) or is_operator(auth.uid()));
create policy "operator manages members" on org_members for all
  using (is_operator(auth.uid())) with check (is_operator(auth.uid()));

-- Sites ------------
create policy "members read sites" on sites for select
  using (org_id in (select user_org_ids(auth.uid())) or is_operator(auth.uid()));
create policy "owners and operators write sites" on sites for all
  using (
    is_operator(auth.uid())
    or exists (
      select 1 from org_members
      where org_id = sites.org_id and user_id = auth.uid() and role in ('owner','operator')
    )
  );

-- Site settings ----
create policy "members read site_settings" on site_settings for select
  using (
    site_id in (select id from sites where org_id in (select user_org_ids(auth.uid())))
    or is_operator(auth.uid())
  );
create policy "editors write site_settings" on site_settings for all
  using (
    is_operator(auth.uid())
    or site_id in (
      select s.id from sites s
      join org_members m on m.org_id = s.org_id
      where m.user_id = auth.uid() and m.role in ('owner','editor','operator')
    )
  );

-- Pages ------------
create policy "members read pages" on pages for select
  using (
    site_id in (select id from sites where org_id in (select user_org_ids(auth.uid())))
    or is_operator(auth.uid())
  );
create policy "editors write pages" on pages for all
  using (
    is_operator(auth.uid())
    or site_id in (
      select s.id from sites s
      join org_members m on m.org_id = s.org_id
      where m.user_id = auth.uid() and m.role in ('owner','editor','operator')
    )
  );

-- Page versions ----
create policy "members read versions" on page_versions for select
  using (
    page_id in (
      select p.id from pages p
      join sites s on s.id = p.site_id
      where s.org_id in (select user_org_ids(auth.uid()))
    )
    or is_operator(auth.uid())
  );
create policy "editors insert versions" on page_versions for insert
  with check (
    is_operator(auth.uid())
    or page_id in (
      select p.id from pages p
      join sites s on s.id = p.site_id
      join org_members m on m.org_id = s.org_id
      where m.user_id = auth.uid() and m.role in ('owner','editor','operator')
    )
  );

-- Media ------------
create policy "members read media" on media for select
  using (
    site_id in (select id from sites where org_id in (select user_org_ids(auth.uid())))
    or is_operator(auth.uid())
  );
create policy "editors write media" on media for all
  using (
    is_operator(auth.uid())
    or site_id in (
      select s.id from sites s
      join org_members m on m.org_id = s.org_id
      where m.user_id = auth.uid() and m.role in ('owner','editor','operator')
    )
  );

-- Audit log --------
create policy "members read audit" on audit_log for select
  using (org_id in (select user_org_ids(auth.uid())) or is_operator(auth.uid()));

-- Form submissions -
create policy "editors read submissions" on form_submissions for select
  using (
    is_operator(auth.uid())
    or site_id in (
      select s.id from sites s
      join org_members m on m.org_id = s.org_id
      where m.user_id = auth.uid() and m.role in ('owner','editor','operator')
    )
  );
create policy "editors update submissions" on form_submissions for update
  using (
    is_operator(auth.uid())
    or site_id in (
      select s.id from sites s
      join org_members m on m.org_id = s.org_id
      where m.user_id = auth.uid() and m.role in ('owner','editor','operator')
    )
  );

-- ============================================================
-- Storage bucket for site media
-- ============================================================
insert into storage.buckets (id, name, public)
values ('site-media', 'site-media', true)
on conflict do nothing;

create policy "editors upload site media" on storage.objects for insert
  with check (
    bucket_id = 'site-media'
    and (
      is_operator(auth.uid())
      or (storage.foldername(name))[1]::uuid in (
        select s.id from sites s
        join org_members m on m.org_id = s.org_id
        where m.user_id = auth.uid() and m.role in ('owner','editor','operator')
      )
    )
  );

create policy "public read site media" on storage.objects for select
  using (bucket_id = 'site-media');

create policy "editors delete site media" on storage.objects for delete
  using (
    bucket_id = 'site-media'
    and (
      is_operator(auth.uid())
      or (storage.foldername(name))[1]::uuid in (
        select s.id from sites s
        join org_members m on m.org_id = s.org_id
        where m.user_id = auth.uid() and m.role in ('owner','editor','operator')
      )
    )
  );
