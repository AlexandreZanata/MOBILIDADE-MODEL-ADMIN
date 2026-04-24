import { redirect } from "next/navigation";

/** Root redirect — sends users to /dashboard (AuthGuard handles unauthenticated). */
export default function RootPage() {
  redirect("/dashboard");
}
