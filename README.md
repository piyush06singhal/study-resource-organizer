# 📚 Study Planner - AI-Powered Learning Platform

A comprehensive study management platform with AI-powered features, advanced note-taking, analytics, and smart scheduling.

## ✨ Features

### 🤖 AI-Powered Features
- **AI Study Plan Generator** - Automatically creates optimized study schedules based on deadlines
- **Smart Revision Scheduling** - Spaced repetition algorithm (SM-2) for optimal learning
- **Topic Difficulty Prediction** - AI analyzes your performance and predicts difficulty
- **Personalized Recommendations** - Real-time study suggestions and break reminders

### 📝 Advanced Note-Taking
- **Rich Markdown Editor** - Full GitHub Flavored Markdown support
- **LaTeX Math Support** - Write equations like `$$ E = mc^2 $$`
- **Code Syntax Highlighting** - 100+ programming languages
- **Live Preview** - See formatted output in real-time
- **Organization** - Tags, subjects, topics, favorites, and full-text search

### 📊 Analytics & Insights
- **Study Time Heatmap** - Visualize your study patterns
- **Productivity Trends** - Track your progress over time
- **Subject Distribution** - See time spent on each subject
- **Best Study Times** - Discover when you're most productive
- **Completion Rates** - Monitor your task completion

### 📅 Study Management
- **Subjects & Topics** - Organize your courses and topics
- **Study Plans** - Schedule and track study sessions
- **Deadlines** - Never miss an assignment or exam
- **Flashcards** - Create and study with spaced repetition
- **Resources** - Store and organize study materials

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd study-planner
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Run database migrations**
- Go to your Supabase Dashboard → SQL Editor
- Run all migration files from `supabase/migrations/` in order

5. **Start development server**
```bash
npm run dev
```

6. **Open your browser**
```
http://localhost:3000
```

## 📖 Usage

### Getting Started
1. Sign up for an account
2. Create your first subject
3. Add topics to your subjects
4. Start creating study plans and notes

### Using AI Features
1. Navigate to `/ai-planner`
2. Add your deadlines
3. Set available study hours
4. Generate AI study plan
5. Follow personalized recommendations

### Creating Notes
1. Go to `/notes`
2. Click "New Note"
3. Use the rich editor with:
   - Markdown formatting
   - LaTeX equations: `$$ equation $$`
   - Code blocks with syntax highlighting
   - Tables, lists, and more

### Viewing Analytics
1. Navigate to `/analytics`
2. View your study patterns
3. Identify best study times
4. Track productivity trends

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Markdown:** react-markdown, remark-gfm
- **Math:** KaTeX
- **Code Highlighting:** react-syntax-highlighter

## 📁 Project Structure

```
study-planner/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Main app pages
│   └── (marketing)/       # Landing pages
├── components/            # React components
│   ├── ai/               # AI feature components
│   ├── analytics/        # Analytics components
│   ├── flashcards/       # Flashcard components
│   ├── notes/            # Note-taking components
│   └── ui/               # Reusable UI components
├── lib/                   # Utilities and actions
│   ├── actions/          # Server actions
│   ├── supabase/         # Supabase client
│   └── types/            # TypeScript types
└── supabase/             # Database migrations
```

## 🔒 Security

- Row Level Security (RLS) enabled on all tables
- User-scoped queries
- Server-side validation
- Secure authentication with Supabase

## 📊 Database Schema

Main tables:
- `profiles` - User profiles
- `subjects` - Course subjects
- `topics` - Subject topics
- `study_plans` - Study schedules
- `study_sessions` - Study tracking
- `deadlines` - Assignments and exams
- `flashcard_decks` - Flashcard collections
- `flashcards` - Individual flashcards
- `notes` - User notes
- `ai_study_plans` - AI-generated plans
- `topic_difficulty` - Difficulty tracking
- `study_recommendations` - AI recommendations

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Supabase for the backend infrastructure
- Radix UI for accessible components
- All open-source contributors

## 📞 Support

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ for students everywhere
