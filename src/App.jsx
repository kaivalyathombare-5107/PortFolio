import { useEffect, useState } from 'react';
import useScrollProgress from './hooks/useScrollProgress.js';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import Skills from './components/Skills.jsx';
import Projects from './components/Projects.jsx';
import Achievements from './components/Achievements.jsx';
import PhotoGallery from './components/PhotoGallery.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import Messages from './components/Messages.jsx';
import WelcomeIntro from './components/WelcomeIntro.jsx';
import {
  profile as defaultProfile,
  skills as defaultSkills,
  projects as defaultProjects,
  achievements as defaultAchievements,
  gallery as defaultGallery,
} from './data.js';
import { fetchPortfolioData, savePortfolioData, unlockOwnerMode, exitOwnerMode } from './lib/api.js';

const defaultData = {
  profile: defaultProfile,
  skills: defaultSkills,
  projects: defaultProjects,
  achievements: defaultAchievements,
  gallery: defaultGallery,
};

export default function App() {
  // 'welcome' -> intro animation, then straight into the site as a normal
  // viewer. There is no separate "who is watching" gate anymore — owner
  // access is unlocked via the hidden button in the footer instead.
  const [mode, setMode] = useState('welcome');
  const [data, setData] = useState(defaultData);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [saveError, setSaveError] = useState('');

  const isOwner = mode === 'owner';

  // Continuously syncs scroll position onto CSS vars so the page reads as
  // one long scrolling scene (parallax layers, HUD progress bar) instead
  // of a stack of static sections.
  useScrollProgress();

  // Load whatever is currently saved in the database on first render. If
  // nothing has been saved yet (or the database isn't attached), the
  // defaults from data.js stay as-is.
  useEffect(() => {
    let cancelled = false;
    fetchPortfolioData().then((remote) => {
      if (cancelled || !remote) return;
      setData((current) => ({
        profile: remote.profile && Object.keys(remote.profile).length ? remote.profile : current.profile,
        skills: Array.isArray(remote.skills) ? remote.skills : current.skills,
        projects: Array.isArray(remote.projects) ? remote.projects : current.projects,
        achievements: Array.isArray(remote.achievements) ? remote.achievements : current.achievements,
        gallery: Array.isArray(remote.gallery) ? remote.gallery : current.gallery,
      }));
    }).finally(() => {
      if (!cancelled) setDataLoaded(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Applies a content change locally and, if signed in as owner, persists
  // it to the database immediately.
  async function commit(nextData) {
    setData(nextData);
    if (!isOwner) return;
    try {
      await savePortfolioData(nextData);
      setSaveError('');
    } catch (err) {
      setSaveError(err.message || 'Failed to save. Your change is only visible to you until this is fixed.');
    }
  }

  async function handleUnlock(passphrase) {
    await unlockOwnerMode(passphrase);
    setMode('owner');
  }

  async function handleExit() {
    await exitOwnerMode();
    setMode('viewer');
  }

  const updateProfile = (updates) => commit({ ...data, profile: { ...data.profile, ...updates } });

  const addSkill = (skill) =>
    commit({ ...data, skills: [...data.skills, { id: `skill-${Date.now()}`, ...skill }] });
  const removeSkill = (id) => commit({ ...data, skills: data.skills.filter((s) => s.id !== id) });

  const addProject = (project) =>
    commit({ ...data, projects: [...data.projects, { id: `project-${Date.now()}`, ...project }] });
  const removeProject = (id) => commit({ ...data, projects: data.projects.filter((p) => p.id !== id) });

  const addAchievement = (achievement) =>
    commit({
      ...data,
      achievements: [...data.achievements, { id: `achievement-${Date.now()}`, ...achievement }],
    });
  const removeAchievement = (id) =>
    commit({ ...data, achievements: data.achievements.filter((a) => a.id !== id) });

  const addPhoto = (photo) =>
    commit({ ...data, gallery: [...data.gallery, { id: `photo-${Date.now()}`, ...photo }] });
  const removePhoto = (id) => commit({ ...data, gallery: data.gallery.filter((p) => p.id !== id) });

  if (mode === 'welcome') {
    return <WelcomeIntro profile={data.profile} onComplete={() => setMode('viewer')} />;
  }

  return (
    <>
      <div className="scroll-hud" aria-hidden="true">
        <div className="scroll-hud-fill" />
      </div>
      <div className="scroll-world" aria-hidden="true">
        <span className="scroll-world-layer scroll-world-layer-1" />
        <span className="scroll-world-layer scroll-world-layer-2" />
        <span className="scroll-world-layer scroll-world-layer-3" />
      </div>
      <Navbar profile={data.profile} isOwner={isOwner} />
      <Hero profile={data.profile} />
      <About profile={data.profile} isOwner={isOwner} onUpdateProfile={updateProfile} />
      <Skills skills={data.skills} isOwner={isOwner} onAddSkill={addSkill} onRemoveSkill={removeSkill} />
      <Projects
        projects={data.projects}
        isOwner={isOwner}
        onAddProject={addProject}
        onRemoveProject={removeProject}
      />
      <Achievements
        achievements={data.achievements}
        isOwner={isOwner}
        onAddAchievement={addAchievement}
        onRemoveAchievement={removeAchievement}
      />
      <PhotoGallery
        gallery={data.gallery}
        isOwner={isOwner}
        onAddPhoto={addPhoto}
        onRemovePhoto={removePhoto}
      />
      {isOwner ? <Messages /> : <Contact />}
      {isOwner && saveError ? (
        <p className="save-error-banner">{saveError}</p>
      ) : null}
      <Footer profile={data.profile} isOwner={isOwner} onUnlock={handleUnlock} onExit={handleExit} />
    </>
  );
}