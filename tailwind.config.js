/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "text-tertary": "var(--text-tertary)",
        "bg-primary": "var(--bg-primary)",
        "bg-secondary": "var(--bg-secondary)",
        "bg-tertary": "var(--bg-tertary)",
        "accent": "var(--accent)",
        // "secondary-color": "var(--text-secondary)",
        // "background-white": "var(--background)",
      },
      backgroundImage: {
        'chat-bg-light': "url('./Images/chat_bg1.png')",
        'chat-bg-dark': "url('./Images/chat_bg2.png')",

      }
    },
  },
  plugins: [],
}

