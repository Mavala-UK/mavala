import type {ReactNode} from 'react';
import {Layers} from './Layers';
import {Atom} from './Atom';
import {Timer} from './Timer';
import {Sparkles} from './Sparkles';
import {FlaskConical} from './FlaskConical';
import {Award} from './Award';
import {BookOpen} from './BookOpen';

const PREFIX_TO_ICON: ReadonlyArray<readonly [string, () => ReactNode]> = [
  ['award winning', Award],
  ['expert care', Atom],
  ['expert tip', Sparkles],
  ['featuring', Layers],
  ['how to apply', BookOpen],
  ['ingredients', FlaskConical],
  ['ritual', Timer],
];

const FALLBACK_ICONS: ReadonlyArray<() => ReactNode> = [
  Layers,
  Atom,
  Timer,
  Sparkles,
  FlaskConical,
  Award,
  BookOpen,
];

function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export function getAccordionIcon(
  title: string | null | undefined,
): ReactNode | null {
  if (!title) return null;
  const normalised = title.trim().toLowerCase();
  for (const [prefix, Icon] of PREFIX_TO_ICON) {
    if (normalised.startsWith(prefix)) return <Icon />;
  }
  const Icon = FALLBACK_ICONS[hashString(normalised) % FALLBACK_ICONS.length];
  return <Icon />;
}
