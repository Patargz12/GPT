# Technology Stack

## Core Framework

- **Next.js 15** with App Router
- **React 19** with TypeScript 5
- **Node.js** runtime environment

## Styling & UI

- **Tailwind CSS v4** for utility-first styling
- **shadcn/ui** components with "new-york" style variant
- **CSS Variables** enabled for theming
- **Lucide React** for consistent iconography
- **class-variance-authority** and **clsx** for conditional styling

## Development Tools

- **TypeScript** with strict mode enabled
- **ESLint** with Next.js configuration
- **PostCSS** for CSS processing

## Build System & Commands

### Development

```bash
# Make sure you don't ask to run npm run dev by testing the UI because it is most likely already running.
# Make sure you don't ask to run npm run dev by testing the UI because it is most likely already running.
# Make sure you don't ask to run npm run dev by testing the UI because it is most likely already running.
# Make sure you don't ask to run npm run dev by testing the UI because it is most likely already running.
npm run dev          # Start development server
npm run lint         # Run ESLint checks
```

### Production

```bash
npm run build        # Build for production
npm run start        # Start production server
```

## Path Aliases

- `@/*` maps to `./src/*`
- Components: `@/components`
- Utils: `@/lib/utils`
- UI Components: `@/components/ui`

## Code Style Guidelines

- Use TypeScript for all new files
- Follow Next.js App Router conventions
- Utilize Tailwind CSS classes over custom CSS
- Prefer shadcn/ui components for consistent design
- Use Lucide React icons for UI elements
