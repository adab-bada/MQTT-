/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class', // atau 'media' jika Anda lebih suka deteksi otomatis dari OS
  theme: {
    extend: {
      colors: {
        // Warna untuk Light Mode
        'light-bg': '#f0f2f5',
        'light-card': '#ffffff',
        'light-text': '#1f2937',
        'light-text-secondary': '#6b7280',
        'light-primary': '#3b82f6',
        'light-accent': '#10b981',

        // Warna untuk Dark Mode
        'dark-bg': '#111827',
        'dark-card': '#1f2937',
        'dark-text': '#f9fafb',
        'dark-text-secondary': '#9ca3af',
        'dark-primary': '#60a5fa',
        'dark-accent': '#34d399',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideIn: {
          '0%': { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-in': 'slideIn 0.5s ease-out',
      }
    },
  },
  plugins: [],
}
