/**
 * Team Display Configuration
 * 
 * Easily customize how team members are displayed in the About page
 * Now supports 4 responsive breakpoints for optimal display across all devices
 */

export const TEAM_CONFIG = {
  /**
   * Number of team members to display per screen section
   * Recommended: 2-3 for best visual experience
   */
  membersPerScreen: 2,

  /**
   * Responsive breakpoints (in pixels)
   * Adjust these to match your design system
   */
  breakpoints: {
    desktop: 1920,      // Large desktop screens
    laptop: 1440,       // Laptop and small desktop
    tablet: 1024,       // Tablet landscape and portrait
    mobile: 768,        // Mobile devices
  },

  /**
   * Position configurations for each breakpoint
   * - x, y: Position coordinates in 3D space
   * - photoW: Photo width (height is auto-calculated from image aspect ratio)
   * - textOffsetX: Horizontal offset for text from photo center
   * - textOffsetY: Vertical offset for text positioning
   * - gap: Spacing between photo and text
   */
  positions: {
    // Large Desktop (>1920px)
    desktop: [
      { x: -9, y: 2, photoW: 6, textOffsetX: 4, textOffsetY: 3, gap: 1 },
      { x: 6.5, y: -4, photoW: 6, textOffsetX: 4, textOffsetY: 3, gap: 1 }
    ],
    
    // Laptop (1440px - 1920px)
    laptop: [
      { x: -8, y: 2, photoW: 5, textOffsetX: 3, textOffsetY: 2.5, gap: 0.8 },
      { x: 5, y: -3.5, photoW: 5, textOffsetX: 3, textOffsetY: 2.5, gap: 0.8 }
    ],
    
    // Tablet (1024px - 1440px)
    tablet: [
      { x: -7, y: 2.5, photoW: 5, textOffsetX: 3, textOffsetY: 2.5, gap: 0.6 },
      { x: 3, y: -3.5, photoW: 5, textOffsetX: 3, textOffsetY: 2.5, gap: 0.6 }
    ],
    
    // Mobile (<1024px)
    mobile: [
      { x: 0, y: 7, photoW: 6, textOffsetX: -3, textOffsetY: -2.5, gap: 0.5 },
      { x: 0, y: -3, photoW: 6, textOffsetX: -3, textOffsetY: -2.5, gap: 0.5 },
    ],
  },
};

/**
 * Usage Examples:
 * 
 * To show 2 members per screen:
 * membersPerScreen: 2
 * 
 * To adjust breakpoints:
 * breakpoints: {
 *   desktop: 1920,  // Change to 1680 for smaller desktop threshold
 *   laptop: 1440,
 *   tablet: 1024,
 *   mobile: 768,
 * }
 * 
 * To show 3 members per screen (add more positions to each breakpoint):
 * membersPerScreen: 3,
 * positions: {
 *   desktop: [
 *     { x: -10, y: 3, photoW: 4, textOffsetX: 5, textOffsetY: 2, gap: 1 },
 *     { x: 0, y: 0, photoW: 4, textOffsetX: 5, textOffsetY: 0, gap: 1 },
 *     { x: 10, y: -3, photoW: 4, textOffsetX: 5, textOffsetY: -2, gap: 1 },
 *   ],
 *   laptop: [...], // Same structure with adjusted values
 *   tablet: [...],
 *   mobile: [...],
 * }
 * 
 * Notes:
 * - photoH (height) is automatically calculated from the image's aspect ratio
 * - textOffsetX: Horizontal position of text relative to scene center
 * - textOffsetY: Vertical position of text relative to scene center
 * - gap: Spacing between elements (used for fine-tuning)
 * - All values are in 3D scene units
 */

