import { videos } from './videos';

export interface PathStep {
  videoId: string;
  /** The question to sit with after this short. */
  question: string;
}

export interface Path {
  id: string;
  title: string;
  eyebrow: string;
  intro: string;
  /** Shown once every step is walked. */
  closing: string;
  steps: PathStep[];
}

export const paths: Path[] = [
  {
    id: 'stoic-week',
    title: 'A Stoic Week',
    eyebrow: 'Stoicism · seven days',
    intro: 'One Stoic idea a day for a week. Not a philosophy to admire, but a set of exercises to run on an ordinary Tuesday.',
    closing: 'A week of practice is how a philosophy becomes a temperament. Walk it again whenever the week needs steadying.',
    steps: [
      { videoId: 'I42vG7c0ebU', question: 'What did you try to control today that was never yours to control?' },
      { videoId: 'uHYsc-xf5vQ', question: 'Who, or what, did you hand the power to upset you this week?' },
      { videoId: 'DeM6jNBLU0A', question: 'Name one fear. What is the worst that would actually happen, and could you bear it?' },
      { videoId: 'ywpyvdIe3gM', question: 'What decision are you circling? What would the person you most respect do with it?' },
      { videoId: '0TpwOMf_RWg', question: 'Which virtue could you practise in one small act before tomorrow?' },
      { videoId: 'eXYWlXmwSw8', question: 'When were you fully here today, and what pulled you away?' },
      { videoId: 'kVP0DRE2Klk', question: 'Where is life asking you to be your best self on unfamiliar ground?' },
    ],
  },
  {
    id: 'sitting-with-grief',
    title: 'Sitting with Grief',
    eyebrow: 'Loss · six shorts',
    intro: 'Grief is not a problem to solve. These shorts keep you company while you let it be what it is, and notice what it is made of.',
    closing: 'You sat with it rather than around it. That is the whole practice. Come back whenever the weight returns.',
    steps: [
      { videoId: 'ib5bAPL3-6I', question: 'What are you grieving right now, large or small?' },
      { videoId: 'Fqsc9yi26j4', question: 'What does this grief tell you about what you loved?' },
      { videoId: 'iGIL1v8OPcQ', question: 'When this week could you give this feeling one unhurried hour?' },
      { videoId: '5tYR7e5Wpyc', question: 'What helps you move through, rather than around?' },
      { videoId: 'IY0hbEKsWUo', question: 'What might be quietly beginning inside this ending?' },
      { videoId: 'OtPS0CoZSpU', question: 'If death is always present, what would you do more beautifully tomorrow?' },
    ],
  },
  {
    id: 'meaning-crisis',
    title: 'Meaning in a Meaning Crisis',
    eyebrow: 'John Vervaeke and friends · seven shorts',
    intro: 'Why so many people feel adrift, and what the cognitive science of wisdom says about finding your footing again.',
    closing: 'Meaning is not found so much as cultivated: through view, care and action, practised daily. You have the map now.',
    steps: [
      { videoId: 'XAiB1SmysHM', question: 'Where do you feel the lack of meaning most sharply in your own life?' },
      { videoId: '4HjTcPKmc3U', question: 'Consumerism, commodification, alienation, loss of meaning: which rides closest to you?' },
      { videoId: 'uY94JVXhHjc', question: 'Purpose, coherence, significance, mattering: which is thinnest for you right now?' },
      { videoId: 'fUJ49pDddDo', question: 'What is one practice you could actually do this week, not just admire?' },
      { videoId: 'n3n7zKQefLc', question: 'View, care, action: which one needs tending first?' },
      { videoId: 'y3835X6iEGQ', question: 'Which ancient practice could you borrow for your own mind?' },
      { videoId: 'YkVpFxOsOJA', question: 'What would change if you treated wisdom as necessary rather than optional?' },
    ],
  },
  {
    id: 'attention',
    title: 'Attention is a Moral Act',
    eyebrow: 'Attention and stillness · seven shorts',
    intro: 'What you attend to, you become. A path about reclaiming attention from noise, comparison and the endless scroll.',
    closing: 'Attention is the one thing you can always give. You have spent a week learning where it goes. Now choose.',
    steps: [
      { videoId: 'kGxQsorYRNU', question: 'What does your mind chew on when it is left alone?' },
      { videoId: 'aQ0iO_0Dlos', question: 'When did you last let yourself be bored, and what came up?' },
      { videoId: 'uaxaot7t3Gg', question: 'Where would silence serve you better than a reply?' },
      { videoId: 'CDUUsXkFF0o', question: 'What did you notice today that you usually miss?' },
      { videoId: 'dizavg9sT2s', question: 'Where in tomorrow is there room for a pocket of stillness?' },
      { videoId: 'qqgJ2py0o-A', question: 'What set of practices would hold your attention steady over a month?' },
      { videoId: 'QTtJG6ocgfM', question: 'What do you give your attention to that leaves you smaller?' },
    ],
  },
  {
    id: 'beginning-again',
    title: 'Beginning Again',
    eyebrow: 'Buddhist practice · seven shorts',
    intro: 'Every moment is a chance to start over. A path through impermanence, anger, humility and self-forgiveness.',
    closing: 'Beginning again is not failure, it is the practice itself. Each return is the path.',
    steps: [
      { videoId: 'als6q2BC7zk', question: 'What are you holding onto that is already changing?' },
      { videoId: 'DvvXPl6Rl9Y', question: 'Where is your anger rooted, and what would it take to let it go?' },
      { videoId: 'LsM0gcYLoEA', question: 'What are you certain about that might deserve a second look?' },
      { videoId: '4THwPX3OZK4', question: 'What could you enjoy today, problems included?' },
      { videoId: 'xEtHPt50jVc', question: 'What are you still punishing yourself for?' },
      { videoId: 'qmBhweFerxI', question: 'What needs uprooting for you to grow?' },
      { videoId: '7clo6hyAfno', question: 'What does doing your best look like tomorrow: not perfectly, just fully?' },
    ],
  },
];

export const pathById = (id: string) => paths.find((p) => p.id === id);

export const videoForStep = (step: PathStep) => videos.find((v) => v.id === step.videoId);

if (import.meta.env.DEV) {
  for (const path of paths) {
    for (const step of path.steps) {
      if (!videoForStep(step)) console.warn(`Path "${path.id}" references a video that is not in the library: ${step.videoId}`);
    }
  }
}
