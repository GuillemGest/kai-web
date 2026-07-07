/**
 * English (en) translation of the resource-centre guides.
 * The `slug` values are stable across locales (URLs).
 */
export interface Guide {
  slug: string
  title: string
  intro: string
  steps: readonly string[]
}

export const GUIDES: readonly Guide[] = [
  {
    slug: 'story-builder-export',
    title: 'Create a selection and export it from Story Builder',
    intro:
      'A walkthrough of the Story Builder interface: conversations, the «Ask KAI» field, the playlist, clip cards, the «Refine» button and exporting through «Export» with EDL, XML and OTIO options.',
    steps: [
      'Open Story Builder and create a new conversation, or reopen one you already have in the project.',
      'Type your query into the «Ask KAI» field in natural language. You might ask for a situation, a topic, a specific statement or a particular narrative moment.',
      'Review KAI’s response and the resulting playlist of clips. Check the video, the timecodes and the summary of the selection before continuing.',
      'Adjust the selection from the clip cards: review the descriptions, remove whatever does not fit and reorder the fragments to build the sequence you want.',
      'Use «Refine» to sharpen the search without losing the context of the conversation.',
      'Once the selection is ready, use «Export» and choose one of the available options — EDL, XML or OTIO — depending on your editing workflow configuration.',
      'Take the exported selection into your editor and continue the edit.',
    ],
  },
  {
    slug: 'premiere-panel',
    title: 'Work with KAI from the Adobe Premiere Pro panel',
    intro:
      'The KAI panel for Adobe Premiere Pro integrates into your editing workflow. From it you can access the project’s conversations, its selection versions and a built-in chat, and insert the clips KAI found directly onto the timeline.',
    steps: [
      'With the KAI panel already configured in Adobe Premiere Pro, open the project’s conversations from the panel sidebar.',
      'Select a conversation or a previously created playlist to reuse those searches and selections instead of starting over.',
      'Compare the versions of a selection — the original and its refinements — to assess different narrative options before deciding.',
      'Switch to «Chat» mode to request new criteria, adjust a search or refine the selection according to the edit in progress.',
      'Select the clips KAI found and insert them onto the timeline from within the editing environment itself.',
    ],
  },
]

/** Returns the guide whose slug matches, or undefined if it does not exist. */
export function findGuideBySlug(slug: string | undefined): Guide | undefined {
  return GUIDES.find((guide) => guide.slug === slug)
}
