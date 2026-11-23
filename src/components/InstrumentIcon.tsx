import type { Family } from '@/lib/instruments'

/** Minimal line-art icon per instrument family. */
export function InstrumentIcon({ family, size = 28, className = '' }: { family: Family; size?: number; className?: string }) {
  const p = { width: size, height: size, viewBox: '0 0 32 32', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, className }
  switch (family) {
    case 'keys':
      return (
        <svg {...p}>
          <rect x="4" y="8" width="24" height="16" rx="2.5" />
          <path d="M10 8v16M16 8v16M22 8v16" />
          <path d="M8.5 8h3v9h-3zM14.5 8h3v9h-3zM20.5 8h3v9h-3z" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'strings':
      return (
        <svg {...p}>
          <path d="M16 3v8" />
          <path d="M13 11c-3 0-4 2.2-4 4 0 1.6 1.2 2.6 1.2 3.5S9 20.5 9 22.5C9 25.5 11.8 28 16 28s7-2.5 7-5.5c0-2-1.2-3-1.2-4s1.2-1.9 1.2-3.5c0-1.8-1-4-4-4Z" />
          <path d="M13.2 15.5c.6.8.6 2.2 0 3M18.8 15.5c-.6.8-.6 2.2 0 3" strokeWidth="1.4" />
          <path d="M16 11v13" strokeWidth="1.2" />
          <path d="M14 3h4" />
        </svg>
      )
    case 'plucked':
      return (
        <svg {...p}>
          <path d="M21 11 28 4M26 2l4 4" />
          <path d="M18 14c-2-2-6-2.5-8.5 0-1.5 1.5-1.3 3.2-2.8 4.6C5 20.3 4 22.5 6.3 25.7 9.5 28 11.7 27 13.4 25.3c1.4-1.5 3.1-1.3 4.6-2.8C20.5 20 20 16 18 14Z" />
          <circle cx="12.5" cy="19.5" r="2" />
          <path d="M21 11l-6.5 6.5" />
        </svg>
      )
    case 'woodwinds':
      return (
        <svg {...p}>
          <path d="M6 26 25 7l2.5 2.5L8.5 28.5Z" />
          <circle cx="12" cy="22" r="0.9" fill="currentColor" />
          <circle cx="15" cy="19" r="0.9" fill="currentColor" />
          <circle cx="18" cy="16" r="0.9" fill="currentColor" />
          <circle cx="21" cy="13" r="0.9" fill="currentColor" />
        </svg>
      )
    case 'brass':
      return (
        <svg {...p}>
          <path d="M3 15h4M7 13v4M7 15h12" />
          <path d="M19 15c3 0 5-4 9-6v12c-4-2-6-6-9-6Z" />
          <path d="M10 15v-4h6v4M10 15c0 3 2 4 4 4s3-1 3-4" />
        </svg>
      )
    case 'synth':
      return (
        <svg {...p}>
          <rect x="3" y="7" width="26" height="18" rx="3" />
          <path d="M6 18c2 0 2-6 4-6s2 6 4 6 2-6 4-6 2 6 4 6 2-6 4-6" />
        </svg>
      )
    case 'percussion':
      return (
        <svg {...p}>
          <ellipse cx="16" cy="15" rx="10" ry="4" />
          <path d="M6 15v8c0 2.2 4.5 4 10 4s10-1.8 10-4v-8" />
          <path d="M9 4l6 9M23 4l-6 9" />
        </svg>
      )
  }
}
