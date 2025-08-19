# ASU Marketplace

The ultimate campus marketplace for Arizona State University students. Buy, sell, and connect with your ASU community!

## Features

- **User Authentication**: Secure login and registration with Supabase
- **Listings Management**: Create, edit, and manage your marketplace listings
- **Messaging System**: Communicate with other users about listings
- **User Profiles**: Customize your profile with interests and preferences
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Frontend**: Astro Framework with React components
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ASU-Marketplace
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with your Supabase credentials:
```env
PUBLIC_SUPABASE_URL=your_supabase_url
PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:4321`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Project Structure

```
src/
├── components/     # React components
├── contexts/      # React contexts (Auth, etc.)
├── features/      # Redux slices
├── lib/          # Utility libraries (Supabase client)
├── pages/        # Page components
├── store/        # Redux store configuration
└── layouts/      # Astro layouts
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
