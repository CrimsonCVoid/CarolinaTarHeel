'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { EditorContext as EditorCtx } from './types.js';

const Ctx = createContext<EditorCtx | null>(null);

export function EditorProvider({ value, children }: { value: EditorCtx; children: ReactNode }) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useEditor(): EditorCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error('useEditor must be used inside <EditorProvider>');
  return v;
}
