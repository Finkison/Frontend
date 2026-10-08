# Design Document: Finkison Platform Polish

## 1. Executive Summary

This design document outlines the comprehensive architecture for modernizing the Finkison EdTech platform. The polish eliminates all mock data dependencies, establishes a professional design system, implements robust backend integration patterns with React Query, and elevates the user experience to world-class standards.

**Core Architectural Pillars:**
- **Data Layer**: TanStack Query (React Query) with type-safe API client and optimistic updates
- **Design System**: 8px grid system with comprehensive token library and Tailwind CSS 4
- **Component Architecture**: Composition-based design with loading/error boundaries
- **State Management**: Server state via React Query, client state via React hooks
- **Navigation**: Fixed professional navbar with mega menus and role-based routing
- **Responsive Strategy**: Mobile-first breakpoints with progressive enhancement
- **Performance**: Code splitting, lazy loading, and aggressive caching strategies

**Technology Stack:**
- Next.js 16 (App Router) + React 19
- TypeScript 5 with strict mode
- Tailwind CSS 4 with custom design tokens
- TanStack Query v5 for server state
- Native Fetch API with interceptors
- Lucide React for icons
- KaTeX for math rendering
- Socket.io client for real-time features

## 2. System Architecture Overview

### 2.1 Application Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        Next.js App Router                        │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                   app/layout.tsx (Root)                     │ │
│  │  - QueryClientProvider (React Query)                       │ │
│  │  - ThemeProvider (Design System)                           │ │
│  │  - AuthProvider (Authentication Context)                   │ │
│  │  - ToastProvider (Global Notifications)                    │ │
│  └────────────────────────────────────────────────────────────┘ │
│                              │                                   │
│  ┌──────────────────────────┴──────────────────────────┐        │
│  │                                                      │        │
│  ▼                                                      ▼        │
│  ┌─────────────────┐                      ┌──────────────────┐  │
│  │ Fixed Navbar    │                      │ Page Components  │  │
│  │ - Logo          │                      │ - Dashboard      │  │
│  │ - Nav Links     │                      │ - Practice       │  │
│  │ - Mega Menus    │                      │ - AI Tutor       │  │
│  │ - User Menu     │                      │ - Battle Arena   │  │
│  │ - Search        │                      │ - Exam Simulator │  │
│  └─────────────────┘                      │ - Library        │  │
│                                            │ - Leaderboard    │  │
│                                            │ - Analytics      │  │
│                                            └──────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Data Access Layer                           │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │               lib/api/client.ts (API Client)                │ │
│  │  - Request interceptors (auth token injection)             │ │
│  │  - Response interceptors (error transformation)            │ │
│  │  - Token refresh logic                                     │ │
│  │  - Type-safe request/response interfaces                   │ │
│  └────────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │         lib/api/hooks/* (React Query Hooks)                 │ │
│  │  - useQuestions()      - useExams()                        │ │
│  │  - useUserProfile()    - useBattleRooms()                  │ │
│  │  - useLeaderboard()    - useAnalytics()                    │ │
│  │  - useLibrary()        - useAIChat()                       │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Express REST API + WebSocket                   │
│                     (finkison-api server)                        │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Data Flow Architecture

```
User Interaction Flow:
┌──────────┐    ┌──────────────┐    ┌─────────────┐    ┌──────────┐
│   User   │───▶│   Page       │───▶│ React Query │───▶│   API    │
│  Action  │    │  Component   │    │   Hook      │    │  Client  │
└──────────┘    └──────────────┘    └─────────────┘    └──────────┘
                       │                    │                  │
                       │                    ▼                  ▼
                       │            ┌─────────────┐    ┌──────────┐
                       │            │   Cache     │    │  Backend │
                       │            │  (stale-    │    │   API    │
                       │            │  while-     │    │  Server  │
                       │            │  revalidate)│    └──────────┘
                       │            └─────────────┘          │
                       │                    │                │
                       │                    ◀────────────────┘
                       │                    │
                       ◀────────────────────┘
                       │
                       ▼
                ┌──────────────┐
                │  UI Update   │
                │  (Optimistic │
                │   or Real)   │
                └──────────────┘
```

## 3. Design System Foundation

### 3.1 Design Tokens Structure

```typescript
// src/lib/design-system/tokens.ts

export const designTokens = {
  // Spacing System (8px base grid)
  spacing: {
    xs: '0.5rem',    // 8px
    sm: '1rem',      // 16px
    md: '1.5rem',    // 24px
    lg: '2rem',      // 32px
    xl: '2.5rem',    // 40px
    '2xl': '3rem',   // 48px
    '3xl': '4rem',   // 64px
    '4xl': '5rem',   // 80px
    '5xl': '6rem',   // 96px
  },

  // Typography Scale
  fontSize: {
    xs: '0.75rem',   // 12px
    sm: '0.875rem',  // 14px
    base: '1rem',    // 16px
    lg: '1.125rem',  // 18px
    xl: '1.25rem',   // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
    '6xl': '3.75rem',  // 60px
  },

  // Color Tokens
  colors: {
    // Brand Colors
    brand: {
      primary: '#F59E0B',    // Amber
      secondary: '#06B6D4',  // Cyan
      accent: '#10B981',     // Emerald
    },
    
    // Semantic Colors
    semantic: {
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
    },

    // Background Colors
    background: {
      primary: '#001726',
      secondary: '#002238',
      tertiary: '#00334A',
    },

    // Neutral Scale (Slate)
    neutral: {
      50: '#F8FAFC',
      100: '#F1F5F9',
      200: '#E2E8F0',
      300: '#CBD5E1',
      400: '#94A3B8',
      500: '#64748B',
      600: '#475569',
      700: '#334155',
      800: '#1E293B',
      900: '#0F172A',
      950: '#020617',
    },
  },

  // Border Radius
  borderRadius: {
    sm: '0.25rem',   // 4px
    default: '0.5rem',  // 8px
    lg: '0.75rem',   // 12px
    xl: '1rem',      // 16px
    '2xl': '1.5rem', // 24px
    full: '9999px',
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    default: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  },

  // Transitions
  transitions: {
    fast: '150ms',
    default: '200ms',
    slow: '300ms',
    slower: '500ms',
  },

  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // Z-Index Scale
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },
} as const;
```

### 3.2 Tailwind Configuration

```typescript
// tailwind.config.ts

import type { Config } from 'tailwindcss';
import { designTokens } from './src/lib/design-system/tokens';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: designTokens.colors.brand,
        semantic: designTokens.colors.semantic,
        bg: designTokens.colors.background,
      },
      spacing: designTokens.spacing,
      fontSize: designTokens.fontSize,
      borderRadius: designTokens.borderRadius,
      boxShadow: designTokens.shadows,
      transitionDuration: designTokens.transitions,
      zIndex: designTokens.zIndex,
      screens: designTokens.breakpoints,
    },
  },
  plugins: [],
};

export default config;
```

### 3.3 Component Design Patterns

#### Button Variants

```typescript
// src/components/ui/Button.tsx

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  // Base styles
  'inline-flex items-center justify-center rounded-default font-medium transition-colors duration-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-brand-primary text-white hover:bg-amber-600 active:bg-amber-700',
        secondary: 'bg-brand-secondary text-white hover:bg-cyan-600 active:bg-cyan-700',
        outline: 'border-2 border-neutral-300 bg-transparent hover:bg-neutral-100 active:bg-neutral-200',
        ghost: 'hover:bg-neutral-100 active:bg-neutral-200',
        danger: 'bg-semantic-error text-white hover:bg-red-600 active:bg-red-700',
      },
      size: {
        sm: 'h-8 px-3 text-sm',       // 32px height
        default: 'h-10 px-4 text-base', // 40px height
        lg: 'h-12 px-6 text-lg',      // 48px height
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={buttonVariants({ variant, size, className })}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
```

#### Card Component

```typescript
// src/components/ui/Card.tsx

import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl border border-neutral-200 bg-white p-4 shadow-default',
          className
        )}
        {...props}
      />
    );
  }
);

Card.displayName = 'Card';

export const CardHeader = forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex flex-col space-y-1.5', className)}
        {...props}
      />
    );
  }
);

CardHeader.displayName = 'CardHeader';

export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={cn('text-2xl font-semibold leading-none tracking-tight', className)}
        {...props}
      />
    );
  }
);

CardTitle.displayName = 'CardTitle';

export const CardContent = forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn('pt-4', className)} {...props} />;
  }
);

CardContent.displayName = 'CardContent';

export const CardFooter = forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex items-center pt-4', className)}
        {...props}
      />
    );
  }
);

CardFooter.displayName = 'CardFooter';
```

#### Input Component

```typescript
// src/components/ui/Input.tsx

import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, helperText, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          ref={ref}
          className={cn(
            'flex h-10 w-full rounded-default border border-neutral-300 bg-white px-3 py-2 text-base',
            'ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium',
            'placeholder:text-neutral-400',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-semantic-error focus-visible:ring-semantic-error',
            className
          )}
          {...props}
        />
        {helperText && (
          <p
            className={cn(
              'mt-1 text-sm',
              error ? 'text-semantic-error' : 'text-neutral-500'
            )}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
```

## 4. Backend Integration Architecture

### 4.1 API Client Implementation

```typescript
// src/lib/api/client.ts

import { getAuthToken, refreshAuthToken, clearAuthToken } from '@/lib/auth';

// Base configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Type definitions
export interface APIError {
  statusCode: number;
  message: string;
  details?: Record<string, unknown>;
}

export interface APIResponse<T> {
  data: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    hasMore?: boolean;
  };
}

// Request configuration type
interface RequestConfig extends RequestInit {
  skipAuth?: boolean;
  retries?: number;
}

// Error transformation utility
function transformAPIError(error: unknown): APIError {
  if (error instanceof Response) {
    return {
      statusCode: error.status,
      message: error.statusText || 'An error occurred',
    };
  }
  
  if (error instanceof Error) {
    return {
      statusCode: 500,
      message: error.message,
    };
  }

  return {
    statusCode: 500,
    message: 'Unknown error occurred',
  };
}

// Request interceptor - adds auth token
async function addAuthHeader(headers: Headers): Promise<Headers> {
  const token = await getAuthToken();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  return headers;
}

// Response interceptor - handles token refresh
async function handleResponse<T>(response: Response): Promise<T> {
  // Handle 401 Unauthorized - attempt token refresh
  if (response.status === 401) {
    const refreshed = await refreshAuthToken();
    if (!refreshed) {
      clearAuthToken();
      // Redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = `/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`;
      }
      throw new Error('Session expired');
    }
    // Retry the original request will be handled by React Query retry logic
    throw new Error('Token refreshed, retry needed');
  }

  // Handle error responses
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw {
      statusCode: response.status,
      message: errorData.message || response.statusText,
      details: errorData.details,
    } as APIError;
  }

  // Handle successful response
  const data = await response.json();
  return data;
}

// Main API client function
export async function apiClient<T>(
  endpoint: string,
  config: RequestConfig = {}
): Promise<T> {
  const { skipAuth = false, retries = 0, ...fetchConfig } = config;

  // Build headers
  const headers = new Headers(fetchConfig.headers);
  headers.set('Content-Type', 'application/json');
  
  if (!skipAuth) {
    await addAuthHeader(headers);
  }

  // Build full URL
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...fetchConfig,
      headers,
    });

    return await handleResponse<T>(response);
  } catch (error) {
    // Transform and rethrow error
    throw transformAPIError(error);
  }
}

// Convenience methods
export const api = {
  get: <T>(endpoint: string, config?: RequestConfig) =>
    apiClient<T>(endpoint, { ...config, method: 'GET' }),

  post: <T>(endpoint: string, data: unknown, config?: RequestConfig) =>
    apiClient<T>(endpoint, {
      ...config,
      method: 'POST',
      body: JSON.stringify(data),
    }),

  put: <T>(endpoint: string, data: unknown, config?: RequestConfig) =>
    apiClient<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  patch: <T>(endpoint: string, data: unknown, config?: RequestConfig) =>
    apiClient<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: <T>(endpoint: string, config?: RequestConfig) =>
    apiClient<T>(endpoint, { ...config, method: 'DELETE' }),
};
```

### 4.2 React Query Configuration

```typescript
// src/lib/api/query-client.ts

import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,  // 5 minutes
      gcTime: 10 * 60 * 1000,     // 10 minutes (formerly cacheTime)
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
      retryDelay: 1000,
    },
  },
});
```

```typescript
// src/app/providers.tsx

'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from '@/lib/api/query-client';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

### 4.3 Custom Query Hooks Pattern

```typescript
// src/lib/api/hooks/useQuestions.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../client';

// Type definitions
export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  subject: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  explanation: {
    en: string;
    am: string;
    or: string;
  };
}

export interface QuestionFilters {
  subject?: string;
  topic?: string;
  difficulty?: string;
  limit?: number;
}

export interface SubmitAnswerPayload {
  questionId: string;
  selectedAnswer: number;
  timeSpent: number;
}

export interface SubmitAnswerResponse {
  correct: boolean;
  points: number;
  explanation: string;
}

// Query keys factory
export const questionKeys = {
  all: ['questions'] as const,
  lists: () => [...questionKeys.all, 'list'] as const,
  list: (filters: QuestionFilters) => [...questionKeys.lists(), filters] as const,
  details: () => [...questionKeys.all, 'detail'] as const,
  detail: (id: string) => [...questionKeys.details(), id] as const,
};

// Fetch questions list
export function useQuestions(filters: QuestionFilters = {}) {
  return useQuery({
    queryKey: questionKeys.list(filters),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.subject) params.append('subject', filters.subject);
      if (filters.topic) params.append('topic', filters.topic);
      if (filters.difficulty) params.append('difficulty', filters.difficulty);
      if (filters.limit) params.append('limit', filters.limit.toString());

      return api.get<Question[]>(`/api/questions?${params.toString()}`);
    },
  });
}

// Fetch single question
export function useQuestion(id: string) {
  return useQuery({
    queryKey: questionKeys.detail(id),
    queryFn: () => api.get<Question>(`/api/questions/${id}`),
    enabled: !!id,
  });
}

// Submit answer mutation
export function useSubmitAnswer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SubmitAnswerPayload) =>
      api.post<SubmitAnswerResponse>('/api/questions/submit', payload),
    onSuccess: (data, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['user', 'progress'] });
      queryClient.invalidateQueries({ queryKey: ['user', 'analytics'] });
      
      // Optional: Update question cache with result
      queryClient.setQueryData<Question>(
        questionKeys.detail(variables.questionId),
        (old) => old && { ...old, userAnswer: variables.selectedAnswer }
      );
    },
  });
}

// Prefetch next question
export function usePrefetchQuestion(id: string) {
  const queryClient = useQueryClient();

  return () => {
    queryClient.prefetchQuery({
      queryKey: questionKeys.detail(id),
      queryFn: () => api.get<Question>(`/api/questions/${id}`),
    });
  };
}
```

### 4.4 Optimistic Update Pattern

```typescript
// src/lib/api/hooks/useUserProfile.ts

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../client';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  grade: number;
  stream: 'natural' | 'social';
  avatar?: string;
}

export interface UpdateProfilePayload {
  name?: string;
  avatar?: string;
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) =>
      api.patch<UserProfile>('/api/user/profile', payload),
    
    // Optimistic update
    onMutate: async (newData) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['user', 'profile'] });

      // Snapshot previous value
      const previousProfile = queryClient.getQueryData<UserProfile>(['user', 'profile']);

      // Optimistically update to new value
      queryClient.setQueryData<UserProfile>(['user', 'profile'], (old) => ({
        ...old!,
        ...newData,
      }));

      // Return context with snapshot
      return { previousProfile };
    },

    // On error, rollback to previous value
    onError: (err, newData, context) => {
      if (context?.previousProfile) {
        queryClient.setQueryData(['user', 'profile'], context.previousProfile);
      }
    },

    // Always refetch after error or success
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
    },
  });
}
```

### 4.5 Pagination Pattern

```typescript
// src/lib/api/hooks/useLibrary.ts

import { useInfiniteQuery } from '@tanstack/react-query';
import { api } from '../client';

export interface Textbook {
  id: string;
  title: string;
  subject: string;
  grade: number;
  stream: 'natural' | 'social';
  coverUrl: string;
  pdfUrl: string;
}

export interface TextbookFilters {
  grade?: number;
  subject?: string;
  stream?: string;
  search?: string;
}

interface TextbookResponse {
  data: Textbook[];
  meta: {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

export function useLibrary(filters: TextbookFilters = {}) {
  return useInfiniteQuery({
    queryKey: ['library', 'textbooks', filters],
    queryFn: async ({ pageParam = 1 }) => {
      const params = new URLSearchParams();
      params.append('page', pageParam.toString());
      params.append('limit', '12');
      
      if (filters.grade) params.append('grade', filters.grade.toString());
      if (filters.subject) params.append('subject', filters.subject);
      if (filters.stream) params.append('stream', filters.stream);
      if (filters.search) params.append('search', filters.search);

      return api.get<TextbookResponse>(`/api/library/textbooks?${params.toString()}`);
    },
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasMore ? lastPage.meta.page + 1 : undefined,
    initialPageParam: 1,
  });
}
```

## 5. Fixed Navigation Architecture

### 5.1 Navigation Component Structure

```
FixedNavbar (src/components/navigation/FixedNavbar.tsx)
├── NavbarContainer (sticky container with z-index)
├── NavbarContent (flex layout with sections)
│   ├── LogoSection
│   │   └── BrandLogo (link to home)
│   ├── NavigationSection (hidden on mobile)
│   │   ├── NavLink (regular nav items)
│   │   └── MegaMenuTrigger (hover-activated)
│   │       └── MegaMenuPanel
│   │           ├── MenuCategory
│   │           │   ├── CategoryHeader
│   │           │   └── MenuItem[]
│   │           └── MenuCategory[]
│   ├── SearchSection
│   │   └── SearchButton (opens command palette)
│   ├── WorkspaceSection
│   │   └── WorkspaceChip (role + grade display)
│   └── UserSection
│       └── UserDropdown
│           ├── ProfileLink
│           ├── SettingsLink
│           └── LogoutButton
└── MobileBottomNav (mobile only, below lg breakpoint)
    └── NavItem[] (Dashboard, Practice, Tutor, Battle, More)
```

### 5.2 Fixed Navbar Implementation

```typescript
// src/components/navigation/FixedNavbar.tsx

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { 
  Home, 
  BookOpen, 
  Target, 
  MessageSquare, 
  Swords, 
  Library, 
  Trophy,
  Search,
  Menu,
  X 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { MegaMenu } from './MegaMenu';
import { UserDropdown } from './UserDropdown';
import { WorkspaceChip } from './WorkspaceChip';

const studentNavItems = [
  { label: 'Home', href: '/home', icon: Home },
  { label: 'Learn', href: '/learn', icon: Target },
  { label: 'Progress', href: '/progress', icon: TrendingUp },
  { label: 'Compete', href: '/compete', icon: Swords },
  { label: 'Resources', href: '/resources', icon: Library },
  { label: 'Get Help', href: '/help', icon: MessageSquare },
];

const megaMenus = {
  curriculum: {
    label: 'Curriculum',
    href: '/curriculum',
    categories: [
      {
        title: 'Natural Science',
        items: [
          { label: 'Mathematics', href: '/curriculum/mathematics', icon: '📐' },
          { label: 'Physics', href: '/curriculum/physics', icon: '⚛️' },
          { label: 'Chemistry', href: '/curriculum/chemistry', icon: '🧪' },
          { label: 'Biology', href: '/curriculum/biology', icon: '🧬' },
        ],
      },
      {
        title: 'Social Science',
        items: [
          { label: 'English', href: '/curriculum/english', icon: '📚' },
          { label: 'History', href: '/curriculum/history', icon: '📜' },
          { label: 'Geography', href: '/curriculum/geography', icon: '🗺️' },
          { label: 'Civics', href: '/curriculum/civics', icon: '⚖️' },
        ],
      },
    ],
  },
  exams: {
    label: 'Exams',
    href: '/exams',
    categories: [
      {
        title: 'Exam Types',
        items: [
          { label: 'Mock Exams', href: '/exams/mock', icon: '📝' },
          { label: 'Exam Simulator', href: '/exam-simulation', icon: '🎯' },
          { label: 'Past Papers', href: '/exams/past-papers', icon: '📄' },
          { label: 'Practice Tests', href: '/exams/practice', icon: '✍️' },
        ],
      },
      {
        title: 'Resources',
        items: [
          { label: 'Exam Guide', href: '/exams/guide', icon: '📖' },
          { label: 'Study Tips', href: '/exams/tips', icon: '💡' },
          { label: 'Exam Schedule', href: '/exams/schedule', icon: '📅' },
        ],
      },
    ],
  },
};

export function FixedNavbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="sticky top-0 z-fixed h-16 border-b border-neutral-200 bg-white">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-default bg-gradient-to-br from-brand-primary to-brand-accent" />
              <span className="text-xl font-bold text-neutral-900">Finkison</span>
            </Link>
          </div>

          {/* Desktop Navigation (hidden on mobile) */}
          <div className="hidden lg:flex lg:items-center lg:space-x-1">
            {studentNavItems.slice(0, 4).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'rounded-default px-3 py-2 text-sm font-medium transition-colors',
                  pathname === item.href
                    ? 'bg-neutral-100 text-brand-primary'
                    : 'text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900'
                )}
              >
                {item.label}
              </Link>
            ))}

            {/* Mega Menus */}
            <MegaMenu config={megaMenus.curriculum} />
            <MegaMenu config={megaMenus.exams} />

            {studentNavItems.slice(4).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'rounded-default px-3 py-2 text-sm font-medium transition-colors',
                  pathname === item.href
                    ? 'bg-neutral-100 text-brand-primary'
                    : 'text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900'
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <button
              className="rounded-default p-2 text-neutral-700 hover:bg-neutral-100"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Workspace Chip (hidden on mobile) */}
            <div className="hidden lg:block">
              <WorkspaceChip />
            </div>

            {/* User Dropdown */}
            <UserDropdown />

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden rounded-default p-2 text-neutral-700 hover:bg-neutral-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="lg:hidden">
            <div className="space-y-1 px-4 pb-3 pt-2">
              {studentNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'block rounded-default px-3 py-2 text-base font-medium',
                    pathname === item.href
                      ? 'bg-neutral-100 text-brand-primary'
                      : 'text-neutral-700 hover:bg-neutral-50'
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-fixed border-t border-neutral-200 bg-white">
        <div className="grid grid-cols-5 h-16">
          {studentNavItems.slice(0, 4).map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center space-y-1',
                  pathname === item.href
                    ? 'text-brand-primary'
                    : 'text-neutral-600'
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs">{item.label}</span>
              </Link>
            );
          })}
          <button
            className="flex flex-col items-center justify-center space-y-1 text-neutral-600"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
            <span className="text-xs">More</span>
          </button>
        </div>
      </div>
    </>
  );
}
```

### 5.3 Mega Menu Implementation

```typescript
// src/components/navigation/MegaMenu.tsx

'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MenuItem {
  label: string;
  href: string;
  icon: string;
}

interface MenuCategory {
  title: string;
  items: MenuItem[];
}

interface MegaMenuConfig {
  label: string;
  href: string;
  categories: MenuCategory[];
}

interface MegaMenuProps {
  config: MegaMenuConfig;
}

export function MegaMenu({ config }: MegaMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout>();
  const closeTimeoutRef = useRef<NodeJS.Timeout>();

  const handleMouseEnter = () => {
    // Clear any pending close timeout
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }

    // Set timeout to show menu after 500ms hover
    hoverTimeoutRef.current = setTimeout(() => {
      setShouldShow(true);
      setIsOpen(true);
    }, 500);
  };

  const handleMouseLeave = () => {
    // Clear any pending show timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    // Set timeout to hide menu after 180ms grace period
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
      setTimeout(() => setShouldShow(false), 200); // Wait for animation
    }, 180);
  };

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className={cn(
          'flex items-center space-x-1 rounded-default px-3 py-2 text-sm font-medium transition-colors',
          isOpen
            ? 'bg-neutral-100 text-brand-primary'
            : 'text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900'
        )}
      >
        <span>{config.label}</span>
        <ChevronDown
          className={cn(
            'h-4 w-4 transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {/* Mega Menu Panel */}
      {shouldShow && (
        <div
          className={cn(
            'absolute left-0 top-full mt-2 w-[32rem] rounded-xl border border-neutral-200 bg-white p-6 shadow-lg transition-opacity',
            isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          )}
        >
          <div className="grid grid-cols-2 gap-6">
            {config.categories.map((category) => (
              <div key={category.title}>
                <h3 className="mb-3 text-xs font-mono uppercase tracking-wider text-neutral-500">
                  {category.title}
                </h3>
                <div className="space-y-2">
                  {category.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="group flex items-center space-x-3 rounded-default p-2 transition-colors hover:bg-neutral-50"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-xl transition-transform group-hover:scale-110">
                        {item.icon}
                      </div>
                      <span className="text-sm font-medium text-neutral-900 group-hover:text-brand-primary">
                        {item.label}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

## 6. Loading and Error State Patterns

### 6.1 Loading State Components

```typescript
// src/components/ui/LoadingState.tsx

import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// Skeleton Loader
export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-default bg-neutral-200', className)}
      {...props}
    />
  );
}

// Full Page Spinner
interface SpinnerProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Spinner({ text, size = 'md' }: SpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <Loader2 className={cn('animate-spin text-brand-primary', sizeClasses[size])} />
      {text && <p className="text-sm text-neutral-600">{text}</p>}
    </div>
  );
}

// Inline Button Spinner
export function ButtonSpinner() {
  return <Loader2 className="mr-2 h-4 w-4 animate-spin" />;
}

// Progress Bar
interface ProgressBarProps {
  progress: number; // 0-100
  label?: string;
}

export function ProgressBar({ progress, label }: ProgressBarProps) {
  return (
    <div className="w-full space-y-2">
      {label && <p className="text-sm font-medium text-neutral-700">{label}</p>}
      <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-200">
        <div
          className="h-full bg-brand-primary transition-all duration-300"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
      <p className="text-xs text-neutral-500">{Math.round(progress)}%</p>
    </div>
  );
}

// List Skeleton
export function ListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  );
}

// Card Skeleton
export function CardSkeleton() {
  return (
    <div className="rounded-xl border border-neutral-200 p-4 space-y-4">
      <Skeleton className="h-6 w-1/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-10 w-24" />
    </div>
  );
}
```

### 6.2 Error State Components

```typescript
// src/components/ui/ErrorState.tsx

import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Something went wrong',
  message,
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-12">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-semantic-error/10">
        <AlertCircle className="h-8 w-8 text-semantic-error" />
      </div>
      <div className="space-y-2 text-center">
        <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
        <p className="text-sm text-neutral-600 max-w-md">{message}</p>
      </div>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      )}
    </div>
  );
}

// Empty State
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  message: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, message, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-12">
      {icon && (
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
          {icon}
        </div>
      )}
      <div className="space-y-2 text-center">
        <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
        <p className="text-sm text-neutral-600 max-w-md">{message}</p>
      </div>
      {action}
    </div>
  );
}

// Inline Error
interface InlineErrorProps {
  message: string;
}

export function InlineError({ message }: InlineErrorProps) {
  return (
    <div className="flex items-center space-x-2 text-semantic-error">
      <AlertCircle className="h-4 w-4" />
      <span className="text-sm">{message}</span>
    </div>
  );
}
```

### 6.3 Error Boundary

```typescript
// src/components/ui/ErrorBoundary.tsx

'use client';

import { Component, ReactNode } from 'react';
import { ErrorState } from './ErrorState';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorState
          title="Something went wrong"
          message={this.state.error?.message || 'An unexpected error occurred'}
          onRetry={this.handleRetry}
        />
      );
    }

    return this.props.children;
  }
}
```

### 6.4 Toast Notification System

```typescript
// src/components/ui/Toast.tsx

'use client';

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  duration?: number;
}

interface ToastContextValue {
  showToast: (toast: Omit<Toast, 'id'>) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(7);
    const duration = toast.duration || 4000;

    setToasts((prev) => [...prev, { ...toast, id }]);

    // Auto dismiss
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-tooltip space-y-2 w-full max-w-sm">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              'flex items-center space-x-3 rounded-xl border p-4 shadow-lg animate-in slide-in-from-bottom-5',
              toast.type === 'success' && 'border-semantic-success bg-semantic-success/10',
              toast.type === 'error' && 'border-semantic-error bg-semantic-error/10',
              toast.type === 'info' && 'border-semantic-info bg-semantic-info/10'
            )}
          >
            {toast.type === 'success' && <CheckCircle className="h-5 w-5 text-semantic-success" />}
            {toast.type === 'error' && <AlertCircle className="h-5 w-5 text-semantic-error" />}
            {toast.type === 'info' && <Info className="h-5 w-5 text-semantic-info" />}
            <p className="flex-1 text-sm text-neutral-900">{toast.message}</p>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-neutral-500 hover:text-neutral-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}
```

## 7. Page Component Architecture

### 7.1 Dashboard Page

```typescript
// src/app/dashboard/page.tsx

'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Flame, TrendingUp, Calendar, Target } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

interface DashboardData {
  user: {
    name: string;
    grade: number;
    stream: string;
  };
  streak: number;
  weeklyProgress: {
    questionsAnswered: number;
    percentageIncrease: number;
  };
  upcomingExam: {
    name: string;
    daysRemaining: number;
  };
  recentActivity: Array<{
    id: string;
    type: string;
    timestamp: string;
    details: string;
  }>;
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-32 w-full" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
      </div>
      <Skeleton className="h-64 w-full" />
    </div>
  );
}

export default function DashboardPage() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api.get<DashboardData>('/api/dashboard'),
    refetchInterval: 60000, // Refresh every 60 seconds
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <DashboardSkeleton />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <ErrorState
          message="Failed to load dashboard data"
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Greeting Card */}
      <Card>
        <CardContent className="py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900">
                Welcome back, {data.user.name}! 👋
              </h1>
              <p className="mt-1 text-neutral-600">
                Grade {data.user.grade} • {data.user.stream} Stream
              </p>
              <p className="mt-1 text-sm text-neutral-500">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Streak Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Flame className="h-5 w-5 text-orange-500" />
              <span>Current Streak</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-brand-primary">
              {data.streak}
              <span className="ml-2 text-lg font-normal text-neutral-600">days</span>
            </div>
            <p className="mt-2 text-sm text-neutral-600">
              Keep it up! Come back tomorrow to maintain your streak.
            </p>
          </CardContent>
        </Card>

        {/* Weekly Progress Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-emerald-500" />
              <span>This Week</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-neutral-900">
              {data.weeklyProgress.questionsAnswered}
            </div>
            <p className="mt-2 text-sm text-neutral-600">
              <span className="font-medium text-semantic-success">
                +{data.weeklyProgress.percentageIncrease}%
              </span>{' '}
              from last week
            </p>
          </CardContent>
        </Card>

        {/* Upcoming Exam Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              <span>Upcoming Exam</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-neutral-900">
              {data.upcomingExam.daysRemaining}
              <span className="ml-2 text-lg font-normal text-neutral-600">days</span>
            </div>
            <p className="mt-2 text-sm text-neutral-600">{data.upcomingExam.name}</p>
            <Link href="/exam-simulation" className="mt-4 inline-block">
              <Button size="sm">Practice Now</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Quick Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/adaptive-learning">
              <Button variant="outline" className="w-full">
                Practice
              </Button>
            </Link>
            <Link href="/ai-tutor">
              <Button variant="outline" className="w-full">
                AI Tutor
              </Button>
            </Link>
            <Link href="/battle">
              <Button variant="outline" className="w-full">
                Battle
              </Button>
            </Link>
            <Link href="/exam-simulation">
              <Button variant="outline" className="w-full">
                Exam Simulator
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {data.recentActivity.length === 0 ? (
            <p className="text-sm text-neutral-600">
              No recent activity. Start practicing to see your progress here!
            </p>
          ) : (
            <div className="space-y-4">
              {data.recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-4 border-l-2 border-brand-primary pl-4"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-neutral-900">
                      {activity.type}
                    </p>
                    <p className="text-sm text-neutral-600">{activity.details}</p>
                    <p className="text-xs text-neutral-500 mt-1">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
```

### 7.2 Practice Mode Page

```typescript
// src/app/adaptive-learning/page.tsx

'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import { useToast } from '@/components/ui/Toast';
import { CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  subject: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  explanation: {
    en: string;
    am: string;
    or: string;
  };
}

interface PracticeSession {
  questions: Question[];
  currentIndex: number;
  totalQuestions: number;
}

export default function PracticeModePage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [explanationLang, setExplanationLang] = useState<'en' | 'am' | 'or'>('en');
  
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  // Fetch practice session
  const { data: session, isLoading, error } = useQuery({
    queryKey: ['practice', 'session'],
    queryFn: () => api.get<PracticeSession>('/api/practice/session'),
  });

  // Submit answer mutation
  const submitAnswer = useMutation({
    mutationFn: (payload: { questionId: string; selectedAnswer: number; timeSpent: number }) =>
      api.post('/api/questions/submit', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'progress'] });
    },
    onError: () => {
      showToast({
        type: 'error',
        message: 'Failed to submit answer. Please try again.',
      });
    },
  });

  // Prefetch next question
  const prefetchNext = () => {
    if (session && currentIndex + 1 < session.questions.length) {
      const nextQuestion = session.questions[currentIndex + 1];
      queryClient.prefetchQuery({
        queryKey: ['question', nextQuestion.id],
        queryFn: () => api.get(`/api/questions/${nextQuestion.id}`),
      });
    }
  };

  const handleSelectAnswer = (optionIndex: number) => {
    if (isAnswered) return;
    
    setSelectedAnswer(optionIndex);
    setIsAnswered(true);

    // Submit answer
    submitAnswer.mutate({
      questionId: currentQuestion.id,
      selectedAnswer: optionIndex,
      timeSpent: 0, // TODO: Track actual time
    });

    // Prefetch next question
    prefetchNext();
  };

  const handleNextQuestion = () => {
    if (currentIndex < (session?.questions.length || 0) - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner text="Loading practice questions..." />
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <ErrorState message="Failed to load practice session" />
      </div>
    );
  }

  const currentQuestion = session.questions[currentIndex];
  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-6">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-neutral-700">
            Question {currentIndex + 1} of {session.totalQuestions}
          </span>
          <span className="text-neutral-500">
            {Math.round(((currentIndex + 1) / session.totalQuestions) * 100)}% Complete
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-200">
          <div
            className="h-full bg-brand-primary transition-all duration-300"
            style={{
              width: `${((currentIndex + 1) / session.totalQuestions) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Question Card */}
      <Card className="p-6">
        {/* Question Meta */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
            {currentQuestion.subject}
          </span>
          <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-800">
            {currentQuestion.topic}
          </span>
          <span
            className={cn(
              'rounded-full px-3 py-1 text-xs font-medium',
              currentQuestion.difficulty === 'easy' && 'bg-green-100 text-green-800',
              currentQuestion.difficulty === 'medium' && 'bg-yellow-100 text-yellow-800',
              currentQuestion.difficulty === 'hard' && 'bg-red-100 text-red-800'
            )}
          >
            {currentQuestion.difficulty}
          </span>
        </div>

        {/* Question Text */}
        <h2 className="text-xl font-medium text-neutral-900 mb-6">
          {currentQuestion.text}
        </h2>

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrectOption = index === currentQuestion.correctAnswer;
            const showCorrect = isAnswered && isCorrectOption;
            const showIncorrect = isAnswered && isSelected && !isCorrect;

            return (
              <button
                key={index}
                onClick={() => handleSelectAnswer(index)}
                disabled={isAnswered}
                className={cn(
                  'relative flex items-center justify-between rounded-xl border-2 p-4 text-left transition-all',
                  !isAnswered && 'hover:border-brand-primary hover:bg-brand-primary/5',
                  !isAnswered && 'cursor-pointer',
                  isAnswered && 'cursor-not-allowed',
                  showCorrect && 'border-semantic-success bg-semantic-success/10',
                  showIncorrect && 'border-semantic-error bg-semantic-error/10',
                  !isAnswered && !isSelected && 'border-neutral-300',
                  !isAnswered && isSelected && 'border-brand-primary bg-brand-primary/5'
                )}
              >
                <span className="text-sm font-medium text-neutral-900">{option}</span>
                {showCorrect && <CheckCircle className="h-5 w-5 text-semantic-success" />}
                {showIncorrect && <XCircle className="h-5 w-5 text-semantic-error" />}
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {isAnswered && (
          <div className="space-y-4 border-t border-neutral-200 pt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-neutral-900">Explanation</h3>
              <div className="flex space-x-2">
                {(['en', 'am', 'or'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setExplanationLang(lang)}
                    className={cn(
                      'rounded-default px-3 py-1 text-xs font-medium transition-colors',
                      explanationLang === lang
                        ? 'bg-brand-primary text-white'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    )}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-sm text-neutral-700 leading-relaxed">
              {currentQuestion.explanation[explanationLang]}
            </p>
          </div>
        )}
      </Card>

      {/* Navigation */}
      {isAnswered && (
        <div className="flex justify-between">
          <Button variant="outline">View Progress</Button>
          <Button onClick={handleNextQuestion}>
            {currentIndex < session.questions.length - 1 ? 'Next Question →' : 'Finish'}
          </Button>
        </div>
      )}
    </div>
  );
}
```

### 7.3 Battle Arena Page (Real-time WebSocket)

```typescript
// src/app/battle/page.tsx

'use client';

import { useState, useEffect, useRef } from 'react';
import { useSocket } from '@/lib/hooks/useSocket';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/LoadingState';
import { Swords, Trophy, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';

interface BattleState {
  status: 'matchmaking' | 'countdown' | 'playing' | 'finished';
  players: {
    player1: { id: string; name: string; score: number; avatar?: string };
    player2: { id: string; name: string; score: number; avatar?: string };
  };
  currentQuestion?: {
    id: string;
    text: string;
    options: string[];
    round: number;
    totalRounds: number;
  };
  timeRemaining?: number;
  winner?: 'player1' | 'player2' | 'tie';
}

export default function BattleArenaPage() {
  const [battleState, setBattleState] = useState<BattleState>({
    status: 'matchmaking',
    players: {
      player1: { id: '', name: '', score: 0 },
      player2: { id: '', name: '', score: 0 },
    },
  });

  const { socket, isConnected } = useSocket();
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!socket) return;

    // Join battle queue
    socket.emit('battle:join');

    // Listen for match found
    socket.on('battle:matched', (data: BattleState) => {
      setBattleState({ ...data, status: 'countdown' });
      
      // Start countdown
      let countdown = 3;
      const countdownInterval = setInterval(() => {
        if (countdown === 0) {
          clearInterval(countdownInterval);
          socket.emit('battle:ready');
        } else {
          countdown--;
        }
      }, 1000);
    });

    // Listen for new question
    socket.on('battle:question', (data: BattleState) => {
      setBattleState({ ...data, status: 'playing' });
    });

    // Listen for round result
    socket.on('battle:round_result', (data: BattleState) => {
      setBattleState(data);
    });

    // Listen for battle end
    socket.on('battle:finished', (data: BattleState) => {
      setBattleState({ ...data, status: 'finished' });
      
      // Show confetti if winner
      if (data.winner === 'player1') {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    });

    return () => {
      socket.off('battle:matched');
      socket.off('battle:question');
      socket.off('battle:round_result');
      socket.off('battle:finished');
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [socket]);

  const handleAnswerSubmit = (optionIndex: number) => {
    if (!socket || !battleState.currentQuestion) return;
    
    socket.emit('battle:answer', {
      questionId: battleState.currentQuestion.id,
      answer: optionIndex,
    });
  };

  // Matchmaking Screen
  if (battleState.status === 'matchmaking') {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center space-y-4">
          <Swords className="mx-auto h-16 w-16 text-brand-primary animate-pulse" />
          <h2 className="text-2xl font-bold text-neutral-900">Finding an opponent...</h2>
          <p className="text-neutral-600">This should only take a moment</p>
          <Spinner />
        </div>
      </div>
    );
  }

  // Battle Screen
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
      {/* Player Score Cards */}
      <div className="grid grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-full bg-brand-primary flex items-center justify-center text-white font-bold text-xl">
              {battleState.players.player1.name[0]}
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">
                {battleState.players.player1.name} (You)
              </h3>
              <p className="text-2xl font-bold text-brand-primary">
                {battleState.players.player1.score} pts
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-full bg-brand-secondary flex items-center justify-center text-white font-bold text-xl">
              {battleState.players.player2.name[0]}
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">
                {battleState.players.player2.name}
              </h3>
              <p className="text-2xl font-bold text-brand-secondary">
                {battleState.players.player2.score} pts
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Question Card */}
      {battleState.status === 'playing' && battleState.currentQuestion && (
        <Card className="p-6 space-y-6">
          {/* Round Info */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-neutral-600">
              Round {battleState.currentQuestion.round} of {battleState.currentQuestion.totalRounds}
            </span>
            <div className="flex items-center space-x-2 text-brand-primary">
              <Clock className="h-4 w-4" />
              <span className="text-lg font-bold">{battleState.timeRemaining}s</span>
            </div>
          </div>

          {/* Question */}
          <h2 className="text-xl font-medium text-neutral-900">
            {battleState.currentQuestion.text}
          </h2>

          {/* Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {battleState.currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSubmit(index)}
                className="rounded-xl border-2 border-neutral-300 p-4 text-left hover:border-brand-primary hover:bg-brand-primary/5 transition-all"
              >
                {option}
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* Victory Screen */}
      {battleState.status === 'finished' && (
        <Card className="p-12 text-center space-y-6">
          <Trophy className="mx-auto h-20 w-20 text-yellow-500" />
          <h2 className="text-3xl font-bold text-neutral-900">
            {battleState.winner === 'player1'
              ? 'Victory! 🎉'
              : battleState.winner === 'tie'
              ? "It's a Tie!"
              : 'Defeat'}
          </h2>
          <div className="space-y-2">
            <p className="text-xl text-neutral-700">
              Final Score: {battleState.players.player1.score} - {battleState.players.player2.score}
            </p>
          </div>
          <div className="flex justify-center space-x-4">
            <Button onClick={() => window.location.reload()}>Play Again</Button>
            <Button variant="outline" onClick={() => window.location.href = '/dashboard'}>
              Return to Dashboard
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
```

## 8. Form Validation Architecture

### 8.1 Form Validation Hook

```typescript
// src/lib/hooks/useForm.ts

import { useState, ChangeEvent, FormEvent } from 'react';

type ValidationRule<T> = (value: T) => string | undefined;

interface FieldConfig<T> {
  initialValue: T;
  rules?: ValidationRule<T>[];
}

interface FormConfig<T extends Record<string, any>> {
  fields: { [K in keyof T]: FieldConfig<T[K]> };
  onSubmit: (values: T) => void | Promise<void>;
}

export function useForm<T extends Record<string, any>>(config: FormConfig<T>) {
  const [values, setValues] = useState<T>(
    Object.entries(config.fields).reduce(
      (acc, [key, field]) => ({
        ...acc,
        [key]: (field as FieldConfig<any>).initialValue,
      }),
      {} as T
    )
  );

  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = (name: keyof T, value: any): string | undefined => {
    const field = config.fields[name];
    if (!field.rules) return undefined;

    for (const rule of field.rules) {
      const error = rule(value);
      if (error) return error;
    }

    return undefined;
  };

  const handleChange = (name: keyof T) => (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    setValues((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleBlur = (name: keyof T) => () => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    
    const error = validateField(name, values[name]);
    if (error) {
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const validateAll = (): boolean => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    Object.keys(config.fields).forEach((key) => {
      const name = key as keyof T;
      const error = validateField(name, values[name]);
      if (error) {
        newErrors[name] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    setTouched(
      Object.keys(config.fields).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {}
      )
    );

    return isValid;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateAll()) {
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        document.getElementById(firstErrorField)?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
      return;
    }

    setIsSubmitting(true);
    try {
      await config.onSubmit(values);
    } finally {
      setIsSubmitting(false);
    }
  };

  const reset = () => {
    setValues(
      Object.entries(config.fields).reduce(
        (acc, [key, field]) => ({
          ...acc,
          [key]: (field as FieldConfig<any>).initialValue,
        }),
        {} as T
      )
    );
    setErrors({});
    setTouched({});
  };

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setFieldValue: (name: keyof T, value: any) =>
      setValues((prev) => ({ ...prev, [name]: value })),
  };
}

// Common validation rules
export const validators = {
  required: (message = 'This field is required') => (value: any) =>
    !value || (typeof value === 'string' && !value.trim()) ? message : undefined,

  email: (message = 'Please enter a valid email') => (value: string) =>
    value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? message : undefined,

  minLength: (min: number, message?: string) => (value: string) =>
    value && value.length < min
      ? message || `Must be at least ${min} characters`
      : undefined,

  maxLength: (max: number, message?: string) => (value: string) =>
    value && value.length > max
      ? message || `Must be no more than ${max} characters`
      : undefined,

  pattern: (regex: RegExp, message: string) => (value: string) =>
    value && !regex.test(value) ? message : undefined,

  password: (message = 'Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number') =>
    (value: string) => {
      if (!value) return undefined;
      const hasUppercase = /[A-Z]/.test(value);
      const hasLowercase = /[a-z]/.test(value);
      const hasNumber = /[0-9]/.test(value);
      const isLongEnough = value.length >= 8;
      return hasUppercase && hasLowercase && hasNumber && isLongEnough
        ? undefined
        : message;
    },
};
```

### 8.2 Form Example Usage

```typescript
// src/app/auth/login/page.tsx

'use client';

import { useForm, validators } from '@/lib/hooks/useForm';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useToast } from '@/components/ui/Toast';
import { api } from '@/lib/api/client';

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const { showToast } = useToast();

  const form = useForm<LoginForm>({
    fields: {
      email: {
        initialValue: '',
        rules: [validators.required(), validators.email()],
      },
      password: {
        initialValue: '',
        rules: [validators.required(), validators.minLength(8)],
      },
    },
    onSubmit: async (values) => {
      try {
        await api.post('/api/auth/login', values);
        window.location.href = '/dashboard';
      } catch (error) {
        showToast({
          type: 'error',
          message: 'Login failed. Please check your credentials.',
        });
      }
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md p-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-6">Welcome Back</h1>
        
        <form onSubmit={form.handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
              Email *
            </label>
            <Input
              id="email"
              type="email"
              value={form.values.email}
              onChange={form.handleChange('email')}
              onBlur={form.handleBlur('email')}
              error={form.touched.email && !!form.errors.email}
              helperText={form.touched.email ? form.errors.email : undefined}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-2">
              Password *
            </label>
            <Input
              id="password"
              type="password"
              value={form.values.password}
              onChange={form.handleChange('password')}
              onBlur={form.handleBlur('password')}
              error={form.touched.password && !!form.errors.password}
              helperText={form.touched.password ? form.errors.password : undefined}
              placeholder="Enter your password"
            />
          </div>

          <Button type="submit" className="w-full" isLoading={form.isSubmitting}>
            Sign In
          </Button>
        </form>
      </Card>
    </div>
  );
}
```

## 9. Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Error Boundary Renders for Component Errors

**For any** React component that throws an error during rendering, the error boundary SHALL catch the error and render the fallback UI with a retry button

**Validates: Requirements 1.4, 5.8**

### Property 2: Authentication Token Injection

**For any** authenticated API request, the API client SHALL include an Authorization header with a valid Bearer token

**Validates: Requirements 2.3**

### Property 3: Optimistic Update Consistency

**For any** mutation operation (answer submission, profile update), the UI SHALL update immediately before the server response, and rollback on error

**Validates: Requirements 2.6**

### Property 4: Request Deduplication

**For any** endpoint, when multiple identical concurrent requests are made, only one network call SHALL be executed

**Validates: Requirements 2.8**

### Property 5: Error Response Format Consistency

**For any** error response from the API, the response SHALL contain statusCode, message, and optional details fields

**Validates: Requirements 2.9, 2.13**

### Property 6: Query Invalidation After Mutation

**For any** successful mutation, all related query keys SHALL be invalidated to trigger refetches

**Validates: Requirements 2.10**

### Property 7: Endpoint Validation

**For any** POST or PUT endpoint, sending invalid payloads SHALL result in validation error responses

**Validates: Requirements 2.15**

### Property 8: Navbar Height Consistency

**For any** viewport size, the fixed navbar height SHALL be between 56px and 64px

**Validates: Requirements 4.1**

### Property 9: Mega Menu Hover Behavior

**For any** mega menu trigger element, hovering SHALL display the corresponding mega menu panel

**Validates: Requirements 4.6**

### Property 10: User Context Display

**For any** authenticated user with role and grade information, the workspace context chip SHALL display both values

**Validates: Requirements 4.8**

### Property 11: Skeleton Loaders for Lists

**For any** list view component in loading state, skeleton loaders SHALL be rendered matching the content structure

**Validates: Requirements 5.1**

### Property 12: Interactive Element Disabling During Mutation

**For any** form during mutation, all interactive elements SHALL be disabled to prevent duplicate submissions

**Validates: Requirements 5.5**

### Property 13: Toast Auto-Dismiss Timing

**For any** non-critical error, a toast notification SHALL appear and auto-dismiss after 4 seconds

**Validates: Requirements 5.6**

### Property 14: Form Field Error Display

**For any** form field with validation error, an error message SHALL appear below the field with red text and an error icon

**Validates: Requirements 5.7**

### Property 15: Dashboard Data Rendering

**For any** user with name, grade, and stream information, all elements SHALL appear in the dashboard greeting card

**Validates: Requirements 6.1**

### Property 16: Question Counter Formatting

**For any** question number and total count, the practice mode counter SHALL display in "Question X of Y" format

**Validates: Requirements 7.1**

### Property 17: Chat Message Rendering

**For any** chat message, user messages SHALL be right-aligned with different background color from assistant messages

**Validates: Requirements 8.3, 8.4**

### Property 18: Battle Score Synchronization

**For any** battle state update, both players' scores SHALL be displayed in real-time

**Validates: Requirements 9.4**

### Property 19: Exam Navigation Color Coding

**For any** exam question, the navigation sidebar SHALL use color coding (gray for unanswered, blue for answered, yellow for flagged)

**Validates: Requirements 10.7**

### Property 20: Library Filtering Logic

**For any** textbook dataset and filter combination, the library SHALL display only textbooks matching all active filters

**Validates: Requirements 11.10**

### Property 21: Leaderboard Rank Display

**For any** user with ranking data, the leaderboard SHALL display the user's rank card with position, name, avatar, points, and accuracy

**Validates: Requirements 12.2**

### Property 22: Form Validation on Blur

**For any** form field, validation SHALL execute immediately after blur event and display inline errors

**Validates: Requirements 17.5**

### Property 23: Focus Ring Visibility

**For any** interactive element receiving keyboard focus, a 2px blue-500 outline with 2px offset SHALL be visible

**Validates: Requirements 14.15, 18.4**

### Property 24: Responsive Grid Collapse

**For any** viewport width below the md breakpoint (768px), multi-column layouts SHALL collapse to single column

**Validates: Requirements 15.4**

### Property 25: Pagination Parameter Consistency

**For any** paginated list endpoint, the API client SHALL include page and limit parameters in the request

**Validates: Requirements 2.12**

## 10. Implementation Priorities and Migration Strategy

### Phase 1: Foundation (Week 1-2)
1. Design system tokens and Tailwind configuration
2. API client and React Query setup
3. Base UI components (Button, Input, Card, Loading, Error)
4. Authentication and route guards
5. Fixed navbar and navigation structure

### Phase 2: Core Pages (Week 3-4)
1. Dashboard page with real data integration
2. Practice mode with React Query integration
3. AI Tutor chat interface
4. Library browser with pagination

### Phase 3: Advanced Features (Week 5-6)
1. Battle Arena with WebSocket integration
2. Exam Simulator with full-screen mode
3. Leaderboard with filtering
4. Performance analytics with charts

### Phase 4: Polish and Optimization (Week 7-8)
1. Mobile responsive refinements
2. Accessibility audit and fixes
3. Performance optimization
4. Error handling improvements
5. Testing and bug fixes

## 11. Data Flow Examples

### Example: Submit Practice Answer

```
User selects answer
     │
     ▼
Component calls submitAnswer.mutate()
     │
     ├──▶ Optimistic Update: UI shows answer immediately
     │
     ▼
API client sends POST /api/questions/submit
     │
     ├──▶ Request interceptor adds auth token
     │
     ▼
Backend validates and processes
     │
     ▼
Response returns { correct: true, points: 10 }
     │
     ▼
React Query onSuccess callback
     │
     ├──▶ Invalidate ['user', 'progress'] query
     ├──▶ Invalidate ['user', 'analytics'] query
     │
     ▼
Queries refetch automatically
     │
     ▼
UI updates with new progress data
```

### Example: Error Recovery

```
API request fails (network error)
     │
     ▼
React Query retry logic (attempt 1)
     │  exponential backoff: 1000ms
     ▼
Retry attempt 1 fails
     │
     ▼
React Query retry logic (attempt 2)
     │  exponential backoff: 2000ms
     ▼
Retry attempt 2 fails
     │
     ▼
React Query retry logic (attempt 3)
     │  exponential backoff: 4000ms
     ▼
Final attempt fails
     │
     ▼
Error boundary catches error
     │
     ▼
Display ErrorState component with retry button
     │
     ▼
User clicks retry
     │
     ▼
Query refetch triggered
```

## 12. Type Definitions Strategy

### 12.1 Shared Types Structure

```
src/types/
├── api/
│   ├── auth.ts          # Authentication types
│   ├── questions.ts     # Question-related types
│   ├── users.ts         # User profile types
│   ├── exams.ts         # Exam and battle types
│   └── common.ts        # Shared API types (APIResponse, APIError)
├── models/
│   ├── user.ts          # User domain model
│   ├── question.ts      # Question domain model
│   ├── exam.ts          # Exam domain model
│   └── battle.ts        # Battle domain model
└── ui/
    ├── forms.ts         # Form-related types
    └── components.ts    # Component prop types
```

### 12.2 Example Type Definitions

```typescript
// src/types/api/common.ts

export interface APIResponse<T> {
  data: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    hasMore?: boolean;
  };
}

export interface APIError {
  statusCode: number;
  message: string;
  details?: Record<string, unknown>;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface FilterParams {
  [key: string]: string | number | boolean | undefined;
}
```

```typescript
// src/types/models/question.ts

export type Difficulty = 'easy' | 'medium' | 'hard';
export type Subject = 'mathematics' | 'physics' | 'chemistry' | 'biology' | 'english' | 'history';

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  subject: Subject;
  topic: string;
  difficulty: Difficulty;
  explanation: {
    en: string;
    am: string;
    or: string;
  };
  metadata?: {
    timeLimit?: number;
    points?: number;
    unit?: string;
  };
}

export interface QuestionFilters {
  subject?: Subject;
  topic?: string;
  difficulty?: Difficulty;
  limit?: number;
}
```

## 13. WebSocket Integration Pattern

```typescript
// src/lib/hooks/useSocket.ts

import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001';

export function useSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Initialize socket connection
    const socket = io(SOCKET_URL, {
      auth: {
        token: localStorage.getItem('auth_token'),
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    // Connection event handlers
    socket.on('connect', () => {
      console.log('Socket connected');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setIsConnected(false);
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  return {
    socket: socketRef.current,
    isConnected,
  };
}
```

## 14. Accessibility Implementation Details

### 14.1 Semantic HTML Structure

```typescript
// Example: Accessible page structure

export default function Page() {
  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only">
        Skip to main content
      </a>
      
      <header>
        <nav aria-label="Primary navigation">
          {/* Navigation content */}
        </nav>
      </header>

      <main id="main-content">
        <h1>Page Title</h1>
        <article>
          {/* Main content */}
        </article>
      </main>

      <aside aria-label="Sidebar">
        {/* Sidebar content */}
      </aside>

      <footer>
        {/* Footer content */}
      </footer>
    </>
  );
}
```

### 14.2 ARIA Live Regions

```typescript
// src/components/ui/LiveRegion.tsx

interface LiveRegionProps {
  message: string;
  politeness?: 'polite' | 'assertive';
}

export function LiveRegion({ message, politeness = 'polite' }: LiveRegionProps) {
  return (
    <div
      role="status"
      aria-live={politeness}
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  );
}
```

## 15. Performance Optimization Strategies

### 15.1 Code Splitting

```typescript
// src/app/dashboard/page.tsx

import dynamic from 'next/dynamic';

// Lazy load heavy chart component
const PerformanceChart = dynamic(
  () => import('@/components/dashboard/PerformanceChart'),
  {
    loading: () => <Skeleton className="h-64 w-full" />,
    ssr: false, // Skip SSR for client-only component
  }
);
```

### 15.2 Image Optimization

```typescript
// Example: Optimized image component

import Image from 'next/image';

export function OptimizedImage({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={300}
      height={200}
      loading="lazy"
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRg..."
    />
  );
}
```

### 15.3 React Memoization

```typescript
// Example: Memoized list item component

import { memo } from 'react';

interface QuestionItemProps {
  question: Question;
  onSelect: (id: string) => void;
}

export const QuestionItem = memo(function QuestionItem({
  question,
  onSelect,
}: QuestionItemProps) {
  return (
    <div onClick={() => onSelect(question.id)}>
      {/* Question content */}
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function
  return prevProps.question.id === nextProps.question.id;
});
```

## 16. Environment Configuration

```bash
# .env.example

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=http://localhost:3001

# Authentication
AUTH_SECRET=your-secret-key-here
JWT_EXPIRATION=7d

# Feature Flags
NEXT_PUBLIC_ENABLE_BATTLE_MODE=true
NEXT_PUBLIC_ENABLE_AI_TUTOR=true

# Analytics (Optional)
NEXT_PUBLIC_GOOGLE_ANALYTICS=
NEXT_PUBLIC_SENTRY_DSN=

# Database (Backend)
DATABASE_URL=postgresql://user:password@localhost:5432/finkison
```

## 17. Conclusion

This design document provides a comprehensive blueprint for modernizing the Finkison platform. The architecture emphasizes:

1. **Type Safety**: Comprehensive TypeScript types across all layers
2. **Developer Experience**: Clear patterns and conventions for consistency
3. **Performance**: Optimistic updates, caching strategies, and code splitting
4. **User Experience**: Professional UI with loading/error states and accessibility
5. **Maintainability**: Modular component architecture and clear separation of concerns
6. **Scalability**: React Query for efficient server state management

The implementation should follow the phased approach outlined, ensuring each layer is solid before building the next. All components should adhere to the design system tokens and patterns established in this document.
