```
AHM PLATFORM — COMPONENT LIBRARY DOCUMENT
Version 1.0
Reusable Frontend Engineering Standards

1. PURPOSE OF THIS DOCUMENT

This document defines:
- reusable frontend components
- component architecture standards
- naming conventions
- usage rules
- frontend engineering discipline

The goal is to ensure:
- consistency
- scalability
- maintainability
- modularity
- rapid future development

2. CORE COMPONENT PHILOSOPHY

PRIMARY PRINCIPLE
Every UI element should be reusable before creating a new version.

The platform should operate like:
- a system of reusable building blocks
NOT
- isolated custom pages

3. COMPONENT ARCHITECTURE PRINCIPLES

RULE 1
Components must be modular.

RULE 2
Components must be reusable.

RULE 3
Components must be scalable.

RULE 4
Business logic should NOT exist inside UI components.

RULE 5
Components must remain visually consistent.

4. STANDARD COMPONENT CATEGORIES

The platform component structure should include:

/components
/ui
/cards
/charts
/tables
/layouts
/forms
/navigation
/modals
/portfolio
/market
/research

```

```
/shared

5. UI COMPONENTS

CORE UI COMPONENTS
- buttons
- inputs
- dropdowns
- tabs
- badges
- toggles
- tooltips
- skeleton loaders
- alerts
- notifications

RULES
- All UI components must be standardized
- No duplicate button styles
- No custom spacing outside standards
- No inconsistent hover behavior

6. CARD COMPONENT SYSTEM

PRIMARY CARD TYPES

Intelligence Card
Purpose:
- AI summaries
- market insights
- important commentary

Metric Card
Purpose:
- KPI display
- statistics
- market numbers

Data Card
Purpose:
- charts
- tables
- analytics

Expandable Card
Purpose:
- secondary detailed data
- drilldowns

RULES
- All cards use shared styling
- Standardized padding
- Standardized border radius
- Standardized spacing
- Avoid unnecessary shadows

7. TABLE COMPONENT SYSTEM

CORE PRINCIPLE
All tables must use ONE shared table framework.

REQUIRED FEATURES
- sorting
- filtering

```

```
- pagination
- responsive support
- loading states
- empty states
- column visibility controls

RULES
- No custom tables unless approved
- No duplicated table logic
- Shared styling mandatory

8. CHART COMPONENT SYSTEM

SUPPORTED CHART TYPES
- line chart
- bar chart
- area chart
- candlestick chart
- heatmap
- pie chart

RULES
- Shared chart wrapper required
- Shared tooltip system required
- Shared axis styling required
- Shared loading states required

9. LAYOUT COMPONENT SYSTEM

STANDARD LAYOUTS

Main App Layout
- sidebar
- top navigation
- content container

Dashboard Layout
- hero metrics
- intelligence blocks
- data sections

Research Layout
- report structure
- charts
- commentary

Portfolio Layout
- holdings
- allocation
- returns
- analytics

RULES
- No page-specific layout duplication
- Layouts must remain reusable

10. NAVIGATION COMPONENTS

REQUIRED COMPONENTS
- sidebar navigation
- mobile navigation
- breadcrumbs
- page headers
- tabs

```

```
RULES
- Navigation must be consistent
- Shared navigation patterns only
- Avoid deep nesting

11. FORM COMPONENT SYSTEM

FORM TYPES
- onboarding forms
- KYC forms
- filters
- search forms
- settings forms

RULES
- Shared validation system
- Shared error handling
- Shared input styling
- Shared loading behavior

12. MODAL COMPONENT SYSTEM

MODAL TYPES
- confirmation modals
- onboarding steps
- information popups
- settings dialogs

RULES
- Shared modal framework mandatory
- Consistent transitions
- Consistent spacing
- Escape/close handling required

13. LOADING COMPONENTS

REQUIRED
Every async component must include:
- loading state
- error state
- empty state

STANDARDIZATION
- skeleton loaders
- retry actions
- fallback messages

14. COMPONENT NAMING CONVENTIONS

RULES
- Use clear descriptive names
- Avoid vague naming
- Components must indicate purpose

GOOD EXAMPLES
- MarketOverviewCard
- SectorPerformanceTable
- PortfolioAllocationChart

BAD EXAMPLES
- Card1
- DataBox
- WidgetNew

```

```
15. COMPONENT FILE STRUCTURE

STANDARD STRUCTURE

ComponentName/
index.tsx
styles.ts
types.ts
hooks.ts
utils.ts

RULES
- Components must remain isolated
- Shared logic extracted properly

16. PROPS STANDARDS

RULES
- Strong typing mandatory
- Avoid excessive prop drilling
- Use reusable interfaces
- Components should remain predictable

17. STATE MANAGEMENT PRINCIPLES

USE LOCAL STATE FOR
- UI interactions
- temporary component state

USE GLOBAL STATE FOR
- auth
- user data
- market state
- watchlists
- application-wide settings

18. SERVICE LAYER RULES

CRITICAL RULE
Components must NEVER directly call APIs.

ALL API COMMUNICATION MUST FLOW THROUGH:
/services

RULES
- Shared API clients
- Shared fetch patterns
- Shared error handling
- Shared caching strategy

19. REUSABILITY STANDARDS

Before creating a new component:
ASK:
- Can an existing component be extended?
- Is this reusable elsewhere?
- Is this violating system consistency?

20. PERFORMANCE PRINCIPLES

REQUIRED
- memoization where needed
- lazy loading

```

```
- optimized rerenders
- code splitting
- virtualization for large tables

21. COMPONENT DOCUMENTATION REQUIREMENTS

Every major component should document:
- purpose
- props
- usage examples
- dependencies
- limitations

22. TESTING STANDARDS

REQUIRED FOR MAJOR COMPONENTS
- rendering tests
- interaction tests
- loading state tests
- edge case testing

23. NON-NEGOTIABLE ENGINEERING RULES

RULE 1
No duplicated components.

RULE 2
No inline business logic.

RULE 3
No inconsistent styling.

RULE 4
No page-specific hacks.

RULE 5
No direct API calls from components.

RULE 6
Every component must support scalability.

24. CURRENT COMPONENT PRIORITIES

HIGH PRIORITY STANDARDIZATION
- tables
- cards
- charts
- navigation
- loading states
- modals
- metric systems

25. LONG-TERM COMPONENT OBJECTIVE

The AHM Platform should eventually function as:
- a scalable design system
- a reusable frontend ecosystem
- a modular financial operating system

The frontend architecture must support:
- rapid feature development
- AI integration
- mobile apps
- institutional scaling

```

```
- long-term maintainability

```

