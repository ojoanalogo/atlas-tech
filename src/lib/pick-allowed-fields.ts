/**
 * Pick only the specified keys from a data object.
 * Used to sanitize user-submitted payloads against an allowlist of field names.
 */
export function pickAllowedFields(
  data: Record<string, unknown>,
  allowedFields: readonly string[],
): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  for (const key of allowedFields) {
    if (key in data) {
      result[key] = data[key]
    }
  }
  return result
}
