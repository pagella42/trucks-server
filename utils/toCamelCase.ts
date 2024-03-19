export function toCamelCase(s: string): string {
  return s
    .split(/-|\s+/)
    .filter((word) => word.length > 0)
    .reduce((result, word, index) => {
      let add = word.toLowerCase();
      add = index === 0 ? add : add.charAt(0).toUpperCase() + add.slice(1);
      return result + add;
    }, "");
}
