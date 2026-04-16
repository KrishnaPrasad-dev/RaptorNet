"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type ApplicationStatus = "new" | "pending" | "rejected";
type ApplicationAction = "accept" | "reject" | "pending";

type ApplicationItem = {
  id: string;
  name: string;
  email: string;
  college: string;
  branch: string;
  resumeLink: string;
  projectLink: string;
  demoVideoLink: string;
  githubLink: string;
  linkedinLink: string;
  leetcodeLink: string;
  phoneNumber: string;
  status: ApplicationStatus;
  createdAt: string;
};

type AcceptedMemberItem = {
  id: string;
  name: string;
  email: string;
  college: string;
  branch: string;
  role: string;
  title: string;
  resumeLink: string;
  projectLink: string;
  demoVideoLink: string;
  githubLink: string;
  linkedinLink: string;
  leetcodeLink: string;
  phoneNumber: string;
  approvedAt: string;
};

type Props = {
  isAuthenticated: boolean;
  isPasswordConfigured: boolean;
  applications: ApplicationItem[];
  acceptedMembers: AcceptedMemberItem[];
};

function formatDate(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(parsed);
}

function statForToday(applications: ApplicationItem[]) {
  const now = new Date();

  return applications.filter((app) => {
    const created = new Date(app.createdAt);
    return (
      !Number.isNaN(created.getTime()) &&
      created.getDate() === now.getDate() &&
      created.getMonth() === now.getMonth() &&
      created.getFullYear() === now.getFullYear()
    );
  }).length;
}

export default function AdminApplicationsClient({
  isAuthenticated,
  isPasswordConfigured,
  applications,
  acceptedMembers,
}: Props) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [actionError, setActionError] = useState("");
  const [activeActionId, setActiveActionId] = useState<string | null>(null);
  const [memberActionError, setMemberActionError] = useState("");
  const [activeMemberActionId, setActiveMemberActionId] = useState<string | null>(null);
  const [confirmRemoveMemberId, setConfirmRemoveMemberId] = useState<string | null>(null);

  const stats = useMemo(() => {
    const total = applications.length;
    const newCount = applications.filter((item) => item.status === "new").length;
    const todayCount = statForToday(applications);

    return { total, newCount, todayCount };
  }, [applications]);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!password.trim()) {
      setAuthError("Enter your admin password.");
      return;
    }

    try {
      setIsSubmitting(true);
      setAuthError("");

      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const result = (await response.json()) as { message?: string };
        setAuthError(result.message ?? "Unable to authenticate.");
        return;
      }

      setPassword("");
      router.refresh();
    } catch {
      setAuthError("Unable to reach admin login route.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleLogout() {
    try {
      setIsLoggingOut(true);

      await fetch("/api/admin/logout", {
        method: "POST",
      });

      router.refresh();
    } finally {
      setIsLoggingOut(false);
    }
  }

  async function handleApplicationAction(applicationId: string, action: ApplicationAction) {
    try {
      setActionError("");
      setActiveActionId(applicationId);

      const response = await fetch(`/api/admin/applications/${applicationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action }),
      });

      if (!response.ok) {
        const result = (await response.json()) as { message?: string };
        setActionError(result.message ?? "Failed to update application.");
        return;
      }

      router.refresh();
    } catch {
      setActionError("Unable to update application right now.");
    } finally {
      setActiveActionId(null);
    }
  }

  async function handleRemoveMember(memberId: string) {
    if (confirmRemoveMemberId !== memberId) {
      setConfirmRemoveMemberId(memberId);
      setMemberActionError("");
      return;
    }

    try {
      setMemberActionError("");
      setActiveMemberActionId(memberId);

      const response = await fetch(`/api/admin/members/${memberId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const result = (await response.json()) as { message?: string };
        setMemberActionError(result.message ?? "Failed to remove member.");
        return;
      }

      setConfirmRemoveMemberId(null);
      router.refresh();
    } catch {
      setMemberActionError("Unable to remove member right now.");
    } finally {
      setActiveMemberActionId(null);
    }
  }

  function statusBadgeClass(status: ApplicationStatus) {
    if (status === "rejected") {
      return "border-red-400/55 bg-red-500/15 text-red-100";
    }

    if (status === "pending") {
      return "border-amber-300/55 bg-amber-400/15 text-amber-100";
    }

    return "border-[#7f1020]/70 bg-[#7f1020]/20 text-[#ffb5c0]";
  }

  if (!isAuthenticated) {
    return (
      <section className="rn-reveal mx-auto mt-10 max-w-xl rounded-[2rem] border border-white/15 bg-[linear-gradient(145deg,rgba(18,18,24,0.88),rgba(12,12,16,0.86))] p-8 shadow-[0_25px_60px_rgba(0,0,0,0.4)]">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#7f1020]/50 bg-[#7f1020]/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#ff8ea1]">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="M7 11V7a5 5 0 0 1 10 0v4" strokeLinecap="round" />
            <rect x="4" y="11" width="16" height="10" rx="2" />
          </svg>
          Private Admin Access
        </div>

        <h1 className="mt-4 text-3xl font-black tracking-tight text-white">Applications Dashboard</h1>
        <p className="mt-2 text-sm leading-6 text-white/70">
          This tab is protected. Enter your admin password to view all received applications.
        </p>

        {!isPasswordConfigured && (
          <div className="mt-5 rounded-xl border border-amber-300/30 bg-amber-300/10 p-4 text-sm text-amber-100">
            Set <span className="font-semibold text-amber-50">ADMIN_DASHBOARD_PASSWORD</span> in your env before using this page.
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleLogin}>
          <label className="block text-xs font-semibold uppercase tracking-[0.14em] text-white/65">
            Admin Password
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-xl border border-white/20 bg-black/30 px-4 py-3 text-sm text-white outline-none transition-colors duration-150 ease-out focus:border-[#7f1020]"
              placeholder="Enter password"
            />
          </label>

          {authError && <p className="text-sm text-[#ff8ea1]">{authError}</p>}

          <button
            type="submit"
            disabled={isSubmitting || !isPasswordConfigured}
            className="rn-button inline-flex items-center gap-2 rounded-full border border-[#7f1020]/70 bg-[#7f1020]/35 px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-150 ease-out hover:bg-[#7f1020]/55 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M9 12h6M12 9l3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3" strokeLinecap="round" />
              <path d="M9 20H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h3" strokeLinecap="round" />
            </svg>
            {isSubmitting ? "Verifying..." : "Unlock Applications"}
          </button>
        </form>
      </section>
    );
  }

  return (
    <section className="mx-auto mt-10 max-w-6xl space-y-6">
      <div className="rn-reveal flex flex-wrap items-start justify-between gap-4 rounded-[1.8rem] border border-white/15 bg-[linear-gradient(145deg,rgba(16,20,28,0.9),rgba(10,12,18,0.86))] p-6 shadow-[0_22px_55px_rgba(0,0,0,0.38)]">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/60">Admin</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-white">Applications</h1>
          <p className="mt-2 text-sm text-white/70">Review every submission, open project links, and shortlist candidates.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/25 px-4 py-2 text-sm font-semibold text-white/80 transition-colors duration-150 ease-out hover:border-white/35 hover:text-white"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Admin Profile
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="inline-flex items-center gap-2 rounded-full border border-[#7f1020]/70 bg-[#7f1020]/25 px-4 py-2 text-sm font-semibold text-white transition-colors duration-150 ease-out hover:bg-[#7f1020]/45 disabled:cursor-not-allowed disabled:opacity-65"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M15 12H9m0 0 3-3m-3 3 3 3" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M5 4h6m8 0h-6m-2 0v16" strokeLinecap="round" />
            </svg>
            {isLoggingOut ? "Signing out..." : "Sign Out"}
          </button>
        </div>
      </div>

      <div className="rn-stagger grid gap-3 sm:grid-cols-3">
        <div className="rn-card rounded-2xl border border-white/15 bg-black/30 p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-white/60">Total</p>
          <p className="mt-1 text-3xl font-black text-white">{stats.total}</p>
        </div>
        <div className="rn-card rounded-2xl border border-white/15 bg-black/30 p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-white/60">New</p>
          <p className="mt-1 text-3xl font-black text-white">{stats.newCount}</p>
        </div>
        <div className="rn-card rounded-2xl border border-white/15 bg-black/30 p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-white/60">Today</p>
          <p className="mt-1 text-3xl font-black text-white">{stats.todayCount}</p>
        </div>
      </div>

      {actionError && (
        <div className="rounded-xl border border-red-400/35 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {actionError}
        </div>
      )}

      {memberActionError && (
        <div className="rounded-xl border border-red-400/35 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {memberActionError}
        </div>
      )}

      {applications.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/20 bg-black/20 p-8 text-center text-white/70">
          No applications yet.
        </div>
      ) : (
        <div className="rn-stagger space-y-4">
          {applications.map((application) => (
            <article
              key={application.id}
              className="rn-card rounded-2xl border border-white/15 bg-[linear-gradient(145deg,rgba(17,20,28,0.9),rgba(10,12,18,0.84))] p-5 shadow-[0_12px_36px_rgba(0,0,0,0.28)]"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-extrabold tracking-tight text-white">{application.name}</h2>
                  <p className="mt-1 text-sm text-white/70">{application.email}</p>
                  <p className="mt-1 text-sm text-white/65">{application.college} • {application.branch}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${statusBadgeClass(application.status)}`}>
                    {application.status}
                  </span>
                  <span className="rounded-full border border-white/20 bg-black/25 px-3 py-1 text-xs text-white/70">
                    {formatDate(application.createdAt)}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {application.resumeLink && (
                  <a
                    href={application.resumeLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/25 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-white/85 transition-colors duration-150 ease-out hover:border-[#7f1020] hover:text-white"
                  >
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                      <path d="M8 3h6l5 5v11a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M14 3v5h5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Resume
                  </a>
                )}
                {application.projectLink && (
                  <a
                    href={application.projectLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/25 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-white/85 transition-colors duration-150 ease-out hover:border-[#7f1020] hover:text-white"
                  >
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                      <path d="M7 17 17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Project
                  </a>
                )}
                {application.demoVideoLink && (
                  <a
                    href={application.demoVideoLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/25 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-white/85 transition-colors duration-150 ease-out hover:border-[#7f1020] hover:text-white"
                  >
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                      <path d="M8 5h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="m11 9 4 3-4 3V9Z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Demo Video
                  </a>
                )}
                <a
                  href={application.githubLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/25 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-white/85 transition-colors duration-150 ease-out hover:border-[#7f1020] hover:text-white"
                >
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden="true">
                    <path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.5-4-1.5-.5-1.4-1.3-1.8-1.3-1.8-1.1-.8.1-.8.1-.8 1.2.1 1.9 1.2 1.9 1.2 1.1 1.8 2.9 1.3 3.6 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.6-1.4-5.6-6.1 0-1.3.5-2.4 1.2-3.3-.1-.3-.5-1.6.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.9.1 3.2.8.9 1.2 2 1.2 3.3 0 4.7-2.9 5.8-5.6 6.1.4.4.8 1.1.8 2.3v3.4c0 .3.2.7.8.6A12 12 0 0 0 12 .5Z" />
                  </svg>
                  GitHub
                </a>
                <a
                  href={application.linkedinLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/25 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-white/85 transition-colors duration-150 ease-out hover:border-[#7f1020] hover:text-white"
                >
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden="true">
                    <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM0 8h5v15H0V8zm7.98 0h4.79v2.05h.07c.67-1.26 2.31-2.59 4.75-2.59 5.08 0 6.02 3.34 6.02 7.69V23h-5v-6.57c0-1.57-.03-3.59-2.19-3.59-2.2 0-2.54 1.72-2.54 3.48V23h-5V8z" />
                  </svg>
                  LinkedIn
                </a>
                {application.leetcodeLink && (
                  <a
                    href={application.leetcodeLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/25 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-white/85 transition-colors duration-150 ease-out hover:border-[#7f1020] hover:text-white"
                  >
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                      <path d="M13 5 6 12l7 7M18 12H7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    LeetCode
                  </a>
                )}
                <a
                  href={`tel:${application.phoneNumber}`}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/25 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-white/85 transition-colors duration-150 ease-out hover:border-[#7f1020] hover:text-white"
                >
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <path d="M5 4h4l2 5-2.5 1.5a15.7 15.7 0 0 0 5 5L15 13l5 2v4l-2 1c-1.1.5-2.3.7-3.5.4A17 17 0 0 1 3.6 9.5C3.3 8.3 3.5 7.1 4 6L5 4Z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {application.phoneNumber}
                </a>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2.5 border-t border-white/10 pt-4">
                <button
                  type="button"
                  onClick={() => handleApplicationAction(application.id, "accept")}
                  disabled={activeActionId === application.id}
                  className="rounded-full border border-emerald-400/40 bg-emerald-500/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-100 transition-colors duration-150 ease-out hover:bg-emerald-500/25 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {activeActionId === application.id ? "Updating..." : "Accept"}
                </button>
                <button
                  type="button"
                  onClick={() => handleApplicationAction(application.id, "pending")}
                  disabled={activeActionId === application.id}
                  className="rounded-full border border-amber-300/45 bg-amber-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-amber-100 transition-colors duration-150 ease-out hover:bg-amber-400/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Keep Pending
                </button>
                <button
                  type="button"
                  onClick={() => handleApplicationAction(application.id, "reject")}
                  disabled={activeActionId === application.id}
                  className="rounded-full border border-red-400/45 bg-red-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-red-100 transition-colors duration-150 ease-out hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Reject
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <section className="rn-reveal rn-delay-1 rounded-2xl border border-white/15 bg-[linear-gradient(145deg,rgba(17,20,28,0.9),rgba(10,12,18,0.84))] p-5 shadow-[0_12px_36px_rgba(0,0,0,0.28)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-white">Accepted Members</h2>
            <p className="mt-1 text-sm text-white/68">
              Members shown on the public members page. Removing here hides them from that list.
            </p>
          </div>
          <span className="rounded-full border border-white/20 bg-black/25 px-3 py-1 text-xs text-white/70">
            {acceptedMembers.length} total
          </span>
        </div>

        {acceptedMembers.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-white/20 bg-black/20 p-6 text-center text-sm text-white/65">
            No accepted members yet.
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {acceptedMembers.map((member) => {
              const isConfirming = confirmRemoveMemberId === member.id;
              const isRemoving = activeMemberActionId === member.id;

              return (
                <article
                  key={member.id}
                  className="rn-card rounded-xl border border-white/15 bg-black/25 p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-bold text-white">{member.name}</h3>
                      <p className="mt-1 text-sm text-white/70">{member.email}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.12em] text-white/55">
                        {member.role} • {member.branch || "Branch N/A"}
                      </p>
                    </div>

                    <span className="rounded-full border border-white/20 bg-black/30 px-3 py-1 text-xs text-white/70">
                      Accepted {formatDate(member.approvedAt)}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {member.resumeLink && (
                      <a
                        href={member.resumeLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center rounded-full border border-white/20 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.1em] text-white/80 transition-colors duration-150 ease-out hover:border-[#7f1020] hover:text-white"
                      >
                        Resume
                      </a>
                    )}
                    {member.projectLink && (
                      <a
                        href={member.projectLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center rounded-full border border-white/20 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.1em] text-white/80 transition-colors duration-150 ease-out hover:border-[#7f1020] hover:text-white"
                      >
                        Project
                      </a>
                    )}
                    {member.demoVideoLink && (
                      <a
                        href={member.demoVideoLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center rounded-full border border-white/20 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.1em] text-white/80 transition-colors duration-150 ease-out hover:border-[#7f1020] hover:text-white"
                      >
                        Demo Video
                      </a>
                    )}
                    {member.githubLink && (
                      <a
                        href={member.githubLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center rounded-full border border-white/20 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.1em] text-white/80 transition-colors duration-150 ease-out hover:border-[#7f1020] hover:text-white"
                      >
                        GitHub
                      </a>
                    )}
                    {member.linkedinLink && (
                      <a
                        href={member.linkedinLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center rounded-full border border-white/20 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.1em] text-white/80 transition-colors duration-150 ease-out hover:border-[#7f1020] hover:text-white"
                      >
                        LinkedIn
                      </a>
                    )}
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2.5 border-t border-white/10 pt-4">
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(member.id)}
                      disabled={isRemoving}
                      className="rn-button rounded-full border border-red-400/45 bg-red-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-red-100 transition-colors duration-150 ease-out hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isRemoving ? "Removing..." : isConfirming ? "Click Again to Confirm Remove" : "Remove Member"}
                    </button>

                    {isConfirming && !isRemoving && (
                      <button
                        type="button"
                        onClick={() => setConfirmRemoveMemberId(null)}
                        className="rounded-full border border-white/25 bg-black/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/75 transition-colors duration-150 ease-out hover:border-white/40 hover:text-white"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </section>
  );
}
