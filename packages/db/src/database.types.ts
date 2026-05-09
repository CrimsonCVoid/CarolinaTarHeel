// Permissive Database stub. Replace with the output of:
//   pnpm --filter @tarheel/db gen-types
// once `supabase link --project-ref <ref>` is configured. The runtime contract
// is enforced by RLS + Zod schemas at API boundaries; this file just gives
// supabase-js v2's generic constraints something valid to chew on.

export type Json = string | number | boolean | null | { [k: string]: Json | undefined } | Json[];

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
}

export interface DayHours {
  open?: string;
  close?: string;
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

/* eslint-disable @typescript-eslint/no-explicit-any */
type GenericRow = Record<string, any>;
type GenericTable = {
  Row: GenericRow;
  Insert: GenericRow;
  Update: GenericRow;
  Relationships: never[];
};

export type Database = {
  public: {
    Tables: {
      organizations: GenericTable;
      org_members: GenericTable;
      sites: GenericTable;
      site_settings: GenericTable;
      pages: GenericTable;
      page_versions: GenericTable;
      media: GenericTable;
      audit_log: GenericTable;
      form_submissions: GenericTable;
    };
    Views: Record<string, never>;
    Functions: {
      is_operator: { Args: { uid: string }; Returns: boolean };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
