// Local puzzle definitions for Little Moments.
// Placement model: { [objectId]: slotId }. Every slot holds exactly one object.
// A slot is satisfied when its occupant's id is in `accepts`.
// Board coordinates are percentages of the board (x/y = centre, w/h = size).
// Board aspect ratio is 4:3 (scene SVGs use a 400x300 viewBox).

const BOOKS = ['book-sage', 'book-blue'];
const PENS = ['pen-peach', 'pen-lavender'];

export const LEVELS = [
  {
    id: 'study-desk',
    title: 'Organize Your Study Desk',
    shortTitle: 'Study desk',
    energyFit: 'steady',
    scene: 'desk',
    intro: 'A clear desk makes starting feel a little lighter.',
    rules: [
      'Books rest on the shelf, side by side.',
      'Pens go in the tray.',
      'The notebook sits on its mat, ready to open.',
      'The plant belongs in the sunny corner.',
    ],
    completion: {
      title: 'Your desk is ready',
      message: 'Everything has a place now. Starting something small can feel easier from here.',
    },
    tip: 'Try it for real: clear just one small spot on your desk for two minutes.',
    reflectionPrompt: 'How does your space feel right now?',
    slots: [
      { id: 'shelf-1', label: 'Shelf', x: 20, y: 26, w: 18, h: 26, accepts: BOOKS },
      { id: 'shelf-2', label: 'Shelf', x: 40, y: 26, w: 18, h: 26, accepts: BOOKS },
      { id: 'plant-corner', label: 'Sunny corner', x: 84, y: 26, w: 20, h: 30, accepts: ['plant'] },
      { id: 'tray-1', label: 'Pen tray', x: 62, y: 66, w: 20, h: 14, accepts: PENS },
      { id: 'tray-2', label: 'Pen tray', x: 84, y: 66, w: 20, h: 14, accepts: PENS },
      { id: 'notebook-mat', label: 'Notebook mat', x: 30, y: 66, w: 30, h: 28, accepts: ['notebook'] },
    ],
    objects: [
      { id: 'book-sage', label: 'Sage book', art: 'book', w: 16, h: 24, artProps: { color: '#A9BFA0', dark: '#7F9A76' } },
      { id: 'book-blue', label: 'Blue book', art: 'book', w: 16, h: 24, artProps: { color: '#9DB4C9', dark: '#7490AB' } },
      { id: 'pen-peach', label: 'Peach pen', art: 'pen', w: 18, h: 8, artProps: { color: '#F0B896' } },
      { id: 'pen-lavender', label: 'Lavender pen', art: 'pen', w: 18, h: 8, artProps: { color: '#B9A9D6' } },
      { id: 'notebook', label: 'Notebook', art: 'notebook', w: 26, h: 24, artProps: {} },
      { id: 'plant', label: 'Plant', art: 'plant', w: 16, h: 30, artProps: {} },
    ],
    start: {
      'book-sage': 'tray-1',
      'book-blue': 'plant-corner',
      'pen-peach': 'shelf-1',
      'pen-lavender': 'notebook-mat',
      notebook: 'shelf-2',
      plant: 'tray-2',
    },
  },
  {
    id: 'calm-corner',
    title: 'Create a Calm Corner',
    shortTitle: 'Calm corner',
    energyFit: 'low',
    scene: 'corner',
    intro: 'A soft little corner you can step into whenever you need a pause.',
    rules: [
      'The plant sits on the windowsill.',
      'The relaxation card hangs on the wall where you can see it.',
      'Headphones wait on the hook.',
      'The mug rests on the side table.',
      'The journal lies on the cushion.',
    ],
    completion: {
      title: 'Your calm corner is set',
      message: 'A place for pausing is ready. You can take as long or as little as you like.',
    },
    tip: 'Try it for real: take three slow breaths, in through the nose and out for a little longer.',
    reflectionPrompt: 'How are you feeling after setting up this corner?',
    slots: [
      { id: 'sill', label: 'Windowsill', x: 20, y: 28, w: 20, h: 30, accepts: ['plant'] },
      { id: 'wall-card', label: 'Wall board', x: 50, y: 24, w: 18, h: 24, accepts: ['relax-card'] },
      { id: 'hook', label: 'Hook', x: 80, y: 26, w: 20, h: 26, accepts: ['headphones'] },
      { id: 'side-table', label: 'Side table', x: 80, y: 60, w: 18, h: 18, accepts: ['mug'] },
      { id: 'cushion', label: 'Cushion', x: 38, y: 68, w: 28, h: 22, accepts: ['journal'] },
    ],
    objects: [
      { id: 'journal', label: 'Journal', art: 'journal', w: 22, h: 16, artProps: {} },
      { id: 'mug', label: 'Warm mug', art: 'mug', w: 12, h: 14, artProps: {} },
      { id: 'plant', label: 'Plant', art: 'plant', w: 16, h: 28, artProps: {} },
      { id: 'headphones', label: 'Headphones', art: 'headphones', w: 16, h: 22, artProps: {} },
      { id: 'relax-card', label: 'Relaxation card', art: 'card', w: 14, h: 20, artProps: {} },
    ],
    start: {
      journal: 'hook',
      mug: 'sill',
      plant: 'cushion',
      headphones: 'wall-card',
      'relax-card': 'side-table',
    },
  },
  {
    id: 'focus-space',
    title: 'Make Space to Focus',
    shortTitle: 'Focus space',
    energyFit: 'high',
    scene: 'focus',
    intro: 'Break one big task into a gentle order, and put distractions out of reach.',
    rules: [
      'Order the task cards from the tiniest start to the last: open your notes, then write three bullets, then stretch and sip water.',
      'The notebook sits on its mat.',
      'The pen rests beside it.',
      'The phone goes in the "phone away" box.',
    ],
    completion: {
      title: 'Room to focus',
      message: 'A tiny first step, a clear space, and a phone out of reach. That is a good setup.',
    },
    tip: 'Try it for real: pick one tiny first step and set a timer for ten minutes.',
    reflectionPrompt: 'How does it feel to have a small plan?',
    slots: [
      { id: 'first', label: 'First', x: 20, y: 28, w: 18, h: 34, accepts: ['task-open'] },
      { id: 'second', label: 'Second', x: 42, y: 28, w: 18, h: 34, accepts: ['task-write'] },
      { id: 'third', label: 'Third', x: 64, y: 28, w: 18, h: 34, accepts: ['task-stretch'] },
      { id: 'phone-away', label: 'Phone away', x: 86, y: 30, w: 16, h: 32, accepts: ['phone'] },
      { id: 'notebook-mat', label: 'Notebook mat', x: 30, y: 72, w: 30, h: 28, accepts: ['notebook'] },
      { id: 'pen-spot', label: 'Pen spot', x: 58, y: 72, w: 20, h: 14, accepts: ['pen'] },
    ],
    objects: [
      { id: 'task-open', label: 'Task card: open your notes', art: 'task', w: 15, h: 28, artProps: { color: '#F4C9AE', lines: ['Open', 'your', 'notes'] } },
      { id: 'task-write', label: 'Task card: write three bullets', art: 'task', w: 15, h: 28, artProps: { color: '#C3D3BC', lines: ['Write 3', 'bullet', 'points'] } },
      { id: 'task-stretch', label: 'Task card: stretch and sip water', art: 'task', w: 15, h: 28, artProps: { color: '#D3CBE6', lines: ['Stretch', '& sip', 'water'] } },
      { id: 'notebook', label: 'Notebook', art: 'notebook', w: 26, h: 24, artProps: {} },
      { id: 'pen', label: 'Pen', art: 'pen', w: 18, h: 8, artProps: { color: '#9DB4C9' } },
      { id: 'phone', label: 'Phone', art: 'phone', w: 11, h: 24, artProps: {} },
    ],
    start: {
      'task-stretch': 'first',
      'task-open': 'second',
      'task-write': 'third',
      notebook: 'phone-away',
      phone: 'pen-spot',
      pen: 'notebook-mat',
    },
  },
];

export const getLevel = (id) => LEVELS.find((l) => l.id === id) ?? null;
