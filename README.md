# LinkUp - Modern Dating Platform

A premium, mobile-first dating web app (PWA) where users can like specific parts of profiles (photos or prompt answers), match, and chat.

## 🚀 Live Demo

**Preview URL:** https://work-1-ganeaumaaiqjfgxl.prod-runtime.all-hands.dev

### Test Accounts

| Email | Password | Type |
|-------|----------|------|
| admin@linkup.app | admin123 | Admin |
| emma@example.com | password123 | User |
| james@example.com | password123 | User |
| sophie@example.com | password123 | User |

## ✨ Features

### Core Features
- **Smooth Onboarding** - 5-step wizard for profile creation
- **Profile System** - Photos (3-6) + 3 prompt answers
- **Discovery Feed** - Vertical card stack with swipe-like interactions
- **Targeted Likes** - Like specific photos or prompt answers with optional comments
- **Matching** - Automatic match creation when both users like each other
- **Real-time Chat** - 1:1 messaging for matched users
- **Safety Tools** - Block, report, and moderation features

### Additional Features
- **PWA Support** - Installable on mobile devices
- **Admin Dashboard** - Moderation tools and analytics
- **48 Curated Prompts** - Across 4 categories (fun, values, lifestyle, relationship)
- **Discovery Filters** - Age range, distance, gender preference
- **Privacy Controls** - Hide profile, pause account, delete account

## 🛠 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Database:** SQLite with Prisma ORM
- **Authentication:** JWT with HTTP-only cookies
- **Icons:** Lucide React

## 📦 Installation

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup

1. **Clone and install dependencies:**
```bash
cd linkup
npm install
```

2. **Set up environment variables:**
```bash
cp .env.example .env
# Edit .env with your settings
```

3. **Initialize the database:**
```bash
npx prisma generate
npx prisma db push
```

4. **Seed the database (optional but recommended):**
```bash
npx prisma db seed
```

5. **Start the development server:**
```bash
npm run dev
```

The app will be available at http://localhost:3000

## 🗄 Database Schema

### Tables
- **users** - Authentication and account data
- **profiles** - User profile information
- **photos** - Profile photos (3-6 per user)
- **prompts** - Curated prompt questions
- **prompt_answers** - User answers to prompts
- **likes** - Likes on photos or prompts (with optional comments)
- **matches** - Matched user pairs
- **messages** - Chat messages between matches
- **blocks** - Blocked user relationships
- **reports** - User reports for moderation
- **skips** - Skipped profiles in discovery

## 📱 Pages & Routes

### Public
- `/` - Landing page
- `/login` - Sign in
- `/signup` - Create account
- `/safety` - Dating safety tips
- `/guidelines` - Community guidelines

### Authenticated
- `/onboarding` - Profile setup wizard
- `/discover` - Discovery feed
- `/matches` - Match list
- `/messages/[matchId]` - Chat with match
- `/profile` - View/edit profile
- `/settings` - Preferences and account

### Admin
- `/admin` - Moderation dashboard

## 🔐 API Routes

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Sign in
- `POST /api/auth/logout` - Sign out
- `GET /api/auth/me` - Get current user

### Profile
- `GET /api/profile` - Get profile
- `POST /api/profile` - Create profile
- `PATCH /api/profile` - Update profile

### Discovery & Matching
- `GET /api/discovery` - Get discoverable profiles
- `POST /api/likes` - Like a photo or prompt
- `POST /api/skip` - Skip a profile
- `GET /api/matches` - Get matches

### Messaging
- `GET /api/messages/[matchId]` - Get messages
- `POST /api/messages/[matchId]` - Send message

### Safety
- `POST /api/blocks` - Block user
- `POST /api/reports` - Report user

### Admin
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/reports` - Get reports queue
- `PATCH /api/admin/reports` - Update report status

## 🎨 Design System

- **Primary Color:** Coral (#ff6b4a)
- **Style:** Modern, warm, minimal, premium
- **Typography:** Clean, large touch targets
- **Components:** Rounded cards, subtle shadows
- **Animations:** Like animation, match celebration

## 📋 Prompt Categories

1. **Fun** - Light-hearted conversation starters
2. **Values** - What matters most to you
3. **Lifestyle** - How you spend your time
4. **Relationship** - What you're looking for

## 🔒 Security Features

- HTTP-only JWT cookies
- Password hashing with bcrypt
- Rate limiting on likes/messages
- User blocking and reporting
- Admin moderation tools
- GDPR-compliant account deletion

## 📝 Environment Variables

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key"
UPLOAD_DIR="./public/uploads"
```

## 🚀 Deployment

### Build for production:
```bash
npm run build
npm start
```

### Database migrations:
```bash
npx prisma migrate deploy
```

## 📄 License

MIT License - feel free to use this for your own projects!

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS
