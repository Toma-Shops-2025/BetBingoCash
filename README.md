# 🎯 BetBingoCash - Live Bingo Gaming Platform

A modern, real-time bingo gaming platform built with React, TypeScript, and Supabase. Players can enjoy live bingo games, participate in tournaments, earn rewards, and cash out their winnings.

## ✨ Features

- 🎮 **Live Bingo Games** - Real-time number calling with interactive bingo cards
- 🏆 **Tournaments** - Competitive gameplay with prize pools
- 💎 **Reward System** - Earn gems and bonuses through gameplay
- 💰 **Payment Integration** - Secure payment processing with PayPal
- 📊 **Leaderboards** - Track your progress and compete with others
- 🎁 **Daily Rewards** - Login bonuses and special offers
- 🔐 **User Authentication** - Secure signup/login with Supabase
- 📱 **Responsive Design** - Works perfectly on all devices

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd BetBingoCash
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Go to [supabase.com](https://supabase.com) and create a new project
   - Copy your project URL and anon key
   - Update `src/lib/supabase.ts` with your credentials

4. **Set up the database**
   - Run the SQL commands from `supabase-schema.sql` in your Supabase SQL editor
   - This will create all necessary tables and policies

5. **Configure environment variables**
   Create a `.env.local` file:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── ui/            # Reusable UI components
│   ├── GameInterface.tsx    # Main game interface
│   ├── BingoCard.tsx       # Bingo card component
│   ├── AuthModal.tsx       # Authentication modal
│   └── PaymentModal.tsx    # Payment processing
├── contexts/           # React contexts
│   └── AppContext.tsx      # Main app state
├── lib/               # Utility libraries
│   └── supabase.ts         # Supabase client
├── pages/             # Page components
└── hooks/             # Custom React hooks
```

## 🎮 Game Features

### Bingo Gameplay
- **Auto-daub**: Automatically mark called numbers
- **Power-ups**: Special abilities to enhance gameplay
- **Real-time scoring**: Live score updates
- **Multiple bingo patterns**: Rows, columns, and diagonals

### Power-ups
- ⭐ **Magic Ball**: Call 3 numbers at once
- 👑 **Magic Dauber**: Auto-mark numbers for 10 seconds
- ⚡ **Triple Time**: Extend game time

### Scoring System
- Base points for each called number
- Bonus points for completing bingo lines
- Gems awarded based on final score

## 💳 Payment Integration

The app uses PayPal for secure payment processing:

- **Deposits**: Add funds to your account
- **Withdrawals**: Cash out your winnings
- **Secure**: Bank-level encryption
- **Fast**: Instant processing

## 🔐 Authentication

Built with Supabase Auth:

- **Email/Password**: Traditional signup/login
- **Session Management**: Automatic session handling
- **User Profiles**: Customizable user information
- **Secure**: Industry-standard security

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface
- **Responsive**: Works on all screen sizes
- **Dark Theme**: Easy on the eyes
- **Animations**: Smooth transitions and effects
- **Accessibility**: WCAG compliant

## 🚀 Deployment

### Netlify Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Connect your GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `dist`
   - Deploy!

### Environment Variables for Production

Set these in your Netlify dashboard:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

- TypeScript for type safety
- ESLint for code quality
- Prettier for formatting
- Component-based architecture

## 📱 Mobile Support

- **Responsive Design**: Adapts to all screen sizes
- **Touch Optimized**: Optimized for mobile devices
- **PWA Ready**: Can be installed as a mobile app

## 🔒 Security Features

- **Row Level Security**: Database-level security
- **Input Validation**: Client and server-side validation
- **Secure Authentication**: Supabase Auth integration
- **HTTPS Only**: Secure connections

## 🎯 Future Enhancements

- [ ] **Multiplayer Rooms**: Play with friends
- [ ] **Voice Chat**: In-game communication
- [ ] **Achievement System**: Unlockable rewards
- [ ] **Social Features**: Friend lists and sharing
- [ ] **Mobile App**: Native iOS/Android apps
- [ ] **Live Streaming**: Watch other players
- [ ] **Custom Themes**: Personalize your experience

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you need help:

- Check the [Issues](https://github.com/your-repo/issues) page
- Create a new issue for bugs
- Join our [Discord](https://discord.gg/your-server) for community support

## 🙏 Acknowledgments

- [Supabase](https://supabase.com) for backend services
- [React](https://reactjs.org) for the frontend framework
- [Tailwind CSS](https://tailwindcss.com) for styling
- [Shadcn/ui](https://ui.shadcn.com) for UI components

---

**Happy Gaming! 🎉**

Built with ❤️ by the BetBingoCash team
