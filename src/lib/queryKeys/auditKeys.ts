export const auditKeys = {
  all: ["audit"] as const,
  list: () => [...auditKeys.all, "list"] as const,
  filtered: (filters: Record<string, string | undefined>) =>
    [...auditKeys.all, "list", filters] as const,
};
