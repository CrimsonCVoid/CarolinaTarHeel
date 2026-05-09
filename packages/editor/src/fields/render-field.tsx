'use client';

import type { FieldMeta } from '@tarheel/templates';
import { TextField } from './text-field';
import { TextareaField } from './textarea-field';
import { BooleanField } from './boolean-field';
import { NumberField } from './number-field';
import { SelectField } from './select-field';
import { ColorField } from './color-field';
import { ImageField } from './image-field';
import { ObjectField } from './object-field';
import { ArrayField } from './array-field';
import { AddressField } from './address-field';
import { HoursField } from './hours-field';

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
