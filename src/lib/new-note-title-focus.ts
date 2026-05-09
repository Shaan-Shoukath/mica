const pending = new Set<string>();

export function markNewNote(path: string) {
  pending.add(path);
}

export function isNewNote(path: string): boolean {
  return pending.has(path);
}

export function clearNewNote(path: string) {
  pending.delete(path);
}
