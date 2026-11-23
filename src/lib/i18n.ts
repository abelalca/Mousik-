import { useStore } from '@/store/useStore'
import type { L } from './types'

const ui = {
  tagline: { en: 'Learn music theory. Compose your first piece.', es: 'Aprende teoría musical. Compón tu primera pieza.' },
  getStarted: { en: 'Get started', es: 'Empezar' },
  haveAccount: { en: 'I already have an account', es: 'Ya tengo una cuenta' },
  signIn: { en: 'Sign in', es: 'Iniciar sesión' },
  signUp: { en: 'Create account', es: 'Crear cuenta' },
  email: { en: 'Email', es: 'Correo electrónico' },
  password: { en: 'Password', es: 'Contraseña' },
  orContinue: { en: 'or', es: 'o' },
  google: { en: 'Continue with Google', es: 'Continuar con Google' },
  noAccount: { en: "Don't have an account?", es: '¿No tienes cuenta?' },
  yesAccount: { en: 'Already have an account?', es: '¿Ya tienes cuenta?' },
  checkEmail: { en: 'Check your inbox to confirm your email, then sign in.', es: 'Revisa tu correo para confirmar tu cuenta y luego inicia sesión.' },
  localMode: {
    en: 'Cloud accounts are not configured yet — your progress will be saved on this device.',
    es: 'Las cuentas en la nube aún no están configuradas: tu progreso se guardará en este dispositivo.',
  },
  continueLocal: { en: 'Continue on this device', es: 'Continuar en este dispositivo' },
  // onboarding
  obLangTitle: { en: 'Which language do you prefer?', es: '¿En qué idioma prefieres aprender?' },
  obNameTitle: { en: 'What should Mo call you?', es: '¿Cómo quieres que Mo te llame?' },
  obNamePlaceholder: { en: 'Your name', es: 'Tu nombre' },
  obGenreTitle: { en: 'What music do you want to compose?', es: '¿Qué música quieres componer?' },
  obGenreSub: {
    en: 'The theory is the same; examples, exercises and your final piece adapt to your style. You can change it anytime.',
    es: 'La teoría es la misma; los ejemplos, ejercicios y tu pieza final se adaptan a tu estilo. Puedes cambiarlo cuando quieras.',
  },
  obNotationTitle: { en: 'How do you name notes?', es: '¿Cómo nombras las notas?' },
  obGoalTitle: { en: 'Pick a daily goal', es: 'Elige una meta diaria' },
  continue: { en: 'Continue', es: 'Continuar' },
  letsGo: { en: "Let's go!", es: '¡Vamos!' },
  back: { en: 'Back', es: 'Atrás' },
  goalCasual: { en: 'Casual', es: 'Tranquilo' },
  goalRegular: { en: 'Regular', es: 'Regular' },
  goalSerious: { en: 'Serious', es: 'En serio' },
  goalIntense: { en: 'Intense', es: 'Intenso' },
  minPerDay: { en: 'min / day', es: 'min / día' },
  // genres
  classical: { en: 'Classical', es: 'Clásica' },
  pop: { en: 'Pop', es: 'Pop' },
  rock: { en: 'Rock', es: 'Rock' },
  classicalDesc: { en: 'Melody, harmony and form, like the great composers.', es: 'Melodía, armonía y forma, como los grandes compositores.' },
  popDesc: { en: 'Hooks, catchy progressions and song structure.', es: 'Ganchos, progresiones pegadizas y estructura de canción.' },
  rockDesc: { en: 'Riffs, power chords and raw energy.', es: 'Riffs, power chords y energía pura.' },
  letters: { en: 'Letters (C D E F G A B)', es: 'Letras (C D E F G A B)' },
  solfege: { en: 'Solfège (Do Re Mi Fa Sol La Si)', es: 'Solfeo (Do Re Mi Fa Sol La Si)' },
  // home
  learn: { en: 'Learn', es: 'Aprender' },
  profile: { en: 'Profile', es: 'Perfil' },
  settings: { en: 'Settings', es: 'Ajustes' },
  unit: { en: 'Unit', es: 'Unidad' },
  start: { en: 'Start', es: 'Empezar' },
  review: { en: 'Review', es: 'Repasar' },
  locked: { en: 'Locked', es: 'Bloqueado' },
  comingSoon: { en: 'Coming soon', es: 'Próximamente' },
  dailyGoal: { en: 'Daily goal', es: 'Meta diaria' },
  dayStreak: { en: 'day streak', es: 'días de racha' },
  totalXp: { en: 'Total XP', es: 'XP total' },
  lessonsDone: { en: 'Lessons', es: 'Lecciones' },
  greeting: { en: 'Hi', es: 'Hola' },
  // lesson
  check: { en: 'Check', es: 'Comprobar' },
  next: { en: 'Next', es: 'Siguiente' },
  gotIt: { en: 'Got it', es: 'Entendido' },
  correct: { en: 'Great!', es: '¡Muy bien!' },
  correctAlt: { en: 'Nice ear!', es: '¡Buen oído!' },
  wrong: { en: 'Not quite', es: 'Casi' },
  answer: { en: 'Correct answer', es: 'Respuesta correcta' },
  listen: { en: 'Listen', es: 'Escuchar' },
  listenAgain: { en: 'Listen again', es: 'Escuchar otra vez' },
  tapToHear: { en: 'Tap the keys to hear them', es: 'Toca las teclas para escucharlas' },
  first: { en: 'First sound', es: 'Primer sonido' },
  second: { en: 'Second sound', es: 'Segundo sonido' },
  quitTitle: { en: 'Leave the lesson?', es: '¿Salir de la lección?' },
  quitBody: { en: 'You will lose your progress in this lesson.', es: 'Perderás tu progreso en esta lección.' },
  keepLearning: { en: 'Keep learning', es: 'Seguir aprendiendo' },
  quit: { en: 'Leave', es: 'Salir' },
  outOfHearts: { en: 'Out of hearts', es: 'Sin corazones' },
  outOfHeartsBody: {
    en: 'Take a short break — hearts refill over time (one every 30 minutes). Mistakes are how we learn!',
    es: 'Tómate un descanso: los corazones se recargan con el tiempo (uno cada 30 minutos). ¡Equivocarse es parte de aprender!',
  },
  backHome: { en: 'Back to home', es: 'Volver al inicio' },
  lessonComplete: { en: 'Lesson complete!', es: '¡Lección completada!' },
  perfect: { en: 'Perfect lesson!', es: '¡Lección perfecta!' },
  xpEarned: { en: 'XP earned', es: 'XP ganada' },
  accuracy: { en: 'Accuracy', es: 'Precisión' },
  streak: { en: 'Streak', es: 'Racha' },
  theory: { en: 'Theory', es: 'Teoría' },
  practice: { en: 'Practice', es: 'Práctica' },
  // settings
  language: { en: 'Language', es: 'Idioma' },
  noteNames: { en: 'Note names', es: 'Nombres de notas' },
  genre: { en: 'Genre', es: 'Género' },
  sound: { en: 'Sound', es: 'Sonido' },
  account: { en: 'Account', es: 'Cuenta' },
  signOut: { en: 'Sign out', es: 'Cerrar sesión' },
  localAccount: { en: 'Saved on this device', es: 'Guardado en este dispositivo' },
  on: { en: 'On', es: 'Activado' },
  off: { en: 'Off', es: 'Desactivado' },
  name: { en: 'Name', es: 'Nombre' },
} satisfies Record<string, L>

export type UiKey = keyof typeof ui

export function useT() {
  const locale = useStore((s) => s.settings.locale)
  const t = (k: UiKey) => ui[k][locale]
  const tl = (l: L) => l[locale]
  return { t, tl, locale }
}
