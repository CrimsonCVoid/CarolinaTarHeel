import type { FieldMeta } from '@tarheel/templates';

export interface FieldComponentProps {
  name: string;
  meta: FieldMeta;
  value: unknown;
  onChange: (next: unknown) => void;
  error?: string;
}

export interface UploadHandler {
  (file: File): Promise<{ url: string; width?: number; height?: number; alt?: string }>;
}

export interface EditorContext {
  upload: UploadHandler;
  siteId: string;
}
