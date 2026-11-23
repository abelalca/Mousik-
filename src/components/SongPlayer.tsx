import { useCallback, useEffect, useRef, useState } from 'react'
import { playTimeline } from '@/lib/audio'
import { SONG_BPM, hasAnything, songEvents, type Song } from '@/lib/song'
import { useStore } from '@/store/useStore'
import { useT } from '@/lib/i18n'
import { Play } from './Icons'

/** Plays a song (defaults to the learner's own) and tracks whether it is sounding. */
export function useSongPlayer() {
  const genre = useStore((s) => s.settings.genre)
  const [playing, setPlaying] = useState(false)
  const alive = useRef(true)
  useEffect(
    () => () => {
      alive.current = false
    },
    [],
  )
  const play = useCallback(
    async (song: Song = useStore.getState().song, repeats = 2) => {
      if (!hasAnything(song)) return
      setPlaying(true)
      try {
        await playTimeline(songEvents(song, genre, { repeats }), SONG_BPM)
      } finally {
        if (alive.current) setPlaying(false)
      }
    },
    [genre],
  )
  return { play, playing }
}

export function PlaySongButton({ className = '', label }: { className?: string; label?: string }) {
  const { t } = useT()
  const song = useStore((s) => s.song)
  const { play, playing } = useSongPlayer()
  if (!hasAnything(song)) return null
  return (
    <button className={`btn-ghost flex items-center justify-center gap-2 ${className}`} onClick={() => play()} disabled={playing}>
      <Play size={16} /> {playing ? t('playing') : label ?? t('listenSong')}
    </button>
  )
}
