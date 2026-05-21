import type {ReactNode} from 'react';
import {Layers} from './Layers';
import {Atom} from './Atom';
import {Timer} from './Timer';
import {Sparkles} from './Sparkles';
import {FlaskConical} from './FlaskConical';
import {Award} from './Award';
import {BookOpen} from './BookOpen';
import {HelpCircle} from './HelpCircle';
import {Molecule} from './Molecule';
import {AlertCircle} from './AlertCircle';

/** Icon component type used for Set-based de-dup by function reference. */
type IconFn = () => ReactNode;

const PREFIX_TO_ICON: ReadonlyArray<readonly [string, IconFn]> = [
  ['award winning', Award],
  ['expert care', Atom],
  ['expert tip', Sparkles],
  ['featuring', Layers],
  ['how to apply', BookOpen],
  ['active ingredient', Molecule],
  ['ingredient', FlaskConical],
  ['ritual', Timer],
  ['how to use', BookOpen],
  ['precautions of use', AlertCircle],
  ['results', Award],
  ['texture', Layers],
  ['result', Award],
  ['usage tips', BookOpen],
  ['benefits', Award],
  ['important', Atom],
];

const FALLBACK_ICONS: ReadonlyArray<IconFn> = [
  Layers,
  Atom,
  Timer,
  Sparkles,
  FlaskConical,
  Award,
  BookOpen,
  Molecule,
  AlertCircle,
];

function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

/**
 * Per-page icon assignment. Takes all accordion titles on a single page,
 * returns a Map from each title to its JSX icon element.
 *
 * Three passes:
 * 1. Prefix matches: title starts with a PREFIX_TO_ICON key → that icon.
 * 2. FAQ detection: title ends with "?" → HelpCircle (no de-dup; multiple
 *    FAQ entries on one page all get HelpCircle, which is semantically correct).
 * 3. Fallback: starting from hashString(title) % FALLBACK_ICONS.length,
 *    walk forward to find an icon NOT already used by a prefix match or FAQ
 *    on this page. This avoids two identical fallback icons on the same page
 *    when the hash would otherwise collide with an already-used icon.
 */
export function assignIcons(
  titles: readonly (string | null | undefined)[],
): Map<string, ReactNode> {
  const usedIcons = new Set<IconFn>();
  const assignments = new Map<string, ReactNode>();

  // Normalise titles for lookup (trim + lowercase)
  const entries = titles
    .filter((t): t is string => typeof t === 'string')
    .map((t) => [t, t.trim().toLowerCase()] as const);

  // Pass 1: prefix matches
  for (const [original, normalised] of entries) {
    for (const [prefix, Icon] of PREFIX_TO_ICON) {
      if (normalised.startsWith(prefix)) {
        assignments.set(original, <Icon />);
        usedIcons.add(Icon);
        break;
      }
    }
  }

  // Pass 2: FAQ detection. Question-mark titles always get HelpCircle.
  // Long-statement titles (5+ words, never prefix-matched) also get
  // HelpCircle since they are FAQ/statement entries, not product-data
  // accordion titles which are typically 1-4 words.
  for (const [original, normalised] of entries) {
    if (assignments.has(original)) continue;
    const isQuestion = normalised.endsWith('?');
    const wordCount = normalised.split(/\s+/).filter(Boolean).length;
    if (isQuestion || wordCount >= 5) {
      assignments.set(original, <HelpCircle />);
      usedIcons.add(HelpCircle);
    }
  }

  // Pass 3: fallback with de-dup against icons already on this page
  for (const [original, normalised] of entries) {
    if (assignments.has(original)) continue;
    const startIdx = hashString(normalised) % FALLBACK_ICONS.length;
    let Icon = FALLBACK_ICONS[startIdx];
    // Walk forward to find an icon not already used on this page
    if (usedIcons.has(Icon)) {
      for (let i = 1; i < FALLBACK_ICONS.length; i++) {
        const candidate = FALLBACK_ICONS[(startIdx + i) % FALLBACK_ICONS.length];
        if (!usedIcons.has(candidate)) {
          Icon = candidate;
          break;
        }
      }
    }
    assignments.set(original, <Icon />);
    usedIcons.add(Icon);
  }

  return assignments;
}

/**
 * Per-title icon lookup (simple, no de-dup). Kept for backwards compatibility
 * with callers that don't have the full page title list available.
 */
export function getAccordionIcon(
  title: string | null | undefined,
): ReactNode | null {
  if (!title) return null;
  const normalised = title.trim().toLowerCase();
  for (const [prefix, Icon] of PREFIX_TO_ICON) {
    if (normalised.startsWith(prefix)) return <Icon />;
  }
  if (normalised.endsWith('?')) return <HelpCircle />;
  const Icon = FALLBACK_ICONS[hashString(normalised) % FALLBACK_ICONS.length];
  return <Icon />;
}
