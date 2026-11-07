import { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '../lib/hooks';
import { Expand, Film, Pause, Play, VolumeOff, VolumeOn } from './Icons';

// The foundation film: autoplays muted and looped (like a hero background), with
// play/pause, sound and fullscreen controls. Respects prefers-reduced-motion and
// pauses itself while scrolled out of view.
export default function HeroFilm() {
  const videoRef = useRef(null);
  const progressRef = useRef(null);
  const userPaused = useRef(false);
  const reducedMotion = usePrefersReducedMotion();
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [started, setStarted] = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);

  // Muted autoplay (the attribute must be present for iOS Safari).
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.setAttribute('muted', '');
    if (reducedMotion) return;
    v.play().catch(() => setAutoplayBlocked(true));
  }, [reducedMotion]);

  // Pause off-screen to save battery; resume when visible unless the viewer paused it.
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !('IntersectionObserver' in window)) return undefined;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) v.pause();
      else if (!userPaused.current && !reducedMotion && v.paused && started) v.play().catch(() => {});
    }, { threshold: 0.25 });
    io.observe(v);
    return () => io.disconnect();
  }, [reducedMotion, started]);

  // Smooth progress bar without re-rendering React every frame.
  useEffect(() => {
    let raf;
    const tick = () => {
      const v = videoRef.current;
      if (v && progressRef.current && v.duration) progressRef.current.style.width = `${(v.currentTime / v.duration) * 100}%`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const togglePlay = () => {
    const v = videoRef.current;
    if (v.paused) {
      userPaused.current = false;
      v.play().catch(() => {});
    } else {
      userPaused.current = true;
      v.pause();
    }
  };

  const toggleSound = () => {
    const v = videoRef.current;
    v.muted = !v.muted;
    setMuted(v.muted);
    if (!v.muted && v.paused) {
      userPaused.current = false;
      v.play().catch(() => {});
    }
  };

  const fullscreen = () => {
    const v = videoRef.current;
    if (v.requestFullscreen) v.requestFullscreen();
    else if (v.webkitEnterFullscreen) v.webkitEnterFullscreen(); // iOS
  };

  return (
    <figure className="film">
      <div className="film-frame">
        <video
          ref={videoRef}
          loop
          playsInline
          muted
          preload="metadata"
          poster="/media/foundation-film-poster.jpg"
          aria-label="Poly Learning Foundation film. A non-profit organization: most organizations help people find jobs — we invent them. We build free platforms, create new roles and train people for them. Featuring PolyCode, Digital Logics Studio and Calculus Runtime."
          onPlay={() => {
            setPlaying(true);
            setStarted(true);
          }}
          onPause={() => setPlaying(false)}
          onVolumeChange={(e) => setMuted(e.currentTarget.muted)}
        >
          <source src="/media/foundation-film-720.mp4" type="video/mp4" media="(max-width: 900px)" />
          <source src="/media/foundation-film.mp4" type="video/mp4" />
        </video>

        {!started && (reducedMotion || autoplayBlocked) && (
          <button className="film-big-play" onClick={togglePlay} aria-label="Play the foundation film">
            <span><Play /></span>
          </button>
        )}

        <div className={`film-controls${playing ? ' auto-hide' : ''}`}>
          <button className="film-btn" onClick={togglePlay} aria-label={playing ? 'Pause film' : 'Play film'}>
            {playing ? <Pause /> : <Play />}
          </button>
          <button className="film-btn" onClick={toggleSound} aria-label={muted ? 'Turn sound on' : 'Mute'}>
            {muted ? <VolumeOff /> : <VolumeOn />}
            <span className="label">{muted ? 'Sound on' : 'Mute'}</span>
          </button>
          <span className="film-spacer" />
          <button className="film-btn" onClick={fullscreen} aria-label="Watch fullscreen">
            <Expand />
          </button>
        </div>
        <div className="film-progress" aria-hidden="true"><span ref={progressRef} /></div>
      </div>
      <figcaption className="film-caption">
        <Film />
        Our story in 32 seconds — what we do, and the three platforms behind it.
      </figcaption>
    </figure>
  );
}
