// src/pages/Profile.jsx
import React, { useEffect, useState } from 'react'
import { Link, useParams, useLocation } from 'react-router-dom'
import axios from 'axios'
import pfpFallback from '../assets/profileblue.jpeg'
import mem from '../assets/group.png'
import pen from '../assets/pen.png'
import githubIcon from '../assets/github.png'
import linkedinIcon from '../assets/linkedin.png'
import LetterGlitch from '../constants/LetterGlitch' 

/** Safely get API base (works in Vite & CRA) */
const API_BASE = import.meta.env.VITE_API_URL
if (!API_BASE) {
  throw new Error('VITE_API_URL is not defined')
}


/** Parse JWT payload (no library needed) */
const parseJwt = (token) => {
  try {
    if (!token) return null
    const payload = token.split('.')[1]
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(decodeURIComponent(escape(decoded)))
  } catch {
    return null
  }
}

/** Helper: convert Google Drive share link to direct download/view link */
const googleDriveDirectLink = (url) => {
  if (!url) return null
  // common share URL: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
  const fileIdMatch = url.match(/\/d\/([A-Za-z0-9_-]+)/)
  if (fileIdMatch) return `https://drive.google.com/uc?export=download&id=${fileIdMatch[1]}`
  // alternative share link that includes id=query param
  const idParamMatch = url.match(/[?&]id=([A-Za-z0-9_-]+)/)
  if (idParamMatch) return `https://drive.google.com/uc?export=download&id=${idParamMatch[1]}`
  return url
}

/** Helper: sanitize URL and ensure it becomes absolute */
const sanitizeUrl = (url) => {
  if (!url) return null
  // If it already has a scheme (http(s), ftp, mailto, etc.) return as is
  if (/^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(url) || /^mailto:/.test(url)) return url
  // If starts with '//' (protocol-relative), prepend https:
  if (url.startsWith('//')) return `https:${url}`
  // Otherwise, treat it as missing scheme and prepend https://
  return `https://${url}`
}

const Profile = (props) => {
  const { id } = useParams()
  const location = useLocation()
  const stateUser = location?.state?.user

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [user, setUser] = useState({
    name: props.name || 'J Krishna Prasad',
    title: props.title || 'Python developer',
    role: props.role || 'Club Member',
    section: props.section || '',
    bio:
      props.bio ||
      `I am from GuruNanak Univeristy.`,
    avatarUrl: props.avatarUrl || '',
    skills: props.skills || ['Python'],
    resumeLink: props.resumeLink || '',
    resumeDirectLink: props.resumeDirectLink || '',
    githuburl: props.githuburl || '',
    linkedinurl: props.linkedinurl || '',
  })

  const getLoggedInUserId = () => {
    if (typeof window === 'undefined') return null
    const token = localStorage.getItem('token') || localStorage.getItem('jwtToken') || sessionStorage.getItem('token')
    const payload = parseJwt(token)
    return payload?._id || payload?.id || null
  }

  useEffect(() => {
    let cancelled = false

    const fetchUser = async () => {
      setLoading(true)
      setError(null)

      const token = typeof window !== 'undefined' ? localStorage.getItem('token') || localStorage.getItem('jwtToken') || sessionStorage.getItem('token') || '' : ''

      const axiosConfig = token ? { headers: { Authorization: `Bearer ${token}` } } : {}


      try {
        // if caller provided a user in state, show immediately
        if (stateUser) {
          const st = stateUser
          setUser((prev) => ({
            ...prev,
            name: st.name || prev.name,
            title: st.title || prev.title,
            role: st.role || prev.role,
            section: st.section || prev.section,
            bio: st.bio || prev.bio,
            avatarUrl: st.avatarUrl || st.profilePic || prev.avatarUrl,
            skills: st.skills?.length ? st.skills : prev.skills,
            resumeLink: st.resumeLink || st.resume || prev.resumeLink,
            resumeDirectLink: st.resumeDirectLink || prev.resumeDirectLink || '',
            githuburl: st.githuburl || st.github || prev.githuburl,
            linkedinurl: st.linkedinurl || st.linkedin || prev.linkedinurl,
          }))
          setLoading(false)
          // continue to refresh from server in background
        }

        let got = null

        try {
          const res = await axios.get(`${API_BASE}/api/profile/${id}`, axiosConfig)
          got = res.data
        } catch (err) {
          if (err.response?.status !== 404) {
            throw err
          }
        }


        if (got && !cancelled) {
          setUser((prev) => ({
            ...prev,
            name: got.name || prev.name,
            title: got.title || prev.title,
            role: got.role || prev.role,
            section: got.section || prev.section,
            bio: got.bio || prev.bio,
            avatarUrl: got.avatarUrl || got.profilePic || prev.avatarUrl,
            skills: got.skills?.length ? got.skills : prev.skills,
            resumeLink: got.resumeLink || got.resume || prev.resumeLink,
            resumeDirectLink: got.resumeDirectLink || '', // prefer direct if available
            githuburl: got.githuburl || got.github || prev.githuburl,
            linkedinurl: got.linkedinurl || got.linkedin || prev.linkedinurl,
          }))
        } else if (!got && !stateUser) {
          throw new Error('User not found')
        }

      } catch (err) {
        if (!cancelled) {
          console.error('Profile fetch error:', err)
          const status = err.response?.status
          if (status === 401 || status === 403) setError('You are not authorized.')
          else if (status === 404) setError('Profile not found.')
          else setError(err.message || 'Unable to load profile.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    if (id) fetchUser()
    else {
      setLoading(false)
      setError('No user id provided in URL.')
    }

    return () => {
      cancelled = true
    }
  }, [id, stateUser])

  const loggedInUserId = getLoggedInUserId()
  const canEdit = loggedInUserId && id && String(loggedInUserId) === String(id)
  const MY_USER_ID = "6991847d329bfc4bb0a5aa0e"
  const isKrishnaProfile = String(id) === MY_USER_ID

  // Build final resume href:
  // Priority: resumeDirectLink (from server) -> resumeLink (raw) -> null
  const raw = user.resumeDirectLink || user.resumeLink || ''
  // If it's a Drive share link, convert to direct first (if direct wasn't populated server-side)
  const maybeDrive = googleDriveDirectLink(raw || user.resumeLink || '')
  const resumeHref = sanitizeUrl(maybeDrive || raw) || null

  const handleResumeClick = (e) => {
    e.preventDefault()
    if (!resumeHref) {
      // show simple feedback: but avoid introducing extra lib dependencies here
      alert('No resume uploaded.')
      return
    }
    try {
      window.open(resumeHref, '_blank', 'noopener,noreferrer')
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      window.location.href = resumeHref
    }
  }

  return (
  <section className="relative min-h-screen w-full mt-12 flex items-center justify-center py-12 px-1 overflow-hidden">

  
  <div className="fixed inset-0 -z-10">
  {isKrishnaProfile ? (
    <>
      <LetterGlitch
        glitchSpeed={50}
        centerVignette={true}
        outerVignette={false}
        smooth={true}
      />
      <div className="absolute inset-0 bg-black/40" />
    </>
  ) : (
    <div className="w-full h-full bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:20px_20px]" />
  )}
</div>

   <div
  className={`relative w-[90%] rounded-2xl shadow-2xl z-10 p-1 ${
    isKrishnaProfile
      ? "bg-black backdrop-blur-sm border border-white/10"
      : "bg-gradient-to-br from-gray-900/60 via-gray-950 to-black/90"
  }`}
>

<div className="flex justify-end mt-1 mr-1 mb-2 gap-3">
  
        

          {canEdit && (
            <Link
              to="/editprofile"
              className="relative h-12 overflow-hidden rounded-xl p-[1px] focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-50"
            >
              <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
              <span className="inline-flex h-full w-full items-center justify-center rounded-xl bg-gray-950 px-4 text-sm font-medium text-gray-50 backdrop-blur-3xl">
                <span className="text-white mr-2">Edit Profile</span>
                <img src={pen} className="h-5 w-5" alt="edit" />
              </span>
            </Link>
          )}

          {canEdit && (
            <Link
              to="/create-project"
              className="relative h-12 overflow-hidden rounded-xl p-[1px] focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-50"
            >
              <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
              <span className="inline-flex h-full w-full items-center justify-center rounded-xl bg-gray-950 px-4 text-sm font-medium text-gray-50 backdrop-blur-3xl">
                <span className="text-white mr-2">Create Project</span>
                <img src={pen} className="h-5 w-5" alt="edit" />
              </span>
            </Link>
          )}

        </div>

        <div className="rounded-2xl bg-gradient-to-b p-8 md:p-12 flex flex-col md:flex-row gap-8">
          <div className="flex-shrink-0 flex items-center justify-center w-full md:w-1/3">
            <div className="relative">
              <img src={user.avatarUrl || pfpFallback} alt={`${user.name} avatar`} className="w-40 h-40 md:w-56 md:h-56 rounded-full object-cover ring-4 ring-indigo-500/40 shadow-lg" />
              <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-gray-800/70 px-4 py-2 rounded-full text-md text-gray-200">
                {user.section || '—'}
              </span>
            </div>
          </div>

          <div className="flex-1 text-gray-200">
            {loading ? (
              <div className="py-8 text-center text-white">Loading profile…</div>
            ) : error ? (
              <div className="py-8 text-center text-red-400">{error}</div>
            ) : (
              <>
                <div className="flex flex-col mt-12 sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    {isKrishnaProfile ? (
                      <><h1 className='text-2xl md:text-4xl font-extrabold text-white'>
                        Krishna Prasad - Admin</h1>
                        </>
                    ) :(
                    <h1 className="text-2xl md:text-4xl font-extrabold text-white">{user.name}</h1>
                    )
                  }
                    <p className="mt-3 text-indigo-300 font-medium text-lg md:text-xl">{user.title}</p>

                    <div className="flex items-center mt-4 gap-3">
                      <button
                        onClick={handleResumeClick}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${resumeHref ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : 'bg-gray-700 text-gray-300 cursor-not-allowed'} transition text-sm shadow-md`}
                        aria-disabled={!resumeHref}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 4v12m0 0l4-4m-4 4l-4-4M21 12v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6"
                          />
                        </svg>
                        <span>{resumeHref ? 'Resume' : 'No resume uploaded'}</span>
                      </button>
                    </div>

                    <div className="mt-5 inline-flex h-12 items-center justify-center rounded-md font-medium text-white">
                      <button className="inline-flex text-white text-md h-12 animate-background-shine items-center justify-center rounded-md border border-gray-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-50">
                        {user.role}
                        <img src={mem} alt="group" className="ml-2 w-9 h-10" />
                      </button>
                    </div>
                  </div>
                </div>

                <p className="mt-6 text-gray-300 leading-relaxed md:text-base">{user.bio}</p>

                <div className="mt-6">
                  <h3 className="text-xl text-indigo-200 font-bold mb-3">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {user.skills.map((s) => (
                      <span key={s} className="relative inline-block overflow-hidden rounded-full p-[2px]">
                        <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                        <div className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-gray-950 px-3 py-1 text-xs font-medium text-gray-50 backdrop-blur-3xl">
                          {s}
                        </div>
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl text-indigo-200 mt-5 font-bold mb-3">Contact</h3>
                </div>
                <div className="mt-4 text-indigo-300 flex flex-row gap-3 font-medium text-lg md:text-xl">
                  <div className="h-11 bg-white w-11 rounded-md border">
                    <a href={user.githuburl || '#'} target="_blank" rel="noreferrer">
                      <img src={githubIcon} alt="github" />
                    </a>
                  </div>
                  <div className="h-11 bg-white w-11 rounded-md">
                    <a href={user.linkedinurl || '#'} target="_blank" rel="noreferrer">
                      <img src={linkedinIcon} alt="linkedin" />
                    </a>
                  </div>


                </div>
              </>
            )}
          </div>
        </div>

        <div className="mt-4 text-center text-xs text-gray-400 pb-2">-------{user.name}-------</div>
      </div>
     
    </section>
  )
}

export default Profile
