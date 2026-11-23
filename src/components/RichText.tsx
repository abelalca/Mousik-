import { Fragment } from 'react'
import { useStore } from '@/store/useStore'
import { noteName } from '@/lib/music'

/** Renders **bold** and {n:C#} (notation-aware note names). Paragraphs split on blank lines. */
export function useRich() {
  const notation = useStore((s) => s.settings.notation)
  const inline = (text: string) =>
    text.split(/(\*\*[^*]+\*\*)/g).map((chunk, i) => {
      const bold = chunk.startsWith('**') && chunk.endsWith('**')
      const raw = bold ? chunk.slice(2, -2) : chunk
      const content = raw.replace(/\{n:([A-G][#b]?)\}/g, (_, n) => noteName(n, notation))
      return bold ? (
        <strong key={i} className="font-semibold text-ink">
          {content}
        </strong>
      ) : (
        <Fragment key={i}>{content}</Fragment>
      )
    })
  const plain = (text: string) =>
    text.replace(/\*\*/g, '').replace(/\{n:([A-G][#b]?)\}/g, (_, n) => noteName(n, notation))
  return { inline, plain }
}

export function RichText({ text, className = '' }: { text: string; className?: string }) {
  const { inline } = useRich()
  return (
    <div className={`space-y-3 ${className}`}>
      {text.split(/\n\n/).map((p, i) => (
        <p key={i} className="leading-relaxed">
          {p.split('\n').map((line, j) => (
            <Fragment key={j}>
              {j > 0 && <br />}
              {inline(line)}
            </Fragment>
          ))}
        </p>
      ))}
    </div>
  )
}
