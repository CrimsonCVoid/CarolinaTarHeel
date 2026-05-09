import type { Config } from 'tailwindcss';
import preset from '@tarheel/config/tailwind-preset';

const config: Config = {
  presets: [preset as Config],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
    '../../packages/editor/src/**/*.{ts,tsx}',
    '../../packages/templates/src/**/*.{ts,tsx}',
  ],
};

export default config;
