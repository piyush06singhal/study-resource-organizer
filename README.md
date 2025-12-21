# StudyFlow - Study Resource Organizer & Planner

A production-ready, full-stack study management application built with Next.js 14, TypeScript, Tailwind CSS, and Supabase.

## Features

### Phase 1 - Foundation (MVP)
- ✅ User authentication (Email/Password + Google OAuth)
- ✅ User profiles and settings
- ✅ Subject and topic organization
- ✅ Study resource management (PDFs, images, links, notes)
- ✅ Resource tagging and filtering

### Phase 2 - Planning & Deadlines
- ✅ Daily and weekly study planner
- ✅ Deadline and exam tracker
- ✅ Calendar views
- ✅ Priority management

### Phase 3 - Progress & Revision
- ✅ Topic progress tracking
- ✅ Revision planner with spaced repetition
- ✅ Study session time logging
- ✅ Study streak tracking

### Phase 4 - Advanced Features
- ✅ Analytics dashboard
- ✅ Notifications system
- ✅ Dark/Light mode
- ✅ Responsive design

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Framer Motion
- **Backend**: Next.js API Routes + Server Actions
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account
- Git

### 1. Clone the Repository

\`\`\`bash
git clone <your-repo-url>
cd study-planner
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the schema from `supabase/schema.sql`
3. Enable Email authentication in Authentication > Providers
4. (Optional) Enable Google OAuth:
   - Go to Authentication > Providers > Google
   - Add your Google Client ID and Secret
   - Add authorized redirect URL: `https://your-project.supabase.co/auth/v1/callback`

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
\`\`\`

Get these values from your Supabase project settings:
- Go to Project Settings > API
- Copy the Project URL and anon/public key

### 5. Run the Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

\`\`\`
study-planner/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Auth pages (login, signup)
│   ├── (marketing)/         # Public pages (home, features, about)
│   ├── (dashboard)/         # Protected app pages
│   ├── api/                 # API routes
│   ├── layout.tsx           # Root layout
│   └── globals.css          # Global styles
├── components/              # React components
│   ├── ui/                  # shadcn/ui components
│   ├── auth/                # Authentication components
│   ├── dashboard/           # Dashboard components
│   ├── subjects/            # Subject management
│   ├── resources/           # Resource management
│   ├── planner/             # Study planner
│   └── providers/           # Context providers
├── lib/                     # Utility functions
│   ├── supabase/            # Supabase clients
│   ├── types/               # TypeScript types
│   ├── actions/             # Server actions
│   └── utils.ts             # Helper functions
├── supabase/                # Database schema
│   └── schema.sql           # PostgreSQL schema with RLS
├── public/                  # Static assets
└── middleware.ts            # Route protection
\`\`\`

## Database Schema

The application uses the following main tables:

- **profiles**: User profiles and preferences
- **semesters**: Academic semesters/terms
- **subjects**: Courses/subjects
- **topics**: Topics within subjects
- **resources**: Study materials (PDFs, links, notes)
- **resource_topics**: Many-to-many relationship
- **study_plans**: Daily/weekly study schedules
- **deadlines**: Assignments, exams, projects
- **study_sessions**: Time tracking
- **revisions**: Revision history
- **notifications**: User notifications

All tables have Row Level Security (RLS) enabled to ensure users can only access their own data.

## Deployment to Vercel

### 1. Push to GitHub

\`\`\`bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
\`\`\`

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure environment variables:
   - Add `NEXT_PUBLIC_SUPABASE_URL`
   - Add `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click "Deploy"

### 3. Update Supabase Settings

After deployment, add your Vercel domain to Supabase:
1. Go to Authentication > URL Configuration
2. Add your Vercel URL to Site URL
3. Add `https://your-app.vercel.app/**` to Redirect URLs

## Features Guide

### User Authentication
- Sign up with email/password
- Login with Google OAuth
- Email verification
- Password reset
- Session management

### Subject Organization
- Create semesters
- Add subjects with color coding
- Organize topics hierarchically
- Track completion status

### Resource Management
- Upload PDFs and images
- Save external links
- Create text notes
- Tag and categorize resources
- Link resources to topics
- Search and filter

### Study Planning
- Create daily study plans
- Schedule study sessions
- Set time estimates
- Track completion
- Calendar view

### Deadline Tracking
- Add assignments and exams
- Set priority levels
- Countdown timers
- Status tracking
- Reminder notifications

### Progress Tracking
- Topic status (Not Started, In Progress, Completed)
- Subject-level progress
- Semester overview
- Visual progress indicators

### Revision System
- Mark topics for revision
- Track revision count
- Schedule next revision
- Confidence level tracking
- Spaced repetition support

### Study Sessions
- Start/stop timer
- Track time per subject
- Session notes
- Daily/weekly summaries
- Study streak tracking

### Analytics
- Time spent per subject
- Completion trends
- Study consistency
- Deadline adherence
- Visual charts and graphs

## Common Issues & Solutions

### Issue: "Invalid API key"
**Solution**: Check that your `.env.local` file has the correct Supabase URL and anon key.

### Issue: "User not authenticated"
**Solution**: Ensure you've run the database schema and RLS policies are enabled.

### Issue: "Cannot read properties of undefined"
**Solution**: Make sure all environment variables are set and the Supabase client is properly initialized.

### Issue: Google OAuth not working
**Solution**: 
1. Verify Google OAuth is enabled in Supabase
2. Check redirect URLs are correctly configured
3. Ensure Google Client ID is valid

## Development Tips

- Use `npm run dev` for development with hot reload
- Run `npm run build` to test production build locally
- Check browser console for client-side errors
- Check Vercel logs for server-side errors
- Use Supabase Dashboard to inspect database

## Contributing

This is a production-ready application. Feel free to fork and customize for your needs.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues or questions:
1. Check the documentation above
2. Review Supabase docs: https://supabase.com/docs
3. Review Next.js docs: https://nextjs.org/docs

## Roadmap

Future enhancements:
- Mobile app (React Native)
- Collaborative study groups
- AI-powered study recommendations
- Export/import functionality
- Integration with calendar apps
- Pomodoro timer
- Flashcards system
- Note-taking with markdown
- File version control

---

Built with ❤️ for students worldwide
