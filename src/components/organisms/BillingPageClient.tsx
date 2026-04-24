"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Settings, Play, RefreshCw, CheckCircle, XCircle } from "lucide-react";
import { Can } from "@/components/auth/Can";
import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";
import { Input } from "@/components/atoms/Input";
import { Modal } from "@/components/molecules/Modal";
import { ConfirmDialog } from "@/components/molecules/ConfirmDialog";
import { ErrorState } from "@/components/molecules/ErrorState";
import { EmptyState } from "@/components/molecules/EmptyState";
import {
  useBillingConfig,
  useUpdateBillingConfig,
  useJobHistory,
  useRunBillingCycleJob,
  useRunExpirationCheck,
} from "@/hooks/billing/useBilling";
import { Permission } from "@/models/Permission";
import type { BillingCycleUnit } from "@/models/Billing";
import type { UpdateBillingConfigInput } from "@/types/billing";

const CYCLE_UNITS: BillingCycleUnit[] = ["MINUTES", "HOURS", "DAYS"];

/**
 * Billing admin page organism.
 * Shows global billing configuration and job execution history.
 * Allows editing config and manually triggering billing jobs.
 */
export function BillingPageClient() {
  const { t, i18n } = useTranslation("billing");
  const { t: tc } = useTranslation("common");

  const [configOpen, setConfigOpen] = useState(false);
  const [runCycleConfirm, setRunCycleConfirm] = useState(false);
  const [runExpirationConfirm, setRunExpirationConfirm] = useState(false);

  // Form state mirrors UpdateBillingConfigInput
  const [form, setForm] = useState<UpdateBillingConfigInput>({});

  const { data: config, isLoading: configLoading, isError: configError, refetch: refetchConfig } =
    useBillingConfig();
  const { data: jobs, isLoading: jobsLoading, isError: jobsError, refetch: refetchJobs } =
    useJobHistory();
  const { mutate: updateConfig, isPending: isUpdating } = useUpdateBillingConfig();
  const { mutate: runCycle, isPending: isRunningCycle } = useRunBillingCycleJob();
  const { mutate: runExpiration, isPending: isRunningExpiration } = useRunExpirationCheck();

  function openConfigEdit() {
    if (!config) return;
    setForm({
      cycleUnit: config.cycleUnit,
      cycleInterval: config.cycleInterval,
      executionTime: config.executionTime,
      executionTimezone: config.executionTimezone,
      pricePerRide: config.pricePerRide,
      minimumCharge: config.minimumCharge,
      pixExpirationDays: config.pixExpirationDays,
      gracePeriodHours: config.gracePeriodHours,
      autoBlockEnabled: config.autoBlockEnabled,
      blockAfterCycles: config.blockAfterCycles,
      isActive: config.isActive,
    });
    setConfigOpen(true);
  }

  function handleConfigSave() {
    updateConfig(form, { onSuccess: () => setConfigOpen(false) });
  }

  const currency = new Intl.NumberFormat(i18n.language, {
    style: "currency",
    currency: "BRL",
  });

  return (
    <Can
      perform={Permission.BILLING_CONFIG_VIEW}
      fallback={<p className="text-sm font-medium text-danger">{t("page.accessDenied")}</p>}
    >
      <div className="space-y-6" data-testid="billing-page">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-neutral-900">{t("page.title")}</h1>
          <Can perform={Permission.BILLING_CONFIG_UPDATE}>
            <Button
              variant="primary"
              size="sm"
              onClick={openConfigEdit}
              disabled={!config}
              data-testid="btn-edit-config"
            >
              <Settings className="h-4 w-4" aria-hidden="true" />
              {t("config.editTitle")}
            </Button>
          </Can>
        </div>

        {/* Config card */}
        {configLoading && (
          <div className="h-48 w-full animate-pulse rounded-xl bg-neutral-200" data-testid="config-skeleton" />
        )}
        {configError && (
          <ErrorState onRetry={() => void refetchConfig()} data-testid="config-error" />
        )}
        {config && (
          <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm" data-testid="config-card">
            <h2 className="mb-4 text-sm font-semibold text-neutral-900">{t("page.configTitle")}</h2>
            <dl className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm sm:grid-cols-3">
              {[
                { label: t("config.cycleUnit"), value: config.cycleUnit },
                { label: t("config.cycleInterval"), value: String(config.cycleInterval) },
                { label: t("config.executionTime"), value: config.executionTime },
                { label: t("config.executionTimezone"), value: config.executionTimezone },
                { label: t("config.pricePerRide"), value: currency.format(config.pricePerRide) },
                { label: t("config.minimumCharge"), value: currency.format(config.minimumCharge) },
                { label: t("config.pixExpirationDays"), value: String(config.pixExpirationDays) },
                { label: t("config.gracePeriodHours"), value: String(config.gracePeriodHours) },
                { label: t("config.blockAfterCycles"), value: String(config.blockAfterCycles) },
              ].map(({ label, value }) => (
                <div key={label}>
                  <dt className="text-neutral-500">{label}</dt>
                  <dd className="font-medium text-neutral-900">{value}</dd>
                </div>
              ))}
              <div>
                <dt className="text-neutral-500">{t("config.autoBlockEnabled")}</dt>
                <dd>
                  <Badge variant={config.autoBlockEnabled ? "success" : "neutral"}>
                    {config.autoBlockEnabled ? tc("status.active") : tc("status.inactive")}
                  </Badge>
                </dd>
              </div>
              <div>
                <dt className="text-neutral-500">{t("config.isActive")}</dt>
                <dd>
                  <Badge variant={config.isActive ? "success" : "neutral"}>
                    {config.isActive ? tc("status.active") : tc("status.inactive")}
                  </Badge>
                </dd>
              </div>
            </dl>
          </div>
        )}

        {/* Job triggers */}
        <Can perform={Permission.BILLING_JOBS_RUN}>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setRunCycleConfirm(true)}
              isLoading={isRunningCycle}
              data-testid="btn-run-billing-cycle"
            >
              <Play className="h-4 w-4" aria-hidden="true" />
              {t("jobs.runBillingCycle")}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setRunExpirationConfirm(true)}
              isLoading={isRunningExpiration}
              data-testid="btn-run-expiration-check"
            >
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              {t("jobs.runExpirationCheck")}
            </Button>
          </div>
        </Can>

        {/* Job history */}
        <Can perform={Permission.BILLING_JOBS_VIEW}>
          <div>
            <h2 className="mb-3 text-sm font-semibold text-neutral-900">{t("page.jobsTitle")}</h2>

            {jobsLoading && (
              <div className="space-y-2" data-testid="jobs-skeleton">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-10 w-full animate-pulse rounded-md bg-neutral-200" />
                ))}
              </div>
            )}

            {jobsError && (
              <ErrorState onRetry={() => void refetchJobs()} data-testid="jobs-error" />
            )}

            {!jobsLoading && !jobsError && (!jobs || jobs.length === 0) && (
              <EmptyState
                namespace="billing"
                titleKey="empty.jobsTitle"
                messageKey="empty.jobsMessage"
              />
            )}

            {!jobsLoading && !jobsError && jobs && jobs.length > 0 && (
              <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
                <table className="w-full text-sm" data-testid="jobs-table">
                  <thead className="bg-neutral-50 text-xs font-medium uppercase text-neutral-500">
                    <tr>
                      <th className="px-4 py-3 text-left">{t("jobs.fields.jobType")}</th>
                      <th className="px-4 py-3 text-left">{t("jobs.fields.status")}</th>
                      <th className="px-4 py-3 text-left">{t("jobs.fields.cyclesGenerated")}</th>
                      <th className="px-4 py-3 text-left">{t("jobs.fields.driversBlocked")}</th>
                      <th className="px-4 py-3 text-left">{t("jobs.fields.durationMs")}</th>
                      <th className="px-4 py-3 text-left">{t("jobs.fields.startedAt")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {jobs.map((job) => (
                      <tr key={job.id} className="transition-colors hover:bg-neutral-50">
                        <td className="px-4 py-3 font-mono text-xs text-neutral-700">{job.jobType}</td>
                        <td className="px-4 py-3">
                          {job.status === "COMPLETED" ? (
                            <span className="inline-flex items-center gap-1 text-success">
                              <CheckCircle className="h-3.5 w-3.5" aria-hidden="true" />
                              {job.status}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-danger">
                              <XCircle className="h-3.5 w-3.5" aria-hidden="true" />
                              {job.status}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-neutral-800">{job.cyclesGenerated}</td>
                        <td className="px-4 py-3 text-neutral-800">{job.driversBlocked}</td>
                        <td className="px-4 py-3 text-neutral-600">{job.durationMs}ms</td>
                        <td className="px-4 py-3 text-neutral-600">
                          {new Intl.DateTimeFormat(i18n.language, {
                            dateStyle: "short",
                            timeStyle: "short",
                          }).format(new Date(job.startedAt))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Can>
      </div>

      {/* Edit config modal */}
      <Modal
        open={configOpen}
        onClose={() => setConfigOpen(false)}
        title={t("config.editTitle")}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setConfigOpen(false)}>
              {tc("actions.cancel")}
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleConfigSave}
              isLoading={isUpdating}
              data-testid="btn-save-config"
            >
              {tc("actions.save")}
            </Button>
          </div>
        }
        data-testid="config-modal"
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-neutral-700">{t("config.cycleUnit")}</label>
            <select
              value={form.cycleUnit ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, cycleUnit: e.target.value as BillingCycleUnit }))}
              className="h-9 rounded-lg border border-neutral-300 bg-neutral-50 px-3 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-primary"
              data-testid="select-cycle-unit"
            >
              {CYCLE_UNITS.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
          <Input
            label={t("config.cycleInterval")}
            type="number"
            min="1"
            value={form.cycleInterval ?? ""}
            onChange={(e) => setForm((f) => ({ ...f, cycleInterval: parseInt(e.target.value, 10) }))}
            data-testid="input-cycle-interval"
          />
          <Input
            label={t("config.executionTime")}
            type="text"
            placeholder="06:00"
            value={form.executionTime ?? ""}
            onChange={(e) => setForm((f) => ({ ...f, executionTime: e.target.value }))}
            data-testid="input-execution-time"
          />
          <Input
            label={t("config.executionTimezone")}
            type="text"
            placeholder="America/Sao_Paulo"
            value={form.executionTimezone ?? ""}
            onChange={(e) => setForm((f) => ({ ...f, executionTimezone: e.target.value }))}
            data-testid="input-timezone"
          />
          <Input
            label={t("config.pricePerRide")}
            type="number"
            min="0"
            step="0.01"
            value={form.pricePerRide ?? ""}
            onChange={(e) => setForm((f) => ({ ...f, pricePerRide: parseFloat(e.target.value) }))}
            data-testid="input-price-per-ride"
          />
          <Input
            label={t("config.minimumCharge")}
            type="number"
            min="0"
            step="0.01"
            value={form.minimumCharge ?? ""}
            onChange={(e) => setForm((f) => ({ ...f, minimumCharge: parseFloat(e.target.value) }))}
            data-testid="input-minimum-charge"
          />
          <Input
            label={t("config.pixExpirationDays")}
            type="number"
            min="1"
            value={form.pixExpirationDays ?? ""}
            onChange={(e) => setForm((f) => ({ ...f, pixExpirationDays: parseInt(e.target.value, 10) }))}
            data-testid="input-pix-expiration"
          />
          <Input
            label={t("config.gracePeriodHours")}
            type="number"
            min="0"
            value={form.gracePeriodHours ?? ""}
            onChange={(e) => setForm((f) => ({ ...f, gracePeriodHours: parseInt(e.target.value, 10) }))}
            data-testid="input-grace-period"
          />
          <Input
            label={t("config.blockAfterCycles")}
            type="number"
            min="1"
            value={form.blockAfterCycles ?? ""}
            onChange={(e) => setForm((f) => ({ ...f, blockAfterCycles: parseInt(e.target.value, 10) }))}
            data-testid="input-block-after-cycles"
          />
        </div>
      </Modal>

      {/* Run billing cycle confirm */}
      <ConfirmDialog
        open={runCycleConfirm}
        onClose={() => setRunCycleConfirm(false)}
        onConfirm={() => { runCycle(); setRunCycleConfirm(false); }}
        title={t("jobs.runBillingCycle")}
        description={tc("confirm.description")}
        confirmLabel={tc("actions.confirm")}
        cancelLabel={tc("actions.cancel")}
        data-testid="confirm-run-cycle"
      />

      {/* Run expiration check confirm */}
      <ConfirmDialog
        open={runExpirationConfirm}
        onClose={() => setRunExpirationConfirm(false)}
        onConfirm={() => { runExpiration(); setRunExpirationConfirm(false); }}
        title={t("jobs.runExpirationCheck")}
        description={tc("confirm.description")}
        confirmLabel={tc("actions.confirm")}
        cancelLabel={tc("actions.cancel")}
        data-testid="confirm-run-expiration"
      />
    </Can>
  );
}
