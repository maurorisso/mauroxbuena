# BuenaXMauro - Property Management System

A modern property management application built with Next.js for managing WEG (Wohnungseigentümergemeinschaft) and MV (Mietverhältnis) properties in the DACH region.

## Features

- **Property Management**: Create and manage properties with types (WEG/MV)
- **Building Management**: Track buildings with detailed address information
- **Unit Management**: Manage units including apartments, offices, gardens, and parking spaces
- **Staff Assignment**: Assign managers and accountants to properties
- **Declaration of Division Upload**: Upload Teilungserklärung (declaration of division) documents (just tried PDF) to automatically extract and create buildings and units. The system processes the document via n8n webhook integration and populates property details, buildings with addresses, and units with specifications (unit number, type, floor, size, co-ownership share, rooms, construction year)

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **React**: 19.2.1
- **Language**: TypeScript
- **Database**: PostgreSQL (via Supabase)
- **ORM**: Drizzle ORM
- **Styling**: Tailwind CSS and Shadcn
- **Document Processing**: n8n (webhook integration for Teilungserklärung processing)
- **Storage**: Supabase Storage (for document uploads)

### n8n Integration

n8n is used as a document processing pipeline for Teilungserklärung (declaration of division) documents:

1. **Webhook Reception**: Receives POST requests with property ID and document URL from the application
2. **AI Document Analysis**: Uses Google Gemini AI to extract structured data from German PDF documents, including:
   - Property name and type (WEG/MV)
   - Building addresses (street, house number, zip code, city)
   - Unit details (number, type, floor, size, co-ownership share, rooms, construction year)
3. **Data Processing**: Cleans and structures the AI response into valid JSON format
4. **Response**: Returns structured data back to the application, which automatically creates buildings and units in the database

## Project Structure

```
buenaxmauro/
├── app/                           # Next.js app directory
│   ├── actions.ts                  # Server actions for properties
│   ├── components/                 # Page-specific components
│   │   ├── create-property-dialog.tsx
│   │   ├── properties-list.tsx
│   │   └── property-item.tsx
│   ├── property/                   # Property detail pages
│   │   ├── [id]/                   # Dynamic property route
│   │   │   └── page.tsx
│   │   ├── actions.ts              # Property-specific server actions
│   │   ├── components/             # Property detail components
│   │   │   ├── buildings-item.tsx
│   │   │   ├── create-building-dialog.tsx
│   │   │   ├── create-unit-dialog.tsx
│   │   │   ├── units-item.tsx
│   │   │   └── tabs/               # Tab components
│   │   │       ├── buildings-tab.tsx
│   │   │       └── units-tab.tsx
│   │   └── layout.tsx
│   ├── layout.tsx                   # Root layout
│   ├── page.tsx                     # Home page
│   ├── globals.css                  # Global styles
│   └── favicon.ico
├── components/                      # Shared UI components
│   └── ui/                         # shadcn/ui components
│       ├── button.tsx
│       ├── dialog.tsx
│       ├── form.tsx
│       ├── input.tsx
│       └── ...                      # Many more UI components
├── db/                              # Database configuration
│   ├── index.ts                     # Database connection
│   ├── migrate.ts                   # Migration runner
│   ├── schemas/                     # Drizzle schema definitions
│   │   ├── properties.ts
│   │   ├── buildings.ts
│   │   ├── units.ts
│   │   └── users.ts
│   └── migrations/                  # Database migrations
│       ├── 0000_*.sql
│       └── meta/                    # Migration metadata
├── hooks/                           # React hooks
│   └── use-mobile.tsx               # Mobile detection hook
├── lib/                             # Utility functions
│   └── utils.ts                     # Common utilities (cn, etc.)
├── types/                           # TypeScript type definitions
│   └── index.ts
├── utils/                           # Utility modules
│   └── supabase/                    # Supabase client utilities
│       ├── client.ts                # Client-side Supabase client
│       ├── server.ts                # Server-side Supabase client
│       └── middleware.ts            # Middleware Supabase client
├── public/                          # Static assets
├── drizzle.config.ts                # Drizzle ORM configuration
├── next.config.ts                   # Next.js configuration
├── tailwind.config.ts               # Tailwind CSS configuration
├── tsconfig.json                    # TypeScript configuration
├── components.json                  # shadcn/ui configuration
├── middleware.ts                    # Next.js middleware
└── package.json                     # Dependencies and scripts
```

## Database Schema

The application uses the following main entities:

- **Properties**: WEG or MV properties with manager and accountant assignments
- **Buildings**: Buildings belonging to properties with address information
- **Units**: Units within buildings (apartments, offices, gardens, parking)
- **Users**: Staff members (although there is no auth for this version)
