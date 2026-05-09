import { z } from 'zod';

/*
 * Optional URL field that tolerates empty strings.
 *
 * The image picker in the editor stores an empty string when the user
 * clears the field, but `z.string().url()` rejects "". Without
 * preprocess, every page with an image field cleared would crash the
 * preview / publish validation. preprocess converts "" → undefined
 * before the URL check, so the field is genuinely optional whether the
 * user never set it or cleared it.
 */
export const optionalUrl = () =>
  z.preprocess(
    (v) => (typeof v === 'string' && v.trim() === '' ? undefined : v),
    z.string().url().optional(),
  );

/** Same idea for any optional string that we want to treat "" as absent. */
export const optionalString = () =>
  z.preprocess(
    (v) => (typeof v === 'string' && v.trim() === '' ? undefined : v),
    z.string().optional(),
  );
