import { useId } from 'react';

// The foundation's mark: three faces of one block - one per platform
// (gold = PolyCode, violet = Digital Logics Studio, cyan = Calculus Runtime).
export default function Logo({ className, title, ...rest }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg className={className} viewBox="-110 -110 220 220" role={title ? 'img' : undefined} aria-hidden={title ? undefined : true} {...rest}>
      {title && <title>{title}</title>}
      <defs>
        <linearGradient id={`${id}t`} x1="0" y1="-100" x2="0" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FDE68A" />
          <stop offset="1" stopColor="#FACC15" />
        </linearGradient>
        <linearGradient id={`${id}r`} x1="0" y1="-50" x2="90" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#7DD3FC" />
          <stop offset="1" stopColor="#0EA5E9" />
        </linearGradient>
        <linearGradient id={`${id}l`} x1="0" y1="-50" x2="-90" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#B4A8FF" />
          <stop offset="1" stopColor="#7C6CF6" />
        </linearGradient>
      </defs>
      <g strokeLinejoin="round" strokeWidth="7">
        <polygon points="-77.94,-50 0,-95 77.94,-50 0,-5" fill={`url(#${id}t)`} stroke={`url(#${id}t)`} />
        <polygon points="4.33,2.5 82.27,-42.5 82.27,47.5 4.33,92.5" fill={`url(#${id}r)`} stroke={`url(#${id}r)`} />
        <polygon points="-82.27,-42.5 -4.33,2.5 -4.33,92.5 -82.27,47.5" fill={`url(#${id}l)`} stroke={`url(#${id}l)`} />
      </g>
    </svg>
  );
}
