export type EntryType =
  | 'clarity' | 'gratitude' | 'intention' | 'practice'
  | 'shift' | 'evening' | 'kindness' | 'weekly'

interface Base<T extends EntryType, D> {
  id: string
  type: T
  /** Local calendar day, YYYY-MM-DD */
  date: string
  createdAt: string
  updatedAt: string
  data: D
}

export type MentalClarityEntry = Base<'clarity', {
  troubling: string; why: string; feeling: string; control: string; accept: string; step: string
}>
export type GratitudeEntry = Base<'gratitude', {
  one: string; oneWhy: string; two: string; twoWhy: string; three: string; threeWhy: string
}>
export type DailyIntention = Base<'intention', { quality: string; action: string; text: string }>
/** Self-respect and confidence checklist (one per day, updated through the day) */
export type PracticeEntry = Base<'practice', { pillar: string; checked: string[] }>
export type PerspectiveShiftSession = Base<'shift', {
  situation: string; emotions: string[]; story: string
  facts: string; assumption: string; alternative: string; factors: string
  control: string; outside: string; balanced: string
  nextType: string; nextStep: string; support: string
  status: 'ongoing' | 'resolved'
}>
export type EveningReflection = Base<'evening', {
  well: string; challenged: string; response: string; practised: string; learned: string; improve: string
}>
export type KindnessActivity = Base<'kindness', { act: string; reflection: string }>
export type WeeklyReflection = Base<'weekly', { question: string; reflection: string }>

export type Entry =
  | MentalClarityEntry | GratitudeEntry | DailyIntention | PracticeEntry
  | PerspectiveShiftSession | EveningReflection | KindnessActivity | WeeklyReflection

export type EntryData = Record<string, string | string[]>

export interface UserPreferences {
  onboarded: boolean
  goals: string[]
  routine: string
  identity: string
  theme: 'system' | 'light' | 'dark'
  reduceMotion: boolean
  largeText: boolean
}

export interface ReminderSlot { on: boolean; time: string }
export interface NotificationPreferences {
  enabled: boolean
  morning: ReminderSlot
  day: ReminderSlot
  evening: ReminderSlot
}

export interface ChallengeProgress {
  started: boolean
  startedAt: string
  /** day number -> ISO completion time */
  done: Record<number, string>
  skipped: number[]
}
