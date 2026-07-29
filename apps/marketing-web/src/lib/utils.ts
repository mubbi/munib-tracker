/** Join truthy class-name parts. Small, dependency-free `cn`. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
