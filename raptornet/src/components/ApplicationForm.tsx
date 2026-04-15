"use client";

import React from "react";

type FormState = {
  name: string;
  email: string;
  college: string;
  branch: string;
  projectLink: string;
  githubLink: string;
  linkedinLink: string;
  leetcodeLink: string;
  phoneNumber: string;
};

type FieldConfig = {
  name: keyof FormState;
  label: string;
  placeholder: string;
  type: "text" | "email" | "url" | "tel";
  autoComplete?: string;
};

const initialState: FormState = {
  name: "",
  email: "",
  college: "",
  branch: "",
  projectLink: "",
  githubLink: "",
  linkedinLink: "",
  leetcodeLink: "",
  phoneNumber: "",
};

export default function ApplicationForm() {
  const [formData, setFormData] = React.useState<FormState>(initialState);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [feedback, setFeedback] = React.useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(result.message ?? "Failed to submit application.");
      }

      setFeedback({
        type: "success",
        message: "Application submitted successfully.",
      });
      setFormData(initialState);
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong while submitting the form.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClassName =
    "mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition-colors duration-150 ease-out placeholder:text-white/30 focus:border-[#7f1020]";

  const fields: FieldConfig[] = [
    { name: "name", label: "Full Name", placeholder: "Your name", type: "text", autoComplete: "name" },
    { name: "email", label: "Email", placeholder: "you@example.com", type: "email", autoComplete: "email" },
    { name: "college", label: "College", placeholder: "Your college", type: "text", autoComplete: "organization" },
    { name: "branch", label: "Branch", placeholder: "CSE / AIML / ECE / Any branch", type: "text", autoComplete: "off" },
    { name: "projectLink", label: "Project Link", placeholder: "https://yourproject.com", type: "url", autoComplete: "url" },
    { name: "githubLink", label: "GitHub Link", placeholder: "https://github.com/yourname", type: "url", autoComplete: "url" },
    { name: "linkedinLink", label: "LinkedIn Link", placeholder: "https://linkedin.com/in/yourname", type: "url", autoComplete: "url" },
    { name: "leetcodeLink", label: "LeetCode Link (optional)", placeholder: "https://leetcode.com/u/yourname", type: "url", autoComplete: "url" },
    { name: "phoneNumber", label: "Phone Number", placeholder: "Your phone number", type: "tel", autoComplete: "tel" },
  ];

  return (
    <form onSubmit={handleSubmit} className="rounded-[2rem] border border-white/10 bg-black/25 p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((field) => (
          <label key={field.name} className={field.name === "phoneNumber" ? "sm:col-span-2" : ""}>
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">{field.label}</span>
            <input
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              placeholder={field.placeholder}
              className={inputClassName}
              type={field.type}
              autoComplete={field.autoComplete}
              inputMode={field.type === "tel" ? "numeric" : undefined}
              required={field.name !== "leetcodeLink"}
            />
          </label>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full bg-[#7f1020] px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition-colors duration-150 ease-out hover:bg-[#9d1427] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Submitting..." : "Submit Application"}
        </button>
        <p className="text-xs leading-5 text-white/55">
          LeetCode is optional. Everything else is required.
        </p>
      </div>

      {feedback && (
        <div
          className={`mt-6 rounded-xl border p-4 text-sm ${
            feedback.type === "success"
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-100"
              : "border-red-500/30 bg-red-500/10 text-red-100"
          }`}
        >
          {feedback.message}
        </div>
      )}
    </form>
  );
}
