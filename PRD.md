# Planning Guide

A comprehensive dashboard for Consulting Resource Managers to track consultant skill levels, training completion, and delivery hours across Microsoft solution plays, enabling data-driven resource allocation and capability development decisions.

**Experience Qualities**:
1. **Analytical** - Provides clear metrics and visual data representations that enable quick assessment of team capabilities and resource allocation across solution plays
2. **Authoritative** - Projects confidence and professionalism through structured data visualization and enterprise-grade design that matches the consulting domain
3. **Actionable** - Surfaces critical insights about skill gaps and resource levels that directly inform staffing and training decisions

**Complexity Level**: Complex Application (advanced functionality, likely with multiple views)
This dashboard aggregates multiple data sources (training records, delivery hours), calculates skill levels dynamically, provides filtering and search capabilities, and presents data through multiple visualization methods (tables, charts, skill matrices), requiring sophisticated state management and data manipulation.

## Essential Features

### Consultant Profile Management
- **Functionality**: Add, edit, and manage consultant profiles with their training and delivery data across 18 solution plays, including region, primary industry expertise, and additional industry experience
- **Purpose**: Maintain accurate records of team capabilities, track individual consultant growth, and capture industry specializations for optimal client matching
- **Trigger**: User clicks "Add Consultant" button or selects existing consultant to edit
- **Progression**: Click add/edit → Form opens with consultant details including name, email, region, primary industry expertise, and additional industries → Enter training completions and delivery hours for each solution play → System calculates skill levels (Apprentice <200hrs, Contributor 200-500hrs, Leader >500hrs) → Save → Dashboard updates with new data
- **Success criteria**: Consultant data persists across sessions, skill levels calculate correctly, primary industry displays prominently in consultant cards, and changes reflect immediately in all views

### Solution Play Skills Matrix
- **Functionality**: Visual grid showing all consultants and their skill levels across all 18 solution plays
- **Purpose**: Provide at-a-glance view of team capability distribution to identify skill gaps and strengths
- **Trigger**: Default view on dashboard load
- **Progression**: Dashboard loads → Matrix displays with consultants as rows and solution plays as columns → Color-coded badges indicate skill levels (Apprentice/Contributor/Leader) → User can click cells for detailed metrics → Hovering shows training completion and hours delivered
- **Success criteria**: Matrix loads instantly, clearly differentiates skill levels through visual design, and allows quick scanning of hundreds of data points

### Solution Play Analytics
- **Functionality**: Detailed breakdown for each solution play showing team capacity, skill distribution, and training completion rates
- **Purpose**: Enable strategic planning for specific solution play staffing and identify training priorities
- **Trigger**: User selects a solution play from dropdown or clicks on matrix column header
- **Progression**: Select solution play → View updates to show: total consultants trained, hours delivered breakdown by skill level, list of qualified consultants → Charts display skill distribution and capacity metrics → User can drill into individual consultant details
- **Success criteria**: Analytics calculate accurately from underlying data, charts render clearly, and provide meaningful insights for resource planning

### Search and Filter System
- **Functionality**: Filter consultants by name, skill level, solution play, industry expertise (including primary industry), region, or minimum hours delivered
- **Purpose**: Quickly locate consultants with specific capabilities and industry experience for project staffing decisions
- **Trigger**: User types in search box or selects filter criteria
- **Progression**: Enter search/filter criteria → Results update in real-time → Filtered consultants display in matrix and lists → Primary industry prominently displayed on consultant cards → Clear filters to return to full view
- **Success criteria**: Search responds instantly (<100ms), supports multiple filter combinations, clearly indicates active filters, and highlights primary industry expertise in results

### Hours Submission Form
- **Functionality**: Structured form for team members to submit their solution area assignment, implemented solution plays, and hours delivered
- **Purpose**: Enable consultants to self-report their work and capabilities, streamlining data collection for resource managers
- **Trigger**: User clicks "Submit Hours" button in Capabilities Assessment tab
- **Progression**: Click Submit Hours → Modal form opens → Enter team member name → Select solution area (AI Business Solutions, Cloud & AI Platforms, or Security) → Choose specific solution play from filtered list → Select hours range (0-100/Apprentice, 101-500/Contributor, 501+/Leader) → Optionally enter exact hours and additional notes → Submit → Confirmation toast appears
- **Success criteria**: Form validates required fields, solution plays filter based on selected area, submission records successfully, and provides clear feedback to user

## Edge Case Handling

- **No Consultants Added**: Display helpful empty state with call-to-action to add first consultant
- **Incomplete Data**: Handle consultants with no training or zero hours gracefully, showing "Not Started" status
- **Duplicate Names**: Allow duplicate consultant names but warn user and use unique IDs for data management
- **Large Datasets**: Implement virtual scrolling or pagination if consultant count exceeds 50 for performance
- **Invalid Data Entry**: Validate numeric inputs for hours, prevent negative values, and show inline error messages
- **Data Export**: Enable CSV export of consultant data for external reporting needs

## Design Direction

The design should evoke confidence, clarity, and executive-level professionalism. It needs to feel like enterprise business intelligence software—authoritative and data-driven—while remaining approachable and easy to navigate. Think Microsoft Power BI meets modern SaaS: sophisticated data visualization with clean information hierarchy and purposeful use of whitespace to prevent cognitive overload.

## Color Selection

A professional color scheme that leverages Microsoft brand associations while maintaining clear data visualization hierarchy.

- **Primary Color**: Deep Azure Blue (oklch(0.45 0.15 250)) - Communicates trust, intelligence, and aligns with Microsoft Azure branding, used for primary actions and key metrics
- **Secondary Colors**: Cool Gray (oklch(0.65 0.01 250)) for supporting UI elements and Steel Blue (oklch(0.55 0.10 250)) for secondary actions, creating a cohesive business intelligence aesthetic
- **Accent Color**: Vibrant Teal (oklch(0.65 0.15 195)) - Draws attention to important metrics, skill achievements, and interactive elements that require user focus
- **Foreground/Background Pairings**:
  - Primary (Deep Azure Blue oklch(0.45 0.15 250)): White text (oklch(1 0 0)) - Ratio 8.2:1 ✓
  - Secondary (Cool Gray oklch(0.65 0.01 250)): White text (oklch(1 0 0)) - Ratio 4.7:1 ✓
  - Accent (Vibrant Teal oklch(0.65 0.15 195)): White text (oklch(1 0 0)) - Ratio 4.8:1 ✓
  - Background (Soft Blue-Gray oklch(0.97 0.005 250)): Dark text (oklch(0.25 0.02 250)) - Ratio 12.8:1 ✓
  - Skill Level Badges: Apprentice (Amber oklch(0.75 0.15 75) on White), Contributor (Blue oklch(0.55 0.15 250) on White), Leader (Emerald oklch(0.55 0.15 155) on White) - All ratio >4.5:1 ✓

## Font Selection

Typography should communicate authority and data clarity, balancing modern professional aesthetics with excellent readability for dense information displays.

- **Primary Font**: Inter for UI elements and body text - Its exceptional clarity at small sizes and professional appearance make it ideal for data-heavy dashboards
- **Data Font**: JetBrains Mono for numerical metrics and skill levels - Monospace clarity ensures numbers align perfectly in tables and charts

- **Typographic Hierarchy**:
  - H1 (Page Title): Inter Bold/32px/tight letter spacing/-0.02em
  - H2 (Section Headers): Inter Semibold/24px/normal spacing
  - H3 (Card Titles): Inter Semibold/18px/normal spacing
  - Body (Descriptions): Inter Regular/14px/relaxed line height/1.6
  - Data Labels: Inter Medium/12px/uppercase/letter spacing/0.05em
  - Metrics (Large): JetBrains Mono Bold/36px/tabular numbers
  - Metrics (Small): JetBrains Mono Medium/16px/tabular numbers
  - Table Content: Inter Regular/14px/consistent row height/40px

## Animations

Animations should enhance comprehension of data changes and guide attention to important updates without creating visual noise or delaying interactions.

- Smooth fade-ins (200ms) when loading data sections to create perceived performance
- Gentle scale transforms (150ms) on card hover to indicate interactivity
- Slide transitions (300ms) when switching between views to maintain spatial awareness
- Number count-up animations (800ms) when metrics update to draw attention to changes
- Subtle pulse effect on newly added/updated consultant rows to confirm actions
- Smooth color transitions (200ms) on badge state changes for skill level updates

## Component Selection

- **Components**:
  - **Card**: Primary container for metrics sections, consultant profiles, and analytics panels with subtle shadows
  - **Table**: Core component for consultant/solution play matrix with custom styling for dense data display
  - **Badge**: Skill level indicators (Beginner/Collaborator/Lead) with color coding and rounded styling
  - **Button**: Primary actions (Add Consultant, Export Data) with solid fills; secondary actions with outline variants
  - **Dialog**: Forms for adding/editing consultant data with proper focus management
  - **Select**: Solution play picker for analytics view with search capability
  - **Input**: Search field and numeric hour inputs with clear validation states
  - **Tabs**: Switch between different dashboard views (Overview, Skills Matrix, Analytics)
  - **Avatar**: Consultant profile images with fallback to initials
  - **Progress**: Visual representation of training completion percentages
  - **Tooltip**: Contextual information on hover for metrics and skill levels
  - **Sheet**: Side panel for detailed consultant information and editing

- **Customizations**:
  - Custom data table with fixed headers, alternating row colors (subtle), and hover states
  - Skill badge component with three distinct variants using Tailwind background colors
  - Metric cards with icon integration from Phosphor Icons (ChartBar, Users, Trophy, Clock)
  - Solution play grid using CSS Grid with responsive column counts

- **States**:
  - Buttons: Default solid, hover with subtle lift (shadow increase), active with scale down, disabled with opacity reduction
  - Table rows: Default white/subtle gray alternating, hover with primary color tint at 5% opacity, selected with border accent
  - Input fields: Default with border, focus with ring and border color change to primary, error with destructive color and message
  - Cards: Default with subtle shadow, hover with increased shadow and scale (1.01), active state maintains hover

- **Icon Selection**:
  - **Plus** (Add consultant action)
  - **MagnifyingGlass** (Search functionality)
  - **Funnel** (Filter controls)
  - **ChartBar** (Analytics view)
  - **Users** (Team overview)
  - **GraduationCap** (Training metrics)
  - **Clock** (Delivery hours)
  - **Trophy** (Skill achievements)
  - **Export** (Data export)
  - **Pencil** (Edit consultant)
  - **Trash** (Remove consultant)
  - **X** (Close dialogs)

- **Spacing**:
  - Page padding: p-6 (24px) on desktop, p-4 (16px) on mobile
  - Section gaps: gap-6 (24px) between major sections
  - Card padding: p-6 (24px) for content areas
  - Table cell padding: px-4 py-3 (16px horizontal, 12px vertical)
  - Button padding: px-4 py-2 for default, px-6 py-3 for large
  - Form field spacing: gap-4 (16px) between fields
  - Badge spacing: px-3 py-1 (12px horizontal, 4px vertical)

- **Mobile**:
  - Skills matrix converts to card-based layout with consultant cards showing top 3 solution plays
  - Metric cards stack vertically instead of horizontal grid
  - Table switches to responsive card view with expandable details
  - Navigation tabs become bottom-fixed tab bar on mobile
  - Dialog forms adjust to full-screen on mobile for better input experience
  - Reduce text sizes by one step (H1 becomes 24px, body becomes 13px)
  - Touch targets expand to minimum 44px for all interactive elements
