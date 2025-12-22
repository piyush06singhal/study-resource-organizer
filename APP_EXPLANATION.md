# 📚 StudyFlow - Complete App Explanation

## What is StudyFlow?

StudyFlow is a **smart study management platform** that helps students organize their learning, track progress, and study more effectively. Think of it as your personal study assistant that helps you:

- 📝 Take organized notes with rich formatting
- 📅 Plan your study schedule
- 🎯 Track deadlines and assignments
- 📊 See your study patterns and progress
- 🗂️ Organize subjects, topics, and resources
- 💡 Get smart study recommendations
- 🎴 Create and study with flashcards

---

## 🤖 About the "AI" Features

### Important: NO External AI API Keys Needed! ✅

The app uses **algorithmic intelligence** (smart calculations), NOT external AI services like OpenAI or ChatGPT. This means:

- ✅ **No API keys required** - Everything works out of the box
- ✅ **No extra costs** - No charges for AI API calls
- ✅ **Privacy-friendly** - Your data stays in your database
- ✅ **Fast and reliable** - No dependency on external services

### How the "AI" Features Actually Work

#### 1. **AI Study Plan Generator** 📅
**What it does:**
- Looks at your upcoming deadlines
- Calculates how many days you have until each deadline
- Distributes study time evenly across available days
- Prioritizes urgent deadlines (due soon = high priority)

**How it works:**
```
Example:
- Exam in 14 days
- You have 3 hours/day to study
- Algorithm calculates: 14 days × 0.5 = 7 hours needed
- Spreads 7 hours across 14 days = ~30 min per day
```

#### 2. **Smart Revision Scheduling** 🔄
**What it does:**
- Uses the **Spaced Repetition Algorithm (SM-2)**
- Schedules when you should review topics again
- Adjusts based on your confidence level

**How it works:**
```
Revision intervals: 1 day → 3 days → 7 days → 14 days → 30 days → 60 days

If you're confident (80%+): Use full interval
If you're struggling (50%-): Reduce interval by 30%

Example:
- First review: Tomorrow (1 day)
- Second review: 3 days later
- Third review: 7 days later
- And so on...
```

#### 3. **Topic Difficulty Prediction** 📊
**What it does:**
- Analyzes how much time you spend on each topic
- Tracks your confidence levels
- Counts how many times you need to review
- Calculates a difficulty score (0-100)

**How it works:**
```
Difficulty Score Calculation:
- Base score: 50
- Spent 5+ hours? +20 points (harder topic)
- Low confidence (<40%)? +20 points
- Many revisions (5+)? +15 points
- High confidence (80%+)? -20 points

Final score = How difficult this topic is for YOU
```

#### 4. **Personalized Recommendations** 💡
**What it does:**
- Finds topics where you're struggling (confidence < 60%)
- Reminds you about upcoming deadlines (within 7 days)
- Suggests breaks if you've studied too long (5+ hours)

**How it works:**
```
Checks:
1. Topics with low confidence → "Focus on [Topic Name]"
2. Deadlines coming up → "Prepare for [Assignment]"
3. Long study sessions → "Take a break!"

Priority scoring:
- Urgent deadline in 2 days = Priority 80
- Low confidence topic (30%) = Priority 70
- Break reminder = Priority 70
```

---

## 🎯 Main Features Explained

### 1. **Dashboard** 🏠
Your home page showing:
- Total subjects you're studying
- Topics completed vs total
- Upcoming deadlines count
- Study time this week
- Quick access to all features

### 2. **Subjects & Topics** 📚
**Subjects:** Your courses (e.g., Mathematics, Physics, History)
**Topics:** Specific chapters or units within subjects

Example:
```
Subject: Mathematics
  ├── Topic: Algebra
  ├── Topic: Calculus
  └── Topic: Geometry
```

### 3. **Notes** 📝
Rich text editor supporting:
- **Markdown** formatting (bold, italic, lists, etc.)
- **LaTeX** math equations: `$ E = mc^2 $`
- **Code** syntax highlighting for programming
- **Tables**, links, images
- Tags for organization
- Full-text search

### 4. **Study Planner** 📅
Create study sessions:
- Set date and time
- Choose subject and topic
- Set duration
- Track completion
- View in calendar format

### 5. **Flashcards** 🎴
Create flashcard decks:
- Front and back of cards
- Organize by subject
- Study with spaced repetition
- Track which cards you know
- Import/export decks

### 6. **Deadlines** ⏰
Track assignments and exams:
- Due date and time
- Priority level (high/medium/low)
- Status (pending/completed)
- Notifications before due date
- Link to related subjects

### 7. **Analytics** 📊
Visual insights:
- **Study time heatmap** - See which days you study most
- **Subject distribution** - Time spent per subject
- **Productivity trends** - Are you improving?
- **Best study times** - When are you most productive?
- **Completion rates** - How many tasks you finish

### 8. **Resources** 📁
Store study materials:
- Upload files (PDFs, images, etc.)
- Add web links
- Organize by subject/topic
- Add descriptions and tags
- Quick access during study

### 9. **Study Sessions** ⏱️
Track your study time:
- Start/stop timer
- Select subject and topic
- Add notes about the session
- View history
- See total time per subject

### 10. **Search** 🔍
Find anything quickly:
- Search across notes, subjects, topics
- Filter by type
- Recent searches
- Advanced filters

---

## 🔧 Required Setup (API Keys)

### ✅ Required:

1. **Supabase** (Database & Authentication)
   - Free tier available
   - Stores all your data
   - Handles user login/signup
   - Get from: https://supabase.com

2. **EmailJS** (Optional - for contact form)
   - Free tier: 200 emails/month
   - Only needed if you want contact form to work
   - Get from: https://www.emailjs.com

3. **Google OAuth** (Optional - for Google login)
   - Free
   - Only needed if you want "Sign in with Google"
   - Get from: https://console.cloud.google.com

### ❌ NOT Required:

- ❌ OpenAI API key
- ❌ ChatGPT API key
- ❌ Anthropic/Claude API key
- ❌ Any paid AI service

---

## 📊 How Your Data is Stored

Everything is stored in **Supabase (PostgreSQL database)**:

```
Your Database Tables:
├── profiles (your account info)
├── subjects (your courses)
├── topics (chapters/units)
├── notes (your study notes)
├── study_plans (scheduled study sessions)
├── study_sessions (completed study time)
├── deadlines (assignments/exams)
├── flashcard_decks (flashcard collections)
├── flashcards (individual cards)
├── resources (study materials)
├── ai_study_plans (generated study schedules)
├── topic_difficulty (difficulty tracking)
├── study_recommendations (smart suggestions)
└── notifications (reminders and alerts)
```

**Security:**
- Row Level Security (RLS) enabled
- You can only see YOUR data
- Other users cannot access your information
- Secure authentication with Supabase

---

## 🚀 Getting Started Guide

### Step 1: Setup Environment
```bash
# Copy the example environment file
cp .env.local.example .env.local

# Edit .env.local with your Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Setup Database
1. Go to Supabase Dashboard
2. Open SQL Editor
3. Run migration files from `supabase/migrations/` folder in order

### Step 4: Start the App
```bash
npm run dev
```

### Step 5: Use the App
1. Sign up for an account
2. Create your first subject (e.g., "Mathematics")
3. Add topics to the subject (e.g., "Algebra", "Calculus")
4. Create notes, flashcards, or study plans
5. Track your progress in Analytics

---

## 💡 Tips for Best Results

### For Study Plans:
- Add all your deadlines first
- Set realistic available hours per day
- Review and adjust the generated plan
- Mark sessions as complete when done

### For Notes:
- Use tags to organize (e.g., #important, #exam)
- Link related notes together
- Use markdown for better formatting
- Add code blocks for programming notes

### For Flashcards:
- Keep cards simple and focused
- Review regularly (follow the schedule)
- Mark cards as "easy" or "hard"
- Create decks by topic, not by subject

### For Analytics:
- Study consistently to see patterns
- Check your best study times
- Focus on subjects with low completion rates
- Use insights to improve your schedule

---

## 🎓 Example Workflow

**Week 1: Setup**
1. Create subjects: Math, Physics, History
2. Add topics to each subject
3. Add upcoming deadlines
4. Generate AI study plan

**Daily Routine:**
1. Check dashboard for today's tasks
2. Review study recommendations
3. Start a study session (with timer)
4. Take notes during study
5. Create flashcards for key concepts
6. Mark tasks as complete

**Weekly Review:**
1. Check analytics for study patterns
2. Review difficult topics (low confidence)
3. Adjust study plan if needed
4. Prepare for upcoming deadlines

---

## 🔒 Privacy & Security

- ✅ All data stored securely in Supabase
- ✅ Passwords are hashed (never stored in plain text)
- ✅ Row Level Security prevents data leaks
- ✅ No data shared with third parties
- ✅ No external AI services = No data sent to OpenAI/etc.
- ✅ You can export your data anytime

---

## 🆘 Common Questions

**Q: Do I need to pay for AI features?**
A: No! The "AI" features use algorithms, not paid AI services.

**Q: Can I use this offline?**
A: No, you need internet to sync with the database.

**Q: How much does Supabase cost?**
A: Free tier includes 500MB database, 2GB bandwidth, 50,000 monthly active users.

**Q: Can I share my notes with others?**
A: Not currently, but you can export them.

**Q: What happens to my data if I stop using the app?**
A: Your data stays in your Supabase project. You can export it anytime.

**Q: Is this suitable for university students?**
A: Yes! It works for any level - high school, university, or self-study.

---

## 🎯 Summary

**StudyFlow is:**
- ✅ A complete study management platform
- ✅ Free to use (with free Supabase tier)
- ✅ No external AI API keys needed
- ✅ Privacy-focused (your data stays with you)
- ✅ Feature-rich (notes, flashcards, analytics, etc.)

**StudyFlow is NOT:**
- ❌ A ChatGPT-powered tutor
- ❌ An AI that writes essays for you
- ❌ A service that requires paid subscriptions
- ❌ A tool that shares your data with AI companies

**The "AI" features are smart algorithms that:**
- Calculate optimal study schedules
- Track your learning patterns
- Predict topic difficulty based on YOUR data
- Suggest when to review topics
- Remind you about deadlines

Everything is based on YOUR study data and behavior, making it personalized to YOU!

---

Built with ❤️ for students who want to study smarter, not harder.
