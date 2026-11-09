import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '../lib/hooks';
import { VolumeOff, VolumeOn } from './Icons';

// The foundation film is the whole home-page hero and fills the screen. It stays pinned while
// the hero scrolls past, and the scroll position drives the playhead: scroll down to move the
// film forward, scroll up to rewind it. On load it plays the short logo intro once and then
// waits for the viewer to scroll. The navbar stays hidden while the film covers the screen.
//
// Sound is on by default and the soundtrack follows the film. Browsers only allow sound after
// a click, tap or key press (scrolling with a wheel or finger doesn't count), so if the
// browser blocks it on load, it starts on the viewer's first click, tap or key press.
//
// Viewers who prefer reduced motion get an ordinary player with controls instead.

const INTRO_END = 3; // s: logo fully assembled. Scrolling starts the film from here.
const FILM_END = 31; // s: end card fully visible, just before the film fades out.
const EASE = 0.15; // share of the remaining gap the playhead closes each frame (smooths wheel steps)
const BAR = 2; // s: one bar of the soundtrack (120 BPM). Re-syncs jump whole bars so the beat never stumbles.
const RESYNC = 4; // s: while scrolling, re-sync the music once it is this far from the film
const FADE_MS = 350;

// Silent encodes with a keyframe every 10 frames, so seeking to any point is instant. Portrait
// screens (phones, tablets held upright) get the vertical 9:16 cut of the film, which has the
// same scenes and timing laid out for a tall screen, so it fills the screen like a Short or Reel.
const SCRUB_SRC = '/media/foundation-film-scrub.mp4';
const SCRUB_SRC_SMALL = '/media/foundation-film-scrub-720.mp4';
const SCRUB_SRC_VERTICAL = '/media/foundation-film-scrub-vertical.mp4';
const MUSIC_SRC = '/media/foundation-film-music.m4a'; // the film's soundtrack, same timeline for both cuts
const POSTER = '/media/foundation-film-poster.jpg'; // the frame at INTRO_END
const POSTER_VERTICAL = '/media/foundation-film-poster-vertical.jpg';
const PORTRAIT = '(max-aspect-ratio: 3/4)';

const isPortrait = () => window.matchMedia(PORTRAIT).matches;
const pickSrc = () => {
  if (isPortrait()) return SCRUB_SRC_VERTICAL;
  return window.matchMedia('(max-width: 900px)').matches ? SCRUB_SRC_SMALL : SCRUB_SRC;
};

const GESTURES = ['pointerdown', 'pointerup', 'touchend', 'click', 'keydown'];

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
  const [audible, setAudible] = useState(false);
  const [src, setSrc] = useState(pickSrc);
  const vertical = src === SCRUB_SRC_VERTICAL;

  // Float the navbar over the page and hide it while the film covers the screen. A layout
  // effect, so the navbar never flashes in on first paint.
  useLayoutEffect(() => {
    const root = document.documentElement.classList;
    root.add('film-hero', 'film-covering');
    return () => root.remove('film-hero', 'film-covering');
  }, []);

  useEffect(() => {
    const root = document.documentElement.classList;
    const track = trackRef.current;
    const stage = stageRef.current;
    const v = videoRef.current;
    const a = audioRef.current;
    v.muted = true;
    v.setAttribute('muted', ''); // iOS Safari only allows muted inline playback with the attribute set

    let intro = true;
    let shown = 0; // where the playhead is easing to, in seconds
    let lastShown = 0;
    let span = 1; // px of scrolling that runs the film from INTRO_END to FILM_END
    let lastP = 0; // scroll progress through the hero on the last frame, 0-1
    let covering = true;
    let raf = 0;

    // ---------- Soundtrack ----------
    // on: the viewer wants sound (default). blocked: the browser hasn't allowed it yet.
    const sound = { on: true, blocked: false, inView: false, fadeRaf: 0 };
    const refresh = () => setAudible(sound.on && !sound.blocked);

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
      if (!a.paused) return fade(1); // already playing, or fading out: bring it (back) up
      a.currentTime = v.currentTime; // start where the film is
      a.volume = 0;
      a.play()
        .then(() => {
          sound.blocked = false;
          refresh();
          if (!sound.on || !sound.inView) return a.pause(); // the gesture only unlocked it for later
          if (Math.abs(a.currentTime - v.currentTime) > 0.5) a.currentTime = v.currentTime;
          fade(1);
        })
        .catch(() => {
          sound.blocked = true; // no click, tap or key press yet: try again on the next one
          refresh();
        });
    };
    const stopMusic = () => {
      if (!a.paused) fade(0, () => a.pause());
    };
    const updateMusic = () => (sound.on && sound.inView ? playMusic() : stopMusic());

    // The speaker icon: mutes when sound is playing, otherwise turns it on (a click is the gesture browsers need).
    toggleSound.current = () => {
      sound.on = !(sound.on && !sound.blocked);
      refresh();
      updateMusic();
    };

    // Any click, tap or key press unlocks sound if the browser blocked it on load.
    const onGesture = (e) => {
      if (!sound.on || !sound.blocked) return;
      if (e.target instanceof Element && e.target.closest('.film-sound')) return; // the icon handles itself
      playMusic();
    };
    GESTURES.forEach((g) => window.addEventListener(g, onGesture, { passive: true }));

    // Keep the music with the film while the viewer scrolls. When they stop, let it play on.
    const syncMusic = () => {
      if (!sound.on || sound.blocked || !sound.inView || Math.abs(shown - lastShown) < 0.001) return;
      if (a.ended) return playMusic(); // it finished; scrolling again restarts it from the film
      const drift = shown - a.currentTime;
      if (Math.abs(drift) > RESYNC) {
        const t = a.currentTime + Math.round(drift / BAR) * BAR;
        a.currentTime = Math.max(0, Math.min(t, (a.duration || 32) - 0.25));
      }
    };

    // The music fades out once the film is half scrolled away, and back in when it returns.
    const soundIo = new IntersectionObserver(
      ([entry]) => {
        sound.inView = entry.isIntersecting;
        updateMusic();
      },
      { rootMargin: '-50% 0px 0px 0px' }
    );
    soundIo.observe(track);

    // ---------- Scroll-driven playhead ----------
    const measure = () => {
      const old = span;
      span = Math.max(1, track.offsetHeight - stage.offsetHeight);
      // Rotating the device changes how long the hero is. Keep the film at the same moment
      // instead of letting the old scroll position land somewhere else in it.
      if (old > 1 && Math.abs(span - old) > 1 && lastP > 0 && lastP < 1) {
        window.scrollTo(0, track.getBoundingClientRect().top + window.scrollY + lastP * span);
      }
    };
    const setCovering = (c) => {
      if (c === covering) return;
      covering = c;
      root.toggle('film-covering', c);
    };

    const endIntro = () => {
      if (!intro) return;
      intro = false;
      v.pause();
      shown = lastShown = v.currentTime;
    };

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const r = track.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -r.top / span));
      lastP = p;
      setCovering(r.top <= 1 && r.bottom >= window.innerHeight - 1);
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
      } else {
        setCovering(false);
      }
    });
    io.observe(track);
    window.addEventListener('resize', measure);

    v.play().catch(() => {
      // Autoplay blocked (e.g. iOS Low Power Mode): show the logo frame and go straight to scrubbing.
      v.poster = isPortrait() ? POSTER_VERTICAL : POSTER;
      endIntro();
    });

    // Rotating the device swaps between the vertical and widescreen cuts. The loop then seeks
    // the new video to the same moment once it has loaded.
    const orientation = window.matchMedia(PORTRAIT);
    const onRotate = () => {
      endIntro();
      setSrc(pickSrc());
    };
    orientation.addEventListener('change', onRotate);

    // Some mobile browsers only load video data after a tap; use the first one to load it.
    const prime = () => {
      if (v.readyState < 2) v.play().then(() => { if (!intro) v.pause(); }).catch(() => {});
    };
    const primeEvents = ['pointerdown', 'touchend', 'keydown'];
    primeEvents.forEach((g) => window.addEventListener(g, prime, { once: true, passive: true }));

    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(sound.fadeRaf);
      io.disconnect();
      soundIo.disconnect();
      a.pause();
      orientation.removeEventListener('change', onRotate);
      window.removeEventListener('resize', measure);
      GESTURES.forEach((g) => window.removeEventListener(g, onGesture));
      primeEvents.forEach((g) => window.removeEventListener(g, prime));
    };
  }, []);

  return (
    <div className="scrub" ref={trackRef}>
      <div className={`scrub-stage${vertical ? ' is-vertical' : ''}`} ref={stageRef}>
        <video ref={videoRef} src={src} muted playsInline preload="auto" aria-label={`${LABEL} Scroll down to move through the film.`} />
        <audio ref={audioRef} src={MUSIC_SRC} preload="auto" />
        <button type="button" className="film-sound" onClick={() => toggleSound.current()} aria-label={audible ? 'Mute' : 'Turn sound on'}>
          {audible ? <VolumeOn /> : <VolumeOff />}
        </button>
        <div className="film-progress" aria-hidden="true"><span ref={barRef} /></div>
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
