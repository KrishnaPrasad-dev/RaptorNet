import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InputSpotlightBorder from "../constants/InputSpotlightBorder";

const API_BASE = import.meta.env.VITE_API_URL;

if (!API_BASE) {
  throw new Error("VITE_API_URL is not defined");
}

async function parseResponseBody(res) {
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    return await res.json();
  }
  return await res.text().catch(() => "");
}

export default function EditProfile() {
  const [form, setForm] = useState({
    name: "",
    title: "",
    resumeLink: "",
    role: "",
    section: "",
    bio: "",
    skills: "",
    github: "",
    linkedin: "",
  });

  const [loading, setLoading] = useState(false);

  // Load profile on mount
  useEffect(() => {
    let cancelled = false;

    const loadProfile = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE}/api/profile`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        if (!res.ok) {
          const body = await parseResponseBody(res);
          throw new Error(
            `Failed to load profile (${res.status}): ${String(body).slice(0, 300)}`,
          );
        }

        const data = await parseResponseBody(res);

        if (!cancelled) {
          const safe = (v) =>
            v === null || typeof v === "undefined" ? "" : String(v);
          setForm({
            name: safe(data.name),
            title: safe(data.title),
            resumeLink: safe(data.resumeLink || data.resume || ""),
            role: safe(data.role),
            section: safe(data.section),
            bio: safe(data.bio),
            skills: Array.isArray(data.skills)
              ? data.skills.join(", ")
              : safe(data.skills),
            github: safe(data.github),
            linkedin: safe(data.linkedin),
          });
        }
      } catch (err) {
        console.error("Error loading profile:", err);
        if (!cancelled)
          toast.error("Failed to load profile. Check console for details.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadProfile();
    return () => {
      cancelled = true;
    };
  }, []);

  // handle text inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // submit updated profile (JSON only)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    try {
      setLoading(true);
      const payload = {
        ...form,
        // send skills as array if comma-separated
        skills: form.skills
          ? form.skills
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
      };

      const res = await fetch(`${API_BASE}/api/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await parseResponseBody(res);
        console.error("Update failed:", res.status, body);
        const message =
          (body && (body.message || body.error)) ||
          `Failed to update profile (${res.status})`;
        toast.error(String(message).slice(0, 200));
        return;
      }

      const data = await parseResponseBody(res).catch(() => ({}));
      toast.success("Profile updated successfully!");
      setTimeout(() => {
        const userId = data && (data._id || data.id);
        if (userId) window.location.href = `/profile/${userId}`;
        else window.location.href = "/profile";
      }, 700);
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error("Error updating profile. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen w-full flex items-center justify-center py-12  overflow-hidden">
      <div className="absolute inset-0 z-[-2] bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:20px_20px]" />

      <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden w-[90%]">
        <div className="fixed inset-0 w-screen h-screen bg-slate-950 z-0">
          <div className="absolute bottom-0 left-[-20vw] top-[-10vh] h-[40vw] w-[40vw] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,0.15),rgba(255,255,255,0))]" />
          <div className="absolute bottom-0 right-[-20vw] top-[-10vh] h-[40vw] w-[40vw] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,0.15),rgba(255,255,255,0))]" />
        </div>

        <div className="flex animate-text-gradient font-extrabold bg-gradient-to-r from-[#b2a8fd] via-[#8678f9] to-[#c7d2fe] bg-[200%_auto] bg-clip-text text-4xl md:text-6xl text-transparent mt-[80px] items-center justify-center relative mx-auto text-center mb-8">
          Edit Profile
        </div>

        <div className="w-full md:w-[90%] mx-auto rounded-2xl sm:mt-12 mb-12 p-8 relative z-10 bg-slate-700/40 backdrop-blur-md shadow-xl">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-slate-300 text-base font-medium mb-2 block">
                  Name
                </label>
                <InputSpotlightBorder
                  inputProps={{
                    name: "name",
                    value: form.name,
                    onChange: handleChange,
                  }}
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="text-slate-300 text-base font-medium mb-2 block">
                  Title
                </label>
                <InputSpotlightBorder
                  inputProps={{
                    name: "title",
                    value: form.title,
                    onChange: handleChange,
                  }}
                  placeholder="Enter your title"
                />
              </div>

              <div>
                <label className="text-slate-300 text-base font-medium mb-2 block">
                  Role
                </label>

                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-800 bg-gray-950 px-4 py-3 text-gray-100 outline-none focus:border-[#8678F9] transition-colors duration-300"
                >
                  <option value="">Select Role</option>
                   <option value="Club Member">Club Member</option>
                  <option value="President">President</option>
                  <option value="Vice President">Vice President</option>
                  <option value="Secretary">Secretary</option>
                  <option value="Treasurer">Treasurer</option>
                  <option value="Project Coordinator">
                    Project Coordinator
                  </option>
                  <option value="Skills Coordinator">Skills Coordinator</option>
                  <option value="Skills Lead - Communication">
                    Skills Lead - Comm
                  </option>
                 
                 
                </select>
              </div>

              <div>
                <label className="text-slate-300 text-base font-medium mb-2 block">
                  Section
                </label>
                <InputSpotlightBorder
                  inputProps={{
                    name: "section",
                    value: form.section,
                    onChange: handleChange,
                  }}
                  placeholder="Enter your section"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-slate-300 text-base font-medium mb-2 block">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  placeholder="Write something about you"
                  className="w-full rounded-md border border-gray-800 bg-gray-950 px-4 py-3 text-gray-100 placeholder-gray-500 outline-none focus:border-[#8678F9] transition-colors duration-300 h-32 resize-none"
                />
              </div>

              <div>
                <label className="text-slate-300 text-base font-medium mb-2 block">
                  Resume Link
                </label>
                <InputSpotlightBorder
                  inputProps={{
                    name: "resumeLink",
                    value: form.resumeLink,
                    onChange: handleChange,
                  }}
                  placeholder="Paste your resume link"
                />
              </div>

              <div>
                <label className="text-slate-300 text-base font-medium mb-2 block">
                  Skills
                </label>
                <InputSpotlightBorder
                  inputProps={{
                    name: "skills",
                    value: form.skills,
                    onChange: handleChange,
                  }}
                  placeholder="e.g. React, Node, CSS"
                />
              </div>

              <div>
                <label className="text-slate-300 text-base font-medium mb-2 block">
                  GitHub
                </label>
                <InputSpotlightBorder
                  inputProps={{
                    name: "github",
                    value: form.github,
                    onChange: handleChange,
                  }}
                  placeholder="GitHub profile link"
                />
              </div>

              <div>
                <label className="text-slate-300 text-base font-medium mb-2 block">
                  LinkedIn
                </label>
                <InputSpotlightBorder
                  inputProps={{
                    name: "linkedin",
                    value: form.linkedin,
                    onChange: handleChange,
                  }}
                  placeholder="LinkedIn profile link"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className={`bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-lg text-lg ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>

          <ToastContainer position="bottom-right" />
        </div>
      </div>
    </section>
  );
}
