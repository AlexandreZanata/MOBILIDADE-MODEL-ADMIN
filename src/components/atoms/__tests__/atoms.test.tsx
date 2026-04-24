import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test/renderWithProviders";
import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";
import { Avatar } from "@/components/atoms/Avatar";
import "@/test/i18n-mock";

describe("Button", () => {
  it("renders children", () => {
    renderWithProviders(<Button>Save</Button>);
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("is disabled when isLoading", () => {
    renderWithProviders(<Button isLoading>Save</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("sets aria-busy when isLoading", () => {
    renderWithProviders(<Button isLoading>Save</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("aria-busy", "true");
  });

  it("calls onClick when clicked", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    renderWithProviders(<Button onClick={onClick}>Click</Button>);
    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("does not call onClick when disabled", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    renderWithProviders(<Button disabled onClick={onClick}>Click</Button>);
    await user.click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
  });
});

describe("Badge", () => {
  it("renders children", () => {
    renderWithProviders(<Badge variant="success">Active</Badge>);
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("applies success variant class", () => {
    renderWithProviders(<Badge variant="success">Active</Badge>);
    expect(screen.getByText("Active")).toHaveClass("text-success");
  });

  it("applies danger variant class", () => {
    renderWithProviders(<Badge variant="danger">Inactive</Badge>);
    expect(screen.getByText("Inactive")).toHaveClass("text-danger");
  });
});

describe("Avatar", () => {
  it("renders initials for two-word name", () => {
    renderWithProviders(<Avatar name="John Smith" />);
    expect(screen.getByText("JS")).toBeInTheDocument();
  });

  it("renders single initial for one-word name", () => {
    renderWithProviders(<Avatar name="Admin" />);
    expect(screen.getByText("A")).toBeInTheDocument();
  });

  it("has correct aria-label", () => {
    renderWithProviders(<Avatar name="Maria Santos" />);
    expect(screen.getByRole("img", { name: "Maria Santos" })).toBeInTheDocument();
  });
});
