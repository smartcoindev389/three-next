'use client';
import { strapi } from '@/lib/strapi/strapi';

type Vec3 = [number, number, number];

interface PersonBoard {
  idx: number;
  startPosition: Vec3;
  finishedPosition: Vec3;
  forwardPosition: Vec3;
  mainText?: string;
  subText?: string;
  isActive?: boolean;
  assetPath?: string;
  photoW?: number;
  textOffsetX?: number;
  textOffsetY?: number;
  gap?: number;
  type?: string;
  name?: string;
  role?: string;
  description?: string;
  delay: number;
  duration?: number;
  startDelay?: number;
  closedDelay?: number;
  forwardDelay?: number;
  startDuration?: number;
  closedDuration?: number;
  forwardDuration?: number;
}

interface GeneratorConfig {
  membersPerScreen: number; // How many members to show per section (2-3 recommended)
  breakpoints: {
    desktop: number;
    laptop: number;
    tablet: number;
    mobile: number;
  };
  positions: {
    desktop: Array<{ x: number; y: number; photoW: number; textOffsetX: number; textOffsetY: number; gap: number }>;
    laptop: Array<{ x: number; y: number; photoW: number; textOffsetX: number; textOffsetY: number; gap: number }>;
    tablet: Array<{ x: number; y: number; photoW: number; textOffsetX: number; textOffsetY: number; gap: number }>;
    mobile: Array<{ x: number; y: number; photoW: number; textOffsetX: number; textOffsetY: number; gap: number }>;
  };
}

/**
 * Generate person sections dynamically based on total team members
 */
export function generatePersonSections(persons: any[], config: GeneratorConfig) {
  // Safety check
  if (!persons || !Array.isArray(persons) || persons.length === 0) {
    return [];
  }

  const { membersPerScreen } = config;
  const totalSections = Math.ceil(persons.length / membersPerScreen);
  const sections = [];

  for (let sectionIndex = 0; sectionIndex < totalSections; sectionIndex++) {
    const startIdx = sectionIndex * membersPerScreen;
    const endIdx = Math.min(startIdx + membersPerScreen, persons.length);
    const sectionMembers = persons.slice(startIdx, endIdx);

    // Create preset for this section with 4 responsive types
    const sectionPreset = {
      desktop: (personsData: any[]) => createResponsiveBoards(sectionMembers, sectionIndex, config, 'desktop'),
      laptop: (personsData: any[]) => createResponsiveBoards(sectionMembers, sectionIndex, config, 'laptop'),
      tablet: (personsData: any[]) => createResponsiveBoards(sectionMembers, sectionIndex, config, 'tablet'),
      mobile: (personsData: any[]) => createResponsiveBoards(sectionMembers, sectionIndex, config, 'mobile'),
      names: `section Person${sectionIndex + 1}`,
    };

    sections.push(sectionPreset);
  }

  return sections;
}

/**
 * Create responsive boards for a section based on breakpoint type
 */
function createResponsiveBoards(
  members: any[],
  sectionIndex: number,
  config: GeneratorConfig,
  breakpointType: 'desktop' | 'laptop' | 'tablet' | 'mobile'
): PersonBoard[] {
  const items: PersonBoard[] = [];
  const baseIdx = sectionIndex * 1000 + 100 + (
    breakpointType === 'desktop' ? 0 : 
    breakpointType === 'laptop' ? 1000 : 
    breakpointType === 'tablet' ? 2000 : 3000
  );

  // Add person items
  members.forEach((person, index) => {
    const positions = config.positions[breakpointType];
    const pos = positions[index % positions.length];
    
    items.push({
      idx: baseIdx + index,
      assetPath: strapi.getStrapiMediaUrl(person?.photo?.url),
      photoW: pos.photoW,
      textOffsetX: pos.textOffsetX,
      textOffsetY: pos.textOffsetY,
      gap: pos.gap,
      // photoH will be calculated from image aspect ratio in ModelFBO
      type: 'Person',
      startPosition: [pos.x, pos.y, -100],
      finishedPosition: [pos.x, pos.y, breakpointType === 'mobile' ? 25 : 29],
      forwardPosition: [pos.x, pos.y, 50],
      delay: 0.3 + (index * 0.1),
      duration: 1,
      name: person?.name,
      role: person?.position,
      description: person?.bio,
    });
  });

  // Add background boards (adjusted based on screen size)
  const bgBaseIdx = sectionIndex * 1000 + 500;
  const bgScale = breakpointType === 'mobile' ? 0.8 : 1;
  
  items.push(
    {
      idx: bgBaseIdx,
      startPosition: [17 * bgScale, 22 * bgScale, -50],
      finishedPosition: [19 * bgScale, 25 * bgScale, -27],
      forwardPosition: [17 * bgScale, 21 * bgScale, 100],
      delay: 0.3,
      duration: 1,
      mainText: '',
      subText: '',
      isActive: false,
    },
    {
      idx: bgBaseIdx + 1,
      startPosition: [-5 * bgScale, -23 * bgScale, -50],
      finishedPosition: [-5 * bgScale, -25 * bgScale, -25],
      forwardPosition: [-17 * bgScale, -19 * bgScale, 100],
      delay: 0.2,
      duration: 1,
      mainText: '',
      subText: '',
      isActive: false,
    },
    {
      idx: bgBaseIdx + 2,
      startPosition: [-20 * bgScale, -23 * bgScale, -50],
      finishedPosition: [-19 * bgScale, -28 * bgScale, -7],
      forwardPosition: [-17 * bgScale, -19 * bgScale, 100],
      delay: 0.1,
      duration: 1,
      mainText: '',
      subText: '',
      isActive: false,
    }
  );

  return items;
}

/**
 * Generate scroll triggers dynamically for person sections
 */
export function generateScrollTriggers(totalSections: number) {
  const triggers = [];

  for (let i = 0; i < totalSections; i++) {
    const currentSection = `section Person${i + 1}`;
    const nextSection = i < totalSections - 1 ? `section Person${i + 2}` : 'section finish 2';
    const prevSection = i > 0 ? `section Person${i}` : 'section Tunnel';

    triggers.push({
      top: () => {
        const AnimationController = require('@/utils/AnimationScrollController').AnimationController;
        AnimationController.play(`${currentSection} open`);
        AnimationController.play(`${nextSection} closed`);
        return true;
      },
      bottom: () => {
        const AnimationController = require('@/utils/AnimationScrollController').AnimationController;
        AnimationController.play(`${prevSection} forward`);
        AnimationController.play(`${currentSection} open`);
        return true;
      },
    });
  }

  return triggers;
}

