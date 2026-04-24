"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Can } from "@/components/auth/Can";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Modal } from "@/components/molecules/Modal";
import { ConfirmDialog } from "@/components/molecules/ConfirmDialog";
import { ErrorState } from "@/components/molecules/ErrorState";
import { EmptyState } from "@/components/molecules/EmptyState";
import {
  useAdminVehicleBrands,
  useCreateVehicleBrand,
  useUpdateVehicleBrand,
  useDeleteVehicleBrand,
} from "@/hooks/vehicles/useAdminVehicles";
import { Permission } from "@/models/Permission";
import type { VehicleBrand } from "@/models/Vehicle";

/**
 * Vehicle reference (brands) management page organism.
 */
export function VehicleReferencePageClient() {
  const { t } = useTranslation("vehicles");
  const { t: tc } = useTranslation("common");

  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<VehicleBrand | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<VehicleBrand | null>(null);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);

  const { data, isLoading, isError, refetch } = useAdminVehicleBrands();
  const { mutate: createBrand, isPending: isCreating } = useCreateVehicleBrand();
  const { mutate: updateBrand, isPending: isUpdating } = useUpdateVehicleBrand();
  const { mutate: deleteBrand, isPending: isDeleting } = useDeleteVehicleBrand();

  const brands = data?.items ?? [];

  function openCreate() {
    setEditTarget(null);
    setName("");
    setSlug("");
    setNameError(null);
    setFormOpen(true);
  }

  function openEdit(brand: VehicleBrand) {
    setEditTarget(brand);
    setName(brand.name);
    setSlug(brand.slug);
    setNameError(null);
    setFormOpen(true);
  }

  function handleSubmit() {
    if (!name.trim()) {
      setNameError(tc("error.generic"));
      return;
    }
    if (editTarget) {
      updateBrand(
        { id: editTarget.id, input: { name, slug } },
        { onSuccess: () => setFormOpen(false) }
      );
    } else {
      createBrand(
        { name, slug },
        { onSuccess: () => setFormOpen(false) }
      );
    }
  }

  return (
    <Can
      perform={Permission.VEHICLE_REFERENCE_VIEW}
      fallback={
        <p className="text-sm font-medium text-danger">{t("page.accessDenied")}</p>
      }
    >
      <div className="space-y-4" data-testid="vehicle-reference-page">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-neutral-900">
            {t("page.brandsTitle")}
          </h1>
          <Can perform={Permission.VEHICLE_REFERENCE_CREATE}>
            <Button
              variant="primary"
              size="sm"
              onClick={openCreate}
              data-testid="btn-create-brand"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              {t("actions.createBrand")}
            </Button>
          </Can>
        </div>

        {isLoading && (
          <div className="space-y-2" data-testid="vehicle-reference-skeleton">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 w-full animate-pulse rounded-md bg-neutral-200" />
            ))}
          </div>
        )}

        {isError && (
          <ErrorState onRetry={() => void refetch()} data-testid="vehicle-reference-error" />
        )}

        {!isLoading && !isError && brands.length === 0 && (
          <EmptyState namespace="common" />
        )}

        {!isLoading && !isError && brands.length > 0 && (
          <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
            <table className="w-full text-sm" data-testid="brands-table">
              <thead className="bg-neutral-50 text-xs font-medium uppercase text-neutral-500">
                <tr>
                  <th className="px-4 py-3 text-left">{t("fields.name")}</th>
                  <th className="px-4 py-3 text-left">{t("fields.slug")}</th>
                  <th className="px-4 py-3 text-left">{tc("table.actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {brands.map((brand: VehicleBrand) => (
                  <tr key={brand.id} className="transition-colors hover:bg-neutral-50">
                    <td className="px-4 py-3 font-medium text-neutral-900">{brand.name}</td>
                    <td className="px-4 py-3 font-mono text-sm text-neutral-600">
                      {brand.slug}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Can perform={Permission.VEHICLE_REFERENCE_UPDATE}>
                          <button
                            onClick={() => openEdit(brand)}
                            aria-label={t("actions.editBrand")}
                            className="rounded-md p-1.5 hover:bg-brand-primary/10 hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                            data-testid={`btn-edit-brand-${brand.id}`}
                          >
                            <Pencil className="h-4 w-4" aria-hidden="true" />
                          </button>
                        </Can>
                        <Can perform={Permission.VEHICLE_REFERENCE_DELETE}>
                          <button
                            onClick={() => setDeleteTarget(brand)}
                            aria-label={t("actions.deleteBrand")}
                            className="rounded-md p-1.5 hover:bg-danger/10 hover:text-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                            data-testid={`btn-delete-brand-${brand.id}`}
                          >
                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                          </button>
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

      {/* Create / Edit modal */}
      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editTarget ? t("brand.editTitle") : t("brand.createTitle")}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setFormOpen(false)}>
              {tc("actions.cancel")}
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSubmit}
              isLoading={isCreating || isUpdating}
              data-testid="btn-submit-brand"
            >
              {tc("actions.save")}
            </Button>
          </div>
        }
        data-testid="brand-form-modal"
      >
        <div className="flex flex-col gap-4">
          <Input
            label={t("fields.name")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("brand.namePlaceholder")}
            error={nameError ?? undefined}
            data-testid="input-brand-name"
          />
          <Input
            label={t("fields.slug")}
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder={t("brand.slugPlaceholder")}
            data-testid="input-brand-slug"
          />
        </div>
      </Modal>

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (!deleteTarget) return;
          deleteBrand(deleteTarget.id, { onSettled: () => setDeleteTarget(null) });
        }}
        title={t("brand.deleteTitle")}
        description={t("brand.deleteDescription")}
        confirmLabel={tc("actions.delete")}
        cancelLabel={tc("actions.cancel")}
        confirmLoading={isDeleting}
        data-testid="delete-brand-dialog"
      />
    </Can>
  );
}
