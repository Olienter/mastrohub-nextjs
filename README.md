# 🍽️ MastroHub - AI-Powered Restaurant Management Platform

A comprehensive restaurant management platform with AI-powered features for menu creation, business insights, and operational optimization.

## ✨ Features

### 🤖 AI Restaurant Assistant
- **LinkedIn-style chat widget** - Floating AI assistant in the bottom right corner
- **Natural conversation** - Friendly, human-like responses
- **Business insights** - Menu analysis, profitability tracking, customer behavior
- **Multi-provider AI support** - OpenAI GPT-4o, Anthropic Claude, Ollama (local)

### 📋 Menu Maker
- **Social network interface** - Each menu item has its own profile
- **Comprehensive manuals** - Chef, Waiter, Marketing, Analytics, Supply Chain, Financial, Sustainability
- **AI Interview system** - 15-minute smart interview to generate all manuals
- **Drag & drop interface** - Easy menu organization

### 📱 QR Menu System
- **Dynamic QR generation** - Real-time menu QR codes
- **Download & share** - Multiple format support
- **Edit & customize** - Full menu management

### 🔧 Restaurant Curator
- **Central dashboard** - All tools in one place
- **Private database** - Secure data management
- **User authentication** - Protected access

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Olienter/mastrohub-nextjs.git
cd mastrohub-nextjs
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

4. **Configure AI providers** (optional)
```bash
# Add to .env.local
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
AI_PROVIDER=openai
```

5. **Run the development server**
```bash
npm run dev
```

6. **Open your browser**
```
http://localhost:3000
```

## 🤖 AI Setup

### Option 1: OpenAI GPT-4o (Recommended)
```bash
# Add to .env.local
AI_PROVIDER=openai
OPENAI_API_KEY=sk-your-key-here
```

### Option 2: Anthropic Claude 3.5
```bash
# Add to .env.local
AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

### Option 3: Ollama (Local - FREE)
```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Pull model
ollama pull llama3.2:3b

# Add to .env.local
AI_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js 15 App Router
│   ├── menu-maker/        # Menu creation interface
│   ├── qrmenu/           # QR menu system
│   └── restaurant-curator/ # Main dashboard
├── components/
│   ├── menu-maker/       # Menu-related components
│   ├── layout/           # Layout components
│   └── ui/              # Reusable UI components
├── lib/
│   ├── ai-agent.ts      # AI assistant logic
│   ├── ai-provider.ts   # Multi-provider AI system
│   └── utils.ts         # Utility functions
```

## 🛠️ Technologies

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Database**: Supabase
- **Authentication**: Supabase Auth
- **AI**: OpenAI GPT-4o, Anthropic Claude, Ollama
- **Language**: TypeScript

## 🎯 Key Features

### AI Restaurant Assistant
- **Natural conversation** with restaurant context
- **Business insights** and recommendations
- **Menu analysis** and optimization
- **Financial tracking** and profitability analysis
- **Marketing strategies** and customer insights

### Menu Maker
- **Profile-based menu items** - Each item has comprehensive data
- **AI-generated manuals** - 7 different manual types per item
- **Smart interview system** - 15-minute AI interview
- **Social network interface** - Menu items as profiles

### QR Menu System
- **Dynamic QR generation** from menu data
- **Download and sharing** capabilities
- **Real-time updates** and customization
- **Mobile-friendly** design

## 🔒 Security

- **Environment variables** for sensitive data
- **GitHub push protection** against secrets
- **Comprehensive .gitignore** for sensitive files
- **User authentication** and protected routes

## 📈 Performance

- **Optimized imports** and lazy loading
- **Webpack optimization** for faster builds
- **Image optimization** with Next.js
- **Code splitting** and dynamic imports

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the [AI Setup Guide](README-AI-SETUP.md)
- Review the documentation

## 🎉 Acknowledgments

- Next.js team for the amazing framework
- OpenAI, Anthropic, and Ollama for AI capabilities
- Tailwind CSS for the beautiful styling
- Framer Motion for smooth animations

---

**Made with ❤️ for the restaurant industry**
