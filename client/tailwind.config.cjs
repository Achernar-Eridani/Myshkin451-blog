/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // 让正文用无衬线字体，代码/元数据用等宽字体
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'Consolas', 'monospace'], 
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'), // 如果你的 tailwind 版本较老，需要这个插件
  ],
}