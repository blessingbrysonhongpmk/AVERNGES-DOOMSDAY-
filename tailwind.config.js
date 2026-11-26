/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'xs': '360px',
      'sm': '576px', // Matches Bootstrap sm
      'md': '768px', // Matches Bootstrap md
      'lg': '992px', // Matches Bootstrap lg
      'xl': '1200px', // Matches Bootstrap xl
      '2xl': '1400px', // Matches Bootstrap xxl
    },
    extend: {
      colors: {
        cinematic: {
          bg: '#08090B',
          surface: '#111216',
          surfaceRaised: '#18191E',
          text: '#F5F5F5',
          silver: '#D8D9DC',
          muted: '#777A80',
          border: '#1E2024',
          borderHover: '#2D3036',
          red: '#E62429',
          redHover: '#F0383D',
        },
        doom: {
          bg: '#08090B',
          surface: '#111216',
          surfaceElevated: '#18191E',
          text: '#F5F5F5',
          muted: '#777A80',
          border: '#1E2024',
          borderHover: '#2D3036',
          accent: '#E62429',
          accentLight: '#F0383D',
          accentDark: '#8E181B',
          silver: '#D8D9DC',
          silverLight: '#E8EAEF',
          danger: '#E62429',
          dangerHover: '#F0383D'
        }
      },
      fontFamily: {
        cinematic: ['Cinzel', 'Trajan Pro', 'Bodoni Moda', 'Georgia', 'serif'],
        trailer: ['Bebas Neue', 'Oswald', 'Barlow Condensed', 'Impact', 'sans-serif'],
        hud: ['Barlow Condensed', 'Oswald', 'sans-serif'],
        display: ['Montserrat', 'Plus Jakarta Sans', 'sans-serif'],
        mono: ['IBM Plex Mono', 'SFMono-Regular', 'Consolas', 'monospace'],
        body: ['Plus Jakarta Sans', 'system-ui', '-apple-system', 'sans-serif'],
        sans: ['Plus Jakarta Sans', 'system-ui', '-apple-system', 'sans-serif'],
      },
      letterSpacing: {
        widest: '0.25em',
        epic: '0.35em',
        titan: '0.5em',
      },
      borderRadius: {
        xs: '2px',
      },
      scale: {
        106: '1.06',
        108: '1.08',
      },
      brightness: {
        65: '.65',
        85: '.85',
      },
      contrast: {
        120: '1.2',
      },
      spacing: {
        13: '3.25rem',
      },
    },
  },
  plugins: [],
}
