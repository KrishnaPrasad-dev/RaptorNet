"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type ProfileForm = {
  name: string;
  role: string;
  title: string;
  college: string;
  branch: string;
  bio: string;
  skills: string;
  resumeLink: string;
  projectLink: string;
  githubLink: string;
  linkedinLink: string;
  leetcodeLink: string;
  phoneNumber: string;
};

const initialForm: ProfileForm = {
  name: "",
  role: "",
  title: "",
  college: "",
  branch: "",
  bio: "",
  skills: "",
  resumeLink: "",
  projectLink: "",
  githubLink: "",
  linkedinLink: "",
  leetcodeLink: "",
  phoneNumber: "",
};

export default function EditProfileClient() {
  const router = useRouter();
  const [form, setForm] = useState<ProfileForm>(initialForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      try {
        setError("");
        const response = await fetch("/api/profile", { method: "GET" });

        if (!response.ok) {
          const payload = (await response.json().catch(() => null)) as
            | { message?: string }
            | null;
          throw new Error(payload?.message ?? "Unable to load profile.");
        }

        const profile = (await response.json()) as {
          name?: string;
          role?: string;
          title?: string;
          college?: string;
          branch?: string;
          bio?: string;
          skills?: string[];
          resumeLink?: string;
          projectLink?: string;
          githubLink?: string;
          linkedinLink?: string;
          leetcodeLink?: string;
          phoneNumber?: string;
        };

        if (!cancelled) {
          setForm({
            name: profile.name ?? "",
            role: profile.role ?? "",
            title: profile.title ?? "",
            college: profile.college ?? "",
            branch: profile.branch ?? "",
            bio: profile.bio ?? "",
            skills: Array.isArray(profile.skills) ? profile.skills.join(", ") : "",
            resumeLink: profile.resumeLink ?? "",
            projectLink: profile.projectLink ?? "",
            githubLink: profile.githubLink ?? "",
            linkedinLink: profile.linkedinLink ?? "",
            leetcodeLink: profile.leetcodeLink ?? "",
            phoneNumber: profile.phoneNumber ?? "",
          });
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Unable to load profile.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  function onChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setIsSaving(true);
      setError("");

      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          skills: form.skills
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as
          | { message?: string }
          | null;
        throw new Error(payload?.message ?? "Unable to update profile.");
      }

      router.push("/profile");
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to update profile.");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-white/12 bg-black/35 p-6 text-sm text-white/70">
        Loading profile...
      </div>
    );
  }

  return (
    <section className="rn-reveal mt-8 rounded-[1.9rem] border border-white/12 bg-[linear-gradient(150deg,rgba(255,255,255,0.05),rgba(10,12,18,0.92))] p-6 sm:p-8">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#ff9cad]">Edit Profile</p>
      <h1 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">Update your member profile</h1>

      <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={onSubmit}>
        <input name="name" value={form.name} onChange={onChange} className="h-12 rounded-xl border border-white/20 bg-black/35 px-4 text-sm text-white outline-none placeholder:text-white/35 focus:border-[#ff4a4a]" placeholder="Name" />
        <input name="title" value={form.title} onChange={onChange} className="h-12 rounded-xl border border-white/20 bg-black/35 px-4 text-sm text-white outline-none placeholder:text-white/35 focus:border-[#ff4a4a]" placeholder="Title" />
        <input name="role" value={form.role} onChange={onChange} className="h-12 rounded-xl border border-white/20 bg-black/35 px-4 text-sm text-white outline-none placeholder:text-white/35 focus:border-[#ff4a4a]" placeholder="Role" />
        <input name="college" value={form.college} onChange={onChange} className="h-12 rounded-xl border border-white/20 bg-black/35 px-4 text-sm text-white outline-none placeholder:text-white/35 focus:border-[#ff4a4a]" placeholder="College" />
        <input name="branch" value={form.branch} onChange={onChange} className="h-12 rounded-xl border border-white/20 bg-black/35 px-4 text-sm text-white outline-none placeholder:text-white/35 focus:border-[#ff4a4a]" placeholder="Branch" />
        <input name="phoneNumber" value={form.phoneNumber} onChange={onChange} className="h-12 rounded-xl border border-white/20 bg-black/35 px-4 text-sm text-white outline-none placeholder:text-white/35 focus:border-[#ff4a4a]" placeholder="Phone" />
        <input name="resumeLink" value={form.resumeLink} onChange={onChange} className="h-12 rounded-xl border border-white/20 bg-black/35 px-4 text-sm text-white outline-none placeholder:text-white/35 focus:border-[#ff4a4a]" placeholder="Resume link" />
        <input name="projectLink" value={form.projectLink} onChange={onChange} className="h-12 rounded-xl border border-white/20 bg-black/35 px-4 text-sm text-white outline-none placeholder:text-white/35 focus:border-[#ff4a4a]" placeholder="Project link" />
        <input name="githubLink" value={form.githubLink} onChange={onChange} className="h-12 rounded-xl border border-white/20 bg-black/35 px-4 text-sm text-white outline-none placeholder:text-white/35 focus:border-[#ff4a4a]" placeholder="GitHub link" />
        <input name="linkedinLink" value={form.linkedinLink} onChange={onChange} className="h-12 rounded-xl border border-white/20 bg-black/35 px-4 text-sm text-white outline-none placeholder:text-white/35 focus:border-[#ff4a4a]" placeholder="LinkedIn link" />
        <input name="leetcodeLink" value={form.leetcodeLink} onChange={onChange} className="h-12 rounded-xl border border-white/20 bg-black/35 px-4 text-sm text-white outline-none placeholder:text-white/35 focus:border-[#ff4a4a]" placeholder="LeetCode link" />
        <input name="skills" value={form.skills} onChange={onChange} className="h-12 rounded-xl border border-white/20 bg-black/35 px-4 text-sm text-white outline-none placeholder:text-white/35 focus:border-[#ff4a4a] sm:col-span-2" placeholder="Skills (comma separated)" />

        <textarea name="bio" value={form.bio} onChange={onChange} rows={4} className="rounded-xl border border-white/20 bg-black/35 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-[#ff4a4a] sm:col-span-2" placeholder="Bio" />

        {error && (
          <p className="rounded-lg border border-[#ff7890]/35 bg-[#7f1020]/20 px-3 py-2 text-sm text-[#ffd3dc] sm:col-span-2">
            {error}
          </p>
        )}

        <div className="flex flex-wrap gap-2 sm:col-span-2">
          <button
            type="submit"
            disabled={isSaving}
            className="h-11 rounded-xl border border-[#ff5a5a]/45 bg-[linear-gradient(130deg,#cc1b1b,#ff2727)] px-5 text-sm font-semibold text-white transition-opacity duration-150 ease-out hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? "Saving..." : "Save Profile"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/profile")}
            className="h-11 rounded-xl border border-white/20 bg-transparent px-5 text-sm font-semibold text-white/80 transition-colors duration-150 ease-out hover:border-white/40 hover:text-white"
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}
