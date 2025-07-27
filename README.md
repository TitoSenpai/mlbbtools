# MLBB Tools - Production Ready Platform

A comprehensive Mobile Legends: Bang Bang platform featuring a powerful admin dashboard and dynamic blog system built with Next.js 15, TypeScript, and shadcn/ui components.

## 🚀 Features

### Admin Dashboard
- **Real-time Analytics**: Monitor user engagement, page views, and content performance
- **Content Management**: Create, edit, and manage blog posts with rich text editing
- **User Management**: Handle user roles, permissions, and account management
- **Performance Monitoring**: Track platform metrics and generate reports
- **Responsive Design**: Fully responsive dashboard that works on all devices

### Blog Platform
- **Dynamic Content**: Create and publish MLBB guides, strategies, and updates
- **Category & Tag System**: Organize content for easy discovery
- **Comment System**: Engage with the community through comments
- **SEO Optimized**: Built-in SEO features for better search visibility
- **Featured Posts**: Highlight important content on the homepage

### MLBB Specific Features
- **Hero Guides**: Comprehensive guides for all Mobile Legends heroes
- **Build Calculator**: Optimize item builds with advanced calculations
- **Meta Analysis**: Stay updated with current meta and tier lists
- **Strategy Content**: In-depth strategic content for competitive play

## 🛠 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Deployment**: Cloudflare Workers (via OpenNext)

## 📦 Installed Components

This project includes all essential shadcn/ui components:

### Navigation & Layout
- ✅ Sidebar with collapsible navigation
- ✅ Breadcrumb navigation
- ✅ Navigation menu
- ✅ Tooltip and popover components

### Forms & Input
- ✅ Button, Input, Textarea
- ✅ Select, Checkbox, Radio Group
- ✅ Switch, Label, Form components

### Data Display
- ✅ Table with sorting and filtering
- ✅ Card components
- ✅ Badge and Avatar
- ✅ Progress indicators
- ✅ Charts for analytics

### Feedback & Overlays
- ✅ Dialog and Sheet components
- ✅ Dropdown menus
- ✅ Accordion and Collapsible
- ✅ Tabs for content organization

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Open your browser**:
   Navigate to `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run deploy` - Deploy to Cloudflare
- `npm run preview` - Preview Cloudflare build locally

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Admin dashboard pages
│   │   ├── blog/         # Blog management
│   │   └── page.tsx      # Dashboard home
│   ├── blog/             # Public blog pages
│   │   └── page.tsx      # Blog homepage
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Landing page
├── components/           # React components
│   ├── ui/              # shadcn/ui components
│   ├── dashboard/       # Dashboard-specific components
│   └── blog/            # Blog-specific components
└── lib/                 # Utility functions
    └── utils.ts         # Tailwind utilities
```

## 🎨 Design System

This project uses a comprehensive design system based on shadcn/ui:

### Color Palette
- **Primary**: Blue (#3B82F6) - For primary actions and navigation
- **Secondary**: Purple (#8B5CF6) - For accent elements
- **Success**: Green (#10B981) - For positive actions
- **Warning**: Orange (#F59E0B) - For warnings and alerts
- **Error**: Red (#EF4444) - For errors and destructive actions

### Typography
- **Headings**: Inter font family for clean, modern headings
- **Body**: Inter for consistent body text
- **Code**: Mono font for code snippets and technical content

## 📱 Responsive Design

The platform is fully responsive with breakpoints:
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: 1024px+

Key responsive features:
- Collapsible sidebar on mobile
- Adaptive grid layouts
- Touch-friendly interactive elements
- Optimized navigation for all screen sizes

## 🚀 Deployment

### Cloudflare Workers (Recommended)
This project is optimized for Cloudflare Workers deployment:

```bash
npm run deploy
```

### Other Platforms
The project can also be deployed to:
- Vercel
- Netlify  
- AWS Amplify
- Any Node.js hosting provider

## 🎮 MLBB Integration

### Content Types
- **Hero Guides**: Detailed guides for each Mobile Legends hero
- **Build Guides**: Item build recommendations and explanations
- **Strategy Articles**: Meta analysis and strategic gameplay tips
- **News & Updates**: Latest game updates and patch notes

### Community Features
- **User Comments**: Engage with the community
- **Ratings**: Rate guides and content
- **Social Sharing**: Share content across platforms
- **User Profiles**: Track user contributions

## 🎯 Production Checklist

- ✅ All shadcn/ui components installed
- ✅ Responsive design implemented
- ✅ Dashboard with analytics
- ✅ Blog management system
- ✅ User authentication ready
- ✅ SEO optimization
- ✅ Performance optimization
- ✅ Error handling
- ✅ Loading states
- ✅ Accessibility features

## 📝 License

This project is for the MLBB Tools platform. All rights reserved.

---

**Built with ❤️ for the Mobile Legends: Bang Bang community**
