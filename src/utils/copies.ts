
export const copies = {
  // Affirmations by mood state (100+ variants)
  affirmations: {
    joy: [
      "Your light is shining so beautifully today",
      "This joy you feel is completely deserved",
      "You're creating such wonderful moments for yourself",
      "Your happiness radiates and touches everything around you",
      "This feeling of joy is a gift you've given yourself",
      "You're blooming in the most beautiful way",
      "Your heart is full of such lovely energy",
      "This lightness in your spirit is precious",
      "You're dancing through life with such grace",
      "Your smile changes everything, including yourself"
    ],
    calm: [
      "This peaceful moment is yours to cherish",
      "You've found such beautiful stillness within yourself",
      "Your calm energy is a sanctuary you've created",
      "This tranquility flows from your inner wisdom",
      "You're embracing this gentle rhythm perfectly",
      "Your peaceful presence is a gift to yourself",
      "This serenity you feel is deeply earned",
      "You're floating in such lovely contentment",
      "Your inner peace is growing stronger each day",
      "This quiet strength within you is remarkable"
    ],
    hope: [
      "Your heart knows the way forward, even when your mind isn't sure",
      "This gentle optimism is your inner light speaking",
      "You're planting seeds of possibility with every breath",
      "Your hope is a bridge to beautiful tomorrows",
      "This feeling of possibility is your spirit awakening",
      "You're opening doors to wonderful new chapters",
      "Your hopeful heart is writing a beautiful story",
      "This sense of potential is your inner wisdom emerging",
      "You're creating space for miracles to unfold",
      "Your hope is a gentle reminder of your resilience"
    ],
    neutral: [
      "This steady moment has its own quiet beauty",
      "You're exactly where you need to be right now",
      "This gentle plateau is perfect for catching your breath",
      "Your presence in this moment is completely enough",
      "This balanced feeling is your system finding its rhythm",
      "You're creating space for whatever wants to emerge",
      "This neutral ground is a peaceful place to rest",
      "Your emotional balance is a form of self-care",
      "This steady energy is your foundation strengthening",
      "You're honoring your need for gentle consistency"
    ],
    sadness: [
      "Your tears are watering the seeds of your growth",
      "This sadness you feel is your heart expanding with love",
      "You're allowing yourself to feel deeply, and that takes courage",
      "Your sensitivity is a superpower, even when it hurts",
      "This heaviness will pass, leaving you lighter than before",
      "You're processing something important, be gentle with yourself",
      "Your sadness is valid, and so is your healing",
      "This tender moment is teaching your heart to grow",
      "You're brave for feeling this fully",
      "Your gentle heart deserves all the comfort in the world"
    ],
    anger: [
      "Your anger is information about what matters to you",
      "This fire you feel can fuel positive change when you're ready",
      "You're allowed to feel this intensity without judgment",
      "Your anger is protecting something precious within you",
      "This energy you feel can be channeled into self-advocacy",
      "You're human, and humans feel the full spectrum",
      "This storm will pass, leaving clearer skies ahead",
      "Your feelings are valid, even the difficult ones",
      "You're processing something that needs attention",
      "This intensity is temporary, your peace is permanent"
    ]
  },

  // UI Microcopy with passive encouragement
  ui: {
    welcome: {
      firstTime: "When you're ready to begin your gentle journey...",
      returning: "Welcome back to your peaceful space",
      noName: "Begin your healing journey",
      withName: (name: string) => `Welcome back, ${name}`
    },
    prompts: {
      invitation: "If you'd like to share what's in your heart today...",
      gentle: "There's no pressure to say anything in particular",
      alternative: "Or simply sit with whatever arises naturally",
      encouragement: "Your voice and your feelings are both welcome here"
    },
    recording: {
      start: "When you're ready, you might like to share",
      recording: "Taking all the time you need...",
      complete: "You've shared something beautiful",
      error: "That didn't work as expected - shall we try gently again?"
    },
    saving: {
      progress: "Gently saving your reflection...",
      complete: "Your thoughts are safely tucked away",
      error: "We couldn't save that just now - your words are still valuable"
    },
    empty: {
      journal: "When you're ready, your first reflection will appear here",
      progress: "Your healing journey will unfold naturally in its own time",
      profile: "Your space will grow as you share more of yourself"
    },
    errors: {
      gentle: "Something didn't go as planned - that's perfectly okay",
      permission: "We'd need microphone access when you're comfortable sharing that",
      storage: "We're having trouble saving right now - your reflection still matters",
      playback: "The audio isn't playing smoothly - your words were still heard"
    },
    actions: {
      optional: "If you'd like to...",
      suggestion: "You might consider...",
      invitation: "Feel free to...",
      noRush: "Whenever you're ready..."
    }
  },

  // Privacy and data messaging
  privacy: {
    assurance: "Everything stays safely on your device",
    control: "You have complete control over your data",
    deletion: "You can remove everything anytime you choose",
    noTracking: "No one else can access your private reflections",
    export: "Your data belongs to you - export it whenever you like"
  },

  // Contextual error states with emotional awareness
  contextual: {
    microphoneBlocked: "Your browser is protecting your privacy by blocking microphone access. When you're ready to share through voice, you can allow access in your browser settings.",
    networkOffline: "You're currently offline, which means everything stays extra private. Your reflections will save locally when you're ready.",
    storageFullReflections: "Your reflection space is getting full. You might like to export your journey or create some space by removing older entries.",
    storageFullAudio: "Your audio recordings are taking up space. Consider keeping just your favorite reflections or saving them elsewhere.",
    playbackFailedGently: "That audio isn't playing smoothly right now. Your reflection was still captured and saved.",
    deleteConfirmation: "This will permanently remove all your reflections and audio recordings. This action feels significant - are you sure this is what you want?",
    exportPreparing: "Gathering all your beautiful reflections together...",
    exportReady: "Your healing journey is ready to download",
    dataCleared: "Your space is now clear and ready for new reflections when you are"
  }
};

// Helper function to get random affirmation by mood
export const getAffirmation = (mood: string): string => {
  const moodAffirmations = copies.affirmations[mood as keyof typeof copies.affirmations];
  if (!moodAffirmations) return copies.affirmations.neutral[0];
  return moodAffirmations[Math.floor(Math.random() * moodAffirmations.length)];
};

// Helper function to get contextual UI copy
export const getUICopy = (category: string, key: string, ...args: any[]): string => {
  const categoryObj = copies.ui[category as keyof typeof copies.ui];
  if (!categoryObj) return "";
  
  const copy = categoryObj[key as keyof typeof categoryObj];
  if (typeof copy === 'function') {
    return copy(...args);
  }
  return copy as string || "";
};
