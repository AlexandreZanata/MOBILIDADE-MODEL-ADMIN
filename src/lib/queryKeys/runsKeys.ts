export const runsKeys = {
  all: ["runs"] as const,
  list: () => [...runsKeys.all, "list"] as const,
  detail: (id: string) => [...runsKeys.all, "detail", id] as const,
};
