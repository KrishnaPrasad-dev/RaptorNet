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

function statusPillClass(status: ProjectStatus) {
  if (status === "shipped") {
    return "border-emerald-300/35 bg-emerald-500/15 text-emerald-100";
  }

  if (status === "needs-help") {
    return "border-amber-200/70 bg-amber-400/25 text-amber-50";
  }

  if (status === "building" || status === "submitting") {
    return "border-amber-300/35 bg-amber-500/15 text-amber-100";
  }

  return "border-white/20 bg-white/10 text-white/80";
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

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default function ProjectDetailClient({ projectId }: { projectId: string }) {
  const [project, setProject] = useState<Project | null>(null);
  const [viewer, setViewer] = useState<ViewerProfile | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [joinMessage, setJoinMessage] = useState("");
  const [newUpdate, setNewUpdate] = useState("");
  const [rolesDraft, setRolesDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const isCreator = Boolean(project && viewer?.accountId === project.createdBy.accountId);
  const isTeamMember = Boolean(
    project && viewer?.accountId && project.teamMembers.some((member) => member.userId === viewer.accountId)
  );

  async function loadProject() {
    try {
      const response = await fetch(`/api/projects/${projectId}`, { cache: "no-store" });
      const payload = (await response.json().catch(() => null)) as
        | Project
        | { message?: string }
        | null;

      if (!response.ok || !payload || !("id" in payload)) {
        setError((payload as { message?: string } | null)?.message ?? "Project not found.");
        return;
      }

      setProject(payload as Project);
      setRolesDraft((payload as Project).openRoles.join(", "));
    } catch {
      setError("Failed to load project.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadProject();
  }, [projectId]);

  useEffect(() => {
    let cancelled = false;

    async function loadViewer() {
      try {
        const response = await fetch("/api/profile", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        if (!cancelled) {
          setIsLoggedIn(response.ok);
          if (response.ok) {
            const payload = (await response.json().catch(() => null)) as ViewerProfile | null;
            if (payload) {
              setViewer(payload);
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

    void loadViewer();

    return () => {
      cancelled = true;
    };
  }, []);

  async function updateStatus(status: ProjectStatus, collaborationClosed?: boolean, maxTeamSize?: number) {
    if (!project) {
      return;
    }

    try {
      setWorking(true);
      const response = await fetch(`/api/projects/${project.id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
          collaborationClosed:
            typeof collaborationClosed === "boolean" ? collaborationClosed : project.collaborationClosed,
          maxTeamSize: typeof maxTeamSize === "number" ? maxTeamSize : project.maxTeamSize,
        }),
      });

      const payload = (await response.json().catch(() => null)) as
        | Project
        | { message?: string }
        | null;

      if (!response.ok || !payload || !("id" in payload)) {
        setError((payload as { message?: string } | null)?.message ?? "Failed to update status.");
        return;
      }

      setProject(payload as Project);
      setSuccess("Project status updated.");
    } catch {
      setError("Could not update status.");
    } finally {
      setWorking(false);
    }
  }

  async function submitJoinRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!project) {
      return;
    }

    try {
      setWorking(true);
      setError(null);
      setSuccess(null);

      const response = await fetch(`/api/projects/${project.id}/request-join`, {
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

      if (!response.ok || !payload || !("id" in payload)) {
        setError((payload as { message?: string } | null)?.message ?? "Failed to request join.");
        return;
      }

      setProject(payload as Project);
      setJoinMessage("");
      setSuccess("Join request sent.");
    } catch {
      setError("Failed to request join.");
    } finally {
      setWorking(false);
    }
  }

  async function decideRequest(requestId: string, action: "accept" | "reject") {
    if (!project) {
      return;
    }

    try {
      setWorking(true);
      const response = await fetch(`/api/projects/${project.id}/requests/${requestId}`, {
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

      if (!response.ok || !payload || !("id" in payload)) {
        setError((payload as { message?: string } | null)?.message ?? "Failed to process request.");
        return;
      }

      setProject(payload as Project);
    } catch {
      setError("Failed to process request.");
    } finally {
      setWorking(false);
    }
  }

  async function submitUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!project) {
      return;
    }

    try {
      setWorking(true);
      setError(null);

      const response = await fetch(`/api/projects/${project.id}/updates`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: newUpdate }),
      });

      const payload = (await response.json().catch(() => null)) as
        | Project
        | { message?: string }
        | null;

      if (!response.ok || !payload || !("id" in payload)) {
        setError((payload as { message?: string } | null)?.message ?? "Failed to post update.");
        return;
      }

      setProject(payload as Project);
      setNewUpdate("");
      setSuccess("Build log updated.");
    } catch {
      setError("Failed to post update.");
    } finally {
      setWorking(false);
    }
  }

  async function saveRoles(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!project) {
      return;
    }

    try {
      setWorking(true);
      setError(null);

      const response = await fetch(`/api/projects/${project.id}/roles`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ roles: rolesDraft.split(",").map((role) => role.trim()).filter(Boolean) }),
      });

      const payload = (await response.json().catch(() => null)) as
        | Project
        | { message?: string }
        | null;

      if (!response.ok || !payload || !("id" in payload)) {
        setError((payload as { message?: string } | null)?.message ?? "Failed to update roles.");
        return;
      }

      setProject(payload as Project);
      setSuccess("Open roles updated.");
    } catch {
      setError("Failed to update roles.");
    } finally {
      setWorking(false);
    }
  }

  const canJoin = useMemo(() => {
    if (!project) {
      return false;
    }

    return project.teamOpen && isLoggedIn && !isCreator && !isTeamMember;
  }, [project, isLoggedIn, isCreator, isTeamMember]);

  if (loading) {
    return (
      <div className="mt-10 rounded-2xl border border-white/12 bg-black/30 p-8 text-center text-white/70">
        Loading project...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="mt-10 rounded-2xl border border-red-400/35 bg-red-500/15 p-8 text-center text-red-100">
        {error ?? "Project not found."}
      </div>
    );
  }

  return (
    <div className="mt-8 grid gap-5 lg:grid-cols-[1.7fr_1fr]">
      <section className="rounded-[1.8rem] border border-white/12 bg-[linear-gradient(150deg,rgba(255,255,255,0.04),rgba(8,10,16,0.92))] p-6 shadow-[0_16px_44px_rgba(0,0,0,0.3)]">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h1 className="text-3xl font-black tracking-tight text-white">{project.title}</h1>
          <span className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${statusPillClass(project.status)}`}>
            {statusLabel(project.status)}
          </span>
        </div>

        <p className="mt-4 text-sm leading-7 text-white/75">{project.description}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          {project.techStack.map((tag) => (
            <span key={tag} className="rounded-full border border-white/18 bg-white/5 px-3 py-1 text-[11px] font-semibold tracking-[0.07em] text-white/78">
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {project.githubLink ? (
            <a href={project.githubLink} target="_blank" rel="noreferrer" className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white/85">
              GitHub
            </a>
          ) : null}
          {project.liveLink ? (
            <a href={project.liveLink} target="_blank" rel="noreferrer" className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white/85">
              Live
            </a>
          ) : null}
        </div>

        <div className="mt-6">
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-white/62">Team Members</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {project.teamMembers.map((member) =>
              member.memberId ? (
                <Link key={member.userId} href={`/members/${member.memberId}`} className="rounded-full border border-white/15 bg-black/35 px-3 py-1 text-xs font-semibold text-white/80 hover:border-[#7f1020] hover:text-white">
                  {member.name}
                </Link>
              ) : (
                <span key={member.userId} className="rounded-full border border-white/15 bg-black/35 px-3 py-1 text-xs font-semibold text-white/80">
                  {member.name}
                </span>
              )
            )}
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-white/62">Open Roles</h2>
          {project.openRoles.length > 0 ? (
            <div className="mt-2 flex flex-wrap gap-2">
              {project.openRoles.map((role) => (
                <span key={role} className="rounded-full border border-[#7f1020]/55 bg-[#7f1020]/16 px-3 py-1 text-[11px] font-semibold tracking-[0.06em] text-[#ffc3ce]">
                  {role}
                </span>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-sm text-white/60">No open roles listed yet.</p>
          )}
        </div>

        {canJoin ? (
          <form className="mt-6 space-y-3 rounded-xl border border-white/12 bg-black/25 p-4" onSubmit={submitJoinRequest}>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/62">Request to Join</p>
            <textarea
              value={joinMessage}
              onChange={(event) => setJoinMessage(event.target.value)}
              required
              maxLength={500}
              className="h-24 w-full resize-none rounded-lg border border-white/18 bg-black/35 px-3 py-2 text-sm text-white outline-none"
              placeholder="Why do you want to join this project?"
            />
            <button type="submit" disabled={working} className="rounded-full border border-[#7f1020]/70 bg-[#7f1020]/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white disabled:opacity-60">
              {working ? "Sending..." : "Send Join Request"}
            </button>
          </form>
        ) : null}

        <div className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-white/62">Build Log</h2>

          {(isCreator || isTeamMember) ? (
            <form className="mt-3 flex gap-2" onSubmit={submitUpdate}>
              <input
                value={newUpdate}
                onChange={(event) => setNewUpdate(event.target.value)}
                required
                maxLength={360}
                className="h-11 flex-1 rounded-lg border border-white/18 bg-black/35 px-3 text-sm text-white outline-none"
                placeholder="Posted new API integration and fixed auth edge cases"
              />
              <button type="submit" disabled={working} className="rounded-lg border border-[#7f1020]/70 bg-[#7f1020]/30 px-4 text-xs font-semibold uppercase tracking-[0.12em] text-white disabled:opacity-60">
                Post
              </button>
            </form>
          ) : null}

          <div className="mt-3 space-y-2">
            {project.buildLog.length === 0 ? (
              <p className="rounded-lg border border-dashed border-white/20 bg-black/25 px-3 py-3 text-sm text-white/60">
                No updates yet.
              </p>
            ) : (
              project.buildLog.map((entry) => (
                <article key={entry._id} className="rounded-lg border border-white/12 bg-black/25 px-3 py-3">
                  <p className="text-sm text-white/82">{entry.text}</p>
                  <p className="mt-1 text-xs text-white/55">{entry.authorName} • {formatDate(entry.createdAt)}</p>
                </article>
              ))
            )}
          </div>
        </div>
      </section>

      <aside className="space-y-4">
        <section className="rounded-[1.6rem] border border-white/12 bg-black/25 p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/58">Project Meta</p>
          <div className="mt-3 space-y-2 text-sm text-white/76">
            <p>Creator: {project.createdBy.name}</p>
            <p>Team: {project.teamMembers.length}/{project.maxTeamSize}</p>
            <p>{project.teamOpen ? "Team Open" : "Team Closed"}</p>
            <p>Created: {formatDate(project.createdAt)}</p>
          </div>
        </section>

        {isCreator ? (
          <section className="rounded-[1.6rem] border border-white/12 bg-black/25 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/58">Creator Controls</p>

            <label className="mt-3 block text-xs text-white/72">
              Status
              <select
                value={project.status}
                disabled={working}
                onChange={(event) => void updateStatus(event.target.value as ProjectStatus)}
                className="mt-1 h-10 w-full rounded-lg border border-white/18 bg-black/35 px-3 text-sm text-white outline-none"
              >
                <option value="idea">Idea</option>
                <option value="building">Building</option>
                <option value="needs-help">Needs Help</option>
                <option value="submitting">Submitting</option>
                <option value="shipped">Shipped</option>
              </select>
            </label>

            <label className="mt-2 block text-xs text-white/72">
              Max Team Size
              <input
                type="number"
                min={1}
                max={20}
                value={project.maxTeamSize}
                onChange={(event) => void updateStatus(project.status, project.collaborationClosed, Number(event.target.value))}
                className="mt-1 h-10 w-full rounded-lg border border-white/18 bg-black/35 px-3 text-sm text-white outline-none"
              />
            </label>

            <label className="mt-2 flex items-center gap-2 text-xs text-white/72">
              <input
                type="checkbox"
                checked={project.collaborationClosed}
                onChange={(event) => void updateStatus(project.status, event.target.checked)}
                className="h-4 w-4 accent-[#7f1020]"
              />
              Close Team
            </label>

            <form className="mt-4" onSubmit={saveRoles}>
              <label className="block text-xs text-white/72">
                Open Roles (comma separated)
                <textarea
                  value={rolesDraft}
                  onChange={(event) => setRolesDraft(event.target.value)}
                  className="mt-1 h-24 w-full resize-none rounded-lg border border-white/18 bg-black/35 px-3 py-2 text-sm text-white outline-none"
                />
              </label>
              <button type="submit" disabled={working} className="mt-2 rounded-full border border-[#7f1020]/70 bg-[#7f1020]/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white disabled:opacity-60">
                Save Roles
              </button>
            </form>

            {project.pendingJoinRequests.length > 0 ? (
              <div className="mt-4 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/62">Pending Requests</p>
                {project.pendingJoinRequests.map((request) => (
                  <div key={request._id} className="rounded-lg border border-white/12 bg-black/25 p-3">
                    <p className="text-xs font-semibold text-white/84">{request.name}</p>
                    <p className="mt-1 text-xs text-white/68">{request.message}</p>
                    <div className="mt-2 flex gap-2">
                      <button type="button" onClick={() => void decideRequest(request._id, "accept")} disabled={working} className="rounded-full border border-emerald-300/40 bg-emerald-500/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-100">
                        Accept
                      </button>
                      <button type="button" onClick={() => void decideRequest(request._id, "reject")} disabled={working} className="rounded-full border border-red-300/40 bg-red-500/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-red-100">
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </section>
        ) : null}

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
      </aside>
    </div>
  );
}
