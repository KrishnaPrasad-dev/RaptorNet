import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import ProjectDetailClient from "@/components/ProjectDetailClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ProjectDetailPage(
  props: { params: Promise<{ id: string }> }
) {
  const { id } = await props.params;

  if (!id) {
    notFound();
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070b] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(255,255,255,0.08),transparent_26%),radial-gradient(circle_at_85%_84%,rgba(127,16,32,0.2),transparent_34%)]" />

      <section className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-14 pt-3 sm:px-10 sm:pt-4 lg:px-12">
        <Navbar />
        <ProjectDetailClient projectId={id} />
      </section>
    </main>
  );
}
