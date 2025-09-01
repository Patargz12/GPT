# Project Structure

## Root Directory

```
├── .git/                 # Git repository
├── .kiro/               # Kiro IDE configuration and steering
├── public/              # Static assets (images, icons)
├── src/                 # Source code
├── node_modules/        # Dependencies
├── package.json         # Project dependencies and scripts
├── next.config.ts       # Next.js configuration
├── tsconfig.json        # TypeScript configuration
├── components.json      # shadcn/ui configuration
├── eslint.config.mjs    # ESLint configuration
└── postcss.config.mjs   # PostCSS configuration
```

## Source Directory (`src/`)

```
src/
├── app/                 # Next.js App Router pages and layouts
│   ├── (pages)/        # Route group for organized page structure
│   │   ├── about/      # About page route
│   │   ├── chat/       # Chat interface route
│   │   └── home/       # Home page route
│   ├── components/     # Shared components
│   │   ├── custom/     # Custom component implementations
│   │   └── shared/     # Reusable shared components
│   ├── features/       # Feature-based component organization
│   │   ├── about/      # About feature components
│   │   ├── chat/       # Chat feature components
│   │   └── home/       # Home feature components
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout component
│   ├── page.tsx        # Root page component
│   └── favicon.ico     # Site favicon
└── lib/                # Utility functions and shared logic
    └── utils.ts        # Common utility functions (shadcn/ui)
```

## File Organization Conventions

### Components

- **Page Components**: Located in `src/app/(pages)/[route]/page.tsx`
- **Layout Components**: Located in `src/app/[route]/layout.tsx`
- **Feature Components**: Organized by feature in `src/app/features/[feature]/`
- **Shared Components**: Place in `src/app/components/shared/`
- **Custom Components**: Place in `src/app/components/custom/`
- **UI Components**: shadcn/ui components go in `@/components/ui`

### Routing

- Uses Next.js App Router file-based routing with route groups
- Route group `(pages)` organizes page routes without affecting URL structure
- Each folder in `src/app/(pages)/` represents a route
- `page.tsx` files define route components
- `layout.tsx` files define shared layouts

### Feature Organization

- **Feature-based Structure**: Components organized by feature in `src/app/features/`
- **Co-location**: Related components, hooks, and utilities grouped by feature
- **Separation of Concerns**: Pages handle routing, features handle business logic

### Assets

- **Static Files**: Place in `public/` directory
- **Images**: Reference with `/filename.ext` from public root
- **Icons**: Use Lucide React components when possible

### Utilities

- **Shared Logic**: Place in `src/lib/`
- **Type Definitions**: Co-locate with components or in dedicated `.d.ts` files
- **Constants**: Define in relevant module or `src/lib/constants.ts`
