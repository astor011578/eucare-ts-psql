export function getEnv(variableName: string): string | undefined {
  const value = process.env[variableName];
  if (!value) return undefined;
  return value.trim();
}
