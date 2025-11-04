# 📊 Project Management Dashboard

**St. Paul's School - Educational Technology Command Center**

A sophisticated project management dashboard featuring comprehensive Gantt visualisation with milestone tracking, built with React, TypeScript, and Tailwind CSS.

[![Netlify Status](https://api.netlify.com/api/v1/badges/your-badge-id/deploy-status)](https://app.netlify.com/sites/your-site/deploys)

## ✨ Features

- 🎨 **Beautiful UI**: Premium design with elegant animations and glassmorphism effects
- 📈 **Gantt Chart**: Interactive timeline visualisation with vertical month labels
- 🎯 **Project Icons**: Colour-coded projects with custom emoji icons
- 📱 **Responsive**: Fully responsive design that works on all devices
- 🔄 **Real-time Updates**: Dynamic project tracking and progress monitoring
- 🎭 **Phase Tracking**: Visual phase indicators (Inception, Planning, Design, Development, Testing, Deployment)
- 🌈 **Colour Palette**: Vibrant accent colours for each project
- ⚡ **Performance**: Optimised with Vite for lightning-fast builds

## 🚀 Quick Start

### Prerequisites

- Node.js 20 or higher
- npm or yarn

### Installation

1. **Clone the repository:**
```bash
git clone <your-repo-url>
cd Dashboard
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start development server:**
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run clean` - Clean build cache
- `npm run deploy` - Build and deploy to Netlify

## 🛠️ Tech Stack

- **Framework**: React 18.3
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Build Tool**: Vite 6.3
- **UI Components**: Radix UI
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Backend** (Optional): Supabase

## 📁 Project Structure

```
Dashboard/
├── public/              # Static assets
│   └── _redirects      # Netlify redirects
├── src/
│   ├── components/     # React components
│   │   ├── ui/        # Reusable UI components
│   │   ├── GanttChart.tsx
│   │   ├── ProjectCard.tsx
│   │   └── ...
│   ├── utils/         # Utility functions
│   ├── styles/        # Global styles
│   ├── App.tsx        # Main application
│   └── main.tsx       # Entry point
├── netlify.toml       # Netlify configuration
├── vite.config.ts     # Vite configuration
└── tailwind.config.js # Tailwind configuration
```

## 🌐 Deployment

### Deploy to Netlify

The project is pre-configured for Netlify deployment:

1. **Connect your Git repository** to Netlify
2. **Configure build settings** (already set in `netlify.toml`):
   - Build command: `npm run build`
   - Publish directory: `build`
3. **Deploy!**

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

### Manual Deployment

```bash
# Build the project
npm run build

# Deploy using Netlify CLI
npm run deploy
```

## 🎨 Customisation

### Project Icons

Icons are automatically assigned based on project names in `src/components/GanttChart.tsx`:
- 🤖 AI/Tech projects
- 📊 Assessment systems
- 📐 Mathematics/IB resources
- 🎓 Portals and forms
- And more...

### Colour Palette

10 vibrant accent colours rotate through projects:
- Coral Red (#FF6B6B)
- Turquoise (#4ECDC4)
- Sky Blue (#45B7D1)
- Sage Green (#96CEB4)
- Warm Yellow (#FFEAA7)
- And more...

### St. Paul's School Branding

Official school colours:
- Indigo Blue: #001D31
- Ruby Red: #820021
- British Green: #002718
- Gold: #B8860B

## 📄 License

Private - St. Paul's School

## 👨‍💻 Author

**Mr Nascimento**  
AI Solutions Developer  
St. Paul's School - Educational Technology Command Center

---

**Original Design**: [Figma Project](https://www.figma.com/design/JRQvUxpwZGP9Lc37AO1HHz/Project-Management-Dashboard--Copy-)

**Made with** ❤️ **for St. Paul's School**
