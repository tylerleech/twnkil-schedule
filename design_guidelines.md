# Employee Task Scheduler - Design Guidelines

## Design Approach

**Selected Approach:** Design System - Drawing from Linear's clean efficiency and Google Calendar's scheduling patterns

**Core Principle:** This is a utility-first productivity tool where clarity, speed, and data organization take precedence over decorative elements. The interface should feel professional, trustworthy, and efficient for daily team use.

---

## Typography System

**Font Family:** 
- Primary: Inter (via Google Fonts) - excellent for UI and data display
- Monospace: JetBrains Mono - for date/time displays and employee IDs if needed

**Type Scale:**
- Page Headers: text-2xl font-semibold (24px)
- Section Headers: text-lg font-semibold (18px)
- Card Titles: text-base font-medium (16px)
- Body Text: text-sm (14px)
- Labels/Meta: text-xs font-medium uppercase tracking-wide (12px)
- Helper Text: text-xs (12px)

**Hierarchy Rules:**
- Use font-weight variations (medium/semibold/bold) for emphasis
- Employ text-opacity for secondary information
- Maintain consistent letter-spacing on labels for readability

---

## Layout System

**Spacing Primitives:** Use Tailwind units of 2, 4, 6, 8, 12, 16 as core spacing values
- Component padding: p-4, p-6
- Section margins: mb-6, mb-8
- Grid gaps: gap-4, gap-6
- Container spacing: px-6, py-8

**Grid Strategy:**
- Main dashboard: Two-column layout on desktop (sidebar + main content area)
- Sidebar width: w-64 (256px) - contains navigation and quick filters
- Main content: flex-1 with max-w-6xl container
- Mobile: Stack to single column, collapsible sidebar

**Responsive Breakpoints:**
- Mobile: base (< 768px) - single column, hamburger nav
- Tablet: md (768px+) - two columns begin
- Desktop: lg (1024px+) - full layout with all features visible

---

## Component Library

### Navigation & Structure

**Top Navigation Bar:**
- Fixed position with subtle bottom border
- Height: h-16
- Contains: Logo/app name, current week indicator, user profile dropdown
- Layout: justify-between with px-6 padding

**Sidebar Navigation:**
- Persistent on desktop, drawer on mobile
- Menu items with icon + label pattern
- Active state with subtle background treatment
- Sections: Dashboard, Current Schedule, History, Settings

### Dashboard Components

**Weekly Schedule Card:**
- Large prominent card showing current week assignments
- Structure: Week date range header, two task sections stacked
- Each section displays: Task name, assigned employee(s), scheduled day
- Spacing: p-6, gap-4 between sections
- Include "Generate Next Week" button at bottom

**Task Assignment Display:**
- Uses definition list pattern (dl/dt/dd structure)
- Foreign Currency Audit: Shows pair of employee names side-by-side
- Branch Balance Check: Shows single employee name
- Day indicator: Large, prominent badge showing day of week
- Employee names: Medium weight, adequate spacing between pairs

**Calendar View Component:**
- Weekly calendar grid showing Mon-Sun columns
- Cells contain task assignments for that day
- Compact view: h-24 cells with text-sm
- Hover states reveal full assignment details
- Empty cells show subtle dashed borders

**History Table:**
- Sortable table with columns: Week Date, Audit Pair, Audit Day, Balance Check Person
- Alternating row backgrounds for scannability
- Search/filter bar above table
- Pagination controls below (10-20 entries per page)
- Export functionality button in top-right

### Form Components

**Manual Override Modal:**
- Centered modal overlay (max-w-2xl)
- Header: "Edit Assignment" with close button
- Form sections clearly labeled
- Employee selection: Radio buttons or dropdown for single, checkboxes for pairs
- Day of week: Button group showing Mon-Sun
- Reason field: Textarea for absence notes
- Action buttons: Cancel (ghost) + Save (primary) with gap-3

**Employee Selection Controls:**
- For pairs: Grid of clickable cards (grid-cols-2), each showing employee name
- Selected state: border and subtle background change
- For single: Dropdown or radio button list
- Disabled state for ineligible employees (e.g., Nalleli for balance check)

### Interactive Elements

**Buttons:**
- Primary action: Solid background, medium font-weight, px-4 py-2, rounded-md
- Secondary: Bordered with transparent background
- Danger/Warning: For overrides and deletions
- Icon buttons: Square aspect ratio (h-10 w-10) for compact actions

**Status Indicators:**
- Day badges: Rounded-full px-3 py-1, uppercase text-xs tracking-wide
- Assignment status: Small pill badges showing "Current", "Upcoming", "Past"
- Constraint violations: Warning badge if manual edit creates conflict

**Cards:**
- Consistent structure: Rounded-lg border with p-4 to p-6 padding
- Hover states: Subtle shadow increase for interactive cards
- Section cards: Distinct from actionable cards through border treatment

### Data Display

**Employee Information:**
- Minimal avatar representation: Circular initial badges (h-8 w-8)
- Name display: Capitalize first letters, medium font-weight
- Group display: Flex row with gap-2 for pairs, vs/& separator

**Date/Time Display:**
- Week range: "Dec 16-22, 2024" format
- Single dates: "Monday, Dec 16" format
- Relative time: "This week", "Next week", "2 weeks ago"
- Use monospace font for precise date displays in tables

### Notification System

**Email Reminder Preview:**
- Small preview card showing what reminder looks like
- Toggle controls for notification preferences
- Schedule timing selector (e.g., "Monday 9 AM")

**In-app Alerts:**
- Toast notifications for successful actions (top-right)
- Warning banners for constraint violations (full-width, below nav)
- Dismissible with smooth exit animations

---

## Layout Patterns

**Dashboard Main View:**
```
[Top Nav - full width]
[Sidebar | Main Content Area]
         | [Current Week Card - prominent]
         | [Quick Actions Row - 2-3 buttons]
         | [Upcoming Schedule Preview]
         | [Recent History Table - truncated]
```

**History Page:**
```
[Top Nav - full width]
[Sidebar | Search/Filter Bar]
         | [Full History Table]
         | [Pagination]
```

**Schedule View Page:**
```
[Top Nav - full width]
[Sidebar | Week Selector]
         | [Calendar Grid View]
         | [Assignment Details Panel]
```

---

## Icons

**Icon Library:** Heroicons (via CDN) - matches Linear/modern productivity apps

**Icon Usage:**
- Navigation items: 20px icons (h-5 w-5)
- Action buttons: 16px icons (h-4 w-4)
- Status indicators: 12px icons (h-3 w-3)
- Specific icons needed: Calendar, Users, History/Clock, Settings, Edit, Trash, Check, Alert Triangle, Mail

---

## Animations

**Use Sparingly:**
- Modal enter/exit: Subtle scale and fade (150ms)
- Toast notifications: Slide in from top-right (200ms)
- Loading states: Skeleton loaders, not spinners
- NO scroll animations, NO hover rotations, NO complex transitions

---

## Accessibility

- Minimum touch target: 44x44px for all interactive elements
- Form labels always visible and properly associated
- Focus states: 2px offset ring on all interactive elements
- Color contrast: Ensure all text meets WCAG AA standards
- Keyboard navigation: Full support for tab order and shortcuts
- Screen reader: Proper ARIA labels on all custom controls

---

## Images

**No Hero Section Required** - This is a utility application, not a marketing page

**Imagery Strategy:**
- Empty states: Simple illustrative SVG placeholders (e.g., calendar icon for no history)
- User avatars: Initial-based circular badges, not photos
- No decorative imagery needed - focus on data clarity