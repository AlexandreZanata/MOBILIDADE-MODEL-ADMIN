"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Pencil } from "lucide-react";
import { Can } from "@/components/auth/Can";
import { Button } from "@/components/atoms/Button";
import { TableActionButton } from "@/components/atoms/TableActionButton";
import { Input } from "@/components/atoms/Input";
import { Modal } from "@/components/molecules/Modal";
import { ErrorState } from "@/components/molecules/ErrorState";
import { EmptyState } from "@/components/molecules/EmptyState";
import {
  useServiceCategories,
  useCreateServiceCategory,
  useUpdateServiceCategory,
} from "@/hooks/serviceCategories/useServiceCategories";
import { Permission } from "@/models/Permission";
import type { ServiceCategory } from "@/models/ServiceCategory";

/**
 * Service categories management page organism.
 */
export function ServiceCategoriesPageClient() {
  const { t, i18n } = useTranslation("serviceCategories");
  const { t: tc } = useTranslation("common");

  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<ServiceCategory | null>(null);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [baseFare, setBaseFare] = useState("");
  const [perKmRate, setPerKmRate] = useState("");
  const [minFare, setMinFare] = useState("");

  const { data, isLoading, isError, refetch } = useServiceCategories();
  const { mutate: create, isPending: isCreating } = useCreateServiceCategory();
  const { mutate: update, isPending: isUpdating } = useUpdateServiceCategory();

  const categories = data?.items ?? [];

  const currency = new Intl.NumberFormat(i18n.language, {
    style: "currency",
    currency: "BRL",
  });

  function openCreate() {
    setEditTarget(null);
    setName("");
    setSlug("");
    setBaseFare("");
    setPerKmRate("");
    setMinFare("");
    setFormOpen(true);
  }

  function openEdit(cat: ServiceCategory) {
    setEditTarget(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setBaseFare(String(cat.baseFare));
    setPerKmRate(String(cat.perKmRate));
    setMinFare(String(cat.minFare));
    setFormOpen(true);
  }

  function handleSubmit() {
    const payload = {
      name,
      slug,
      baseFare: parseFloat(baseFare),
      perKmRate: parseFloat(perKmRate),
      minFare: parseFloat(minFare),
    };

    if (editTarget) {
      update(
        { id: editTarget.id, input: payload },
        { onSuccess: () => setFormOpen(false) }
      );
    } else {
      create(payload, { onSuccess: () => setFormOpen(false) });
    }
  }

  return (
    <Can
      perform={Permission.SERVICE_CATEGORY_VIEW}
      fallback={
        <p className="text-sm font-medium text-danger">{t("page.accessDenied")}</p>
      }
    >
      <div className="space-y-4" data-testid="service-categories-page">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-neutral-900">{t("page.title")}</h1>
          <Can perform={Permission.SERVICE_CATEGORY_CREATE}>
            <Button
              variant="primary"
              size="sm"
              onClick={openCreate}
              data-testid="btn-create-category"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              {t("actions.create")}
            </Button>
          </Can>
        </div>

        {isLoading && (
          <div className="space-y-2" data-testid="service-categories-skeleton">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 w-full animate-pulse rounded-md bg-neutral-200" />
            ))}
          </div>
        )}

        {isError && (
          <ErrorState
            onRetry={() => void refetch()}
            data-testid="service-categories-error"
          />
        )}

        {!isLoading && !isError && categories.length === 0 && (
          <EmptyState
            namespace="serviceCategories"
            titleKey="empty.title"
            messageKey="empty.message"
          />
        )}

        {!isLoading && !isError && categories.length > 0 && (
          <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
            <table className="w-full text-sm" data-testid="service-categories-table">
              <thead className="bg-neutral-50 text-xs font-medium uppercase text-neutral-500">
                <tr>
                  <th className="px-4 py-3 text-left">{t("fields.name")}</th>
                  <th className="px-4 py-3 text-left">{t("fields.baseFare")}</th>
                  <th className="px-4 py-3 text-left">{t("fields.perKmRate")}</th>
                  <th className="px-4 py-3 text-left">{t("fields.minFare")}</th>
                  <th className="px-4 py-3 text-left">{tc("table.actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {categories.map((cat: ServiceCategory) => (
                  <tr key={cat.id} className="transition-colors hover:bg-neutral-50">
                    <td className="px-4 py-3 font-medium text-neutral-900">{cat.name}</td>
                    <td className="px-4 py-3 text-neutral-800">
                      {currency.format(cat.baseFare)}
                    </td>
                    <td className="px-4 py-3 text-neutral-800">
                      {currency.format(cat.perKmRate)}
                    </td>
                    <td className="px-4 py-3 text-neutral-800">
                      {currency.format(cat.minFare)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Can perform={Permission.SERVICE_CATEGORY_UPDATE}>
                          <TableActionButton
                            icon={Pencil}
                            label={t("actions.edit")}
                            variant="default"
                            onClick={() => openEdit(cat)}
                            data-testid={`btn-edit-category-${cat.id}`}
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

      {/* Create / Edit modal */}
      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editTarget ? t("modal.editTitle") : t("modal.createTitle")}
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
              data-testid="btn-submit-category"
            >
              {tc("actions.save")}
            </Button>
          </div>
        }
        data-testid="category-form-modal"
      >
        <div className="flex flex-col gap-4">
          <Input
            label={t("fields.name")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            data-testid="input-category-name"
          />
          <Input
            label={t("fields.slug")}
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            data-testid="input-category-slug"
          />
          <div className="grid grid-cols-3 gap-3">
            <Input
              label={t("fields.baseFare")}
              type="number"
              min="0"
              step="0.01"
              value={baseFare}
              onChange={(e) => setBaseFare(e.target.value)}
              data-testid="input-base-fare"
            />
            <Input
              label={t("fields.perKmRate")}
              type="number"
              min="0"
              step="0.01"
              value={perKmRate}
              onChange={(e) => setPerKmRate(e.target.value)}
              data-testid="input-per-km-rate"
            />
            <Input
              label={t("fields.minFare")}
              type="number"
              min="0"
              step="0.01"
              value={minFare}
              onChange={(e) => setMinFare(e.target.value)}
              data-testid="input-min-fare"
            />
          </div>
        </div>
      </Modal>
    </Can>
  );
}
