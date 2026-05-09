-- ============================================================
-- 0002 — Decouple page slug (URL) from template page key (schema)
-- ============================================================
--
-- Until now, pages.slug doubled as both the URL and the lookup key into
-- the template's pages array. That meant changing a slug (e.g. /menu →
-- /food) would orphan the row from its schema. We split the concerns:
--
--   pages.slug              — URL path on the public site (editable)
--   pages.template_page_key — stable identifier of the template page
--                             definition (NOT editable — it's the
--                             schema's own slug)
--
-- Existing rows: backfill template_page_key from the current slug.
-- That's correct because everyone shipping today has slug == template
-- key. New pages renamed afterward will keep the original key while
-- slug changes.

alter table pages add column if not exists template_page_key text;

update pages
   set template_page_key = slug
 where template_page_key is null;

alter table pages alter column template_page_key set not null;

-- The (site_id, slug) unique constraint still applies — two pages on
-- the same site can't share a URL. (site_id, template_page_key) is
-- ALSO unique because each template page slot can only be filled
-- once per site.
create unique index if not exists pages_site_template_page_key_uniq
  on pages (site_id, template_page_key);

-- Audit trail entry for the migration so operators can confirm.
insert into audit_log (org_id, site_id, user_id, action, metadata)
select
  org_id,
  id,
  null,
  'migration.0002_template_page_key',
  jsonb_build_object('migrated_at', now())
from sites
where exists (select 1 from pages where pages.site_id = sites.id);
