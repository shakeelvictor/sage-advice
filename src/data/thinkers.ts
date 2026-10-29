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
  { name: 'Thích Nhất Hạnh', dates: '1926–2022', tradition: 'buddhist', bio: 'Vietnamese Zen master, poet and peace activist who founded Plum Village. He made mindfulness a practice for ordinary life: breathing, walking, washing the dishes, being there.' },
  { name: 'Brother Phap Linh', tradition: 'buddhist', bio: 'Monk in the Plum Village tradition, formerly a composer. Teaches the slow accumulation of mindfulness that pays out in the hard moments.' },
  { name: 'Larry Ward', tradition: 'buddhist', bio: 'Dharma teacher ordained by Thích Nhất Hạnh and author of America’s Racial Karma. Brings mindfulness to the news, the body and the long work of healing.' },
  { name: 'Tara Brach', dates: 'b. 1953', tradition: 'buddhist', bio: 'Psychologist and meditation teacher, author of Radical Acceptance. Her RAIN practice gives difficult feelings a kind, step-by-step welcome.' },
  { name: 'Pema Chödrön', dates: 'b. 1936', tradition: 'buddhist', bio: 'American Buddhist nun and author of When Things Fall Apart. Plain, humorous instruction in staying with what is uncomfortable.' },
  { name: 'Sharon Salzberg', dates: 'b. 1952', tradition: 'buddhist', bio: 'Co-founder of the Insight Meditation Society and the teacher who brought loving-kindness practice to the West.' },
  { name: 'Andy Puddicombe', dates: 'b. 1972', tradition: 'buddhist', bio: 'Former Buddhist monk and co-founder of Headspace. Meditation without incense: ten minutes of stepping back from the mind.' },
  { name: 'Alan Watts', dates: '1915–1973', tradition: 'taoist', bio: 'English writer and speaker who interpreted Zen and Taoism for the West. Playful, erudite, and insistent that you are not separate from the world.' },
  { name: 'Marcus Aurelius', dates: '121–180', tradition: 'stoic', bio: 'Roman emperor whose private notebook, the Meditations, is the most-read Stoic text. Written to himself, at night, to meet the next day well.' },
  { name: 'Epictetus', dates: 'c. 50–135', tradition: 'stoic', bio: 'Born enslaved, later a teacher in Nicopolis. His Enchiridion opens with the one distinction Stoicism rests on: what is in our control, and what is not.' },
  { name: 'Epicurus', dates: '341–270 BC', tradition: 'other', bio: 'Greek philosopher of the Garden. Pleasure, for him, meant the absence of pain and the company of friends, not indulgence.' },
  { name: 'Diogenes', dates: 'c. 412–323 BC', tradition: 'other', bio: 'The Cynic who lived in a barrel in Athens and mocked every pretension. Rich in freedom because poor in needs.' },
  { name: 'Baruch Spinoza', dates: '1632–1677', tradition: 'other', bio: 'Dutch philosopher of the Ethics. Argued that we suffer when pushed around by causes we do not understand, and are freed by understanding them.' },
  { name: 'Michel de Montaigne', dates: '1533–1592', tradition: 'other', bio: 'French nobleman who retired to his tower and invented the essay. Humane, sceptical, and sure that even kings sit on the toilet.' },
  { name: 'Arthur Schopenhauer', dates: '1788–1860', tradition: 'other', bio: 'German philosopher of the will and of pessimism. Clear-eyed about desire, and about how little other people’s opinions should weigh.' },
  { name: 'Henry David Thoreau', dates: '1817–1862', tradition: 'other', bio: 'American transcendentalist who spent two years in a cabin at Walden Pond. Suspicious of news, hurry and anything that owned its owner.' },
  { name: 'Jiddu Krishnamurti', dates: '1895–1986', tradition: 'other', bio: 'Indian teacher who renounced the role of guru. Asked his listeners to observe their own thought without authority, method or escape.' },
  { name: 'Ram Dass', dates: '1931–2019', tradition: 'other', bio: 'Harvard psychologist turned spiritual teacher, author of Be Here Now. Loving awareness, humour, and the step on the path that is right in front of you.' },
  { name: 'Dandapani', tradition: 'other', bio: 'Former Hindu monk, now a teacher of concentration. Wisdom, in his guru’s definition, is the timely application of knowledge.' },
  { name: 'Viktor Frankl', dates: '1905–1997', tradition: 'existentialist', bio: 'Viennese psychiatrist and Holocaust survivor, author of Man’s Search for Meaning. Being human means reaching beyond yourself.' },
  { name: 'Albert Camus', dates: '1913–1960', tradition: 'existentialist', bio: 'French-Algerian writer and philosopher of the absurd. Faced a universe without given meaning and chose lucidity, revolt and a certain calm.' },
  { name: 'Gabor Maté', dates: 'b. 1944', tradition: 'psychology', bio: 'Hungarian-Canadian physician and author of The Myth of Normal. Trauma, in his account, is not what happened to you but the disconnection from yourself that followed.' },
  { name: 'Brené Brown', dates: 'b. 1965', tradition: 'psychology', bio: 'Research professor who spent two decades studying shame, courage and belonging. Vulnerability, she found, is the most accurate measure of courage.' },
  { name: 'Francis Weller', tradition: 'psychology', bio: 'Psychotherapist and author of The Wild Edge of Sorrow. Grief as an apprenticeship rather than a problem, and the condition for joy.' },
  { name: 'Lori Gottlieb', dates: 'b. 1966', tradition: 'psychology', bio: 'Psychotherapist and author of Maybe You Should Talk to Someone. Distinguishes idiot compassion from the kind that tells you the truth.' },
  { name: 'Marc Brackett', tradition: 'psychology', bio: 'Director of the Yale Center for Emotional Intelligence and author of Permission to Feel. The non-judgmental listener does more good than the fixer.' },
  { name: 'Paul Bloom', dates: 'b. 1963', tradition: 'psychology', bio: 'Psychologist at Toronto and Yale, author of The Sweet Spot. Loneliness, in his reading, is a need signalling, not a fault.' },
  { name: 'Lisa Genova', dates: 'b. 1970', tradition: 'psychology', bio: 'Neuroscientist and novelist (Still Alice). Translates what stress does to memory into practices that fit in nine seconds.' },
  { name: 'Alexi Pappas', dates: 'b. 1990', tradition: 'psychology', bio: 'Olympic runner, filmmaker and author of Bravey. Her rule of thirds reframes the bad days of any long pursuit.' },
  { name: 'Katina Bajaj', tradition: 'psychology', bio: 'Creative health scientist studying play in adult life. Play as an approach to everything, not an item on the calendar.' },
  { name: 'Bernardo Huberman', tradition: 'other', bio: 'Physicist and complexity researcher, father of Andrew Huberman. On the difference between happiness as a checklist and joy as a way of being in yourself.' },
  { name: 'Steven Pressfield', dates: 'b. 1943', tradition: 'other', bio: 'Novelist and author of The War of Art. Named Resistance as the force that stands between you and your calling.' },
  { name: 'Debbie Millman', dates: 'b. 1961', tradition: 'other', bio: 'Designer and host of Design Matters. After a thousand interviews: the reward is the making, not the recognition.' },
  { name: 'Sam Harris', dates: 'b. 1967', tradition: 'other', bio: 'Neuroscientist, author of Waking Up and a secular meditation teacher. The present moment, examined without religion.' },
  { name: 'Mary Oliver', dates: '1935–2019', tradition: 'other', bio: 'American poet who walked the woods of Provincetown every morning with a notebook. Attention, in her work, is the beginning of devotion.' },
  { name: 'David Whyte', dates: 'b. 1955', tradition: 'other', bio: 'Anglo-Irish poet and philosopher of the conversational nature of reality. Anything that does not bring you alive is too small for you.' },
  { name: 'Krista Tippett', dates: 'b. 1960', tradition: 'other', bio: 'Journalist and host of On Being. A long study of the questions that shape a life, and the people who live them well.' },
  { name: 'Brian McLaren', dates: 'b. 1956', tradition: 'christian', bio: 'Author and faculty member at the Center for Action and Contemplation. Practising presence: of God, of others, and of yourself.' },
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
