/** @type {import('tailwindcss').Config} */
const v = (name) => `rgb(var(--${name}) / <alpha-value>)`
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: v('bg'),
        surface: v('surface'),
        raised: v('raised'),
        ink: v('ink'),
        muted: v('muted'),
        line: v('line'),
        accent: v('accent'),
        'accent-ink': v('accent-ink'),
        accent2: v('accent2'),
        success: v('success'),
        danger: v('danger'),
      },
      fontFamily: {
        display: 'var(--font-display)',
        body: 'var(--font-body)',
      },
      borderRadius: { card: 'var(--radius)' },
      boxShadow: {
        soft: '0 1px 2px rgb(0 0 0 / 0.04), 0 8px 24px -8px rgb(var(--shadow) / 0.18)',
        lift: '0 2px 0 rgb(var(--shadow) / 0.12), 0 12px 32px -12px rgb(var(--shadow) / 0.35)',
      },
    },
  },
  plugins: [],
}
