export const billingKeys = {
  all: ["billing"] as const,

  config: () => [...billingKeys.all, "config"] as const,

  cycleDetail: (cycleId: string) =>
    [...billingKeys.all, "cycle", cycleId] as const,

  driverStatus: (driverId: string) =>
    [...billingKeys.all, "driver", driverId, "status"] as const,

  driverCycles: (driverId: string) =>
    [...billingKeys.all, "driver", driverId, "cycles"] as const,

  jobHistory: () => [...billingKeys.all, "jobs", "history"] as const,
};
