/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1A3A6B',
        primaryDeep: '#102F5D',
        teal: '#0F6E56',
        surface: '#F5F7FA',
        card: '#FFFFFF',
        border: '#E2E8F0',
        textPrimary: '#0F172A',
        textSecondary: '#64748B',
        statusGreen: '#16A34A',
        statusOrange: '#D97706',
        statusRed: '#DC2626',
        mutedBg: '#F8FAFC',
        warnBg: '#FEF3C7',
      },
      fontFamily: {
        heading: ['Plus Jakarta Sans', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        card: '8px',
        btn: '6px',
      },
      borderWidth: {
        3: '3px',
      },
    },
  },
  plugins: [],
}
