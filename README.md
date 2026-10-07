# FundFlow Frontend

Kora-powered programmable fundraising platform frontend built with Next.js 15, React 19, and TypeScript.

## Overview

FundFlow Frontend provides a responsive, modern web interface for:

- **Campaign Discovery**: Browse and search fundraising campaigns
- **Campaign Management**: Create and manage your own fundraising campaigns
- **Contribution Flow**: Secure payment processing via Kora
- **Dashboard**: Track campaign performance, contributions, and payouts
- **Milestone Management**: Define and approve fund release conditions
- **Beneficiary Management**: Add and verify payout recipients
- **Real-time Updates**: Live campaign activity and notifications

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     FundFlow Frontend                           │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Next.js    │  │   React      │  │    TypeScript        │  │
│  │   App Router │  │   Components │  │    Type Safety       │  │
│  └──────┬──────┘  └──────┬──────┘  └─────────┬───────────┘  │
│         │                │                   │                │
│  ┌──────▼──────────────────────────────────────────────────▼─────┐  │
│  │                    React Query (Data Fetching)               │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                         │                              │
│  ┌──────────────────────────────┐    ┌──────────────────────┐   │
│  │        Custom Components        │    │        UI Library     │   │
│  │  CampaignCard, ContributeModal  │    │  Button, Card, Badge  │   │
│  │  CampaignHero, AuthProvider     │    │  Progress, Skeleton   │   │
│  └──────────────────────────────┘    └──────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                 FundFlow Backend API                            │
│            (http://localhost:8000/api/v1)                       │
└─────────────────────────────────────────────────────────────┘
```

## Prerequisites

- Node.js 18+ (LTS recommended)
- npm or yarn
- Git

## Clone & Setup

```bash
# Clone the repository
git clone <repository-url>
cd frontend

# Install dependencies
npm install

# Or using yarn
yarn install
```

## Configuration

Create or modify the `.env.local` file for local development:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# Development server
NEXT_PUBLIC_ENV=development

# Optional: Override default settings
# NEXT_PUBLIC_KORA_MOCK=true
```

## Running the Application

### Development Server

```bash
# Start Next.js development server
npm run dev

# Open your browser to http://localhost:3000
```

### Production Build & Run

```bash
# Build for production
npm run build

# Start production server
npm run start

# Server will run on http://localhost:3000
```

## Type Checking

```bash
# Run TypeScript type checking without emitting files
npm run typecheck
```

## Project Structure

```
frontend/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout with Tailwind CSS
│   ├── page.tsx           # Home page
│   ├── globals.css        # Global styles
│   ├── auth/              # Authentication pages
│   │   └── login/
│   │       └── page.tsx
│   ├── campaigns/         # Campaign discovery and detail
│   │   ├── page.tsx       # Campaign list page
│   │   └── [slug]/
│   │       └── page.tsx   # Campaign detail page
│   ├── create/            # Campaign creation flow
│   │   └── page.tsx
│   ├── dashboard/          # Owner dashboard
│   │   ├── page.tsx       # Dashboard overview
│   │   └── [id]/
│   │       └── page.tsx   # Campaign management dashboard
│   └── contribute/        # Contribution flow (if applicable)
├── components/            # Reusable React components
│   ├── ui.tsx             # Core UI primitives (Button, Card, etc.)
│   ├── forms.tsx          # Form components (Input, Textarea, etc.)
│   ├── auth-provider.tsx  # Authentication context
│   ├── campaign-card.tsx  # Campaign card component
│   ├── campaign-hero.tsx  # Campaign hero section
│   ├── campaign-tabs.tsx  # Campaign detail tabs
│   └── contribute-modal.tsx # Contribution modal
├── lib/                   # Utility functions and hooks
│   ├── api.ts             # API client and helpers
│   ├── queries.ts         # React Query hooks
│   └── types/             # TypeScript type definitions
│       └── index.ts
├── public/                # Static assets
│   └── (images, icons, etc.)
├── styles/                # Additional styles (if any)
├── package.json           # Project dependencies
├── tsconfig.json          # TypeScript configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── postcss.config.mjs     # PostCSS configuration
```

## Key Features

### UI Components

The application uses a custom component library with a premium design system:

- **Button**: Primary, dark, outline, ghost, and danger variants
- **Card**: Content containers with hover effects
- **Badge**: Status indicators with multiple tones
- **Progress**: Campaign progress visualization
- **Skeleton**: Loading states
- **EmptyState**: Empty content placeholders
- **Input/Textarea**: Form fields with validation

### Design System

- **Color Scheme**: Custom palette with voltage (primary), ink (dark), soft (light), etc.
- **Typography**: System fonts with premium weight and spacing
- **Animations**: Subtle animations for transitions and interactions
- **Responsive**: Mobile-first design with breakpoints at 640px, 768px, 1024px

### State Management

- **React Query**: Server state management with automatic caching and refetching
- **Context API**: Authentication state and user session management
- **Local Storage**: JWT token persistence

## API Integration

The frontend communicates with the backend API for all data operations:

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/login` | POST | User login |
| `/auth/register` | POST | User registration |
| `/auth/me` | GET | Current user profile |
| `/campaigns` | GET | List all campaigns |
| `/campaigns/{id}` | GET | Get campaign details |
| `/campaigns` | POST | Create new campaign |
| `/campaigns/{id}/contribute` | POST | Make a contribution |
| `/dashboard/overview` | GET | User dashboard overview |
| `/campaigns/{id}/milestones` | GET | Campaign milestones |
| `/payouts/{id}/execute` | POST | Execute a payout |

### API Client

The API client (`lib/api.ts`) provides:

- Automatic JWT token injection for authenticated requests
- Error handling with custom `ApiError` class
- Response parsing and type safety
- Helper functions for formatting (naira, formatDate, etc.)

## Authentication Flow

1. User submits login credentials
2. Backend returns JWT token
3. Token is stored in localStorage
4. API client automatically includes token in Authorization header
5. Protected routes verify authentication state

## Routing

The application uses Next.js App Router with file-based routing:

- `/` - Home page with featured campaigns
- `/campaigns` - Campaign discovery and search
- `/campaigns/{slug}` - Campaign detail page
- `/create` - Campaign creation form
- `/dashboard` - User's campaign overview
- `/dashboard/{id}` - Individual campaign management

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:8000/api/v1` |
| `NEXT_PUBLIC_ENV` | Environment mode | `development` |

## Testing

### Development Testing

```bash
# Start both frontend and backend
npm run dev

# Open browser to http://localhost:3000
# Test all user flows manually
```

### Automated Testing (Playwright)

```bash
# Install Playwright
npm install -D @playwright/test
npx playwright install

# Run tests
npx playwright test

# Run tests with UI
npx playwright test --ui

# Generate snapshots
npx playwright test --update-snapshots
```

## Styling

### Tailwind CSS

The application uses Tailwind CSS with custom theme configuration:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        voltage: '#FF6B35',     // Primary brand color
        ink: '#1A1A1A',         // Dark text
        soft: '#F8F8F8',        // Light backgrounds
        // ... additional colors
      }
    }
  }
}
```

### Custom CSS

- **globals.css**: Global styles and Tailwind directives
- **Animations**: Custom animations like `rise-in`, `rise-in-*` for staggered animations

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Make your changes
4. Run `npm run typecheck` to verify type safety
5. Test all user flows manually
6. Commit your changes (`git commit -m 'Add your feature'`)
7. Push to the branch (`git push origin feature/your-feature`)
8. Open a Pull Request

## Performance Considerations

- **Code Splitting**: Next.js automatic code splitting
- **Image Optimization**: Next.js Image component for optimized images
- **Font Optimization**: System fonts to avoid external requests
- **Bundle Analysis**: Available via `npm run build` with `--analyze` flag

## Security Considerations

- **CSRF Protection**: JWT tokens with proper validation
- **Input Sanitization**: Backend validates all inputs (frontend provides UX validation)
- **Secure Storage**: JWT tokens stored in localStorage with HTTP-only consideration
- **HTTPS**: Required in production for all API communication

## Deployment

### Docker (Recommended)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]
```

### Standalone

```bash
# Build for production
npm run build

# Start server
npm run start

# Use PM2 for process management
npm install -g pm2
pm2 start npm --name fundflow-frontend -- run start
```

## License

MIT License - see LICENSE file for details.

## Contact

For questions or support, please contact the development team.