import type { SVGProps } from 'react'

type P = SVGProps<SVGSVGElement> & { size?: number }
const base = ({ size = 20, ...p }: P) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  ...p,
})

export const Flame = (p: P) => (
  <svg {...base(p)} fill="currentColor" stroke="none">
    <path d="M12 2c.6 3.4-1.6 5-3.2 6.8C7.3 10.5 6 12.3 6 15a6 6 0 0 0 12 0c0-2.4-1-4.3-2.3-5.6.1 1.6-.5 2.8-1.6 3.4.4-3.7-.9-7.6-2.1-10.8Z" />
  </svg>
)
export const Heart = (p: P) => (
  <svg {...base(p)} fill="currentColor" stroke="none">
    <path d="M12 21s-7.5-4.6-9.5-9.3C1 8 3.3 4.5 6.8 4.5c2 0 3.5 1.1 5.2 3 1.7-1.9 3.2-3 5.2-3 3.5 0 5.8 3.5 4.3 7.2C19.5 16.4 12 21 12 21Z" />
  </svg>
)
export const Bolt = (p: P) => (
  <svg {...base(p)} fill="currentColor" stroke="none">
    <path d="M13.5 2 4 13.5h6.5L9.5 22 20 9.5h-6.6L13.5 2Z" />
  </svg>
)
export const Lock = (p: P) => (
  <svg {...base(p)}>
    <rect x="5" y="11" width="14" height="10" rx="2.5" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </svg>
)
export const Check = (p: P) => (
  <svg {...base(p)} strokeWidth={3}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
)
export const X = (p: P) => (
  <svg {...base(p)}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
)
export const Speaker = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5H4Z" fill="currentColor" />
    <path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" />
  </svg>
)
export const Home = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 11 12 4l8 7v8.5a1.5 1.5 0 0 1-1.5 1.5H15v-6H9v6H5.5A1.5 1.5 0 0 1 4 19.5V11Z" />
  </svg>
)
export const User = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21a8 8 0 0 1 16 0" />
  </svg>
)
export const Note = (p: P) => (
  <svg {...base(p)}>
    <circle cx="7" cy="18" r="3" fill="currentColor" />
    <circle cx="18" cy="16" r="3" fill="currentColor" />
    <path d="M10 18V5l11-2v13" />
  </svg>
)
export const Star = (p: P) => (
  <svg {...base(p)} fill="currentColor" stroke="none">
    <path d="m12 2.5 2.9 6 6.6.8-4.9 4.5 1.3 6.5L12 17l-5.9 3.3 1.3-6.5-4.9-4.5 6.6-.8L12 2.5Z" />
  </svg>
)
export const Sparkle = (p: P) => (
  <svg {...base(p)} fill="currentColor" stroke="none">
    <path d="M12 2c.7 4.8 2.4 7.3 8 8-5.6.7-7.3 3.2-8 8-.7-4.8-2.4-7.3-8-8 5.6-.7 7.3-3.2 8-8Z" />
  </svg>
)
export const Bulb = (p: P) => (
  <svg {...base(p)}>
    <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3Z" />
  </svg>
)
export const Play = (p: P) => (
  <svg {...base(p)} fill="currentColor" stroke="none">
    <path d="M8 5.5v13a1 1 0 0 0 1.5.9l10.4-6.5a1 1 0 0 0 0-1.8L9.5 4.6A1 1 0 0 0 8 5.5Z" />
  </svg>
)
