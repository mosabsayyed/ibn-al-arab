# MemoriPilot: System Architect

## Overview
This file contains the architectural decisions and design patterns for the MemoriPilot project.

## Architectural Decisions

- React Context API for global authentication state management
- Supabase v2 with apikey-only header authentication
- Universal dev script to prevent AI assistant process interference
- Bilingual support with i18next for English/Arabic localization
- Basic routing structure established but core features not implemented



- React Context API for global authentication state management
- Supabase v2 with apikey-only header authentication
- Universal dev script to prevent AI assistant process interference
- Bilingual support with i18next for English/Arabic localization



1. **Decision 1**: Description of the decision and its rationale.
2. **Decision 2**: Description of the decision and its rationale.
3. **Decision 3**: Description of the decision and its rationale.



## Components

### Frontend Application

React-based frontend with TypeScript, using Vite for development and Tailwind CSS for styling

**Responsibilities:**

- User interface and interactions
- State management with React Context
- Internationalization with i18next
- Routing with React Router

### Supabase Backend

Supabase backend providing authentication, database, and real-time features

**Responsibilities:**

- User authentication and authorization
- Database storage for users, orders, meals
- Email confirmation and OTP verification
- Real-time updates for order status

### Dev Server Management

Universal dev server management script for safe development workflow

**Responsibilities:**

- Background process management
- PID tracking and cleanup
- Package manager auto-detection
- Port conflict detection and resolution

### Business Logic

User profile and admin dashboard functionality (NOT YET IMPLEMENTED)

**Responsibilities:**

- User profile management
- Admin user/order management
- Meal ordering system
- Checkout and payment processing
- Order history and analytics

### Database Schema

Supabase database tables and relationships (NOT YET IMPLEMENTED)

**Responsibilities:**

- User profiles table
- Orders and order items tables
- Meals and categories tables
- Admin permissions and settings





### Frontend Application

React-based frontend with TypeScript, using Vite for development and Tailwind CSS for styling

**Responsibilities:**

- User interface and interactions
- State management with React Context
- Internationalization with i18next
- Routing with React Router

### Supabase Backend

Supabase backend providing authentication, database, and real-time features

**Responsibilities:**

- User authentication and authorization
- Database storage for meals and orders
- Email confirmation and OTP verification
- Real-time updates for order status

### Dev Server Management

Universal dev server management script for safe development workflow

**Responsibilities:**

- Background process management
- PID tracking and cleanup
- Package manager auto-detection
- Port conflict detection and resolution



