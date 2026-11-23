export type Locale = 'en' | 'es'
export type Genre = 'classical' | 'pop' | 'rock'
/** A bilingual string. */
export type L = { en: string; es: string }
export type ByGenre<T> = Record<Genre, T>
