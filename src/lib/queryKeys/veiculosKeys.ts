export const veiculosKeys = {
  all: ["veiculos"] as const,
  list: () => [...veiculosKeys.all, "list"] as const,
  detail: (id: string) => [...veiculosKeys.all, "detail", id] as const,
};
