import Navbar from "@/components/Navbar";
import ProjectsHubClient from "../../components/ProjectsHubClient";
import LightRays from "@/components/LightRays";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function ProjectsPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070b] text-white">
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_18%_10%,rgba(255,255,255,0.06),transparent_26%),radial-gradient(circle_at_85%_84%,rgba(127,16,32,0.18),transparent_34%)]" />
      <div className="pointer-events-none absolute inset-0 z-[1] hidden opacity-80 md:block">
        <LightRays
          raysOrigin="top-center"
          raysColor="#ff0026"
          raysSpeed={1.15}
          lightSpread={2}
          rayLength={3}
          pulsating={false}
          fadeDistance={1.35}
          saturation={1.2}
          followMouse={false}
          mouseInfluence={0}
          noiseAmount={0}
          distortion={0.0}
        />
      </div>

      <section className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-14 pt-3 sm:px-10 sm:pt-4 lg:px-12">
        <Navbar />
        <ProjectsHubClient />
      </section>
    </main>
  );
}
