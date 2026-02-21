/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Modernized Light Mode
        'light-bg': '#f1f5f9',
        'light-card': '#ffffff',
        'light-text': '#0f172a',
        'light-text-secondary': '#64748b',
        'light-primary': '#2563eb',
        'light-accent': '#059669',

        // Automotive Dark Mode (Default look for this app)
        'dark-bg': '#0f0f11',
        'dark-card': '#1a1a1d',
        'dark-text': '#f8fafc',
        'dark-text-secondary': '#94a3b8',
        'dark-primary': '#3b82f6', // Electric Blue
        'dark-accent': '#ef4444', // Racing Red
        'dark-success': '#10b981', // Emerald Green
        'dark-warning': '#f59e0b', // Amber
      },
      boxShadow: {
        'neon-blue': '0 0 10px rgba(59, 130, 246, 0.5)',
        'neon-red': '0 0 10px rgba(239, 68, 68, 0.5)',
        'inner-dark': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.6)',
      },
      backgroundImage: {
        'carbon-pattern': "radial-gradient(circle, #1a1a1d 0%, #0f0f11 100%)",
        'dashboard-gradient': "linear-gradient(180deg, rgba(26,26,29,1) 0%, rgba(15,15,17,1) 100%)",
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideIn: {
          '0%': { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        pulseNeon: {
          '0%, 100%': { opacity: 1, boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)' },
          '50%': { opacity: 0.8, boxShadow: '0 0 20px rgba(59, 130, 246, 0.8)' },
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-in': 'slideIn 0.5s ease-out',
        'pulse-neon': 'pulseNeon 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
