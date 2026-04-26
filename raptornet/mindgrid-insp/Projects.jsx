import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import githubIcon from "../assets/github.png";
import linkedinIcon from "../assets/linkedin.png";
import arrowIcon from "../assets/arrow-up.png";
import featuredIcon from "../assets/featured.png";
import nonfeaturedIcon from "../assets/nonfeatured.png";


// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const API_BASE = import.meta.env.VITE_API_URL;

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/projects`);
        if (!res.ok) throw new Error("Failed to fetch projects");

        const data = await res.json();
        setProjects(data);
      } catch (err) {
        console.error("Projects fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const token = localStorage.getItem("token");

  const parseJwt = (token) => {
    try {
      if (!token) return null;
      const payload = token.split(".")[1];
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  };



  const payload = parseJwt(token);
  const userEmail = payload?.email;

  const toggleFeature = async (id) => {
    try {
      await fetch(`${API_BASE}/api/projects/${id}/feature`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const res = await fetch(`${API_BASE}/api/projects`);
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      console.error("Feature toggle error:", err);
    }
  };

  return (
    <section className="w-full flex flex-col relative overflow-hidden bg-black min-h-screen">
      {/* SAME HERO BACKGROUND */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f1a_2px,transparent_2px),linear-gradient(to_bottom,#80808005_2px,transparent_2px)] bg-[size:14px_24px]" />
        <div className="absolute left-1/2 top-[-10%] h-[1000px] w-[1000px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_400px_at_50%_300px,#ffffff10,#000000)]" />
      </div>

      <div className="relative z-10 w-[90%] max-w-6xl mx-auto mt-32 mb-20">
        {/* SAME HERO HEADING STYLE */}
        <h1
          className="text-4xl md:text-6xl font-extrabold text-center mb-16
        bg-gradient-to-r from-[#b2a8fd] via-[#8678f9] to-[#c7d2fe]
        bg-[200%_auto] bg-clip-text text-transparent animate-text-gradient"
        >
          PROJECTS
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 80, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0)" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="hero_tag font-extrabold text-center text-gray_gradient"
        >
          <span>
            Great ideas grow with great teams. <br />
            <span className="block">Connect. Collaborate. Contribute.</span>
          </span>
        </motion.p>

        {loading ? (
          <p className="text-center text-gray-400">Loading projects...</p>
        ) : projects.length === 0 ? (
          <p className="text-center text-gray-400">No projects yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {projects.map((project) => (
              <div
                key={project._id}
                className="bg-transparent border border-white/10 backdrop-blur-md
                p-8 rounded-2xl shadow-xl
                hover:scale-[1.03] transition duration-300
                flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between flex-wrap gap-2">

                    {/* LEFT SIDE — Title */}
                    <h2 className="text-2xl font-semibold text-pink-400">
                      {project.title}
                    </h2>

                    {/* RIGHT SIDE — Featured Area */}
                    <div className="flex flex-col items-end">

                      {project.isFeatured && (
                        <div className="flex items-center gap-2">
                          <h2 className="text-white text-xl font-medium">
                            Featured
                          </h2>
                          <img
                            src={featuredIcon}
                            alt="featured"
                            className="h-6 w-6"
                          />
                        </div>
                      )}

                      {project.isNonfeatured && (
                        <img
                          src={nonfeaturedIcon}
                          alt="special"
                          className="h-6 w-6 mt-1"
                        />
                      )}

                    </div>

                  </div>


                  {userEmail === import.meta.env.VITE_ADMIN_EMAIL && (
                    <button
                      onClick={() => toggleFeature(project._id)}
                      className="text-md mt-2 py-2 px-2 rounded-xl  border border-1px text-yellow-400 hover:text-yellow-300 mt-2"
                    >
                      {project.isFeatured
                        ? "UnFeature Project"
                        : "Mark as Featured"}
                    </button>
                  )}

                  <p className="text-gray-400 mt-4 text-sm leading-relaxed">
                    {project.description}
                  </p>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2 mt-6">
                    {project.techStack?.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 text-xs rounded-full
                        bg-purple-500/20 text-purple-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>



                {/* Team Members */}
                {project.teamMembers?.length > 0 && (
                  <div className="mt-6">
                    <p className="text-gray-500 text-xs uppercase tracking-wider">
                      Team Members
                    </p>

                    <div className="flex flex-wrap gap-2 mt-2">
                      {project.teamMembers.map((member, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 text-xs rounded-full
          bg-indigo-500/20 text-indigo-300"
                        >
                          {member}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Progress + Footer */}
                <div className="mt-8">
                  <div className="flex justify-between text-xs text-gray-400 mb-2">
                    <span>{project.status}</span>
                    <span>{project.progress}%</span>
                  </div>

                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>

                  <div className="mt-6 flex justify-between items-center flex-wrap gap-4">
                    {/* LEFT SIDE — LinkedIn then GitHub */}
                    <div className="flex gap-4 flex-wrap">
                      {/* Creator LinkedIn FIRST */}
                      {project.createdBy?.linkedin && (
                        <a
                          href={project.createdBy.linkedin}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 bg-gray-200 h-11 px-4 rounded-md border shadow-sm hover:scale-105 transition"
                        >
                          <img
                            src={linkedinIcon}
                            alt="linkedin"
                            className="h-6 w-6"
                          />
                          <p className="text-black text-sm font-medium">
                            LinkedIn
                          </p>
                        </a>
                      )}

                      {/* Project GitHub SECOND */}
                      {project.githubLink && (
                        <a
                          href={project.githubLink}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 bg-gray-200 h-11 px-4 rounded-md border shadow-sm hover:scale-105 transition"
                        >
                          <img
                            src={githubIcon}
                            alt="github"
                            className="h-6 w-6"
                          />
                          <p className="text-black text-sm font-medium">
                            GitHub
                          </p>
                        </a>
                      )}
                    </div>

                    {/* RIGHT SIDE — Live Button */}
                    {project.liveLink && (
                      <a
                        href={project.liveLink}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <button className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none">
                          <span
                            className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] 
        bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]"
                          />
                          <span
                            className="inline-flex h-full w-full items-center justify-center 
        rounded-full bg-gray-950 px-8 py-1 text-sm font-medium text-gray-50 backdrop-blur-3xl"
                          >
                            Check Live Site
                            <img
                              src={arrowIcon}
                              alt="github"
                              className=" ml-3   h-4 w-4"
                            />
                          </span>
                        </button>
                      </a>
                    )}
                  </div>

                  {payload?.email &&
                    project.createdBy?.email &&
                    payload.email === project.createdBy.email && (
                      <div className="mt-4 text-right">
                        <Link
                          to={`/edit-project/${project._id}`}
                          className="text-xl border p-2 rounded-xl text-gray-400 hover:text-white"
                        >
                          Edit →
                        </Link>
                      </div>
                    )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
