'use client';

import type { FieldMeta } from '@tarheel/templates';
import { TextField } from './text-field.js';
import { TextareaField } from './textarea-field.js';
import { BooleanField } from './boolean-field.js';
import { NumberField } from './number-field.js';
import { SelectField } from './select-field.js';
import { ColorField } from './color-field.js';
import { ImageField } from './image-field.js';
import { ObjectField } from './object-field.js';
import { ArrayField } from './array-field.js';
import { AddressField } from './address-field.js';
import { HoursField } from './hours-field.js';

interface Args {
  name: string;
  meta: FieldMeta;
  value: unknown;
  onChange: (next: unknown) => void;
  error?: string;
}

export function renderField(args: Args) {
  const { meta } = args;
  const C = pick(meta);
  return <C key={args.name} {...args} />;
}

function pick(meta: FieldMeta) {
  switch (meta.kind) {
    case 'text':
    case 'url':
    case 'email':
    case 'phone':
    case 'richtext':
      return TextField;
    case 'textarea':
      return TextareaField;
    case 'boolean':
      return BooleanField;
    case 'number':
      return NumberField;
    case 'select':
      return SelectField;
    case 'color':
      return ColorField;
    case 'image':
      return ImageField;
    case 'object':
      return ObjectField;
    case 'array':
      return ArrayField;
    case 'address':
      return AddressField;
    case 'hours':
      return HoursField;
    default:
      return TextField;
  }
}
