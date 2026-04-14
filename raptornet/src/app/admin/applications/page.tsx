import Navbar from "@/components/Navbar";
import LetterGlitch from "@/components/LetterGlitch";
import AdminApplicationsClient from "@/components/AdminApplicationsClient";
import { getDb } from "@/lib/mongodb";
import { isAdminAuthenticated, isAdminPasswordConfigured } from "@/lib/adminAuth";

type ApplicationDoc = {
  _id: { toString(): string };
  name?: string;
  email?: string;
  college?: string;
  branch?: string;
  projectLink?: string;
  githubLink?: string;
  linkedinLink?: string;
  leetcodeLink?: string;
  phoneNumber?: string;
  status?: string;
  createdAt?: Date | string;
};

async function getApplications() {
  try {
    const db = await getDb();
    const docs = (await db
      .collection<ApplicationDoc>("applications")
      .find({})
      .sort({ createdAt: -1 })
      .limit(300)
      .toArray()) as ApplicationDoc[];

    return docs.map((item) => ({
      id: item._id.toString(),
      name: item.name ?? "",
      email: item.email ?? "",
      college: item.college ?? "",
      branch: item.branch ?? "",
      projectLink: item.projectLink ?? "",
      githubLink: item.githubLink ?? "",
      linkedinLink: item.linkedinLink ?? "",
      leetcodeLink: item.leetcodeLink ?? "",
      phoneNumber: item.phoneNumber ?? "",
      status: item.status ?? "new",
      createdAt:
        item.createdAt instanceof Date
          ? item.createdAt.toISOString()
          : new Date(item.createdAt ?? Date.now()).toISOString(),
    }));
  } catch (error) {
    console.error("Failed to load applications:", error);
    return [];
  }
}

export default async function AdminApplicationsPage() {
  const passwordConfigured = isAdminPasswordConfigured();
  const authenticated = passwordConfigured ? await isAdminAuthenticated() : false;
  const applications = authenticated ? await getApplications() : [];

  return (
    <main className="relative min-h-screen overflow-hidden text-white">
      <div className="pointer-events-none fixed inset-0 z-0">
        <LetterGlitch
          glitchSpeed={50}
          glitchColors={["#7f1020", "#c81f37", "#7f8ea3"]}
          centerVignette={true}
          outerVignette={false}
          smooth={true}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,8,0.34),rgba(5,5,8,0.46))]" />
      </div>

      <section className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-16 pt-4 sm:px-10 lg:px-12">
        <Navbar />

        <AdminApplicationsClient
          isAuthenticated={authenticated}
          isPasswordConfigured={passwordConfigured}
          applications={applications}
        />
      </section>
    </main>
  );
}
