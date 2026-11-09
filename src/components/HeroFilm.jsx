import { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '../lib/hooks';
import { VolumeOff, VolumeOn } from './Icons';

// The foundation film is the whole home-page hero. It stays pinned under the navbar while
// the hero scrolls past, and the scroll position drives the playhead: scroll down to move
// the film forward, scroll up to rewind it. On load it plays the short logo intro once and
// then waits for the viewer to scroll.
//
// The soundtrack follows the film. Browsers only allow sound after a click, tap or key press
// (scrolling with a wheel or finger doesn't count), so it starts on the viewer's first click
// or scroll key while the film is on screen, or from the sound button.
//
// Viewers who prefer reduced motion get an ordinary player with controls instead.

const INTRO_END = 3; // s: logo fully assembled. Scrolling starts the film from here.
const FILM_END = 31; // s: end card fully visible, just before the film fades out.
const EASE = 0.15; // share of the remaining gap the playhead closes each frame (smooths wheel steps)
const BAR = 2; // s: one bar of the soundtrack (120 BPM). Re-syncs jump whole bars so the beat never stumbles.
const RESYNC = 4; // s: while scrolling, re-sync the music once it is this far from the film
const FADE_MS = 350;

// Silent encodes with a keyframe every 10 frames, so seeking to any point is instant.
const SCRUB_SRC = '/media/foundation-film-scrub.mp4';
const SCRUB_SRC_SMALL = '/media/foundation-film-scrub-720.mp4';
const MUSIC_SRC = '/media/foundation-film-music.m4a'; // the film's soundtrack, same timeline
const POSTER = '/media/foundation-film-poster.jpg'; // the frame at INTRO_END

const SCROLL_KEYS = ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', ' ', 'End', 'Home'];
const INTERACTIVE = 'a, button, input, select, textarea, label, [contenteditable]';

const LABEL =
  'Poly Learning Foundation film. A non-profit organization: most organizations help people find jobs — we invent them. We build free platforms, create new roles and train people for them. Featuring PolyCode, Digital Logics Studio and Calculus Runtime.';

export default function HeroFilm() {
  const reducedMotion = usePrefersReducedMotion();
  return reducedMotion ? <PlainFilm /> : <ScrollFilm />;
}

function Backdrop() {
  return (
    <>
      <div className="bg-grid" />
      <div className="glow glow-gold" />
      <div className="glow glow-violet" />
      <div className="glow glow-cyan" />
    </>
  );
}

function ScrollFilm() {
  const trackRef = useRef(null);
  const stageRef = useRef(null);
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const barRef = useRef(null);
  const hintRef = useRef(null);
  const toggleSound = useRef(() => {});
  const [soundOn, setSoundOn] = useState(false);
  const [src] = useState(() => (window.matchMedia('(max-width: 900px)').matches ? SCRUB_SRC_SMALL : SCRUB_SRC));

  useEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    const v = videoRef.current;
    const a = audioRef.current;
    v.muted = true;
    v.setAttribute('muted', ''); // iOS Safari only allows muted inline playback with the attribute set

    let intro = true;
    let shown = 0; // where the playhead is easing to, in seconds
    let lastShown = 0;
    let pinTop = 0; // px from the viewport top where the stage pins (the navbar height)
    let span = 1; // px of scrolling that runs the film from INTRO_END to FILM_END
    let raf = 0;

    // ---------- Soundtrack ----------
    const sound = { on: false, userMuted: false, inView: false, fadeRaf: 0 };

    const fade = (to, done) => {
      cancelAnimationFrame(sound.fadeRaf);
      const from = a.volume;
      const t0 = performance.now();
      const step = (now) => {
        const k = Math.min(1, (now - t0) / FADE_MS);
        a.volume = from + (to - from) * k; // ignored on iOS, where volume is read-only
        if (k < 1) sound.fadeRaf = requestAnimationFrame(step);
        else if (done) done();
      };
      sound.fadeRaf = requestAnimationFrame(step);
    };

    const playMusic = () => {
      if (!a.paused) return fade(1); // it was fading out: bring it back
      a.currentTime = v.currentTime; // start where the film is
      a.volume = 0;
      a.play()
        .then(() => {
          if (Math.abs(a.currentTime - v.currentTime) > 0.5) a.currentTime = v.currentTime;
          if (sound.on && sound.inView) fade(1);
        })
        .catch(() => {
          // Blocked: no click or key press yet. Leave the button showing "Sound on".
          sound.on = false;
          setSoundOn(false);
        });
    };
    const stopMusic = () => {
      if (!a.paused) fade(0, () => a.pause());
    };
    const updateMusic = () => (sound.on && sound.inView ? playMusic() : stopMusic());
    const setSound = (on) => {
      sound.on = on;
      setSoundOn(on);
      updateMusic();
    };
    toggleSound.current = () => {
      const on = !sound.on;
      sound.userMuted = !on;
      setSound(on);
    };

    // Keep the music with the film while the viewer scrolls. When they stop, let it play on.
    const syncMusic = () => {
      if (!sound.on || !sound.inView || Math.abs(shown - lastShown) < 0.001) return;
      if (a.ended) return playMusic(); // it finished; scrolling again restarts it from the film
      const drift = shown - a.currentTime;
      if (Math.abs(drift) > RESYNC) {
        const t = a.currentTime + Math.round(drift / BAR) * BAR;
        a.currentTime = Math.max(0, Math.min(t, (a.duration || 32) - 0.25));
      }
    };

    // First click (not on a link or control) or scroll key while the film is on screen turns sound on.
    const onGesture = (e) => {
      if (sound.on || sound.userMuted || !sound.inView) return;
      if (e.target instanceof Element && e.target.closest(INTERACTIVE)) return;
      if (e.type === 'keydown' && !SCROLL_KEYS.includes(e.key)) return;
      setSound(true);
    };
    window.addEventListener('click', onGesture);
    window.addEventListener('keydown', onGesture);

    // The music fades out once the film has mostly scrolled away, and back in when it returns.
    const soundIo = new IntersectionObserver(
      ([entry]) => {
        sound.inView = entry.isIntersecting;
        updateMusic();
      },
      { rootMargin: '0px 0px -40% 0px' }
    );
    soundIo.observe(track);

    // ---------- Scroll-driven playhead ----------
    const measure = () => {
      pinTop = parseFloat(getComputedStyle(stage).top) || 0;
      span = Math.max(1, track.offsetHeight - stage.offsetHeight);
    };

    const endIntro = () => {
      if (!intro) return;
      intro = false;
      v.pause();
      shown = lastShown = v.currentTime;
    };

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const p = Math.min(1, Math.max(0, (pinTop - track.getBoundingClientRect().top) / span));
      barRef.current.style.transform = `scaleX(${p})`;
      hintRef.current.classList.toggle('is-hidden', p > 0.01);

      if (intro) {
        if (p > 0.002 || v.currentTime >= INTRO_END) endIntro();
        else return;
      }
      const target = INTRO_END + p * (FILM_END - INTRO_END);
      shown += (target - shown) * EASE;
      if (Math.abs(target - shown) < 0.005) shown = target;
      // One seek at a time: while the browser is still seeking, skip and catch up next frame.
      if (v.readyState >= 1 && !v.seeking && Math.abs(v.currentTime - shown) > 1 / 60) v.currentTime = shown;
      syncMusic();
      lastShown = shown;
    };

    // Only run the loop while the hero is on screen.
    const io = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(raf);
      if (entry.isIntersecting) {
        measure();
        raf = requestAnimationFrame(tick);
      }
    });
    io.observe(track);
    window.addEventListener('resize', measure);

    v.play().catch(() => {
      // Autoplay blocked (e.g. iOS Low Power Mode): show the logo frame and go straight to scrubbing.
      v.poster = POSTER;
      endIntro();
    });

    // Some mobile browsers only load video data after a tap; use the first one to load it.
    const prime = () => {
      if (v.readyState < 2) v.play().then(() => { if (!intro) v.pause(); }).catch(() => {});
    };
    const gestures = ['pointerdown', 'touchend', 'keydown'];
    gestures.forEach((g) => window.addEventListener(g, prime, { once: true, passive: true }));

    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(sound.fadeRaf);
      io.disconnect();
      soundIo.disconnect();
      a.pause();
      window.removeEventListener('resize', measure);
      window.removeEventListener('click', onGesture);
      window.removeEventListener('keydown', onGesture);
      gestures.forEach((g) => window.removeEventListener(g, prime));
    };
  }, []);

  return (
    <div className="scrub" ref={trackRef}>
      <div className="scrub-stage" ref={stageRef}>
        <Backdrop />
        <div className="film-frame">
          <video ref={videoRef} src={src} muted playsInline preload="auto" aria-label={`${LABEL} Scroll down to move through the film.`} />
          <audio ref={audioRef} src={MUSIC_SRC} preload="metadata" />
          <button type="button" className="film-btn film-sound" onClick={() => toggleSound.current()} aria-label={soundOn ? 'Mute the soundtrack' : 'Turn the soundtrack on'}>
            {soundOn ? <VolumeOn /> : <VolumeOff />}
            <span className="label">{soundOn ? 'Mute' : 'Sound on'}</span>
          </button>
          <div className="film-progress" aria-hidden="true"><span ref={barRef} /></div>
        </div>
        <span className="scrub-hint" ref={hintRef} aria-hidden="true" />
      </div>
    </div>
  );
}

function PlainFilm() {
  return (
    <div className="hero-plain">
      <Backdrop />
      <div className="container">
        <div className="film-frame">
          <video controls playsInline preload="metadata" poster={POSTER} aria-label={LABEL}>
            <source src="/media/foundation-film-720.mp4" type="video/mp4" media="(max-width: 900px)" />
            <source src="/media/foundation-film.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </div>
  );
}
