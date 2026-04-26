"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";

type ProjectStatus = "idea" | "building" | "needs-help" | "submitting" | "shipped";

type TeamMember = {
  userId: string;
  memberId: string;
  name: string;
  email: string;
};

type JoinRequest = {
  _id: string;
  userId: string;
  memberId: string;
  name: string;
  email: string;
  message: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
};

type BuildLogEntry = {
  _id: string;
  userId: string;
  memberId: string;
  authorName: string;
  text: string;
  createdAt: string;
};

type Project = {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  teamMembers: TeamMember[];
  githubLink: string;
  liveLink: string;
  status: ProjectStatus;
  progress: number;
  createdBy: {
    accountId: string;
    memberId: string;
    name: string;
    email: string;
    linkedin: string;
  };
  openRoles: string[];
  buildLog: BuildLogEntry[];
  maxTeamSize: number;
  teamOpen: boolean;
  collaborationClosed: boolean;
  joinRequestCount: number;
  pendingJoinRequests: JoinRequest[];
  createdAt: string;
  updatedAt: string;
};

type ViewerProfile = {
  accountId: string;
  id: string;
  name: string;
  email: string;
};

type NewProjectForm = {
  title: string;
  description: string;
  techStack: string;
  githubLink: string;
  liveLink: string;
  status: ProjectStatus;
  progress: number;
  openRoles: string;
  maxTeamSize: number;
};

const initialForm: NewProjectForm = {
  title: "",
  description: "",
  techStack: "",
  githubLink: "",
  liveLink: "",
  status: "idea",
  progress: 0,
  openRoles: "",
  maxTeamSize: 5,
};

function statusPillClass(status: ProjectStatus) {
  if (status === "shipped") {
    return "border-emerald-300/40 bg-emerald-500/15 text-emerald-100";
  }

  if (status === "needs-help") {
    return "border-amber-200/75 bg-amber-400/25 text-amber-50";
  }

  if (status === "building" || status === "submitting") {
    return "border-blue-200/40 bg-blue-500/15 text-blue-100";
  }

  return "border-white/20 bg-white/10 text-white/82";
}

function statusLabel(status: ProjectStatus) {
  if (status === "needs-help") {
    return "Needs Help";
  }

  if (status === "building") {
    return "Building";
  }

  if (status === "submitting") {
    return "Submitting";
  }

  if (status === "shipped") {
    return "Shipped";
  }

  return "Idea";
}

function parseListField(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
  }).format(date);
}

export default function ProjectsHubClient() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [viewer, setViewer] = useState<ViewerProfile | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [updatingProjectId, setUpdatingProjectId] = useState("");
  const [joinModalProject, setJoinModalProject] = useState<Project | null>(null);
  const [joinMessage, setJoinMessage] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"all" | "needs-help" | "building" | "shipped">("all");
  const [stackFilter, setStackFilter] = useState("all");
  const [form, setForm] = useState<NewProjectForm>(initialForm);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function upsertProject(nextProject: Project) {
    setProjects((prev) => prev.map((project) => (project.id === nextProject.id ? nextProject : project)));
  }

  async function loadProjects() {
    try {
      const response = await fetch("/api/projects", {
        cache: "no-store",
      });

      const payload = (await response.json().catch(() => [])) as
        | Project[]
        | { message?: string };

      if (!response.ok) {
        throw new Error(
          (payload as { message?: string })?.message ?? "Failed to load projects."
        );
      }

      setProjects(Array.isArray(payload) ? payload : []);
    } catch (fetchError) {
      const message =
        fetchError instanceof Error ? fetchError.message : "Failed to load projects.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadProjects();
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function checkAuth() {
      try {
        const response = await fetch("/api/profile", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        if (!cancelled) {
          setIsLoggedIn(response.ok);
          if (response.ok) {
            const profile = (await response.json().catch(() => null)) as ViewerProfile | null;
            if (profile) {
              setViewer(profile);
            }
          }
        }
      } catch {
        if (!cancelled) {
          setIsLoggedIn(false);
          setViewer(null);
        }
      }
    }

    void checkAuth();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleStatusUpdate(
    project: Project,
    changes: { status?: ProjectStatus; collaborationClosed?: boolean; maxTeamSize?: number }
  ) {
    try {
      setUpdatingProjectId(project.id);
      const response = await fetch(`/api/projects/${project.id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: changes.status ?? project.status,
          collaborationClosed:
            typeof changes.collaborationClosed === "boolean"
              ? changes.collaborationClosed
              : project.collaborationClosed,
          maxTeamSize: changes.maxTeamSize ?? project.maxTeamSize,
        }),
      });

      const payload = (await response.json().catch(() => null)) as
        | Project
        | { message?: string }
        | null;

      if (!response.ok) {
        setError((payload as { message?: string } | null)?.message ?? "Could not update status.");
        return;
      }

      if (payload && "id" in payload) {
        upsertProject(payload as Project);
      }
    } catch {
      setError("Could not update status right now.");
    } finally {
      setUpdatingProjectId("");
    }
  }

  async function handleJoinRequestSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!joinModalProject) {
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch(`/api/projects/${joinModalProject.id}/request-join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: joinMessage }),
      });

      const payload = (await response.json().catch(() => null)) as
        | Project
        | { message?: string }
        | null;

      if (!response.ok) {
        setError((payload as { message?: string } | null)?.message ?? "Join request failed.");
        return;
      }

      if (payload && "id" in payload) {
        upsertProject(payload as Project);
      }

      setSuccess("Join request sent to project creator.");
      setJoinMessage("");
      setJoinModalProject(null);
    } catch {
      setError("Network error while sending join request.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRequestDecision(
    projectId: string,
    requestId: string,
    action: "accept" | "reject"
  ) {
    try {
      setUpdatingProjectId(projectId);
      const response = await fetch(`/api/projects/${projectId}/requests/${requestId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action }),
      });

      const payload = (await response.json().catch(() => null)) as
        | Project
        | { message?: string }
        | null;

      if (!response.ok) {
        setError((payload as { message?: string } | null)?.message ?? "Could not process request.");
        return;
      }

      if (payload && "id" in payload) {
        upsertProject(payload as Project);
      }
    } catch {
      setError("Could not process request right now.");
    } finally {
      setUpdatingProjectId("");
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!isLoggedIn) {
      setError("Login to add a project.");
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          techStack: parseListField(form.techStack),
          openRoles: parseListField(form.openRoles),
        }),
      });

      const payload = (await response.json().catch(() => null)) as
        | Project
        | { message?: string }
        | null;

      if (!response.ok) {
        setError((payload as { message?: string } | null)?.message ?? "Could not publish project.");
        return;
      }

      if (payload && "id" in payload) {
        setProjects((prev) => [payload as Project, ...prev]);
      } else {
        await loadProjects();
      }

      setForm(initialForm);
      setShowAddModal(false);
      setSuccess("Project published. Builders can now discover and join you.");
    } catch {
      setError("Network error while publishing project.");
    } finally {
      setSubmitting(false);
    }
  }

  const projectCountLabel = useMemo(() => {
    if (projects.length === 1) {
      return "1 project";
    }

    return `${projects.length} projects`;
  }, [projects.length]);

  const stackTags = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((project) => {
      project.techStack.forEach((tech) => {
        if (tech.trim()) {
          set.add(tech.trim());
        }
      });
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const stackMatch = stackFilter === "all" || project.techStack.includes(stackFilter);
      const statusMatch = statusFilter === "all" || project.status === statusFilter;
      return stackMatch && statusMatch;
    });
  }, [projects, stackFilter, statusFilter]);

  return (
    <div className="mt-10 space-y-5 sm:mt-12">
      <section className="rn-reveal relative rounded-[1.6rem] border border-white/10 bg-[linear-gradient(160deg,rgba(12,16,24,0.68),rgba(9,12,18,0.78))] p-4 sm:p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/48">Projects</p>
            <p className="mt-2 max-w-xl text-sm text-white/73 sm:text-[15px]">
              Collaborate on real projects built by guild members.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowFilters((prev) => !prev)}
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-white/18 bg-black/30 px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/78 transition-colors hover:border-white/30 hover:text-white"
            >
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M4 7h16M7 12h10M10 17h4" strokeLinecap="round" />
              </svg>
              Filters
            </button>

            <button
              type="button"
              onClick={() => {
                setError(null);
                setSuccess(null);
                setShowAddModal(true);
              }}
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-[#7f1020]/70 bg-[#7f1020]/22 px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#7f1020]/38"
            >
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
                <path d="M12 5v14M5 12h14" strokeLinecap="round" />
              </svg>
              Add Project
            </button>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/55">
          <span className="rounded-full border border-white/14 bg-white/[0.04] px-3 py-1">{projectCountLabel}</span>
          <span className="rounded-full border border-white/14 bg-white/[0.04] px-3 py-1">
            {isLoggedIn ? "Publishing on" : "Publishing off"}
          </span>
        </div>

        {showFilters ? (
          <div className="mt-4 rounded-xl border border-white/10 bg-black/30 p-3.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/52">Status</span>
              {[
                { label: "All", value: "all" },
                { label: "Needs Help", value: "needs-help" },
                { label: "Building", value: "building" },
                { label: "Shipped", value: "shipped" },
              ].map((statusItem) => (
                <button
                  key={statusItem.value}
                  type="button"
                  onClick={() => setStatusFilter(statusItem.value as typeof statusFilter)}
                  className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] transition-colors ${statusFilter === statusItem.value ? "border-[#7f1020]/75 bg-[#7f1020]/25 text-white" : "border-white/20 bg-white/5 text-white/70 hover:border-white/32 hover:text-white"}`}
                >
                  {statusItem.label}
                </button>
              ))}
            </div>

            <div className="mt-2.5 flex flex-wrap items-center gap-2">
              <span className="mr-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/52">Stack</span>
              <button
                type="button"
                onClick={() => setStackFilter("all")}
                className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] transition-colors ${stackFilter === "all" ? "border-[#7f1020]/75 bg-[#7f1020]/25 text-white" : "border-white/20 bg-white/5 text-white/70 hover:border-white/32 hover:text-white"}`}
              >
                All
              </button>
              {stackTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setStackFilter(tag)}
                  className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] transition-colors ${stackFilter === tag ? "border-[#7f1020]/75 bg-[#7f1020]/25 text-white" : "border-white/20 bg-white/5 text-white/70 hover:border-white/32 hover:text-white"}`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </section>

      {error ? (
        <div className="rounded-xl border border-red-400/35 bg-red-500/15 px-4 py-3 text-sm text-red-100">
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="rounded-xl border border-emerald-300/35 bg-emerald-500/15 px-4 py-3 text-sm text-emerald-100">
          {success}
        </div>
      ) : null}

      <section className="grid gap-4 md:grid-cols-2">
        {loading ? (
          <div className="md:col-span-2 rounded-2xl border border-white/12 bg-black/30 p-8 text-center text-white/70">
            Loading projects...
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="md:col-span-2 rounded-2xl border border-dashed border-white/20 bg-black/25 p-8 text-center text-white/70">
            No projects match your current filters.
          </div>
        ) : (
          filteredProjects.map((project) => {
            const isCreator = viewer?.accountId === project.createdBy.accountId;
            const isTeamMember = Boolean(
              viewer?.accountId &&
              project.teamMembers.some((member) => member.userId === viewer.accountId)
            );

            return (
              <article
                key={project.id}
                className="rounded-[1.45rem] border border-white/10 bg-[linear-gradient(148deg,rgba(255,255,255,0.04),rgba(8,10,16,0.92))] p-5 shadow-[0_14px_40px_rgba(0,0,0,0.28)]"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-[1.35rem] font-bold tracking-tight text-white">{project.title}</h3>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-white/48">
                      by {project.createdBy.name}
                    </p>
                  </div>
                  <span className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${statusPillClass(project.status)}`}>
                    {statusLabel(project.status)}
                  </span>
                </div>

                <p className="mt-3 text-sm leading-7 text-white/74">{project.description}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <span
                      key={`${project.id}-${tech}`}
                      className="rounded-full border border-white/18 bg-white/5 px-3 py-1 text-[10px] font-semibold tracking-[0.08em] text-white/78"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {project.openRoles.length > 0 ? (
                  <div className="mt-4">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-white/54">Open Roles</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {project.openRoles.map((role) => (
                        <span
                          key={`${project.id}-${role}`}
                          className="rounded-full border border-[#7f1020]/55 bg-[#7f1020]/16 px-3 py-1 text-[10px] font-semibold tracking-[0.08em] text-[#ffc3ce]"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div className="mt-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] text-white/56">
                  <span className="inline-flex items-center gap-1 rounded-full border border-white/16 bg-white/[0.03] px-2.5 py-1">
                    <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                      <path d="M4 19h16M6 17V9m6 8V5m6 12v-6" strokeLinecap="round" />
                    </svg>
                    {project.progress}%
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-white/16 bg-white/[0.03] px-2.5 py-1">
                    <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                      <path d="M16 11c1.6 0 3 1.4 3 3v4H5v-4c0-1.6 1.4-3 3-3m8 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {project.teamMembers.length}/{project.maxTeamSize}
                  </span>
                  <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 ${project.teamOpen ? "border-emerald-300/35 bg-emerald-500/12 text-emerald-100" : "border-white/16 bg-white/[0.03] text-white/55"}`}>
                    {project.teamOpen ? "Open" : "Closed"}
                  </span>
                </div>

                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/12">
                  <div
                    className="h-2 rounded-full bg-[linear-gradient(90deg,#7f1020,#d12a48)]"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-2">
                    {project.githubLink ? (
                      <a
                        href={project.githubLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.13em] text-white/85 transition-colors hover:border-white/35 hover:text-white"
                      >
                        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
                          <path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.2.8-.6v-2.2c-3.4.8-4.2-1.4-4.2-1.4-.5-1.4-1.3-1.8-1.3-1.8-1.1-.8.1-.8.1-.8 1.2.1 1.9 1.2 1.9 1.2 1.1 1.9 2.9 1.3 3.6 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-6a4.7 4.7 0 0 1 1.2-3.2c-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.2-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8.1 3.1a4.7 4.7 0 0 1 1.2 3.2c0 4.7-2.8 5.7-5.5 6 .4.3.8 1 .8 2.1v3.1c0 .4.2.7.8.6A12 12 0 0 0 12 .5Z" />
                        </svg>
                        GitHub
                      </a>
                    ) : null}

                    {project.liveLink ? (
                      <a
                        href={project.liveLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.13em] text-white/85 transition-colors hover:border-white/35 hover:text-white"
                      >
                        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                          <path d="M7 17 17 7m0 0h-7m7 0v7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Live
                      </a>
                    ) : null}

                    <Link
                      href={`/projects/${project.id}`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.13em] text-white/85 transition-colors hover:border-white/35 hover:text-white"
                    >
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                        <path d="M12 5c5 0 8 6.5 8 6.5S17 18 12 18 4 11.5 4 11.5 7 5 12 5Z" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="12" cy="11.5" r="2" />
                      </svg>
                      Details
                    </Link>
                  </div>

                  {project.teamOpen && isLoggedIn && !isCreator && !isTeamMember ? (
                    <button
                      type="button"
                      onClick={() => {
                        setJoinMessage("");
                        setJoinModalProject(project);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-full border border-[#7f1020]/70 bg-[#7f1020]/25 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.13em] text-white transition-colors hover:bg-[#7f1020]/45"
                    >
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                        <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                      </svg>
                      Request to Join
                    </button>
                  ) : (
                    <span className="rounded-full border border-white/15 bg-black/35 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.13em] text-white/55">
                      {project.teamOpen ? "In Team" : "Team Closed"}
                    </span>
                  )}
                </div>

                {isCreator ? (
                  <div className="mt-5 rounded-xl border border-white/12 bg-black/30 p-3.5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/56">Creator Controls</p>

                    <div className="mt-2 grid gap-2 sm:grid-cols-2">
                      <select
                        value={project.status}
                        disabled={updatingProjectId === project.id}
                        onChange={(event) =>
                          void handleStatusUpdate(project, {
                            status: event.target.value as ProjectStatus,
                          })
                        }
                        className="h-9 rounded-lg border border-white/18 bg-black/35 px-3 text-xs text-white outline-none"
                      >
                        <option value="idea">Idea</option>
                        <option value="building">Building</option>
                        <option value="needs-help">Needs Help</option>
                        <option value="submitting">Submitting</option>
                        <option value="shipped">Shipped</option>
                      </select>

                      <label className="flex items-center gap-2 text-[11px] text-white/72">
                        <span>Close Team</span>
                        <input
                          type="checkbox"
                          checked={project.collaborationClosed}
                          disabled={updatingProjectId === project.id}
                          onChange={(event) =>
                            void handleStatusUpdate(project, {
                              collaborationClosed: event.target.checked,
                            })
                          }
                          className="h-4 w-4 accent-[#7f1020]"
                        />
                      </label>
                    </div>

                    {project.pendingJoinRequests.length > 0 ? (
                      <div className="mt-3 space-y-2">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/56">Pending Requests</p>
                        {project.pendingJoinRequests.map((request) => (
                          <div key={request._id} className="rounded-lg border border-white/12 bg-white/[0.03] p-3">
                            <p className="text-xs font-semibold text-white/85">{request.name}</p>
                            <p className="mt-1 text-xs leading-6 text-white/70">{request.message}</p>
                            <div className="mt-2 flex gap-2">
                              <button
                                type="button"
                                disabled={updatingProjectId === project.id}
                                onClick={() => void handleRequestDecision(project.id, request._id, "accept")}
                                className="rounded-full border border-emerald-300/40 bg-emerald-500/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-100"
                              >
                                Accept
                              </button>
                              <button
                                type="button"
                                disabled={updatingProjectId === project.id}
                                onClick={() => void handleRequestDecision(project.id, request._id, "reject")}
                                className="rounded-full border border-red-300/40 bg-red-500/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-red-100"
                              >
                                Reject
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ) : null}

                <div className="mt-4 text-[11px] text-white/50">
                  {formatDate(project.createdAt)}
                </div>
              </article>
            );
          })
        )}
      </section>

      {showAddModal ? (
        <div className="fixed inset-0 z-[260] flex items-center justify-center bg-black/75 px-4">
          <div className="w-full max-w-3xl rounded-2xl border border-white/14 bg-[#0f141e] p-5 shadow-[0_28px_70px_rgba(0,0,0,0.5)]">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-white">Add Project</h2>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="rounded-full border border-white/18 bg-white/8 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.13em] text-white/78"
              >
                Close
              </button>
            </div>

            {!isLoggedIn ? (
              <div className="rounded-xl border border-white/15 bg-black/30 px-4 py-4 text-sm text-white/75">
                Login is required to add a project.
                <a href="/login" className="ml-2 font-semibold text-[#ffc3ce] hover:text-white">
                  Go to Login
                </a>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-2">
                <label className="sm:col-span-2">
                  <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-white/62">Title</span>
                  <input
                    value={form.title}
                    onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                    className="h-11 w-full rounded-xl border border-white/15 bg-black/35 px-4 text-sm text-white outline-none placeholder:text-white/35"
                    placeholder="AI Interview Assistant"
                    maxLength={120}
                    required
                    disabled={submitting}
                  />
                </label>

                <label className="sm:col-span-2">
                  <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-white/62">Description</span>
                  <textarea
                    value={form.description}
                    onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
                    className="h-24 w-full resize-none rounded-xl border border-white/15 bg-black/35 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35"
                    placeholder="What does it do, who is it for, and what help do you need?"
                    maxLength={1200}
                    required
                    disabled={submitting}
                  />
                </label>

                <label>
                  <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-white/62">Tech Stack</span>
                  <input
                    value={form.techStack}
                    onChange={(event) => setForm((prev) => ({ ...prev, techStack: event.target.value }))}
                    className="h-11 w-full rounded-xl border border-white/15 bg-black/35 px-4 text-sm text-white outline-none placeholder:text-white/35"
                    placeholder="Next.js, Node, MongoDB"
                    disabled={submitting}
                  />
                </label>

                <label>
                  <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-white/62">Open Roles</span>
                  <input
                    value={form.openRoles}
                    onChange={(event) => setForm((prev) => ({ ...prev, openRoles: event.target.value }))}
                    className="h-11 w-full rounded-xl border border-white/15 bg-black/35 px-4 text-sm text-white outline-none placeholder:text-white/35"
                    placeholder="ML Engineer, UI Dev"
                    disabled={submitting}
                  />
                </label>

                <label>
                  <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-white/62">GitHub Link</span>
                  <input
                    value={form.githubLink}
                    onChange={(event) => setForm((prev) => ({ ...prev, githubLink: event.target.value }))}
                    className="h-11 w-full rounded-xl border border-white/15 bg-black/35 px-4 text-sm text-white outline-none placeholder:text-white/35"
                    placeholder="https://github.com/..."
                    type="url"
                    disabled={submitting}
                  />
                </label>

                <label>
                  <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-white/62">Live Link</span>
                  <input
                    value={form.liveLink}
                    onChange={(event) => setForm((prev) => ({ ...prev, liveLink: event.target.value }))}
                    className="h-11 w-full rounded-xl border border-white/15 bg-black/35 px-4 text-sm text-white outline-none placeholder:text-white/35"
                    placeholder="https://yourapp.com"
                    type="url"
                    disabled={submitting}
                  />
                </label>

                <label>
                  <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-white/62">Status</span>
                  <select
                    value={form.status}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        status: event.target.value as NewProjectForm["status"],
                      }))
                    }
                    className="h-11 w-full rounded-xl border border-white/15 bg-black/35 px-4 text-sm text-white outline-none"
                    disabled={submitting}
                  >
                    <option value="idea">Idea</option>
                    <option value="building">Building</option>
                    <option value="needs-help">Needs Help</option>
                    <option value="submitting">Submitting</option>
                    <option value="shipped">Shipped</option>
                  </select>
                </label>

                <label>
                  <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-white/62">Max Team Size ({form.maxTeamSize})</span>
                  <input
                    type="range"
                    min={1}
                    max={20}
                    value={form.maxTeamSize}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, maxTeamSize: Number(event.target.value) }))
                    }
                    className="h-11 w-full accent-[#7f1020]"
                    disabled={submitting}
                  />
                </label>

                <label className="sm:col-span-2">
                  <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-white/62">Progress ({form.progress}%)</span>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={form.progress}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, progress: Number(event.target.value) }))
                    }
                    className="h-11 w-full accent-[#7f1020]"
                    disabled={submitting}
                  />
                </label>

                <button
                  type="submit"
                  disabled={submitting}
                  className="sm:col-span-2 h-11 rounded-xl border border-[#7f1020]/55 bg-[linear-gradient(130deg,#6f0d1c,#a2162d)] px-5 text-xs font-semibold uppercase tracking-[0.13em] text-white disabled:cursor-not-allowed disabled:opacity-55"
                >
                  {submitting ? "Publishing..." : "Publish Project"}
                </button>
              </form>
            )}
          </div>
        </div>
      ) : null}

      {joinModalProject ? (
        <div className="fixed inset-0 z-[260] flex items-center justify-center bg-black/75 px-4">
          <div className="w-full max-w-lg rounded-2xl border border-white/15 bg-[#0e121b] p-5 shadow-[0_28px_70px_rgba(0,0,0,0.48)]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/58">Join Request</p>
            <h3 className="mt-2 text-lg font-bold text-white">{joinModalProject.title}</h3>
            <form className="mt-4 space-y-3" onSubmit={handleJoinRequestSubmit}>
              <label className="block">
                <span className="mb-2 block text-[10px] uppercase tracking-[0.16em] text-white/58">Why do you want to join?</span>
                <textarea
                  value={joinMessage}
                  onChange={(event) => setJoinMessage(event.target.value)}
                  required
                  maxLength={500}
                  className="h-28 w-full resize-none rounded-xl border border-white/20 bg-black/35 px-4 py-3 text-sm text-white outline-none"
                  placeholder="Mention your skills, time commitment, and what value you can add."
                />
              </label>

              <div className="flex flex-wrap justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setJoinModalProject(null)}
                  className="rounded-full border border-white/18 bg-white/8 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/78"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-full border border-[#7f1020]/70 bg-[#7f1020]/30 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "Sending..." : "Send Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
