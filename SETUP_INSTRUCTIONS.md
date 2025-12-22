# 🚀 Complete Setup Instructions

## Prerequisites

Before you begin, ensure you have:
- Node.js 18 or higher installed
- npm or yarn package manager
- A Supabase account (free tier works)
- Git installed

## Step 1: Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd study-planner

# Install dependencies
npm install
```

## Step 2: Supabase Setup

### Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign in or create an account
3. Click "New Project"
4. Fill in project details:
   - Name: Study Planner
   - Database Password: (choose a strong password)
   - Region: (choose closest to you)
5. Wait for project to be created (~2 minutes)

### Get Your Credentials

1. In your Supabase project dashboard
2. Go to Settings → API
3. Copy:
   - Project URL
   - `anon` `public` key

## Step 3: Environment Variables

```bash
# Copy the example file
cp .env.local.example .env.local
```

Edit `.env.local` and add your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## Step 4: Database Migrations

### Option A: Using Supabase Dashboard (Recommended)

1. Go to your Supabase Dashboard
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"
4. Run each migration file in order:

**Migration 1: Core Tables**
- Copy contents of `supabase/migrations/001_initial_schema.sql`
- Paste and click "Run"

**Migration 2: Analytics Tables**
- Copy contents of `supabase/migrations/002_analytics.sql`
- Paste and click "Run"

**Migration 3: Flashcards Tables**
- Copy contents of `supabase/migrations/003_flashcards.sql`
- Paste and click "Run"

**Migration 4: AI & Notes Tables**
- Copy contents of `supabase/migrations/004_ai_and_notes.sql`
- Paste and click "Run"

### Option B: Using Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Push migrations
supabase db push
```

## Step 5: Verify Database Setup

1. Go to Supabase Dashboard → Table Editor
2. Verify these tables exist:
   - profiles
   - subjects
   - topics
   - study_plans
   - study_sessions
   - deadlines
   - flashcard_decks
   - flashcards
   - notes
   - ai_study_plans
   - topic_difficulty
   - study_recommendations

## Step 6: Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 7: Create Your First Account

1. Click "Sign Up"
2. Enter your email and password
3. Check your email for verification link
4. Click the verification link
5. You're ready to go!

## 🎯 Quick Feature Test

### Test Basic Features
1. Create a subject (e.g., "Mathematics")
2. Add a topic (e.g., "Calculus")
3. Create a study plan
4. Log a study session

### Test Notes Feature
1. Navigate to `/notes`
2. Click "New Note"
3. Try markdown formatting:
   ```markdown
   # My Note
   **Bold text**
   $$ E = mc^2 $$
   ```
4. Click "Save"

### Test AI Features
1. Navigate to `/ai-planner`
2. Add some deadlines first
3. Click "Generate AI Plan"
4. View recommendations

### Test Analytics
1. Navigate to `/analytics`
2. View your study patterns
3. Check productivity trends

## 🔧 Troubleshooting

### Issue: "Module not found" errors

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: Database connection errors

**Solution:**
1. Check `.env.local` has correct credentials
2. Verify Supabase project is active
3. Check if you're using the correct URL and key

### Issue: Migrations fail

**Solution:**
1. Check if tables already exist
2. Drop existing tables if needed
3. Run migrations in correct order
4. Check Supabase logs for specific errors

### Issue: Authentication not working

**Solution:**
1. Check Supabase Auth settings
2. Verify email confirmation is enabled
3. Check redirect URLs in Supabase settings

### Issue: Markdown/LaTeX not rendering

**Solution:**
```bash
npm install react-markdown remark-gfm remark-math rehype-katex katex
```

## 📦 Production Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your repository
5. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Click "Deploy"

### Deploy to Netlify

1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "Add new site"
4. Select your repository
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
6. Add environment variables
7. Click "Deploy"

## 🔐 Security Checklist

- [ ] Change default Supabase password
- [ ] Enable RLS on all tables
- [ ] Set up proper authentication
- [ ] Configure CORS settings
- [ ] Enable email verification
- [ ] Set up rate limiting
- [ ] Review security policies

## 📊 Performance Optimization

### Enable Caching
```typescript
// next.config.ts
export default {
  experimental: {
    optimizeCss: true,
  },
}
```

### Database Indexes
All necessary indexes are created by migrations, but verify:
- User ID indexes on all user-scoped tables
- Foreign key indexes
- Full-text search indexes on notes

## 🎓 Next Steps

1. **Customize**: Update colors, branding, and content
2. **Add Data**: Create subjects, topics, and study plans
3. **Explore Features**: Try all the AI-powered features
4. **Invite Users**: Share with friends or classmates
5. **Monitor**: Check analytics and performance

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## 🆘 Getting Help

If you encounter issues:
1. Check this setup guide
2. Review error messages carefully
3. Check browser console for errors
4. Review Supabase logs
5. Open an issue on GitHub

## ✅ Setup Complete!

You're all set! Start using your AI-powered study planner and boost your productivity! 🚀

---

**Happy Studying!** 📚✨
