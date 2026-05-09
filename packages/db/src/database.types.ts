// This file is replaced at deploy time by `pnpm --filter @tarheel/db gen-types`.
// The shapes below are hand-typed mirrors of migrations/0001_initial.sql so the
// rest of the monorepo can typecheck before a Supabase project exists.

export type Json = string | number | boolean | null | { [k: string]: Json | undefined } | Json[];

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
}

export interface DayHours {
  open?: string; // "11:00"
  close?: string; // "21:00"
  closed?: boolean;
}

export interface WeeklyHours {
  mon?: DayHours;
  tue?: DayHours;
  wed?: DayHours;
  thu?: DayHours;
  fri?: DayHours;
  sat?: DayHours;
  sun?: DayHours;
  note?: string;
}

export interface Brand {
  name?: string;
  logoUrl?: string;
  primary?: string;
  font?: string;
}

export interface Contact {
  phone?: string;
  email?: string;
  address?: Address;
}

export interface Social {
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  google?: string;
  yelp?: string;
}

export interface SeoDefaults {
  defaultOgImage?: string;
  gtmId?: string;
  twitterHandle?: string;
}

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string;
          name: string;
          slug: string;
          plan: 'starter' | 'standard' | 'premium';
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          stripe_subscription_status: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['organizations']['Row']> & {
          name: string;
          slug: string;
        };
        Update: Partial<Database['public']['Tables']['organizations']['Row']>;
      };
      org_members: {
        Row: {
          org_id: string;
          user_id: string;
          role: 'owner' | 'editor' | 'operator';
          invited_by: string | null;
          joined_at: string;
        };
        Insert: Database['public']['Tables']['org_members']['Row'];
        Update: Partial<Database['public']['Tables']['org_members']['Row']>;
      };
      sites: {
        Row: {
          id: string;
          org_id: string;
          domain: string;
          template_id: string;
          vercel_project_id: string | null;
          vercel_deployment_url: string | null;
          revalidation_secret: string;
          preview_secret: string;
          status: 'draft' | 'live' | 'archived';
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['sites']['Row']> & {
          org_id: string;
          domain: string;
          template_id: string;
        };
        Update: Partial<Database['public']['Tables']['sites']['Row']>;
      };
      site_settings: {
        Row: {
          site_id: string;
          brand: Brand;
          contact: Contact;
          hours: WeeklyHours;
          social: Social;
          seo: SeoDefaults;
          updated_at: string;
        };
        Insert: { site_id: string } & Partial<Omit<Database['public']['Tables']['site_settings']['Row'], 'site_id'>>;
        Update: Partial<Database['public']['Tables']['site_settings']['Row']>;
      };
      pages: {
        Row: {
          id: string;
          site_id: string;
          slug: string;
          title: string | null;
          meta_description: string | null;
          og_image_url: string | null;
          draft_content: Json;
          published_content: Json | null;
          status: 'draft' | 'published';
          published_at: string | null;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['pages']['Row']> & {
          site_id: string;
          slug: string;
        };
        Update: Partial<Database['public']['Tables']['pages']['Row']>;
      };
      page_versions: {
        Row: {
          id: string;
          page_id: string;
          content: Json;
          edited_by: string | null;
          reason: string | null;
          created_at: string;
        };
        Insert: { page_id: string; content: Json; edited_by?: string | null; reason?: string | null };
        Update: Partial<Database['public']['Tables']['page_versions']['Row']>;
      };
      media: {
        Row: {
          id: string;
          site_id: string;
          storage_path: string;
          public_url: string;
          alt_text: string | null;
          width: number | null;
          height: number | null;
          size_bytes: number | null;
          mime_type: string | null;
          uploaded_by: string | null;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['media']['Row']> & {
          site_id: string;
          storage_path: string;
          public_url: string;
        };
        Update: Partial<Database['public']['Tables']['media']['Row']>;
      };
      audit_log: {
        Row: {
          id: string;
          org_id: string;
          site_id: string | null;
          user_id: string | null;
          action: string;
          metadata: Json;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['audit_log']['Row']> & { org_id: string; action: string };
        Update: Partial<Database['public']['Tables']['audit_log']['Row']>;
      };
      form_submissions: {
        Row: {
          id: string;
          site_id: string;
          form_id: string;
          data: Json;
          ip_hash: string | null;
          user_agent: string | null;
          status: 'new' | 'read' | 'archived' | 'spam';
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['form_submissions']['Row']> & {
          site_id: string;
          form_id: string;
          data: Json;
        };
        Update: Partial<Database['public']['Tables']['form_submissions']['Row']>;
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_operator: { Args: { uid: string }; Returns: boolean };
    };
    Enums: Record<string, never>;
  };
}
