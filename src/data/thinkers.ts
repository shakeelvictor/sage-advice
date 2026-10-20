import { videos, Video } from './videos';

export type Tradition = NonNullable<Video['tradition']>;

export interface TraditionMeta {
  id: Tradition;
  label: string;
  /** Who the tradition's founding voices are, and what it asks of you. */
  blurb: string;
}

export const TRADITIONS: TraditionMeta[] = [
  {
    id: 'stoic',
    label: 'Stoicism',
    blurb:
      'Marcus Aurelius, Seneca and Epictetus taught that the one thing in your power is your own judgement. Modern Stoics keep the exercises alive: journal, rehearse adversity, act with virtue.',
  },
  {
    id: 'buddhist',
    label: 'Buddhist practice',
    blurb:
      'From the Buddha through teachers like Thích Nhất Hạnh: suffering has causes, attention can be trained, and compassion is a skill. These shorts are practice, not doctrine.',
  },
  {
    id: 'cognitive-science',
    label: 'The cognitive science of wisdom',
    blurb:
      'John Vervaeke and colleagues ask what wisdom actually is, why so many people feel adrift, and which practices reliably cultivate meaning.',
  },
  {
    id: 'existentialist',
    label: 'Existentialism',
    blurb: 'Kierkegaard, Nietzsche, Ortega and their heirs: you are responsible for the life you make, and the anxiety that comes with that is the price of being free.',
  },
  {
    id: 'psychology',
    label: 'Modern psychology',
    blurb: 'Clinicians and researchers on emotion, attention and the mind: how it goes wrong, and what helps.',
  },
  { id: 'christian', label: 'Christian contemplatives', blurb: 'Voices from the contemplative Christian tradition.' },
  { id: 'taoist', label: 'Taoism', blurb: 'The way that can be spoken is not the eternal way. Effortless action, humility, water over rock.' },
  { id: 'other', label: 'Other voices', blurb: 'Philosophers, writers and teachers who do not sit neatly in one school, and are better for it.' },
];

export interface Thinker {
  name: string;
  dates?: string;
  tradition: Tradition;
  bio: string;
}

/** Bios for the voices in the library. A video's `thinker` field matches on `name`. */
export const THINKERS: Thinker[] = [
  { name: 'John Vervaeke', dates: 'b. 1961', tradition: 'cognitive-science', bio: 'Cognitive scientist at the University of Toronto. His lecture series Awakening from the Meaning Crisis traces how the West lost its practices of wisdom and how they might be rebuilt.' },
  { name: 'Christopher Mastropietro', tradition: 'cognitive-science', bio: 'Writer and collaborator of John Vervaeke on dialogue, symbol and the recovery of meaning.' },
  { name: 'Ryan Holiday', dates: 'b. 1987', tradition: 'stoic', bio: 'Author of The Obstacle Is the Way and the Daily Stoic. The person most responsible for putting Marcus Aurelius back on nightstands.' },
  { name: 'Brigid Delaney', tradition: 'stoic', bio: 'Australian journalist and author of Reasons Not to Worry, a year spent living by Stoic rules and reporting back.' },
  { name: 'Arthur Brooks', dates: 'b. 1964', tradition: 'stoic', bio: 'Harvard professor and columnist on the science of happiness, drawing on the Stoics, Aquinas and the research on what actually makes a life go well.' },
  { name: 'Socrates', dates: '470–399 BC', tradition: 'other', bio: 'The Athenian who wrote nothing and questioned everyone. His method, asking until the assumption shows itself, is the root of Western philosophy.' },
  { name: 'Aristotle', dates: '384–322 BC', tradition: 'other', bio: 'Plato’s student and tutor to Alexander. His ethics holds that virtue is a habit, learned by doing, aimed at a flourishing life.' },
  { name: 'Boethius', dates: 'c. 480–524', tradition: 'other', bio: 'Roman statesman who wrote The Consolation of Philosophy in prison awaiting execution. On fortune, impermanence and what cannot be taken from you.' },
  { name: 'John Locke', dates: '1632–1704', tradition: 'other', bio: 'English philosopher of mind and liberty. Argued that we are born without innate ideas and owe ourselves the work of thinking clearly.' },
  { name: 'Ralph Waldo Emerson', dates: '1803–1882', tradition: 'other', bio: 'American essayist and transcendentalist. Self-Reliance is his great sermon on trusting your own mind against the crowd.' },
  { name: 'Søren Kierkegaard', dates: '1813–1855', tradition: 'existentialist', bio: 'Danish philosopher of anxiety, faith and the self. The first to insist that truth must be lived, not merely held.' },
  { name: 'Friedrich Nietzsche', dates: '1844–1900', tradition: 'existentialist', bio: 'German philosopher of becoming who you are. Suspicious of comfort, generous toward courage.' },
  { name: 'José Ortega y Gasset', dates: '1883–1955', tradition: 'existentialist', bio: 'Spanish philosopher. "I am I and my circumstance": you cannot be understood apart from the world you find yourself in, and neither can your task.' },
  { name: 'Anaïs Nin', dates: '1903–1977', tradition: 'existentialist', bio: 'Diarist and novelist. Her journals are an unflinching study of how a life expands or shrinks in proportion to one’s courage.' },
  { name: 'Erich Fromm', dates: '1900–1980', tradition: 'psychology', bio: 'Psychoanalyst and social critic. The Art of Loving and To Have or To Be? diagnose how a consumer society hollows out the person.' },
  { name: 'Carl Jung', dates: '1875–1961', tradition: 'psychology', bio: 'Swiss psychiatrist. Founder of analytical psychology, mapper of the shadow, and insistent that the only real danger is the unexamined human being.' },
  { name: 'Andrew Huberman', dates: 'b. 1975', tradition: 'psychology', bio: 'Stanford neuroscientist. Translates research on stress, gratitude and attention into protocols you can actually run.' },
  { name: 'Dr K (Alok Kanojia)', tradition: 'psychology', bio: 'Harvard-trained psychiatrist behind Healthy Gamer, blending clinical psychology with meditative practice for people who grew up online.' },
  { name: 'Dr Julie Smith', tradition: 'psychology', bio: 'Clinical psychologist and author of Why Has Nobody Told Me This Before? Plain tools for emotions that feel unmanageable.' },
  { name: 'Dr Emily Anhalt', tradition: 'psychology', bio: 'Psychologist and co-founder of Coa, a gym for mental health. Advocates for emotional fitness the way we think of physical fitness.' },
  { name: 'Shadé Zahrai', tradition: 'psychology', bio: 'Behavioural strategist and former lawyer who teaches practical ways to notice and reframe unhelpful thinking.' },
  { name: 'Cory Muscara', tradition: 'buddhist', bio: 'Former monk in the Burmese Theravāda tradition, now a mindfulness teacher. Clear, undramatic instruction in being present.' },
  { name: 'Rebecca Solnit', dates: 'b. 1961', tradition: 'other', bio: 'Essayist and historian. Hope in the Dark argues that uncertainty is exactly where hope and action live.' },
  { name: 'Maria Popova', dates: 'b. 1984', tradition: 'other', bio: 'Writer behind The Marginalian, a long meditation on how to live, gathered from the people who thought hardest about it.' },
  { name: 'Jim Rohn', dates: '1930–2009', tradition: 'other', bio: 'American speaker on personal philosophy. His enduring point: your philosophy, not your circumstances, sets the course of your life.' },
  { name: "Alex O'Connor", dates: 'b. 1999', tradition: 'other', bio: 'Philosopher and host of Within Reason. Rigorous about ethics and belief, and clear that wisdom is a necessity rather than a luxury.' },
  { name: 'Andrew Garfield', dates: 'b. 1983', tradition: 'other', bio: 'Actor. His conversation with Elmo about losing his mother became one of the most honest public descriptions of grief as unexpressed love.' },
];

export const thinkerSlug = (name: string) =>
  name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export const traditionMeta = (id: Tradition) => TRADITIONS.find((t) => t.id === id);

export const videosByThinker = (name: string) => videos.filter((v) => v.thinker === name);
export const videosByTradition = (id: Tradition) => videos.filter((v) => v.tradition === id);

export const thinkerBySlug = (slug: string): Thinker | undefined => {
  const known = THINKERS.find((t) => thinkerSlug(t.name) === slug);
  if (known) return known;
  // A thinker tagged in the library without a bio yet still gets a page.
  const tagged = videos.find((v) => v.thinker && thinkerSlug(v.thinker) === slug);
  return tagged?.thinker ? { name: tagged.thinker, tradition: tagged.tradition ?? 'other', bio: '' } : undefined;
};

/** Every voice with at least one short, grouped by tradition and ordered by how much of them we have. */
export const voicesByTradition = (): { tradition: TraditionMeta; thinkers: (Thinker & { count: number })[]; unattributed: number }[] => {
  const names = new Set(videos.map((v) => v.thinker).filter((n): n is string => Boolean(n)));
  const thinkers = [...names].map((name) => {
    const known = THINKERS.find((t) => t.name === name);
    const tagged = videos.find((v) => v.thinker === name);
    return { ...(known ?? { name, tradition: tagged?.tradition ?? 'other', bio: '' }), count: videosByThinker(name).length };
  });
  return TRADITIONS.map((tradition) => ({
    tradition,
    thinkers: thinkers.filter((t) => t.tradition === tradition.id).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name)),
    unattributed: videosByTradition(tradition.id).filter((v) => !v.thinker).length,
  })).filter((group) => group.thinkers.length > 0 || group.unattributed > 0);
};
