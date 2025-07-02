export type LinkType = {
  type: 'email' | 'external' | 'internal' | null;
  url: string | '/' | null;
  email: string | null;
  text: string | null;
} | null;
