# ASU Marketplace

A modern marketplace platform built with Astro, React, and TypeScript, designed for Arizona State University students to buy, sell, and trade items.

## 🚀 Phase 1 Complete

Phase 1 of the ASU Marketplace project has been successfully completed, including:

### ✅ Project Setup
- **Astro Project**: Initialized with React and TypeScript support
- **UI Framework**: Integrated Tailwind CSS for modern, responsive design
- **Package Management**: All dependencies properly configured and installed

### ✅ Supabase Integration
- **Database**: Supabase client library installed and configured
- **Authentication**: Ready for Google OAuth integration
- **Schema Design**: Database structure planned for users and listings tables

### ✅ Development Environment
- **TypeScript**: Full TypeScript support for type safety
- **React Components**: Ready for building interactive UI components
- **Build System**: Development and production build pipelines configured

## 🛠️ Tech Stack

- **Frontend Framework**: [Astro](https://astro.build/) with React integration
- **UI Framework**: [Tailwind CSS](https://tailwindcss.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Backend**: [Supabase](https://supabase.com/) (Database & Authentication)
- **Package Manager**: npm

## 📁 Project Structure

```
ASU-Marketplace/
├── public/          # Static assets
├── src/             # Source code
│   ├── components/  # React components
│   ├── pages/       # Astro pages
│   └── layouts/     # Page layouts
├── astro.config.mjs # Astro configuration
├── tsconfig.json    # TypeScript configuration
└── package.json     # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Bhavya700/ASU-Marketplace.git
   cd ASU-Marketplace
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:4321`

## 📝 Available Scripts

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory with your Supabase credentials:
```env
PUBLIC_SUPABASE_URL=your_supabase_project_url
PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🎯 Next Steps

- [ ] Implement user authentication with Supabase
- [ ] Create database schema for users and listings
- [ ] Build marketplace listing components
- [ ] Implement search and filtering functionality
- [ ] Add image upload capabilities
- [ ] Create user profile management

## 🤝 Contributing

This project is currently in development. Contributions and feedback are welcome!

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ for ASU students**
