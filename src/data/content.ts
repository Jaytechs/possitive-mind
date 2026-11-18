import type { EntryType } from '../types'

export const TAGLINE = 'Train your mind. Change your perspective. Build a future you\u2019ll appreciate.'

export const REFLECTIONS = [
  'You do not have to solve everything today. Identify one thing you can work on and begin there.',
  'Your current circumstances are part of your story, but they do not have to determine every decision you make.',
  'Being grateful does not mean pretending that life is easy.',
  'Confidence grows when your actions gradually support what you believe about yourself.',
  'Sometimes the most constructive thing you can do is recognise that you need help.',
  'Missing one day does not erase the progress you have made.',
  'A hard moment tells you what happened. It does not have to tell you who you are.',
  'You cannot control every outcome, but you can choose how you prepare and how you respond.',
  'Discipline is often just a small promise to yourself, kept again today.',
  'Noticing a feeling is not the same as obeying it.',
  'Kindness works best when it is honest, and honesty works best when it is kind.',
  'Progress usually looks ordinary while it is happening.',
  'Ask what is in your hands today, then do the smallest useful thing with it.',
  'Comparison hides your own progress. Look at where you were a month ago instead.',
]

export interface Quality { id: string; name: string; blurb: string; actions: string[] }
export const QUALITIES: Quality[] = [
  { id: 'disciplined', name: 'Disciplined', blurb: 'Doing what you decided to do, even when the mood has changed.', actions: ['finish my study session before opening social media', 'start the task I keep postponing for just ten minutes'] },
  { id: 'confident', name: 'Confident', blurb: 'Trusting that you can handle things, including handling them imperfectly.', actions: ['speak up once in a class, meeting or conversation', 'say yes to something I usually avoid because I feel unready'] },
  { id: 'patient', name: 'Patient', blurb: 'Giving people and processes the time they actually need.', actions: ['pause and breathe before replying when I feel irritated', 'let a slow task take as long as it takes without rushing it'] },
  { id: 'kind', name: 'Kind', blurb: 'Paying attention to what someone else needs, and acting on it.', actions: ['listen carefully when someone needs my attention', 'send a message to someone who has been on my mind'] },
  { id: 'courageous', name: 'Courageous', blurb: 'Acting while still feeling afraid.', actions: ['have the conversation I have been avoiding', 'ask for help with something I find difficult'] },
  { id: 'consistent', name: 'Consistent', blurb: 'Showing up in small ways, repeatedly.', actions: ['do my planned routine, even a shortened version', 'repeat yesterday\u2019s good habit once more'] },
  { id: 'responsible', name: 'Responsible', blurb: 'Owning your choices and following through on your commitments.', actions: ['complete a commitment I made to someone', 'tidy up a mistake instead of hoping it goes unnoticed'] },
  { id: 'generous', name: 'Generous', blurb: 'Giving time, attention or resources without keeping score.', actions: ['share notes, food or time with someone who needs it', 'help someone without expecting anything back'] },
  { id: 'focused', name: 'Focused', blurb: 'Choosing one thing and giving it your full attention.', actions: ['work for 25 minutes with my phone out of reach', 'finish one task before starting the next'] },
  { id: 'respectful', name: 'Respectful', blurb: 'Treating people with dignity, including when you disagree.', actions: ['hear someone out without interrupting', 'disagree calmly and without sarcasm'] },
  { id: 'honest', name: 'Honest', blurb: 'Saying what is true with care, and being straight with yourself.', actions: ['admit when I do not know or understand something', 'tell someone the truth gently rather than avoiding it'] },
  { id: 'enthusiastic', name: 'Enthusiastic', blurb: 'Bringing real energy and interest to what is in front of you.', actions: ['ask one genuine question about something I am learning', 'start my day with a task I actually look forward to'] },
]

export interface Pillar { id: string; name: string; action: string; principle: string; blurb: string; activity: string; type: EntryType }
export const PILLARS: Pillar[] = [
  { id: 'clarity', name: 'Mental clarity', action: 'Clear Your Mind', principle: 'Clean out the clutter', type: 'clarity',
    blurb: 'Thoughts you never put into words tend to keep circling. Writing them down lets you see them clearly and decide what to do.',
    activity: 'Write down what is on your mind and choose one small step.' },
  { id: 'gratitude', name: 'Gratitude', action: 'Practise Gratitude', principle: 'Notice what you already have', type: 'gratitude',
    blurb: 'Gratitude is not about denying difficulty. It is about noticing what is also true: the people, chances and small things that are working.',
    activity: 'Record three things you appreciate, and why they matter.' },
  { id: 'identity', name: 'Personal identity', action: 'Today I Am', principle: 'Practise who you are becoming', type: 'intention',
    blurb: 'You become a patient or disciplined person by doing patient, disciplined things. Choose a quality and an action that shows it.',
    activity: 'Pick a quality for today and an action that proves it.' },
  { id: 'confidence', name: 'Self-respect and confidence', action: 'Carry Yourself With Confidence', principle: 'Prepare as someone who matters', type: 'practice',
    blurb: 'How you sit, prepare and speak to yourself shapes how you feel. This is about self-respect, not appearance or perfection.',
    activity: 'Work through a short daily self-respect checklist.' },
  { id: 'kindness', name: 'Kindness and respect', action: 'Choose Kindness', principle: 'Treat people well', type: 'kindness',
    blurb: 'Relationships are built from small, repeated acts. Kindness does not mean letting others disrespect you; respect and boundaries belong together.',
    activity: 'Do one kind act today and note how it went.' },
]
export const pillarForType = (t: EntryType) => PILLARS.find(p => p.type === t)

export const CONFIDENCE_ITEMS = [
  'Check my posture and sit or stand upright comfortably',
  'Prepare myself properly for the day',
  'Keep up with personal hygiene',
  'Tidy my study or work space',
  'Take a short movement break',
  'Speak to myself with respect',
  'Keep my head up when I walk or talk to someone',
]

export const KINDNESS_ACTS = [
  'Appreciate someone out loud', 'Help a friend with something', 'Encourage someone who is struggling',
  'Listen without interrupting', 'Thank someone properly', 'Offer assistance before being asked',
  'Apologise where it is due', 'Skip an unnecessary criticism', 'Respect an opinion I disagree with',
]

export const GRATITUDE_PROMPTS = [
  'Who helped you recently, even in a small way?', 'What is something ordinary that worked today?',
  'What progress have you made that you have not acknowledged?', 'What is a place or object that makes your life easier?',
  'Which lesson from a past difficulty are you glad to have?', 'Who is easy to take for granted?',
  'What did you get to do today that someone else would love to do?', 'What part of your body or health do you rely on?',
]

export const EMOTIONS = ['Disappointed', 'Frustrated', 'Worried', 'Angry', 'Confused', 'Sad', 'Discouraged', 'Overwhelmed', 'Other']

export const SITUATIONS: { label: string; starter: string }[] = [
  { label: 'Academic setback', starter: 'I studied hard for an assessment and still did not get the result I wanted.' },
  { label: 'Money pressure', starter: 'I do not have enough money for something I need and I am not sure how to cope.' },
  { label: 'Rejection', starter: 'I applied for something or reached out to someone and was turned down.' },
  { label: 'Relationship strain', starter: 'Someone close to me and I are not getting along right now.' },
  { label: 'Family disagreement', starter: 'A disagreement with my family is weighing on me.' },
  { label: 'No work yet', starter: 'I have been looking for work and nothing has come through.' },
  { label: 'Procrastination', starter: 'I keep putting off something important and feel worse each day.' },
  { label: 'Fear of the future', starter: 'I feel anxious about what comes after this stage of my life.' },
  { label: 'Comparing myself', starter: 'I keep comparing myself with other people and coming up short.' },
  { label: 'Lost motivation', starter: 'I used to be driven but now I cannot find the energy.' },
  { label: 'A mistake', starter: 'I made a mistake and cannot stop thinking about it.' },
  { label: 'Slipping discipline', starter: 'I set a routine for myself and have not kept to it.' },
  { label: 'Sudden disappointment', starter: 'Something I was counting on did not happen.' },
]

export const NEXT_TYPES = ['Take a specific action', 'Make a plan', 'Ask someone for support', 'Rest, then revisit this', 'Accept something I cannot change']

export const CHALLENGE_DAYS = [
  { day: 1, title: 'Mental clarity', activity: 'Write down what is troubling you and identify a constructive next step.', link: '/practise/clarity' },
  { day: 2, title: 'Gratitude', activity: 'Record three things you appreciate, and why.', link: '/practise/gratitude' },
  { day: 3, title: 'Personal identity', activity: 'Choose a quality you want to develop and practise it today.', link: '/practise/identity' },
  { day: 4, title: 'Self-respect and confidence', activity: 'Practise personal care, preparation and good posture.', link: '/practise/confidence' },
  { day: 5, title: 'Kindness and respect', activity: 'Complete one meaningful act of kindness.', link: '/practise/kindness' },
  { day: 6, title: 'Putting it together', activity: 'Practise several of the five principles through the day.', link: '/practise' },
  { day: 7, title: 'Reflection', activity: 'Look back on the week and decide which practices you want to keep.', link: '/challenge' },
]

export const GOALS = ['Discipline', 'Confidence', 'Gratitude', 'Handling challenges', 'Better relationships', 'Self-respect', 'Personal growth', 'A positive attitude']

export const TYPE_LABEL: Record<EntryType, string> = {
  clarity: 'Clear your mind', gratitude: 'Gratitude', intention: 'Intention', practice: 'Self-respect',
  shift: 'Perspective Shift', evening: 'Evening reflection', kindness: 'Kindness', weekly: 'Weekly reflection',
}
export const KEY_LABEL: Record<string, string> = {
  troubling: 'On my mind', why: 'Why it bothers me', feeling: 'What I feel', control: 'Within my control', accept: 'What I may need to accept', step: 'One small step',
  one: 'Grateful for', oneWhy: 'Why it matters', two: 'Grateful for', twoWhy: 'Why it matters', three: 'Grateful for', threeWhy: 'Why it matters',
  quality: 'Quality', action: 'Action', text: 'Intention', checked: 'Completed',
  situation: 'What happened', emotions: 'Feelings', story: 'What I told myself', facts: 'Facts I know', assumption: 'Assumptions I am making',
  alternative: 'Another way to see it', factors: 'What contributed', outside: 'Outside my control', balanced: 'A balanced view',
  nextType: 'Approach', nextStep: 'Next step', support: 'Support', status: 'Status',
  act: 'Act of kindness', reflection: 'Reflection', question: 'Question',
  well: 'What went well', challenged: 'What challenged me', response: 'How I responded', practised: 'Practised my quality', learned: 'What I learned', improve: 'To improve tomorrow',
}
export const HIDDEN_KEYS = ['pillar']

export const RISK = /(kill (myself|him|her|them|someone)|end my life|suicid|want to die|hurt myself|self[- ]?harm|harm (myself|someone|others|him|her|them))/i
