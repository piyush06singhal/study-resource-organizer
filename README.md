# 📚 StudyFlow - Smart Study Management Platform

A comprehensive study management platform built with Next.js, TypeScript, and Supabase. Organize your studies, track progress, and study smarter with automated scheduling and analytics.

## ✨ Key Features

- **📝 Rich Notes** - Markdown editor with LaTeX math and code syntax highlighting
- **📚 Subject & Topic Management** - Organize courses and track completion
- **📅 Study Planner** - Schedule and track study sessions
- **🧠 Smart Planner** - Auto-generate study schedules based on deadlines
- **🎴 Flashcards** - Spaced repetition learning system
- **⏰ Deadline Tracking** - Never miss assignments or exams
- **📊 Analytics** - Study time heatmaps and productivity insights
- **🔍 Advanced Search** - Find anything across all your materials
- **💾 Export/Import** - Backup data in CSV, JSON, or full backup format

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Supabase account (free tier available)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/piyush06singhal/study-resource-organizer.git
cd study-resource-organizer/study-planner
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

4. **Setup database**
- Go to your Supabase Dashboard → SQL Editor
- Run migration files from `supabase/migrations/` in order

5. **Start development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI + shadcn/ui
- **Animations:** Framer Motion

## 📁 Project Structure

```
study-planner/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Login/Signup pages
│   ├── (dashboard)/       # Main app pages
│   └── (marketing)/       # Landing page
├── components/            # React components
├── lib/                   # Utilities and server actions
└── supabase/             # Database migrations
```

## 🔒 Security

- Row Level Security (RLS) enabled on all tables
- User-scoped queries
- Secure authentication with Supabase
- No external AI APIs (privacy-friendly)

## 📖 Documentation

- [Setup Instructions](SETUP_INSTRUCTIONS.md) - Detailed setup guide
- [App Explanation](APP_EXPLANATION.md) - Feature documentation

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

Built with ❤️ for students everywhere using modern web technologies.

---

**Note:** The "Smart Planner" uses algorithms (not AI APIs) to calculate optimal study schedules based on your deadlines and available time. No API keys or external AI services required.
