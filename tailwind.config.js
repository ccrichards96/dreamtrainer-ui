/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html', 
    './src/**/*.{js,ts,jsx,tsx}',
    'node_modules/preline/dist/*.js'
  ],
  safelist: [
    // Dynamic padding classes that might be used in Storyblok
    {
      pattern: /^(p|px|py|pt|pb|pl|pr)-\d+$/,
    },
    // Dynamic margin classes
    {
      pattern: /^(m|mx|my|mt|mb|ml|mr)-\d+$/,
    },
    // Dynamic background colors
    {
      pattern: /^bg-(red|green|blue|yellow|purple|pink|indigo|gray|black|white)-(50|100|200|300|400|500|600|700|800|900)$/,
    },
    // Common spacing values
    'px-4', 'px-6', 'px-8', 'px-12', 'px-16', 'px-20', 'px-24',
    'py-4', 'py-6', 'py-8', 'py-12', 'py-16', 'py-20', 'py-24',
    'm-4', 'm-6', 'm-8', 'm-12', 'm-16', 'm-20', 'm-24',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
