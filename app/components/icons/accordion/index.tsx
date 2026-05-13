import type {ReactNode} from 'react';
import {Layers} from './Layers';
import {Atom} from './Atom';
import {Timer} from './Timer';
import {Sparkles} from './Sparkles';
import {FlaskConical} from './FlaskConical';
import {Award} from './Award';

const PREFIX_TO_ICON: ReadonlyArray<readonly [string, () => ReactNode]> = [
  ['award winning', Award],
  ['expert care', Atom],
  ['expert tip', Sparkles],
  ['featuring', Layers],
  ['ingredients', FlaskConical],
  ['ritual', Timer],
];

export function getAccordionIcon(
  title: string | null | undefined,
): ReactNode | null {
  if (!title) return null;
  const normalised = title.trim().toLowerCase();
  for (const [prefix, Icon] of PREFIX_TO_ICON) {
    if (normalised.startsWith(prefix)) return <Icon />;
  }
  return null;
}
