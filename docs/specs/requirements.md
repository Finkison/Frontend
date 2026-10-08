# Requirements Document

## Introduction

This requirements document defines the comprehensive polish and modernization of Finkison, a national EdTech platform for Ethiopian entrance exam candidates. The platform currently has 68 .tsx and 57 .ts files serving students, teachers, principals, and parents across multiple portals. The polish focuses on eliminating all mock data dependencies, establishing a professional design system, implementing robust backend integration patterns, and elevating the user experience to world-class standards comparable to College Board, Khan Academy, and Google Classroom.

The platform supports multilingual content (Amharic, Oromo, English), serves 32M youth across sciences and humanities streams (Grades 9-12), and provides AI tutoring, adaptive learning, competitive practice, exam simulation, and curriculum resources.

## Glossary

- **Platform**: The Finkison EdTech web application consisting of UI (Next.js) and API (Express + Prisma)
- **UI_Client**: The Next.js frontend application (`finkison-ui`)
- **API_Server**: The Express REST API backend (`finkison-api`)
- **OfflineDataVault**: Legacy client-side localStorage class containing seed questions and mock data (to be removed)
- **React_Query**: TanStack Query library for server state management and data fetching
- **Design_System**: Comprehensive style guide defining tokens, components, spacing, typography, and color palettes
- **Fixed_Navbar**: Non-collapsing navigation bar with consistent 56-64px height, always visible at top
- **Mega_Menu**: Large dropdown navigation panel with categorized links and rich content
- **API_Client**: Centralized HTTP client module for all backend communication
- **Loading_State**: Visual feedback pattern during asynchronous operations (skeletons, spinners, progress indicators)
- **Error_State**: Visual feedback pattern for failed operations (toast notifications, inline errors, retry mechanisms)
- **Grid_System**: 8px-based spacing and layout system for consistent visual rhythm
- **Type_Scale**: Hierarchical text sizing system using rem/px values
- **Color_Tokens**: Named design system variables for brand colors, semantic colors, and neutral scales
- **Practice_Mode**: Adaptive question delivery system with spaced repetition
- **Battle_Arena**: Real-time 1v1 competitive quiz feature with WebSocket synchronization
- **Exam_Simulator**: Timed 250-question mock entrance exam environment
- **AI_Tutor**: Conversational Socratic learning assistant with multilingual support
- **Dashboard**: Student home screen showing progress, streaks, upcoming exams, and recommendations
- **Leaderboard**: National ranking system with regional/school filters
- **Library**: Digital textbook repository with MoE-approved curriculum content
- **Performance_Insights**: Analytics dashboard with IRT-based score projections and cutoff odds
- **Zero_Data_Mode**: Offline-first architecture for low-connectivity environments (to be removed)
- **Student_Portal**: Primary learning interface for Grade 9-12 candidates
- **Teacher_Portal**: School admin console for educators and principals
- **Parent_Portal**: Guardian dashboard with SMS alerts and child progress monitoring

## Requirements

### Requirement 1: Mock Data Elimination Strategy

**User Story:** As a platform maintainer, I want all mock data and offline seed questions completely removed from the codebase, so that the application exclusively uses live backend data and provides accurate, real-time information to users.

#### Acceptance Criteria

1.1 THE Platform SHALL delete the entire `offlineVault.ts` file from `src/lib/`

1.2 THE Platform SHALL delete the entire `indexedDbVault.ts` file from `src/lib/`

1.3 THE Platform SHALL remove all import statements referencing `OfflineDataVault` across all TSX and TS files

1.4 THE Platform SHALL replace all `OfflineDataVault.getQuestions()` fallback calls with proper error handling using React Query error boundaries

1.5 THE Platform SHALL remove all `localStorage.getItem()` calls used for question caching

1.6 THE Platform SHALL remove all static `SEED_OFFLINE_QUESTIONS` arrays from component files

1.7 THE Platform SHALL delete any `mockData` or `MOCK_` prefixed constants from service files

1.8 THE Platform SHALL remove `/offline` route references from navigation components (Navbar, Footer, CommandPalette, MobileBottomNav)

1.9 THE Platform SHALL remove `offline-vault` service entries from ServiceJourneyBridge component

1.10 THE Platform SHALL replace offline fallback logic in ExamBattleArena component with loading states and error boundaries

1.11 THE Platform SHALL replace offline fallback logic in ExamSimulatorEngine component with proper data fetching patterns

1.12 THE Platform SHALL update all "zero-data offline" messaging in UI to reference live backend connectivity

---

### Requirement 2: Backend Integration Architecture

**User Story:** As a frontend developer, I want a centralized, type-safe API client with React Query integration, so that all data fetching follows consistent patterns with automatic caching, refetching, and error handling.

#### Acceptance Criteria

2.1 THE UI_Client SHALL create a unified API client module at `src/lib/api/client.ts` using native fetch with TypeScript types

2.2 THE UI_Client SHALL configure a React Query provider at the application root with staleTime of 5 minutes and cacheTime of 10 minutes

2.3 THE UI_Client SHALL implement authentication token injection in API client request interceptors

2.4 THE UI_Client SHALL implement automatic token refresh logic when receiving 401 responses

2.5 THE UI_Client SHALL create typed query hooks for all API endpoints (useQuestions, useExams, useUserProfile, useBattleRooms, etc.)

2.6 THE UI_Client SHALL implement optimistic updates for mutation operations (submit answer, create battle, update profile)

2.7 THE UI_Client SHALL configure query retry logic with exponential backoff (max 3 retries)

2.8 THE UI_Client SHALL implement request deduplication to prevent duplicate concurrent requests

2.9 THE UI_Client SHALL create error transformation utilities to convert API errors into user-friendly messages

2.10 THE UI_Client SHALL implement query invalidation patterns after successful mutations

2.11 THE UI_Client SHALL create prefetching logic for anticipated navigation (prefetch exam questions on dashboard)

2.12 THE UI_Client SHALL implement pagination support for list endpoints using cursor-based or offset-based strategies

2.13 THE API_Server SHALL return consistent error response format with statusCode, message, and optional details object

2.14 THE API_Server SHALL implement CORS configuration allowing UI_Client origin with credentials

2.15 THE API_Server SHALL implement request validation using Zod schemas for all POST/PUT endpoints

---

### Requirement 3: Responsive Design System Foundation

**User Story:** As a UI designer, I want a comprehensive design system with tokens and guidelines, so that all pages maintain visual consistency and scale gracefully across devices.

#### Acceptance Criteria

3.1 THE Design_System SHALL define an 8px grid system where all spacing values are multiples of 8 (8px, 16px, 24px, 32px, 40px, 48px, 64px)

3.2 THE Design_System SHALL define a type scale with base font size 16px and sizes: xs(12px), sm(14px), base(16px), lg(18px), xl(20px), 2xl(24px), 3xl(30px), 4xl(36px)

3.3 THE Design_System SHALL define primary color tokens: brand-primary (#F59E0B amber), brand-secondary (#06B6D4 cyan), brand-accent (#10B981 emerald)

3.4 THE Design_System SHALL define semantic color tokens: success (#10B981), warning (#F59E0B), error (#EF4444), info (#3B82F6)

3.5 THE Design_System SHALL define neutral color scale: slate-50 through slate-950 with 100-step increments

3.6 THE Design_System SHALL define background colors: bg-primary (#001726), bg-secondary (#002238), bg-tertiary (#00334A)

3.7 THE Design_System SHALL define border radius tokens: sm(4px), DEFAULT(8px), lg(12px), xl(16px), 2xl(24px), full(9999px)

3.8 THE Design_System SHALL define shadow tokens: sm, DEFAULT, md, lg, xl, 2xl with appropriate blur and opacity values

3.9 THE Design_System SHALL define transition duration tokens: fast(150ms), DEFAULT(200ms), slow(300ms), slower(500ms)

3.10 THE Design_System SHALL define breakpoint tokens: sm(640px), md(768px), lg(1024px), xl(1280px), 2xl(1536px)

3.11 THE Design_System SHALL define z-index scale: dropdown(1000), sticky(1020), fixed(1030), modal-backdrop(1040), modal(1050), popover(1060), tooltip(1070)

3.12 THE Design_System SHALL document component patterns in `/docs/design-system.md` with visual examples

3.13 THE Design_System SHALL define button variants: primary, secondary, outline, ghost, danger with hover and active states

3.14 THE Design_System SHALL define input component styling with focus rings, error states, and disabled states

3.15 THE Design_System SHALL define card component structure with header, body, and footer sections

---

### Requirement 4: Fixed Professional Navigation

**User Story:** As a user, I want a fixed professional navigation bar that never collapses, so that I can access key features instantly without scrolling or menu toggling.

#### Acceptance Criteria

4.1 THE Fixed_Navbar SHALL maintain a fixed height between 56px and 64px at all viewport sizes

4.2 THE Fixed_Navbar SHALL use `position: sticky` with `top: 0` and `z-index: 1030`

4.3 THE Fixed_Navbar SHALL display full navigation links on viewports 1024px and wider (lg breakpoint)

4.4 THE Fixed_Navbar SHALL display hamburger menu icon on viewports below 1024px

4.5 THE Fixed_Navbar SHALL render mega menus for "Learn" and "Compete" categories with 500ms hover delay

4.6 WHEN a user hovers over a mega menu trigger, THE Fixed_Navbar SHALL display the mega menu panel below the navigation bar

4.7 WHEN a user moves mouse outside mega menu boundaries, THE Fixed_Navbar SHALL close the mega menu after 180ms grace period

4.8 THE Fixed_Navbar SHALL display workspace context chip showing user role and grade/school information

4.9 THE Fixed_Navbar SHALL display search icon button that opens command palette on click

4.10 THE Fixed_Navbar SHALL display account dropdown menu with profile, settings, and logout options

4.11 THE Fixed_Navbar SHALL highlight active navigation item matching current route with border and background color

4.12 THE Fixed_Navbar SHALL display role-specific navigation items (Student: Home/Learn/Progress/Compete/Resources/Get Help)

4.13 THE Fixed_Navbar SHALL display role-specific navigation items (Teacher: Home/My Classes/Insights/Content Library/Assessments/Professional)

4.14 THE Fixed_Navbar SHALL display role-specific navigation items (Parent: Home/My Children/Progress Reports/Alerts/Admissions/Support)

4.15 THE Fixed_Navbar SHALL include brand logo linking to home page with gradient border effect on hover

4.16 THE Mega_Menu SHALL render in a panel with minimum width 32rem and maximum width 40rem

4.17 THE Mega_Menu SHALL display category headers with icons using 10px uppercase font-mono font

4.18 THE Mega_Menu SHALL display menu items in a two-column grid with proper spacing

4.19 THE Mega_Menu SHALL render menu item icons in colored background circles with hover scale effect

4.20 THE Mega_Menu SHALL close when user clicks outside boundaries or presses Escape key

4.21 THE Mega_Menu SHALL include "Recommended for You" personalization section when displaying Learn mega menu

---

### Requirement 5: Navigation Mega Menu Content Structure

**User Story:** As a user, I want intuitive mega menus that organize learning paths and competitive features with personalized recommendations, so that I can quickly discover relevant content.

#### Acceptance Criteria

5.1 THE Fixed_Navbar SHALL display "Learn" mega menu containing categorized links for Sciences and Humanities streams

5.2 THE Fixed_Navbar SHALL display "Learn" mega menu with "Recommended for You" section showing 3 personalized unit suggestions

5.3 THE Fixed_Navbar SHALL display "Learn" mega menu with Sciences category containing links to Biology, Chemistry, Physics, and Mathematics

5.4 THE Fixed_Navbar SHALL display "Learn" mega menu with Humanities category containing links to History, Geography, Civics, and Economics

5.5 THE Fixed_Navbar SHALL display "Compete" mega menu containing links for Quick Match, Tournaments, and Rankings

5.6 THE Fixed_Navbar SHALL display "Progress" dropdown menu containing links to Analytics, Study History, and Achievements

5.7 THE Fixed_Navbar SHALL display "Resources" dropdown menu containing links to Textbooks, Video Lessons, and Study Guides

5.8 THE Fixed_Navbar SHALL display "Get Help" dropdown menu containing links to AI Tutor, FAQs, and Contact Support

5.9 THE Mega_Menu SHALL render recommendation items with progress indicators showing completion percentage

5.10 THE Mega_Menu SHALL update "Recommended for You" content based on user's weak units and learning history

---

### Requirement 6: Loading and Error State Patterns

**User Story:** As a user, I want clear visual feedback during loading and error conditions, so that I understand system status and can take appropriate actions.

#### Acceptance Criteria

6.1 THE Loading_State SHALL display skeleton loaders matching content structure for list views

6.2 THE Loading_State SHALL display centered spinner with descriptive text for full-page loads

6.3 THE Loading_State SHALL display inline spinner adjacent to action buttons for mutation operations

6.4 THE Loading_State SHALL display progress bar for multi-step operations (exam submission, file upload)

6.5 THE Loading_State SHALL disable interactive elements during mutation to prevent duplicate submissions

6.6 THE Error_State SHALL display toast notifications for non-critical errors with 4-second auto-dismiss

6.7 THE Error_State SHALL display inline error messages below form inputs with red text and error icon

6.8 THE Error_State SHALL display error boundary fallback UI for React component errors with retry button

6.9 THE Error_State SHALL display empty state illustrations with helpful text when lists contain zero items

6.10 WHEN a network request fails, THE Error_State SHALL display retry button with exponential backoff indicator

6.11 WHEN authentication token expires, THE Error_State SHALL redirect to login page after displaying session timeout message

6.12 WHEN API returns validation errors, THE Error_State SHALL display field-specific error messages in forms

6.13 THE Loading_State SHALL use React Query's `isLoading`, `isFetching`, and `isRefetching` states appropriately

6.14 THE Loading_State SHALL show shimmer animation effect on skeleton loaders

6.15 THE Error_State SHALL log detailed error information to console while showing user-friendly messages in UI

---

### Requirement 7: Home Page Polish

**User Story:** As a student, I want a polished home page that shows my progress, streaks, recommendations, and upcoming exams, so that I can quickly understand my learning status and next actions.

#### Acceptance Criteria

7.1 THE Dashboard SHALL display greeting card with user name, grade, stream, and current date

7.2 THE Dashboard SHALL display streak counter showing consecutive days logged in with fire icon animation

7.3 THE Dashboard SHALL display progress card showing questions answered this week with percentage increase indicator

7.4 THE Dashboard SHALL display upcoming exam countdown card with days remaining and CTA button

7.5 THE Dashboard SHALL display performance chart showing score trends over last 30 days using line chart

7.6 THE Dashboard SHALL display subject strength radar chart showing proficiency across 6 core subjects

7.7 THE Dashboard SHALL display "Continue Learning" section with 3 recommended question sets based on weak units

7.8 THE Dashboard SHALL display "Recent Activity" timeline showing last 5 practice sessions with timestamps

7.9 THE Dashboard SHALL display leaderboard preview card showing user rank and top 3 competitors

7.10 THE Dashboard SHALL display quick action buttons for Learn, Get Help, Compete, and Full-Length Practice Test

7.11 THE Dashboard SHALL use 24px vertical spacing between major sections following grid system

7.12 THE Dashboard SHALL fetch all data using React Query hooks with loading skeletons

7.13 THE Dashboard SHALL display empty states with illustrations when user has zero activity

7.14 THE Dashboard SHALL refresh data automatically every 60 seconds when tab is active

7.15 THE Dashboard SHALL be fully responsive collapsing to single column below md breakpoint

---

### Requirement 8: Practice Session Polish

**User Story:** As a student, I want a polished practice interface with smooth question transitions, real-time feedback, and progress tracking, so that I can efficiently practice questions.

#### Acceptance Criteria

8.1 THE Practice_Mode SHALL display question counter in format "Question 5 of 20" at top of screen

8.2 THE Practice_Mode SHALL display subject badge, difficulty badge, and unit indicator for each question

8.3 THE Practice_Mode SHALL render question text with proper typography and math formula support using KaTeX

8.4 THE Practice_Mode SHALL display 4 option buttons in a 2x2 grid on desktop and vertical stack on mobile

8.5 WHEN a user selects an answer, THE Practice_Mode SHALL disable all option buttons immediately

8.6 WHEN a user selects an answer, THE Practice_Mode SHALL highlight correct answer in green and incorrect selection in red

8.7 WHEN a user selects an answer, THE Practice_Mode SHALL display explanation panel below options with multilingual tabs (En/Am/Or)

8.8 THE Practice_Mode SHALL display "Next Question" button after answer submission with keyboard shortcut (Enter or →)

8.9 THE Practice_Mode SHALL display "View Progress" button as secondary action after answer submission

8.10 THE Practice_Mode SHALL display progress bar at top showing completion percentage

8.11 THE Practice_Mode SHALL display timer showing elapsed time in MM:SS format (optional)

8.12 THE Practice_Mode SHALL save answer to backend using React Query mutation with optimistic update

8.13 THE Practice_Mode SHALL display toast notification on mutation error with retry option

8.14 THE Practice_Mode SHALL preload next 3 questions in background for instant transitions

8.15 THE Practice_Mode SHALL display summary screen after completing all questions with score, time, and weak units

---

### Requirement 9: Get Help Chat Interface Polish

**User Story:** As a student, I want a polished AI tutor chat interface with smooth message rendering, typing indicators, and multilingual support, so that I can get help understanding difficult concepts.

#### Acceptance Criteria

9.1 THE AI_Tutor SHALL display chat interface with fixed message input at bottom and scrollable message area

9.2 THE AI_Tutor SHALL display welcome message with example prompts when chat is empty

9.3 THE AI_Tutor SHALL display user messages with right alignment and different background color from assistant messages

9.4 THE AI_Tutor SHALL display assistant messages with left alignment and avatar icon

9.5 THE AI_Tutor SHALL display typing indicator (three animated dots) when waiting for assistant response

9.6 THE AI_Tutor SHALL render markdown formatting in assistant messages including bold, italic, lists, and code blocks

9.7 THE AI_Tutor SHALL render mathematical expressions using KaTeX notation

9.8 THE AI_Tutor SHALL display language selector toggle for Amharic, Oromo, and English at top of interface

9.9 THE AI_Tutor SHALL display "Clear Chat" button that resets conversation after confirmation

9.10 THE AI_Tutor SHALL auto-scroll to latest message when new message arrives

9.11 THE AI_Tutor SHALL display "Copy" button on hover over assistant messages

9.12 THE AI_Tutor SHALL disable send button and input field while request is pending

9.13 THE AI_Tutor SHALL display error message inline when API request fails with retry button

9.14 THE AI_Tutor SHALL store conversation history in React Query cache with 10-minute staleTime

9.15 THE AI_Tutor SHALL display character count indicator showing "0/1000" below input field

---

### Requirement 10: Compete Real-Time Experience Polish

**User Story:** As a student, I want a polished competitive arena with smooth real-time synchronization, score animations, and victory celebrations, so that competitive practice feels exciting and engaging.

#### Acceptance Criteria

10.1 THE Battle_Arena SHALL display matchmaking screen with animated spinner while finding opponent

10.2 THE Battle_Arena SHALL display "opponent found" animation with both player names and avatars

10.3 THE Battle_Arena SHALL display countdown timer (3...2...1...GO!) before battle starts

10.4 THE Battle_Arena SHALL display side-by-side score cards showing both players' scores in real-time

10.5 THE Battle_Arena SHALL display round timer as circular progress indicator counting down from 30 seconds

10.6 THE Battle_Arena SHALL display question number and total rounds (Round 3 of 10)

10.7 WHEN a user selects an answer, THE Battle_Arena SHALL show immediate visual feedback before opponent responds

10.8 WHEN both players answer, THE Battle_Arena SHALL display result overlay showing correct answer and points awarded

10.9 WHEN round ends, THE Battle_Arena SHALL transition to next question with 2-second delay and transition animation

10.10 THE Battle_Arena SHALL display "waiting for opponent" overlay if other player is slower

10.11 WHEN battle completes, THE Battle_Arena SHALL display victory screen with confetti animation for winner

10.12 WHEN battle completes, THE Battle_Arena SHALL display final score summary with accuracy percentage

10.13 THE Battle_Arena SHALL display "Find Match" and "Return to Home" buttons after battle ends

10.14 THE Battle_Arena SHALL handle WebSocket disconnection with automatic reconnection attempt

10.15 THE Battle_Arena SHALL display connection status indicator (connected/reconnecting) in top corner

---

### Requirement 11: Full-Length Practice Test Experience Polish

**User Story:** As a student, I want a polished exam simulator that replicates the real national exam experience with timed sections, question navigation, and professional styling, so that I can practice under realistic conditions.

#### Acceptance Criteria

11.1 THE Exam_Simulator SHALL display exam information screen with instructions, duration, and question count before starting

11.2 THE Exam_Simulator SHALL display "Start Test" button that enters full-screen mode and begins timer

11.3 THE Exam_Simulator SHALL display persistent header with timer, question counter, and flag counter

11.4 THE Exam_Simulator SHALL display timer in HH:MM:SS format counting down from total exam duration (4 hours)

11.5 WHEN timer reaches 10 minutes remaining, THE Exam_Simulator SHALL change timer color to red

11.6 THE Exam_Simulator SHALL display question navigation sidebar showing numbered buttons for all 250 questions

11.7 THE Exam_Simulator SHALL use color coding in navigation sidebar (unanswered: gray, answered: blue, flagged: yellow)

11.8 THE Exam_Simulator SHALL display current question with subject badge and topic label

11.9 THE Exam_Simulator SHALL display 4 option buttons in vertical list with radio button styling

11.10 THE Exam_Simulator SHALL display "Previous" and "Next" navigation buttons below options

11.11 THE Exam_Simulator SHALL display "Flag for Review" button that toggles yellow flag icon

11.12 THE Exam_Simulator SHALL save answer to backend automatically using debounced React Query mutation

11.13 THE Exam_Simulator SHALL display "Review & Submit" button when user reaches last question

11.14 THE Exam_Simulator SHALL display review screen showing answered/flagged/unanswered counts with grid of question numbers

11.15 WHEN user clicks "Submit Test", THE Exam_Simulator SHALL display confirmation modal with warning about finality

11.16 WHEN exam is submitted, THE Exam_Simulator SHALL exit full-screen and navigate to results page

11.17 THE Exam_Simulator SHALL handle timer expiration by auto-submitting exam

11.18 THE Exam_Simulator SHALL display "Exit Test" button in header that warns about losing progress

---

### Requirement 12: Resources Browser Polish

**User Story:** As a student, I want a polished resources interface to browse textbooks by grade and subject with search and filtering, so that I can easily find relevant curriculum materials.

#### Acceptance Criteria

12.1 THE Library SHALL display filter sidebar with grade selector (9, 10, 11, 12)

12.2 THE Library SHALL display filter sidebar with stream selector (Sciences, Humanities)

12.3 THE Library SHALL display filter sidebar with subject checkboxes for all subjects

12.4 THE Library SHALL display search input at top with debounced text search

12.5 THE Library SHALL display textbook grid with 3 columns on desktop, 2 on tablet, 1 on mobile

12.6 THE Library SHALL display textbook cards with cover image, title, subject badge, and grade indicator

12.7 THE Library SHALL display textbook cards with "View" button that opens PDF viewer or content page

12.8 THE Library SHALL display textbook cards with "Download" button that initiates PDF download

12.9 THE Library SHALL display textbook cards with bookmark icon button that toggles saved state

12.10 THE Library SHALL fetch textbooks using React Query with filters as query keys

12.11 THE Library SHALL display skeleton loaders during initial load

12.12 THE Library SHALL display "No textbooks found" empty state with illustration when filters return zero results

12.13 THE Library SHALL display result count text showing "Showing 12 of 45 textbooks"

12.14 THE Library SHALL implement infinite scroll loading more textbooks as user scrolls

12.15 THE Library SHALL highlight active filters with colored badges

---

### Requirement 13: Rankings Polish

**User Story:** As a student, I want a polished leaderboard showing my rank and top performers with filtering options, so that I can see how I compare to peers and stay motivated.

#### Acceptance Criteria

13.1 THE Leaderboard SHALL display current user rank card at top with highlighted background

13.2 THE Leaderboard SHALL display user rank card with position number, name, avatar, points, and accuracy percentage

13.3 THE Leaderboard SHALL display filter tabs for "National", "Regional", "School" scopes

13.4 THE Leaderboard SHALL display filter dropdown for time period (This Week, This Month, All Time)

13.5 THE Leaderboard SHALL display top 3 positions with enlarged cards and medals (gold, silver, bronze icons)

13.6 THE Leaderboard SHALL display positions 4-100 in a scrollable table with rank, name, avatar, points, and accuracy

13.7 THE Leaderboard SHALL display user avatar placeholder with colored background and initials when image unavailable

13.8 THE Leaderboard SHALL highlight current user row in table with subtle background color

13.9 THE Leaderboard SHALL display position change indicator (↑ +5 or ↓ -3) showing change from previous period

13.10 THE Leaderboard SHALL fetch rankings using React Query with scope and period as query keys

13.11 THE Leaderboard SHALL display skeleton loaders during data fetch

13.12 THE Leaderboard SHALL implement pagination with "Load More" button at bottom

13.13 THE Leaderboard SHALL display "Not yet ranked" state when user has insufficient activity

13.14 THE Leaderboard SHALL display refresh button that invalidates query and refetches data

13.15 THE Leaderboard SHALL display timestamp showing last update time

---

### Requirement 14: Progress Analytics Polish

**User Story:** As a student, I want polished performance analytics with interactive charts showing my progress and cutoff projections, so that I can understand my readiness for entrance exams.

#### Acceptance Criteria

14.1 THE Performance_Insights SHALL display summary cards showing total questions answered, average score, and study time

14.2 THE Performance_Insights SHALL display subject breakdown bar chart with scores per subject

14.3 THE Performance_Insights SHALL display score trend line chart showing performance over last 90 days

14.4 THE Performance_Insights SHALL display heatmap calendar showing activity days with color intensity based on question count

14.5 THE Performance_Insights SHALL display weak units list ranked by error rate with remedial practice links

14.6 THE Performance_Insights SHALL display cutoff projection card with IRT-based predicted score and confidence interval

14.7 THE Performance_Insights SHALL display university admission probability gauges for top 3 target universities

14.8 THE Performance_Insights SHALL use interactive chart library (Recharts or Chart.js) with hover tooltips

14.9 THE Performance_Insights SHALL display date range selector for filtering analytics by time period

14.10 THE Performance_Insights SHALL fetch analytics data using React Query with date range as query key

14.11 THE Performance_Insights SHALL display export button that downloads analytics report as PDF

14.12 THE Performance_Insights SHALL be fully responsive with chart aspect ratios adjusting for mobile

14.13 THE Performance_Insights SHALL display loading skeletons matching chart dimensions during fetch

14.14 THE Performance_Insights SHALL display empty state when user has zero activity data

14.15 THE Performance_Insights SHALL refresh data automatically when user completes new practice session

---

### Requirement 15: Page-Specific Consistency Standards

**User Story:** As a UI maintainer, I want consistent spacing, typography, and component usage across all pages, so that the platform feels cohesive and professional.

#### Acceptance Criteria

15.1 THE Platform SHALL use consistent page layout wrapper with max-width 1280px (xl breakpoint) and horizontal padding

15.2 THE Platform SHALL use consistent page header pattern with title (3xl font), subtitle, and action buttons

15.3 THE Platform SHALL use 32px vertical spacing between page header and main content

15.4 THE Platform SHALL use 24px vertical spacing between major content sections

15.5 THE Platform SHALL use 16px vertical spacing between related content items

15.6 THE Platform SHALL use consistent card component with 16px padding, rounded-xl borders, and subtle shadow

15.7 THE Platform SHALL use consistent button sizing (sm: 32px height, DEFAULT: 40px height, lg: 48px height)

15.8 THE Platform SHALL use consistent input field sizing matching button heights

15.9 THE Platform SHALL use consistent icon sizing (sm: 16px, DEFAULT: 20px, lg: 24px)

15.10 THE Platform SHALL use consistent badge component with sm rounded corners and uppercase 10px font

15.11 THE Platform SHALL use consistent heading hierarchy (h1: 36px, h2: 30px, h3: 24px, h4: 20px)

15.12 THE Platform SHALL use consistent body text sizing (14px for secondary text, 16px for primary)

15.13 THE Platform SHALL use consistent link styling with underline on hover and color transition

15.14 THE Platform SHALL use consistent modal backdrop with rgba(0, 0, 0, 0.5) overlay

15.15 THE Platform SHALL use consistent focus ring styling with 2px blue-500 outline offset 2px

---

### Requirement 16: Mobile Responsive Experience

**User Story:** As a mobile user, I want all pages to be fully functional and visually optimized on my smartphone, so that I can use Finkison effectively on any device.

#### Acceptance Criteria

16.1 THE Platform SHALL render Fixed_Navbar as mobile bottom navigation bar on viewports below lg breakpoint

16.2 THE Platform SHALL display 5 primary navigation items in mobile bottom nav (Home, Learn, Compete, Progress, More)

16.3 THE Platform SHALL display "More" item in bottom nav that opens overlay menu with additional links

16.4 THE Platform SHALL collapse multi-column layouts to single column below md breakpoint

16.5 THE Platform SHALL increase touch target sizes to minimum 44x44px on mobile

16.6 THE Platform SHALL stack filter sidebars above content on mobile instead of side-by-side

16.7 THE Platform SHALL convert desktop mega menus to mobile accordion menus

16.8 THE Platform SHALL display mobile hamburger menu icon that opens full-screen navigation overlay

16.9 THE Platform SHALL hide non-essential UI elements on mobile (detailed timestamps, secondary badges)

16.10 THE Platform SHALL use mobile-optimized chart renderings with simplified axes and labels

16.11 THE Platform SHALL implement swipe gestures for question navigation in Practice_Mode and Exam_Simulator

16.12 THE Platform SHALL display mobile-optimized spacing using 16px instead of 24px for major sections

16.13 THE Platform SHALL test all interactions on iOS Safari and Android Chrome for compatibility

16.14 THE Platform SHALL ensure text remains readable without horizontal scrolling at 375px viewport width

16.15 THE Platform SHALL implement mobile-friendly date pickers and select dropdowns using native controls

---

### Requirement 17: Authentication and Authorization Polish

**User Story:** As a user, I want secure authentication with clear login/logout flows and role-based access control, so that my data is protected and I only see features relevant to my role.

#### Acceptance Criteria

17.1 THE Platform SHALL display login form with email and password inputs using proper input types

17.2 THE Platform SHALL display "Show/Hide Password" toggle icon in password input field

17.3 THE Platform SHALL display "Remember Me" checkbox below password field

17.4 THE Platform SHALL display "Forgot Password?" link below login form

17.5 THE Platform SHALL display loading spinner on login button during authentication request

17.6 THE Platform SHALL display field-specific error messages below inputs when validation fails

17.7 THE Platform SHALL redirect to home page after successful login

17.8 THE Platform SHALL store authentication token in httpOnly secure cookie

17.9 THE Platform SHALL implement automatic token refresh before expiration using refresh token

17.10 THE Platform SHALL display session timeout warning modal 2 minutes before token expiration

17.11 THE Platform SHALL redirect to login page when token expires with redirect_url query parameter

17.12 THE Platform SHALL implement role-based route guards that check user.role before rendering protected pages

17.13 THE Platform SHALL display 403 Forbidden page when user attempts to access unauthorized route

17.14 THE Platform SHALL display logout confirmation modal when user clicks logout button

17.15 THE Platform SHALL clear all authentication state and redirect to landing page after logout

---

### Requirement 18: Form Validation and User Input Polish

**User Story:** As a user, I want clear, real-time validation feedback on all forms, so that I understand input requirements and can correct errors quickly.

#### Acceptance Criteria

18.1 THE Platform SHALL display required field indicators (asterisk *) next to input labels

18.2 THE Platform SHALL display character count indicators for text inputs with max length constraints

18.3 THE Platform SHALL validate email format and display error message for invalid emails

18.4 THE Platform SHALL validate password strength and display strength meter (weak/medium/strong)

18.5 THE Platform SHALL display inline validation errors immediately after blur event

18.6 THE Platform SHALL display success checkmark icon in input field when validation passes

18.7 THE Platform SHALL disable submit buttons until all required fields pass validation

18.8 THE Platform SHALL display form-level error summary at top when submission fails

18.9 THE Platform SHALL scroll to first error field when form submission fails

18.10 THE Platform SHALL display confirmation message after successful form submission

18.11 THE Platform SHALL implement debounced validation for expensive checks (username availability)

18.12 THE Platform SHALL display helpful hint text below inputs explaining format requirements

18.13 THE Platform SHALL prevent form submission when Enter key is pressed on single-line inputs

18.14 THE Platform SHALL display unsaved changes warning when user navigates away from dirty form

18.15 THE Platform SHALL implement client-side validation matching server-side Zod schemas

---

### Requirement 19: Accessibility Compliance

**User Story:** As a user with accessibility needs, I want the platform to follow WCAG 2.1 AA standards, so that I can navigate and use all features with assistive technologies.

#### Acceptance Criteria

19.1 THE Platform SHALL use semantic HTML elements (nav, main, article, section, aside) for document structure

19.2 THE Platform SHALL provide alt text for all informational images

19.3 THE Platform SHALL use aria-label attributes for icon-only buttons

19.4 THE Platform SHALL implement keyboard navigation for all interactive elements with visible focus indicators

19.5 THE Platform SHALL maintain 4.5:1 color contrast ratio for normal text and 3:1 for large text

19.6 THE Platform SHALL use aria-live regions for dynamic content updates (toast notifications, live scores)

19.7 THE Platform SHALL implement skip navigation link as first focusable element

19.8 THE Platform SHALL use aria-expanded attribute for collapsible sections and dropdowns

19.9 THE Platform SHALL associate form labels with inputs using for attribute or aria-labelledby

19.10 THE Platform SHALL implement aria-describedby for error messages and hint text

19.11 THE Platform SHALL ensure modal dialogs trap focus within modal boundaries

19.12 THE Platform SHALL return focus to trigger element when modal closes

19.13 THE Platform SHALL use role="button" for clickable divs and aria-pressed for toggle buttons

19.14 THE Platform SHALL provide screen reader announcements for page navigation using aria-live

19.15 THE Platform SHALL test with screen reader software (NVDA, JAWS, VoiceOver) for major user flows

---

### Requirement 20: Performance Optimization

**User Story:** As a user, I want fast page loads and smooth interactions, so that I can navigate the platform without frustrating delays.

#### Acceptance Criteria

20.1 THE Platform SHALL achieve Lighthouse performance score above 90 for production builds

20.2 THE Platform SHALL implement code splitting at route level using Next.js dynamic imports

20.3 THE Platform SHALL lazy load images below the fold using native loading="lazy" attribute

20.4 THE Platform SHALL implement React.memo for expensive list item components

20.5 THE Platform SHALL use React Query's staleWhileRevalidate strategy to serve cached data instantly

20.6 THE Platform SHALL implement virtual scrolling for lists exceeding 100 items

20.7 THE Platform SHALL compress images to WebP format with quality 85

20.8 THE Platform SHALL minify and bundle CSS using Tailwind purge in production

20.9 THE Platform SHALL preload critical fonts using <link rel="preload">

20.10 THE Platform SHALL implement service worker for offline page caching (optional enhancement)

20.11 THE Platform SHALL defer non-critical JavaScript loading using Next.js Script component

20.12 THE Platform SHALL implement request debouncing for search inputs (300ms delay)

20.13 THE Platform SHALL limit re-renders using useMemo and useCallback hooks appropriately

20.14 THE Platform SHALL compress API responses using gzip encoding

20.15 THE Platform SHALL implement CDN caching for static assets with far-future expiration headers

---

### Requirement 21: Deployment and Environment Configuration

**User Story:** As a DevOps engineer, I want clear environment configuration and deployment procedures, so that I can deploy the platform reliably across development, staging, and production environments.

#### Acceptance Criteria

21.1 THE Platform SHALL use `.env.local` for local development environment variables

21.2 THE Platform SHALL use `.env.production` for production environment variables

21.3 THE Platform SHALL define NEXT_PUBLIC_API_URL environment variable for API base URL

21.4 THE Platform SHALL define NEXT_PUBLIC_WS_URL environment variable for WebSocket URL

21.5 THE Platform SHALL define API_SECRET_KEY environment variable for JWT signing

21.6 THE Platform SHALL define DATABASE_URL environment variable for Prisma connection

21.7 THE Platform SHALL document all environment variables in `.env.example` with descriptions

21.8 THE Platform SHALL validate required environment variables at application startup

21.9 THE Platform SHALL implement health check endpoint at `/api/health` returning status 200

21.10 THE Platform SHALL implement graceful shutdown handling for API server

21.11 THE Platform SHALL log application errors to external logging service (optional)

21.12 THE Platform SHALL implement error tracking using Sentry or similar service (optional)

21.13 THE Platform SHALL generate source maps for production debugging with restricted access

21.14 THE Platform SHALL implement database migration scripts using Prisma migrate

21.15 THE Platform SHALL document deployment steps in `DEPLOYMENT.md` file

