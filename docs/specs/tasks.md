# Implementation Plan: Finkison Platform Polish

## Overview

This implementation plan transforms the Finkison EdTech platform by eliminating all mock data dependencies, establishing a professional design system with Tailwind CSS 4, implementing robust backend integration with React Query, and polishing all pages to world-class standards. The plan follows a phased approach covering 10 major implementation areas across the Next.js frontend.

## Tasks

- [x] 1. Foundation Setup - Design System & Build Configuration
  - Create design tokens file at `src/lib/design-system/tokens.ts` with spacing, typography, colors, borders, shadows, transitions, and z-index scales
  - Update `tailwind.config.ts` to extend theme with design tokens
  - Install required dependencies: `@tanstack/react-query`, `@tanstack/react-query-devtools`, `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react`, `katex`, `recharts`
  - Create utility function at `src/lib/utils.ts` for `cn()` className merging using clsx and tailwind-merge
  - Create providers file at `src/app/providers.tsx` with QueryClientProvider setup
  - Update root layout at `src/app/layout.tsx` to wrap children with Providers component
  - _Requirements: 3.1-3.15, 2.2_

- [x] 2. Mock Data Elimination Phase
  - [x] 2.1 Delete offline data infrastructure files
    - Delete `src/lib/offlineVault.ts` file completely
    - Delete `src/lib/indexedDbVault.ts` file completely  
    - Remove any `mockData.ts` or `MOCK_` prefixed constant files from `src/data/` directory
    - _Requirements: 1.1, 1.2, 1.7_

  - [x] 2.2 Remove offline fallback logic from Practice Mode
    - Search for all `OfflineDataVault` imports in practice-related components (`src/app/adaptive-learning/`, `src/components/practice/`)
    - Remove fallback calls to `OfflineDataVault.getQuestions()` 
    - Replace with proper error boundaries and loading states using React Query patterns
    - Remove `localStorage.getItem()` calls for question caching
    - _Requirements: 1.3, 1.4, 1.5_

  - [x] 2.3 Remove offline fallback logic from Exam Simulator
    - Search for offline fallbacks in `src/app/exam-simulation/` and `src/components/exam/`
    - Remove static `SEED_OFFLINE_QUESTIONS` arrays
    - Replace with React Query data fetching patterns
    - _Requirements: 1.6, 1.11_

  - [x] 2.4 Remove offline fallback logic from Battle Arena
    - Search for offline fallbacks in `src/app/battle/` and `src/components/battle/`
    - Remove mock battle data and replace with WebSocket + React Query patterns
    - _Requirements: 1.10_

  - [x] 2.5 Clean up navigation and routing references
    - Remove `/offline` route references from Navbar component
    - Remove offline-related links from Footer component  
    - Remove offline entries from CommandPalette if present
    - Remove offline service entries from ServiceJourneyBridge component
    - Update all "zero-data offline" UI messaging to reference live backend connectivity
    - _Requirements: 1.8, 1.9, 1.12_

- [x] 3. API Client Infrastructure
  - [x] 3.1 Create core API client module
    - Create `src/lib/api/client.ts` with fetch-based API client
    - Implement request interceptor for auth token injection using `getAuthToken()` helper
    - Implement response interceptor for error transformation and 401 handling
    - Implement automatic token refresh logic with retry on 401 responses
    - Define TypeScript interfaces for APIError and APIResponse types
    - Export convenience methods: `api.get()`, `api.post()`, `api.put()`, `api.patch()`, `api.delete()`
    - _Requirements: 2.1, 2.3, 2.4, 2.9_

  - [x] 3.2 Configure React Query provider
    - Create `src/lib/api/query-client.ts` with QueryClient configuration
    - Set staleTime to 5 minutes and gcTime to 10 minutes
    - Configure retry logic with exponential backoff (max 3 retries)
    - Set refetchOnWindowFocus to false and refetchOnReconnect to true
    - _Requirements: 2.2, 2.7_

  - [x] 3.3 Create authentication helpers
    - Create `src/lib/auth.ts` with `getAuthToken()`, `setAuthToken()`, `refreshAuthToken()`, `clearAuthToken()` functions
    - Implement session timeout detection and redirect logic
    - Store tokens in httpOnly cookies where possible, with fallback to secure localStorage
    - _Requirements: 2.4, 16.8, 16.9_

- [x] 4. Base UI Component Library
  - [x] 4.1 Create Button component
    - Create `src/components/ui/Button.tsx` with CVA variants (primary, secondary, outline, ghost, danger)
    - Implement size variants (sm: 32px, default: 40px, lg: 48px)
    - Add isLoading prop with spinner animation
    - Add focus ring styling with 2px blue-500 outline
    - _Requirements: 3.13, 14.7_

  - [x] 4.2 Create Card component
    - Create `src/components/ui/Card.tsx` with Card, CardHeader, CardTitle, CardContent, CardFooter exports
    - Use 16px padding, rounded-xl borders, and shadow-default
    - _Requirements: 14.6_

  - [x] 4.3 Create Input component
    - Create `src/components/ui/Input.tsx` with error state support
    - Implement 40px height matching button default size
    - Add focus ring with 2px blue-500 outline offset 2px
    - Support error prop to display red border and error icon
    - Support helperText prop for error messages or hints
    - _Requirements: 3.14, 14.8, 14.15, 17.5, 17.6_

  - [x] 4.4 Create Badge component
    - Create `src/components/ui/Badge.tsx` with variants for subjects, difficulty, status
    - Use sm rounded corners and uppercase 10px font-mono font
    - _Requirements: 14.10_

  - [x] 4.5 Create loading state components
    - Create `src/components/ui/Spinner.tsx` with inline and centered variants
    - Create `src/components/ui/SkeletonLoader.tsx` for list item skeletons with shimmer animation
    - Create `src/components/ui/ProgressBar.tsx` for multi-step operations
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.14_

  - [x] 4.6 Create error state components
    - Create `src/components/ui/Toast.tsx` for non-critical error notifications with 4-second auto-dismiss
    - Create `src/components/ui/ErrorBoundary.tsx` for React component errors with retry button
    - Create `src/components/ui/EmptyState.tsx` with illustration support for zero-item lists
    - _Requirements: 5.6, 5.8, 5.9_

- [x] 5. React Query Hooks - Data Fetching Layer
  - [x] 5.1 Create questions data hooks
    - Create `src/lib/api/hooks/useQuestions.ts` with query key factory pattern
    - Implement `useQuestions(filters)` hook for fetching question lists
    - Implement `useQuestion(id)` hook for single question fetch
    - Implement `useSubmitAnswer()` mutation with optimistic update
    - Implement `usePrefetchQuestion(id)` for background preloading
    - _Requirements: 2.5, 2.6, 2.10, 2.11, 7.12, 7.14_

  - [x] 5.2 Create user profile data hooks
    - Create `src/lib/api/hooks/useUserProfile.ts`
    - Implement `useUserProfile()` query hook
    - Implement `useUpdateProfile()` mutation with optimistic updates
    - Include rollback logic on error using onMutate/onError pattern
    - _Requirements: 2.5, 2.6, 2.10_

  - [x] 5.3 Create battle arena data hooks
    - Create `src/lib/api/hooks/useBattle.ts`
    - Implement `useBattleRooms()` for available battles list
    - Implement `useJoinBattle()` mutation for matchmaking
    - Implement `useBattleState(roomId)` for real-time battle synchronization
    - _Requirements: 2.5, 9.1-9.15_

  - [x] 5.4 Create exam simulator data hooks
    - Create `src/lib/api/hooks/useExams.ts`
    - Implement `useExam(examId)` for exam metadata fetch
    - Implement `useExamQuestions(examId)` for 250-question batch fetch
    - Implement `useSubmitExam()` mutation for final submission
    - Implement `useSaveExamAnswer()` with debounced auto-save mutation
    - _Requirements: 2.5, 10.12, 10.17_

  - [x] 5.5 Create library data hooks with pagination
    - Create `src/lib/api/hooks/useLibrary.ts`
    - Implement `useLibrary(filters)` with useInfiniteQuery for cursor-based pagination
    - Implement `useBookmarkTextbook()` mutation for saving textbooks
    - Support grade, subject, stream, and search filters
    - _Requirements: 2.5, 2.12, 11.10, 11.14_

  - [x] 5.6 Create leaderboard data hooks
    - Create `src/lib/api/hooks/useLeaderboard.ts`
    - Implement `useLeaderboard(scope, period)` query with national/regional/school scopes
    - Support time period filters (week, month, all-time)
    - _Requirements: 2.5, 12.10_

  - [x] 5.7 Create analytics data hooks
    - Create `src/lib/api/hooks/useAnalytics.ts`
    - Implement `useUserAnalytics(dateRange)` for performance insights
    - Implement `useSubjectBreakdown()` for subject-wise scores
    - Implement `useScoreTrend(days)` for historical performance data
    - _Requirements: 2.5, 13.10_

  - [x] 5.8 Create AI tutor data hooks
    - Create `src/lib/api/hooks/useAITutor.ts`
    - Implement `useChatHistory()` for conversation retrieval with 10-minute staleTime
    - Implement `useSendMessage()` mutation for sending chat messages
    - Implement `useClearChat()` mutation for conversation reset
    - _Requirements: 2.5, 8.14_

- [x] 6. Fixed Navigation Implementation
  - [x] 6.1 Create Fixed Navbar component
    - Create `src/components/navigation/FixedNavbar.tsx` with sticky positioning (top: 0, z-index: 1030)
    - Set fixed height to 64px (16 rem units)
    - Implement flex layout with logo, nav links, search, workspace chip, and user menu sections
    - Hide navigation links below lg breakpoint (1024px) and show hamburger icon
    - Highlight active route using usePathname() hook with border and background color
    - _Requirements: 4.1-4.4, 4.11_

  - [x] 6.2 Create Mega Menu component
    - Create `src/components/navigation/MegaMenu.tsx` with hover-triggered dropdown panel
    - Implement 500ms hover delay before opening
    - Implement 180ms grace period before closing
    - Set minimum width 32rem (512px) and maximum width 40rem (640px)
    - Display category headers with icons using 10px uppercase font-mono
    - Render menu items in two-column grid with proper spacing
    - Close on outside click or Escape key press
    - _Requirements: 4.5-4.7, 4.16-4.20_

  - [x] 6.3 Create Workspace Context Chip
    - Create `src/components/navigation/WorkspaceChip.tsx`
    - Display user role badge and grade/school information
    - Use pill-shaped design with colored background based on role
    - _Requirements: 4.8_

  - [x] 6.4 Create User Dropdown Menu
    - Create `src/components/navigation/UserDropdown.tsx`
    - Display user avatar with fallback initials
    - Include menu items: Profile, Settings, Logout
    - Implement logout confirmation modal before clearing auth state
    - _Requirements: 4.10, 16.14, 16.15_

  - [x] 6.5 Create Mobile Bottom Navigation
    - Create `src/components/navigation/MobileBottomNav.tsx` visible only below lg breakpoint
    - Display 5 primary items: Dashboard, Practice, Tutor, Battle, More
    - Use fixed positioning at bottom with z-index 1030
    - Ensure touch targets are minimum 44x44px
    - "More" item opens overlay menu with additional navigation links
    - _Requirements: 15.1-15.3, 15.5_

  - [x] 6.6 Implement role-based navigation
    - Create `src/lib/navigation/routes.ts` defining role-specific nav items
    - Student routes: Dashboard, Practice, AI Tutor, Battle, Library, Leaderboard
    - Teacher routes: Console, Publisher, Benchmarks, Analytics, Curriculum, Licensing
    - Parent routes: Dashboard, SMS Alerts, Cutoff Odds, Curriculum, Support
    - Use role from user context to conditionally render appropriate nav items
    - _Requirements: 4.12-4.14_

- [x] 7. Dashboard Page Polish
  - [x] 7.1 Create Dashboard page structure
    - Update `src/app/dashboard/page.tsx` with responsive grid layout
    - Use max-width 1280px container with horizontal padding
    - Implement 32px vertical spacing between header and content
    - Implement 24px vertical spacing between major sections
    - Collapse to single column below md breakpoint
    - _Requirements: 14.1-14.5, 6.15_

  - [x] 7.2 Implement greeting and streak cards
    - Create `src/components/dashboard/GreetingCard.tsx` displaying user name, grade, stream, and date
    - Create `src/components/dashboard/StreakCard.tsx` with fire icon animation and consecutive days counter
    - Fetch user data using `useUserProfile()` hook with skeleton loader
    - _Requirements: 6.1, 6.2_

  - [x] 7.3 Implement progress and countdown cards
    - Create `src/components/dashboard/ProgressCard.tsx` showing questions answered this week with percentage increase
    - Create `src/components/dashboard/ExamCountdownCard.tsx` with days remaining and CTA button
    - Use React Query to fetch progress data with automatic refresh every 60 seconds
    - _Requirements: 6.3, 6.4, 6.14_

  - [x] 7.4 Implement performance charts
    - Create `src/components/dashboard/ScoreTrendChart.tsx` using Recharts line chart for 30-day score trends
    - Create `src/components/dashboard/SubjectRadarChart.tsx` using Recharts radar chart for 6 core subjects
    - Fetch data using `useScoreTrend()` and `useSubjectBreakdown()` hooks
    - Display loading skeletons matching chart dimensions
    - _Requirements: 6.5, 6.6, 6.12_

  - [x] 7.5 Implement learning recommendations section
    - Create `src/components/dashboard/ContinueLearning.tsx` displaying 3 recommended question sets
    - Base recommendations on weak units from analytics data
    - Each card includes subject badge, topic name, and "Practice Now" button
    - _Requirements: 6.7_

  - [x] 7.6 Implement activity timeline and quick actions
    - Create `src/components/dashboard/RecentActivity.tsx` showing last 5 practice sessions with timestamps
    - Create `src/components/dashboard/QuickActions.tsx` with buttons for Practice, AI Tutor, Battle, Exam Simulator
    - Create `src/components/dashboard/LeaderboardPreview.tsx` showing user rank and top 3 competitors
    - _Requirements: 6.8, 6.9, 6.10_

  - [x] 7.7 Display empty states when user has zero activity
    - Implement empty state illustrations for RecentActivity, LeaderboardPreview when data is empty
    - Use EmptyState component with helpful messaging and CTA to start practicing
    - _Requirements: 6.13_

- [x] 8. Practice Mode Polish
  - [x] 8.1 Create Practice Mode page structure
    - Update `src/app/adaptive-learning/page.tsx` with centered question card layout
    - Implement question counter display in format "Question 5 of 20" at top
    - Display progress bar at top showing completion percentage
    - Add optional timer showing elapsed time in MM:SS format
    - _Requirements: 7.1, 7.10, 7.11_

  - [x] 8.2 Create Question Display component
    - Create `src/components/practice/QuestionCard.tsx`
    - Display subject badge, difficulty badge, and unit indicator
    - Render question text with KaTeX support for mathematical expressions
    - Import and configure KaTeX CSS for formula rendering
    - _Requirements: 7.2, 7.3_

  - [x] 8.3 Create Answer Options component
    - Create `src/components/practice/AnswerOptions.tsx`
    - Display 4 option buttons in 2x2 grid on desktop, vertical stack on mobile
    - Implement radio button styling for single selection
    - On selection, disable all buttons immediately
    - Highlight correct answer in green (bg-emerald-100, border-emerald-500)
    - Highlight incorrect selection in red (bg-red-100, border-red-500)
    - _Requirements: 7.4, 7.5, 7.6_

  - [x] 8.4 Create Explanation Panel component
    - Create `src/components/practice/ExplanationPanel.tsx` displayed after answer submission
    - Implement multilingual tabs for English, Amharic, Oromo using tab component
    - Render explanation text with markdown support
    - _Requirements: 7.7_

  - [x] 8.5 Implement navigation and progress controls
    - Create "Next Question" button with keyboard shortcut support (Enter or →)
    - Create "View Progress" secondary button
    - Implement question prefetching: load next 3 questions in background using `usePrefetchQuestion()`
    - Ensure instant transitions between questions
    - _Requirements: 7.8, 7.9, 7.14_

  - [x] 8.6 Implement answer submission with mutations
    - Use `useSubmitAnswer()` mutation hook for saving answers
    - Implement optimistic update to immediately show result
    - Display toast notification on mutation error with retry option
    - Track time spent per question and include in submission payload
    - _Requirements: 7.12, 7.13_

  - [x] 8.7 Create Practice Summary screen
    - Create `src/components/practice/PracticeSummary.tsx` displayed after completing all questions
    - Show total score, time taken, accuracy percentage
    - Display list of weak units with links to remedial practice
    - Include "Practice Again" and "Back to Dashboard" buttons
    - _Requirements: 7.15_

- [x] 9. AI Tutor Chat Interface Polish
  - [x] 9.1 Create AI Tutor page structure
    - Update `src/app/ai-tutor/page.tsx` with fixed chat layout
    - Message input fixed at bottom with z-index appropriate for fixed elements
    - Scrollable message area taking remaining vertical space
    - _Requirements: 8.1_

  - [x] 9.2 Create Chat Message components
    - Create `src/components/ai-tutor/MessageList.tsx` for scrollable message container
    - Create `src/components/ai-tutor/UserMessage.tsx` with right alignment and distinct background
    - Create `src/components/ai-tutor/AssistantMessage.tsx` with left alignment and avatar icon
    - Implement auto-scroll to latest message on new message arrival
    - _Requirements: 8.3, 8.4, 8.10_

  - [x] 9.3 Implement markdown and math rendering in messages
    - Install and configure markdown parser (e.g., react-markdown)
    - Configure KaTeX for mathematical expression rendering in assistant messages
    - Support bold, italic, lists, code blocks, inline code formatting
    - _Requirements: 8.6, 8.7_

  - [x] 9.4 Create Chat Input component
    - Create `src/components/ai-tutor/ChatInput.tsx` with textarea and send button
    - Display character count indicator showing "0/1000" below input
    - Disable send button and input while request is pending
    - Support Enter key to send (Shift+Enter for new line)
    - _Requirements: 8.12, 8.15_

  - [x] 9.5 Implement chat state management
    - Use `useChatHistory()` hook to fetch conversation with 10-minute staleTime
    - Use `useSendMessage()` mutation for sending messages
    - Display typing indicator (three animated dots) while waiting for response
    - Display inline error message with retry button on API failure
    - _Requirements: 8.5, 8.13, 8.14_

  - [x] 9.6 Implement chat controls and welcome state
    - Create language selector toggle for Amharic, Oromo, English at top
    - Create "Clear Chat" button with confirmation modal before reset
    - Display welcome message with example prompts when chat is empty
    - Implement "Copy" button on hover over assistant messages
    - _Requirements: 8.2, 8.8, 8.9, 8.11_

- [x] 10. Battle Arena Real-Time Experience Polish
  - [x] 10.1 Create Battle Arena page structure
    - Update `src/app/battle/page.tsx` with full-screen battle layout
    - Implement connection status indicator in top corner (connected/reconnecting)
    - Use WebSocket client for real-time synchronization
    - _Requirements: 9.15_

  - [x] 10.2 Create Matchmaking screen
    - Create `src/components/battle/MatchmakingScreen.tsx`
    - Display animated spinner while finding opponent
    - Use `useJoinBattle()` mutation to enter matchmaking queue
    - Handle WebSocket connection for matchmaking events
    - _Requirements: 9.1_

  - [x] 10.3 Create Battle Start sequence
    - Create `src/components/battle/OpponentFoundAnimation.tsx` showing both players' names and avatars
    - Create countdown animation (3...2...1...GO!) with scale transitions
    - Transition to battle screen after countdown completes
    - _Requirements: 9.2, 9.3_

  - [x] 10.4 Create Battle UI components
    - Create `src/components/battle/BattleScoreCards.tsx` showing side-by-side real-time scores
    - Create `src/components/battle/RoundTimer.tsx` as circular progress indicator counting down from 30 seconds
    - Display question number and total rounds (Round 3 of 10)
    - _Requirements: 9.4, 9.5, 9.6_

  - [x] 10.5 Implement battle question flow
    - Create `src/components/battle/BattleQuestion.tsx` with immediate visual feedback on selection
    - Display result overlay showing correct answer and points awarded after both players answer
    - Implement "waiting for opponent" overlay if other player is slower
    - Transition to next question with 2-second delay and animation
    - _Requirements: 9.7, 9.8, 9.9, 9.10_

  - [x] 10.6 Create Battle Victory screen
    - Create `src/components/battle/VictoryScreen.tsx` with confetti animation for winner
    - Display final score summary with accuracy percentage for both players
    - Include "Play Again" button (re-enters matchmaking) and "Return to Dashboard" button
    - _Requirements: 9.11, 9.12, 9.13_

  - [x] 10.7 Implement WebSocket reconnection handling
    - Handle WebSocket disconnection events gracefully
    - Implement automatic reconnection with exponential backoff
    - Display connection status changes to user
    - Preserve battle state across reconnection when possible
    - _Requirements: 9.14, 9.15_

- [x] 11. Exam Simulator Full-Screen Experience Polish
  - [x] 11.1 Create Exam Information screen
    - Create `src/components/exam/ExamInstructions.tsx` showing exam details before start
    - Display instructions, duration (4 hours), question count (250), and rules
    - Create "Start Exam" button that requests full-screen mode and begins timer
    - _Requirements: 10.1, 10.2_

  - [x] 11.2 Create Exam Header component
    - Create `src/components/exam/ExamHeader.tsx` with persistent header
    - Display timer in HH:MM:SS format counting down from total duration
    - Change timer color to red when 10 minutes remaining
    - Display question counter and flag counter
    - Include "Exit Exam" button with progress loss warning
    - _Requirements: 10.3, 10.4, 10.5, 10.18_

  - [x] 11.3 Create Question Navigation Sidebar
    - Create `src/components/exam/QuestionNavigationSidebar.tsx`
    - Display numbered buttons for all 250 questions in scrollable grid
    - Use color coding: unanswered (gray), answered (blue), flagged (yellow)
    - Enable direct navigation to any question by clicking number button
    - _Requirements: 10.6, 10.7_

  - [x] 11.4 Create Exam Question Display
    - Create `src/components/exam/ExamQuestionCard.tsx`
    - Display subject badge and topic label at top
    - Render question text with KaTeX support
    - Display 4 option buttons in vertical list with radio button styling
    - _Requirements: 10.8, 10.9_

  - [x] 11.5 Implement exam navigation controls
    - Create "Previous" and "Next" buttons below options
    - Create "Flag for Review" button with toggle for yellow flag icon
    - Implement keyboard shortcuts for navigation (← Previous, → Next, F to Flag)
    - Display "Review & Submit" button only when user reaches last question
    - _Requirements: 10.10, 10.11, 10.13_

  - [x] 11.6 Implement auto-save functionality
    - Use `useSaveExamAnswer()` mutation with 2-second debounce
    - Save answer automatically when selection changes
    - Display subtle saving indicator (checkmark icon) when save completes
    - Handle save failures gracefully with retry logic
    - _Requirements: 10.12_

  - [x] 11.7 Create Exam Review screen
    - Create `src/components/exam/ExamReview.tsx` accessed via "Review & Submit" button
    - Display summary counts: answered, flagged, unanswered questions
    - Show grid of all question numbers with color coding
    - Enable navigation to specific questions from review screen
    - _Requirements: 10.14_

  - [x] 11.8 Implement exam submission flow
    - Create confirmation modal warning about submission finality
    - Use `useSubmitExam()` mutation for final submission
    - Exit full-screen mode after submission
    - Navigate to results page showing score and breakdown
    - Implement auto-submit when timer reaches 00:00:00
    - _Requirements: 10.15, 10.16, 10.17_

- [x] 12. Library Curriculum Browser Polish
  - [x] 12.1 Create Library page structure
    - Update `src/app/library/page.tsx` with sidebar + grid layout
    - Filter sidebar on left (hidden on mobile, moves to top)
    - Textbook grid on right with 3 columns on desktop, 2 on tablet, 1 on mobile
    - _Requirements: 15.6_

  - [x] 12.2 Create Filter Sidebar component
    - Create `src/components/library/FilterSidebar.tsx`
    - Implement grade selector with radio buttons (9, 10, 11, 12)
    - Implement stream selector (Natural Science, Social Science)
    - Implement subject checkboxes for all subjects with scroll if needed
    - Highlight active filters with colored badges at top
    - _Requirements: 12.1, 12.2, 12.3, 12.15_

  - [x] 12.3 Create Search and Results Header
    - Create search input with debounced text search (300ms delay)
    - Display result count text showing "Showing 12 of 45 textbooks"
    - Display sort dropdown (optional: by grade, subject, title)
    - _Requirements: 12.4, 12.13, 19.12_

  - [x] 12.4 Create Textbook Card component
    - Create `src/components/library/TextbookCard.tsx`
    - Display cover image with lazy loading
    - Display title, subject badge, and grade indicator
    - Include "View" button opening PDF viewer or content page
    - Include "Download" button initiating PDF download
    - Include bookmark icon button toggling saved state with `useBookmarkTextbook()` mutation
    - _Requirements: 12.6, 12.7, 12.8, 12.9_

  - [x] 12.5 Implement textbook data fetching
    - Use `useLibrary(filters)` hook with infinite scroll pagination
    - Display skeleton loaders during initial load
    - Implement infinite scroll with intersection observer loading more as user scrolls
    - Display "No textbooks found" empty state when filters return zero results
    - _Requirements: 12.5, 12.10, 12.11, 12.12, 12.14, 19.3_

- [x] 13. Leaderboard Rankings Polish
  - [x] 13.1 Create Leaderboard page structure
    - Update `src/app/leaderboard/page.tsx` with filter tabs and ranking display
    - Use max-width 1280px container with proper spacing
    - _Requirements: 14.1_

  - [x] 13.2 Create Leaderboard Filter Controls
    - Create filter tabs for "National", "Regional", "School" scopes
    - Create time period dropdown for "This Week", "This Month", "All Time"
    - Display refresh button invalidating query and refetching data
    - Display timestamp showing last update time
    - _Requirements: 12.3, 12.4, 12.14, 12.15_

  - [x] 13.3 Create Current User Rank Card
    - Create `src/components/leaderboard/UserRankCard.tsx` displayed at top with highlighted background
    - Show position number, name, avatar, points, accuracy percentage
    - Display position change indicator (↑ +5 or ↓ -3) from previous period
    - Display "Not yet ranked" state when user has insufficient activity
    - _Requirements: 12.1, 12.2, 12.9, 12.13_

  - [x] 13.4 Create Top 3 Podium Display
    - Create `src/components/leaderboard/Podium.tsx` for positions 1-3
    - Display enlarged cards with gold, silver, bronze medal icons
    - Show avatar placeholder with colored background and initials when image unavailable
    - _Requirements: 12.5, 12.7_

  - [x] 13.5 Create Rankings Table
    - Create `src/components/leaderboard/RankingsTable.tsx` for positions 4-100
    - Display columns: rank, name, avatar, points, accuracy, change indicator
    - Highlight current user row with subtle background color
    - Implement pagination with "Load More" button at bottom
    - _Requirements: 12.6, 12.8, 12.12_

  - [x] 13.6 Implement leaderboard data fetching
    - Use `useLeaderboard(scope, period)` hook with scope and period as query keys
    - Display skeleton loaders during data fetch
    - Handle empty states appropriately
    - _Requirements: 12.10, 12.11_

- [x] 14. Performance Insights Analytics Polish
  - [x] 14.1 Create Analytics page structure
    - Update `src/app/performance-insights/page.tsx` with dashboard grid layout
    - Display page header with title (3xl font), subtitle, and export button
    - Use 24px vertical spacing between chart sections
    - _Requirements: 14.1, 14.2, 14.3, 14.4_

  - [x] 14.2 Create Summary Statistics Cards
    - Create summary cards showing total questions answered, average score, study time
    - Display cards in 3-column grid on desktop, single column on mobile
    - Use Card component with centered text and large numeric displays
    - _Requirements: 13.1_

  - [x] 14.3 Create Subject Breakdown Chart
    - Create `src/components/analytics/SubjectBreakdownChart.tsx` using Recharts BarChart
    - Display scores per subject with different colored bars
    - Include hover tooltips showing exact values
    - Fetch data using `useSubjectBreakdown()` hook
    - _Requirements: 13.2, 13.8_

  - [x] 14.4 Create Score Trend Chart
    - Create `src/components/analytics/ScoreTrendChart.tsx` using Recharts LineChart
    - Show performance over last 90 days with date range selector
    - Include hover tooltips with date and score details
    - Fetch data using `useScoreTrend()` hook
    - _Requirements: 13.3, 13.8, 13.9_

  - [x] 14.5 Create Activity Heatmap Calendar
    - Create `src/components/analytics/ActivityHeatmap.tsx`
    - Display calendar grid with color intensity based on daily question count
    - Use green color scale (light to dark) for activity levels
    - Support current year view with month labels
    - _Requirements: 13.4_

  - [x] 14.6 Create Weak Units and Projections
    - Create `src/components/analytics/WeakUnits.tsx` list ranked by error rate with remedial links
    - Create `src/components/analytics/CutoffProjection.tsx` showing IRT-based predicted score
    - Display confidence interval and university admission probability gauges for top 3 universities
    - _Requirements: 13.5, 13.6, 13.7_

  - [x] 14.7 Implement analytics data fetching and export
    - Use `useUserAnalytics(dateRange)` hook with date range as query key
    - Display loading skeletons matching chart dimensions during fetch
    - Display empty state when user has zero activity data
    - Implement export button downloading analytics report as PDF (optional enhancement)
    - _Requirements: 13.10, 13.11, 13.13, 13.14_

  - [x] 14.8 Optimize charts for mobile responsiveness
    - Adjust chart aspect ratios for mobile viewports
    - Simplify axes labels and reduce font sizes on small screens
    - Test chart interactions on touch devices
    - _Requirements: 13.12, 15.10_

- [x] 15. Form Validation and Authentication Polish
  - [x] 15.1 Create Form Validation utilities
    - Create `src/lib/validation/schemas.ts` with Zod schemas matching backend validation
    - Create email validation regex and strength meter calculation functions
    - Create `src/hooks/useFormValidation.ts` custom hook with debounced validation logic
    - _Requirements: 17.3, 17.4, 17.11, 17.15_

  - [x] 15.2 Polish Login Page
    - Update `src/app/auth/login/page.tsx` with improved styling
    - Use proper input types (type="email", type="password")
    - Implement "Show/Hide Password" toggle icon in password field
    - Display "Remember Me" checkbox below password
    - Include "Forgot Password?" link below form
    - Display loading spinner on submit button during authentication
    - Display field-specific error messages below inputs on validation failure
    - Redirect to dashboard after successful login or to redirect_url query parameter
    - _Requirements: 16.1-16.7, 17.6_

  - [x] 15.3 Polish Registration Page
    - Update `src/app/auth/register/page.tsx` with validation
    - Implement password strength meter (weak/medium/strong) with visual indicator
    - Display character count for inputs with max length constraints
    - Display inline validation errors after blur event
    - Display success checkmark in valid fields
    - Disable submit button until all required fields pass validation
    - _Requirements: 17.1, 17.2, 17.4, 17.5, 17.6, 17.7_

  - [x] 15.4 Create Form Error Handling components
    - Create form-level error summary component displayed at top on submission failure
    - Implement auto-scroll to first error field when validation fails
    - Display confirmation message after successful submission
    - Create unsaved changes warning modal for dirty forms
    - _Requirements: 17.8, 17.9, 17.10, 17.14_

  - [x] 15.5 Implement Session Management
    - Implement session timeout warning modal displayed 2 minutes before token expiration
    - Handle token expiration redirect to login with redirect_url parameter
    - Implement logout confirmation modal before clearing state
    - Clear all authentication state and redirect to landing page after logout
    - _Requirements: 16.10, 16.11, 16.14, 16.15_

  - [x] 15.6 Implement Role-Based Route Guards
    - Create `src/middleware/roleGuard.ts` checking user.role before rendering protected pages
    - Create 403 Forbidden page component displayed for unauthorized access attempts
    - Wrap protected routes with role guard checking logic
    - _Requirements: 16.12, 16.13_

- [x] 16. Accessibility Improvements
  - [x] 16.1 Implement semantic HTML structure
    - Audit all pages to use semantic elements (nav, main, article, section, aside)
    - Ensure proper heading hierarchy (h1 → h2 → h3) without skipping levels
    - Add skip navigation link as first focusable element navigating to main content
    - _Requirements: 18.1, 18.7_

  - [x] 16.2 Add ARIA attributes and labels
    - Add alt text for all informational images (decorative images: alt="")
    - Add aria-label for icon-only buttons
    - Add aria-expanded for collapsible sections and dropdowns
    - Add aria-live regions for dynamic content (toast notifications, live battle scores)
    - Add role="button" for clickable divs and aria-pressed for toggle buttons
    - _Requirements: 18.2, 18.3, 18.6, 18.8, 18.13_

  - [x] 16.3 Implement keyboard navigation
    - Ensure all interactive elements are keyboard accessible with Tab key
    - Add visible focus indicators with 2px outline offset 2px
    - Implement keyboard shortcuts documented in help section (e.g., Arrow keys for navigation)
    - Test modal focus trap ensuring Tab cycles within modal and Escape closes
    - Return focus to trigger element when modal closes
    - _Requirements: 18.4, 18.11, 18.12_

  - [x] 16.4 Verify color contrast ratios
    - Audit all text/background combinations for 4.5:1 contrast (normal text) and 3:1 (large text)
    - Fix any contrast issues in design tokens or component overrides
    - Test with browser accessibility tools (Chrome DevTools Lighthouse)
    - _Requirements: 18.5_

  - [x] 16.5 Implement form accessibility
    - Associate all form labels with inputs using htmlFor attribute
    - Use aria-describedby for error messages and hint text
    - Announce form validation errors to screen readers
    - Display required field indicators with both visual and aria-required attribute
    - _Requirements: 18.9, 18.10, 17.1_

  - [x] 16.6 Test with screen readers
    - Test major user flows (login, practice questions, exam simulator) with NVDA or JAWS
    - Implement aria-live announcements for page navigation
    - Fix any issues discovered during screen reader testing
    - _Requirements: 18.14, 18.15_

- [x] 17. Performance Optimization
  - [x] 17.1 Implement code splitting and lazy loading
    - Use Next.js dynamic imports for route-level code splitting
    - Lazy load heavy components (charts, PDF viewer) using React.lazy and Suspense
    - Add loading="lazy" attribute to images below the fold
    - _Requirements: 19.2, 19.3_

  - [x] 17.2 Optimize component re-renders
    - Wrap expensive list item components with React.memo
    - Use useMemo for expensive calculations
    - Use useCallback for event handlers passed to child components
    - Audit components for unnecessary re-renders using React DevTools Profiler
    - _Requirements: 19.4, 19.13_

  - [x] 17.3 Optimize images and assets
    - Convert images to WebP format with quality 85
    - Compress images using next/image component with automatic optimization
    - Preload critical fonts using <link rel="preload"> in document head
    - _Requirements: 19.7, 19.9_

  - [x] 17.4 Implement virtual scrolling for long lists
    - Install and configure react-window or react-virtualized for lists exceeding 100 items
    - Apply to leaderboard rankings table and library textbook grid
    - Test scroll performance on lower-end devices
    - _Requirements: 19.6_

  - [x] 17.5 Optimize React Query caching strategy
    - Review staleWhileRevalidate strategy to serve cached data instantly
    - Configure appropriate staleTime values per data type (5-10 minutes for relatively static data)
    - Implement prefetching for anticipated navigation (dashboard → practice)
    - _Requirements: 19.5, 2.11_

  - [x] 17.6 Optimize build and bundle size
    - Enable Tailwind CSS purge in production to remove unused styles
    - Minify CSS and JavaScript in production build
    - Defer non-critical JavaScript loading using Next.js Script component
    - Analyze bundle size using Next.js bundle analyzer
    - _Requirements: 19.8, 19.11_

  - [x] 17.7 Run Lighthouse performance audit
    - Run Lighthouse audit on production build for all major pages
    - Aim for performance score above 90
    - Fix critical issues identified in audit report
    - _Requirements: 19.1_

- [x] 18. Responsive Design Implementation
  - [x] 18.1 Implement mobile navigation patterns
    - Ensure Fixed Navbar collapses to mobile bottom nav below lg breakpoint
    - Convert desktop mega menus to mobile accordion menus
    - Display mobile hamburger menu icon opening full-screen navigation overlay
    - _Requirements: 15.1, 15.7, 15.8_

  - [x] 18.2 Implement responsive layout patterns
    - Collapse multi-column layouts to single column below md breakpoint (768px)
    - Stack filter sidebars above content on mobile instead of side-by-side
    - Use mobile-optimized spacing (16px instead of 24px for major sections)
    - _Requirements: 15.4, 15.6, 15.12_

  - [x] 18.3 Optimize touch interactions
    - Increase touch target sizes to minimum 44x44px on mobile for all interactive elements
    - Implement swipe gestures for question navigation in Practice Mode and Exam Simulator
    - Use native mobile controls for date pickers and select dropdowns
    - _Requirements: 15.5, 15.11, 15.15_

  - [x] 18.4 Test mobile viewport compatibility
    - Test all pages at 375px viewport width ensuring no horizontal scrolling
    - Test on iOS Safari and Android Chrome for compatibility
    - Hide non-essential UI elements on mobile (detailed timestamps, secondary badges)
    - _Requirements: 15.9, 15.13, 15.14_

- [x] 19. Environment Configuration and Deployment Preparation
  - [x] 19.1 Configure environment variables
    - Create `.env.example` file documenting all required variables with descriptions
    - Define NEXT_PUBLIC_API_URL for API base URL
    - Define NEXT_PUBLIC_WS_URL for WebSocket URL
    - Document backend variables: API_SECRET_KEY, DATABASE_URL
    - _Requirements: 20.1-20.7_

  - [x] 19.2 Implement application startup validation
    - Create `src/lib/config/validation.ts` validating required env variables at startup
    - Throw descriptive errors if required variables are missing
    - Log configuration warnings for optional variables
    - _Requirements: 20.8_

  - [x] 19.3 Create health check and monitoring endpoints
    - Create `/api/health` endpoint returning status 200 with uptime info
    - Implement graceful shutdown handling for API server
    - (Optional) Integrate Sentry or similar error tracking service
    - (Optional) Set up external logging service integration
    - _Requirements: 20.9, 20.10, 20.11, 20.12_

  - [x] 19.4 Configure production build settings
    - Generate source maps for production debugging with restricted access
    - Configure CORS on API server allowing UI_Client origin with credentials
    - Enable gzip compression for API responses
    - Implement CDN caching headers for static assets with far-future expiration
    - _Requirements: 20.13, 2.14, 19.14, 19.15_

  - [x] 19.5 Document deployment procedures
    - Create `DEPLOYMENT.md` file with step-by-step deployment instructions
    - Document database migration process using Prisma migrate
    - Document environment-specific configuration (dev, staging, production)
    - Include rollback procedures and troubleshooting tips
    - _Requirements: 20.14, 20.15_

- [x] 20. Final Integration and Testing
  - Verify all mock data has been removed from codebase (search for "OfflineDataVault", "MOCK_", "SEED_")
  - Test all pages with React Query DevTools to ensure proper caching and refetching
  - Verify loading states display correctly during data fetching
  - Verify error states display correctly and retry logic works
  - Test all forms with validation edge cases
  - Verify role-based navigation displays correct items for each user role
  - Test responsive breakpoints on all pages (375px, 768px, 1024px, 1280px)
  - Verify keyboard navigation works for all interactive elements
  - Test Battle Arena WebSocket connection, reconnection, and error handling
  - Test Exam Simulator full-screen mode, timer, auto-save, and submission
  - Verify all API calls use centralized api client with proper error handling
  - Run production build and verify bundle size is reasonable
  - _Requirements: All requirements integration testing_

## Notes

- Tasks marked with `*` are optional test-related or enhancement tasks that can be skipped for faster MVP
- Each task references specific requirements for traceability back to the requirements document
- React Query hooks provide automatic caching, refetching, and error handling reducing boilerplate
- Design system tokens ensure visual consistency across all components
- All data fetching uses the centralized API client with authentication token injection
- Loading and error states are handled consistently using dedicated UI components
- Mobile responsiveness is built-in using Tailwind breakpoints and mobile-first approach
- Accessibility is addressed through semantic HTML, ARIA attributes, and keyboard navigation
- Performance optimization focuses on code splitting, lazy loading, and React Query caching

## Task Dependency Graph

```json
{
  "waves": [
    {
      "id": 0,
      "tasks": ["1"]
    },
    {
      "id": 1,
      "tasks": ["2.1", "3.1", "3.2", "3.3"]
    },
    {
      "id": 2,
      "tasks": ["2.2", "2.3", "2.4", "4.1", "4.2", "4.3", "4.4", "4.5", "4.6"]
    },
    {
      "id": 3,
      "tasks": ["2.5", "5.1", "5.2", "5.3", "5.4", "5.5", "5.6", "5.7", "5.8"]
    },
    {
      "id": 4,
      "tasks": ["6.1", "6.2", "6.3", "6.4", "6.5", "6.6"]
    },
    {
      "id": 5,
      "tasks": ["7.1", "8.1", "9.1", "10.1", "11.1", "12.1", "13.1", "14.1", "15.1"]
    },
    {
      "id": 6,
      "tasks": ["7.2", "7.3", "7.4", "7.5", "7.6", "8.2", "8.3", "8.4", "9.2", "9.3", "9.4", "10.2", "10.3", "10.4", "11.2", "11.3", "11.4", "12.2", "12.3", "12.4", "13.2", "13.3", "13.4", "13.5", "14.2", "14.3", "14.4", "14.5", "14.6", "15.2", "15.3", "15.4", "15.5", "15.6"]
    },
    {
      "id": 7,
      "tasks": ["7.7", "8.5", "8.6", "8.7", "9.5", "9.6", "10.5", "10.6", "10.7", "11.5", "11.6", "11.7", "11.8", "12.5", "13.6", "14.7", "14.8", "16.1", "16.2", "16.3", "16.4", "16.5", "17.1", "17.2", "17.3", "17.4", "17.5", "17.6", "18.1", "18.2", "18.3", "18.4"]
    },
    {
      "id": 8,
      "tasks": ["16.6", "17.7", "19.1", "19.2", "19.3", "19.4", "19.5"]
    },
    {
      "id": 9,
      "tasks": ["20"]
    }
  ]
}
```
