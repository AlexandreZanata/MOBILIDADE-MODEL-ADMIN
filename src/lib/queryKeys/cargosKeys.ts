export const cargosKeys = {
  all: ["cargos"] as const,
  list: () => [...cargosKeys.all, "list"] as const,
  detail: (id: string) => [...cargosKeys.all, "detail", id] as const,
};
