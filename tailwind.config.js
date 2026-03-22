/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px) scale(0.97)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        popIn: {
          '0%': { transform: 'scale(1)' },
          '40%': { transform: 'scale(1.13)' },
          '100%': { transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.4s ease-out both',
        'slide-up': 'slideUp 0.22s cubic-bezier(0.16, 1, 0.3, 1) both',
        'pop-in': 'popIn 0.35s ease-out',
      },
      colors: {
        dm: {
          bg:      '#0B0C1A',  // page background
          surface: '#131526',  // cards, navbar
          raised:  '#1C1E38',  // elevated surfaces (sidebar header, code blocks)
          border:  '#252740',  // borders
        },
        brand: {
          dark: '#F4F4F8',       // page background
          darker: '#FFFFFF',     // navbar / surface
          orange: '#FF4F1F',     // primary accent
          'orange-light': '#FF6B45',
          cyan: '#0068B8',       // links / accents (dark enough for light bg)
          'cyan-light': '#0080D8',
          gray: '#FFFFFF',       // card background
          'gray-light': '#E6E6F0', // borders
          muted: '#767698',      // muted text
        },
      },
      fontFamily: {
        sans: ['Proxima Nova', 'proxima-nova', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#374151',
            'h1,h2,h3,h4': { color: '#111827' },
            a: { color: '#0068B8' },
            code: { color: '#FF4F1F' },
            'code::before': { content: '""' },
            'code::after': { content: '""' },
            pre: { backgroundColor: '#F8F8FB', border: '1px solid #E6E6F0' },
            blockquote: { borderLeftColor: '#FF4F1F', color: '#6B7280' },
            strong: { color: '#111827' },
            hr: { borderColor: '#E6E6F0' },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
