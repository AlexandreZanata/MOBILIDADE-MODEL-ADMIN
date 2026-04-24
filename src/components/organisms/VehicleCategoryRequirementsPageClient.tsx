"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Can } from "@/components/auth/Can";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { TableActionButton } from "@/components/atoms/TableActionButton";
import { Modal } from "@/components/molecules/Modal";
import { ConfirmDialog } from "@/components/molecules/ConfirmDialog";
import { ErrorState } from "@/components/molecules/ErrorState";
import { EmptyState } from "@/components/molecules/EmptyState";
import {
  useAdminVehicleCategoryRequirements,
  useUpsertVehicleCategoryRequirement,
  useDeleteVehicleCategoryRequirement,
} from "@/hooks/vehicles/useAdminVehicles";
import { Permission } from "@/models/Permission";
import type { VehicleCategoryRequirement } from "@/models/Vehicle";

/**
 * Vehicle category requirements management page organism.
 *
 * Displays all configured minimum-year requirements per service category.
 * Supports create/update (upsert) and delete with confirmation.
 * Deletion reverts the category to the global minimum year rule.
 */
export function VehicleCategoryRequirementsPageClient() {
  const { t } = useTranslation("vehicles");
  const { t: tc } = useTranslation("common");

  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<VehicleCategoryRequirement | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<VehicleCategoryRequirement | null>(null);

  const [categoryId, setCategoryId] = useState("");
  const [minYear, setMinYear] = useState("");
  const [minYearError, setMinYearError] = useState<string | null>(null);

  const { data: requirements, isLoading, isError, refetch } =
    useAdminVehicleCategoryRequirements();

  const { mutate: upsert, isPending: isUpserting } =
    useUpsertVehicleCategoryRequirement();

  const { mutate: deleteReq, isPending: isDeleting } =
    useDeleteVehicleCategoryRequirement();

  function openCreate() {
    setEditTarget(null);
    setCategoryId("");
    setMinYear("");
    setMinYearError(null);
    setFormOpen(true);
  }

  function openEdit(req: VehicleCategoryRequirement) {
    setEditTarget(req);
    setCategoryId(req.serviceCategoryId);
    setMinYear(String(req.minYear));
    setMinYearError(null);
    setFormOpen(true);
  }

  function handleSubmit() {
    const year = parseInt(minYear, 10);
    if (!categoryId.trim()) {
      setMinYearError(tc("error.generic"));
      return;
    }
    if (isNaN(year) || year < 1900 || year > 2100) {
      setMinYearError(tc("error.generic"));
      return;
    }
    setMinYearError(null);
    upsert(
      { serviceCategoryId: categoryId, minYear: year },
      { onSuccess: () => setFormOpen(false) }
    );
  }

  const items = requirements ?? [];

  return (
    <Can
      perform={Permission.VEHICLE_ADMIN_VIEW}
      fallback={
        <p className="text-sm font-medium text-danger">{t("page.accessDenied")}</p>
      }
    >
      <div className="space-y-4" data-testid="vehicle-requirements-page">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-neutral-900">
            {t("page.requirementsTitle")}
          </h1>
          <Can perform={Permission.VEHICLE_ADMIN_UPDATE}>
            <Button
              variant="primary"
              size="sm"
              onClick={openCreate}
              data-testid="btn-create-requirement"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              {t("actions.setRequirement")}
            </Button>
          </Can>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="space-y-2" data-testid="requirements-skeleton">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 w-full animate-pulse rounded-md bg-neutral-200" />
            ))}
          </div>
        )}

        {isError && (
          <ErrorState
            onRetry={() => void refetch()}
            data-testid="requirements-error"
          />
        )}

        {!isLoading && !isError && items.length === 0 && (
          <EmptyState
            namespace="vehicles"
            titleKey="empty.requirementsTitle"
            messageKey="empty.requirementsMessage"
          />
        )}

        {!isLoading && !isError && items.length > 0 && (
          <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
            <table className="w-full text-sm" data-testid="requirements-table">
              <thead className="bg-neutral-50 text-xs font-medium uppercase text-neutral-500">
                <tr>
                  <th className="px-4 py-3 text-left">{t("fields.serviceCategory")}</th>
                  <th className="px-4 py-3 text-left">{t("fields.minYear")}</th>
                  <th className="px-4 py-3 text-left">{tc("table.actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {items.map((req: VehicleCategoryRequirement) => (
                  <tr key={req.id} className="transition-colors hover:bg-neutral-50">
                    <td className="px-4 py-3 font-mono text-sm text-neutral-700">
                      {req.serviceCategoryId}
                    </td>
                    <td className="px-4 py-3 font-semibold text-neutral-900">
                      {req.minYear}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Can perform={Permission.VEHICLE_ADMIN_UPDATE}>
                          <TableActionButton
                            icon={Pencil}
                            label={t("actions.setRequirement")}
                            variant="default"
                            onClick={() => openEdit(req)}
                            data-testid={`btn-edit-req-${req.id}`}
                          />
                        </Can>
                        <Can perform={Permission.VEHICLE_ADMIN_DELETE}>
                          <TableActionButton
                            icon={Trash2}
                            label={t("actions.deleteRequirement")}
                            variant="danger"
                            onClick={() => setDeleteTarget(req)}
                            data-testid={`btn-delete-req-${req.id}`}
                          />
                        </Can>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Upsert modal */}
      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={t("requirement.upsertTitle")}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setFormOpen(false)}>
              {tc("actions.cancel")}
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSubmit}
              isLoading={isUpserting}
              data-testid="btn-submit-requirement"
            >
              {tc("actions.save")}
            </Button>
          </div>
        }
        data-testid="requirement-form-modal"
      >
        <div className="flex flex-col gap-4">
          <Input
            label={t("requirement.categoryLabel")}
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            placeholder="UUID of the service category"
            disabled={!!editTarget}
            data-testid="input-category-id"
          />
          <Input
            label={t("requirement.minYearLabel")}
            type="number"
            min="1900"
            max="2100"
            value={minYear}
            onChange={(e) => setMinYear(e.target.value)}
            placeholder={t("requirement.minYearPlaceholder")}
            helperText={t("requirement.minYearHelperText")}
            error={minYearError ?? undefined}
            data-testid="input-min-year"
          />
        </div>
      </Modal>

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (!deleteTarget) return;
          deleteReq(deleteTarget.serviceCategoryId, {
            onSettled: () => setDeleteTarget(null),
          });
        }}
        title={t("requirement.deleteTitle")}
        description={t("requirement.deleteDescription")}
        confirmLabel={tc("actions.delete")}
        cancelLabel={tc("actions.cancel")}
        confirmLoading={isDeleting}
        data-testid="delete-requirement-dialog"
      />
    </Can>
  );
}
