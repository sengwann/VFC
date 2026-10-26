import "server-only";

const MIN_RESOLUTION_NOTE_LENGTH = 5;
const MAX_RESOLUTION_NOTE_LENGTH = 500;

export type ValidationResult =
  | { ok: true; data: string }
  | { ok: false; error: string };

export function validateResolutionNote(raw: string): ValidationResult {
  const note = raw.trim();
  if (!note || note.length < MIN_RESOLUTION_NOTE_LENGTH) {
    return {
      ok: false,
      error: `Resolution note is required (minimum ${MIN_RESOLUTION_NOTE_LENGTH} characters).`,
    };
  }
  if (note.length > MAX_RESOLUTION_NOTE_LENGTH) {
    return {
      ok: false,
      error: `Resolution note must be at most ${MAX_RESOLUTION_NOTE_LENGTH} characters.`,
    };
  }
  return { ok: true, data: note };
}
