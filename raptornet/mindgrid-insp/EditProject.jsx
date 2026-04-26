import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import InputSpotlightBorder from "../constants/InputSpotlightBorder";
import "react-toastify/dist/ReactToastify.css";

const API_BASE = import.meta.env.VITE_API_URL;

if (!API_BASE) {
  throw new Error("VITE_API_URL is not defined");
}

export default function EditProject() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(projectId);

  const [form, setForm] = useState({
    title: "",
    description: "",
    techStack: "",
    teamMembers: "",
    githubLink: "",
    liveLink: "",
    status: "Idea",
    progress: 0,
  });

  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  // ===============================
  // LOAD PROJECT (EDIT MODE)
  // ===============================
  useEffect(() => {
    if (!isEditMode) return;

    const fetchProject = async () => {
      try {
        setLoading(true);

        const res = await fetch(`${API_BASE}/api/projects/${projectId}`, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        if (!res.ok) {
          throw new Error("Failed to load project");
        }

        const data = await res.json();

        setForm({
          title: data.title || "",
          description: data.description || "",
          techStack: data.techStack?.join(", ") || "",
          teamMembers: data.teamMembers?.join(", ") || "",
          githubLink: data.githubLink || "",
          liveLink: data.liveLink || "",
          status: data.status || "Idea",
          progress: data.progress || 0,
        });
      } catch (err) {
        console.error(err);
        toast.error("Unable to load project.");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId, token, isEditMode]);

  // ===============================
  // HANDLE INPUT CHANGE
  // ===============================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ===============================
  // HANDLE SUBMIT
  // ===============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        ...form,
        techStack: form.techStack
          ? form.techStack.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        teamMembers: form.teamMembers
          ? form.teamMembers.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        progress: Number(form.progress),
      };

      const url = isEditMode
        ? `${API_BASE}/api/projects/${projectId}`
        : `${API_BASE}/api/projects`;

      const method = isEditMode ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error("Backend error:", errorData);
        throw new Error(errorData.message || "Save failed");
      }

      toast.success(
        isEditMode
          ? "Project updated successfully!"
          : "Project created successfully!"
      );

      setTimeout(() => {
        navigate(-1);
      }, 800);
    } catch (err) {
      console.error("Submit error:", err.message);
      toast.error(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen w-full flex items-center justify-center py-12 overflow-hidden">
      
      {/* Grid Background */}
      <div className="absolute inset-0 z-[-2] bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:20px_20px]" />

      <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden w-[90%]">
        
        {/* Glow Background */}
        <div className="fixed inset-0 w-screen h-screen bg-slate-950 z-0">
          <div className="absolute bottom-0 left-[-20vw] top-[-10vh] h-[40vw] w-[40vw] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,0.15),rgba(255,255,255,0))]" />
          <div className="absolute bottom-0 right-[-20vw] top-[-10vh] h-[40vw] w-[40vw] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,0.15),rgba(255,255,255,0))]" />
        </div>

        {/* Heading */}
        <div className="flex animate-text-gradient font-extrabold bg-gradient-to-r from-[#b2a8fd] via-[#8678f9] to-[#c7d2fe] bg-[200%_auto] bg-clip-text text-4xl md:text-6xl text-transparent mt-[80px] items-center justify-center relative mx-auto text-center mb-8">
          {isEditMode ? "Edit Project" : "Create Project"}
        </div>

        {/* Card */}
        <div className="w-full md:w-[90%] mx-auto rounded-2xl sm:mt-12 mb-12 p-8 relative z-10 bg-slate-700/40 backdrop-blur-md shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">

            <InputSpotlightBorder
              inputProps={{
                name: "title",
                value: form.title,
                onChange: handleChange,
              }}
              placeholder="Project Title"
            />

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Project Description"
              className="w-full rounded-md border border-gray-800 bg-gray-950 px-4 py-3 text-gray-100 outline-none focus:border-indigo-500 h-32 resize-none"
            />

            <InputSpotlightBorder
              inputProps={{
                name: "techStack",
                value: form.techStack,
                onChange: handleChange,
              }}
              placeholder="Tech Stack (React, Node, MongoDB)"
            />

            <InputSpotlightBorder
              inputProps={{
                name: "teamMembers",
                value: form.teamMembers,
                onChange: handleChange,
              }}
              placeholder="Team Members (Krishna, Rahul, Ananya)"
            />

            <InputSpotlightBorder
              inputProps={{
                name: "githubLink",
                value: form.githubLink,
                onChange: handleChange,
              }}
              placeholder="GitHub Link"
            />

            <InputSpotlightBorder
              inputProps={{
                name: "liveLink",
                value: form.liveLink,
                onChange: handleChange,
              }}
              placeholder="Live Demo Link"
            />

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-800 bg-gray-950 px-4 py-3 text-gray-100"
            >
              <option value="Idea">Idea</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>

            <div>
              <label className="text-gray-300 text-sm">
                Progress ({form.progress}%)
              </label>
              <input
                type="range"
                name="progress"
                min="0"
                max="100"
                value={form.progress}
                onChange={handleChange}
                className="w-full accent-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg transition"
            >
              {loading
                ? "Saving..."
                : isEditMode
                ? "Update Project"
                : "Create Project"}
            </button>
          </form>

          <ToastContainer position="bottom-right" />
        </div>
      </div>
    </section>
  );
}