export const servidoresKeys = {
  all: ["servidores"] as const,
  list: () => [...servidoresKeys.all, "list"] as const,
  detail: (id: string) => [...servidoresKeys.all, "detail", id] as const,
};
