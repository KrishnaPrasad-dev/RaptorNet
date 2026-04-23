import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import EditProfileClient from "@/components/EditProfileClient";
import { getAuthenticatedMemberSession } from "@/lib/memberAuth";

export const dynamic = "force-dynamic";

export default async function EditProfilePage() {
  const session = await getAuthenticatedMemberSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070b] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_22%_14%,rgba(255,255,255,0.08),transparent_24%),radial-gradient(circle_at_79%_82%,rgba(127,16,32,0.16),transparent_30%)]" />

      <section className="relative mx-auto w-full max-w-7xl px-4 pb-14 pt-3 sm:px-10 sm:pt-4 lg:px-12">
        <Navbar />
        <EditProfileClient />
      </section>
    </main>
  );
}
