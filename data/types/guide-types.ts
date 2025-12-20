/**
 * Type definitions for brewing guides and instructions
 * Prepared for future content migration from React components to data files
 */

export type GuideDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface GuideContent {
  overview: string;
  steps: string[];
  tips: string[];
}

export interface Guide {
  id: string;
  title: string;
  difficulty: GuideDifficulty;
  time: string;
  category: string;
  content: GuideContent;
}

export interface GuideCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  guides: Guide[];
}

export interface InstructionListItem {
  label: string;
  desc: string;
}

export interface InstructionSection {
  heading?: string;
  content?: string;
  list?: InstructionListItem[];
}

export interface ToolInstructions {
  id: string;
  toolId: string;
  title: string;
  sections: InstructionSection[];
}

/**
 * Future usage:
 *
 * import { GUIDE_CATEGORIES } from '@/data/guides/all-guides';
 * import { TOOL_INSTRUCTIONS } from '@/data/instructions/tool-instructions';
 *
 * This structure prepares for:
 * - Separating content from presentation logic
 * - Type-safe content management
 * - Easier content updates without code changes
 * - Potential CMS integration
 * - Content versioning and translation support
 */
