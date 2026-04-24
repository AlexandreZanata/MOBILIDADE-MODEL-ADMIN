import { redirect } from "next/navigation";

/** Root redirect — sends authenticated users to /rides, others to /login. */
export default function RootPage() {
  redirect("/rides");
}
