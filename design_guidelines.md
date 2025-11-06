# Design Guidelines: Anime & Movie Tracking App

## Design Approach

**Selected Approach**: Design System with Domain References
- **Primary Reference**: MyAnimeList, AniList (anime tracking patterns)
- **Secondary Reference**: Notion, Linear (clean data management)
- **System Foundation**: Material Design principles for structured data presentation

**Justification**: This is a utility-focused, information-dense application where efficiency and learnability are paramount. The notebook-style interface requires clear hierarchy and familiar patterns for tracking complex data.

## Core Design Elements

### A. Typography

**Font Family**: 
- Primary: Inter (via Google Fonts CDN)
- Monospace: JetBrains Mono (for counters/numbers)

**Hierarchy**:
- App Title: text-2xl, font-bold
- Section Headers: text-xl, font-semibold
- Show/Movie Titles: text-lg, font-medium
- Episode Counters: text-base, font-mono, font-semibold
- Metadata (genres, status): text-sm, font-normal
- Labels: text-xs, font-medium, uppercase, tracking-wide

### B. Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, and 12
- Component gaps: gap-4
- Section padding: p-6 or p-8
- Card spacing: space-y-4
- Button padding: px-4 py-2

**Grid Structure**:
- Main container: max-w-7xl mx-auto px-4
- Two-column layout for larger screens: 2/3 main content + 1/3 stats sidebar
- Mobile: Single column stack

### C. Component Library

#### Navigation & Header
- Fixed top navigation bar with app title
- Search bar prominence: Large autocomplete input (h-12) with search icon
- Quick stats display in header: Episode count badge, Movie count badge

#### Autocomplete Search
- Dropdown with fuzzy match results
- Show cover thumbnails (small, 48x48) next to titles
- Highlight matched characters
- Max 8 results shown, scrollable
- Result items: Hover state with subtle background change

#### Tracking Cards (Main Content)
**Anime Show Card**:
- Horizontal card layout with thumbnail (80x112)
- Title + Episode counter (large, prominent with +/- buttons)
- Progress bar showing episodes watched
- Status badge (Watching, Completed, On Hold)
- Quick actions: Edit, Delete icons (top-right)

**Movie Card**:
- Compact horizontal card with poster thumbnail (64x96)
- Title + Type badge (Anime Movie / Movie)
- Watched count indicator
- Same action icons

#### List Organization
- Tabs for filtering: All, Watching, Completed, Movies
- Sort dropdown: By Title, By Recent, By Episodes
- Cards in vertical list with dividers (divide-y)

#### Stats Dashboard (Sidebar/Top Section)
- Large number displays with labels
- Total Anime Episodes: Big counter with icon
- Total Movies: Separate counter
- This Week stats (optional engagement metric)
- Circular progress indicators for visual interest

#### Forms & Inputs
- Add New Entry button (prominent, primary CTA)
- Modal overlay for adding shows/movies
- Input fields: Title search, Episode count, Status dropdown
- Counter controls: Large +/- buttons flanking number display
- Save/Cancel buttons in modal footer

#### Interactive Elements
- Primary buttons: Rounded (rounded-md), medium height (h-10)
- Icon buttons: Square (h-8 w-8), rounded-full for +/- counters
- Hover states: Scale slightly (hover:scale-105) for counters
- Disabled states: Reduced opacity (opacity-50)

### D. Animations

**Minimal, Purposeful Only**:
- Counter increment: Quick number change with subtle scale pulse
- Card add/remove: Fade in/out (duration-200)
- Modal: Fade in background, slide-up content
- No scroll animations, no decorative motion

## Layout Specifications

**Dashboard View**:
- Header: Fixed position with search + stats
- Main area: Scrollable list of tracking cards
- Sidebar (desktop): Pinned stats dashboard
- Empty state: Centered illustration + "Start tracking" CTA

**Responsive Behavior**:
- Desktop (lg): Two-column with sidebar
- Tablet (md): Single column, stats at top
- Mobile: Stack everything, fixed search bar, scrollable content

**Density**:
- Comfortable spacing for easy scanning
- Cards have breathing room (mb-4 between cards)
- No cramped layouts - prioritize readability over fitting more content

## Icons

**Library**: Heroicons (via CDN)
- Search: MagnifyingGlassIcon
- Plus/Minus: PlusIcon, MinusIcon
- Edit: PencilIcon
- Delete: TrashIcon
- Stats: ChartBarIcon
- Film: FilmIcon
- TV: TvIcon

## Images

**No Hero Section Required** - This is a utility application.

**Functional Images**:
- Anime/Movie Posters: Placeholder rectangles with aspect ratios (portrait 2:3)
- Empty state illustration: Simple graphic encouraging first entry
- All images loaded from external URLs (user-provided or API)
- Fallback: Colored placeholder with title initials

## Accessibility

- All interactive elements have focus states (ring-2 ring-offset-2)
- Form labels associated with inputs
- ARIA labels for icon-only buttons
- Keyboard navigation for autocomplete (arrow keys, enter to select)
- Sufficient contrast ratios for all text
- Skip to main content link