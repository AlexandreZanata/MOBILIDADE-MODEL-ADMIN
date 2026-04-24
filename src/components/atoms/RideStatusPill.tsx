import { useTranslation } from "react-i18next";
import { RideStatus } from "@/models/Ride";

const statusClasses: Record<RideStatus, string> = {
  [RideStatus.AGUARDANDO_MOTORISTA]: "bg-warning/15 text-warning",
  [RideStatus.MOTORISTA_ACEITOU]: "bg-info/15 text-info",
  [RideStatus.MOTORISTA_A_CAMINHO]: "bg-info/15 text-info",
  [RideStatus.MOTORISTA_CHEGOU]: "bg-brand-primary/15 text-brand-primary",
  [RideStatus.EM_ANDAMENTO]: "bg-brand-primary/15 text-brand-primary",
  [RideStatus.CONCLUIDA]: "bg-success/15 text-success",
  [RideStatus.CANCELADA_PASSAGEIRO]: "bg-danger/15 text-danger",
  [RideStatus.CANCELADA_MOTORISTA]: "bg-danger/15 text-danger",
  [RideStatus.CANCELADA_ADMIN]: "bg-danger/15 text-danger",
  [RideStatus.EXPIRADA]: "bg-neutral-200 text-neutral-700",
};

export interface RideStatusPillProps {
  status: RideStatus;
  "data-testid"?: string;
}

/**
 * Colored pill for ride status. Label resolved via i18n `rides:status.<STATUS>`.
 */
export function RideStatusPill({ status, ...props }: RideStatusPillProps) {
  const { t } = useTranslation("rides");
  const classes = statusClasses[status] ?? "bg-neutral-200 text-neutral-700";

  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        classes,
      ].join(" ")}
      {...props}
    >
      {t(`status.${status}`)}
    </span>
  );
}
