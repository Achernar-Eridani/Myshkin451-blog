<template>
  <footer class="bg-white dark:bg-[#050505] border-t border-gray-200 dark:border-gray-800 pt-20 pb-10 transition-colors duration-500">
    <div class="container mx-auto px-6 max-w-6xl">
      
      <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
        <div class="md:col-span-2 space-y-6">
          <h4 class="font-serif text-2xl font-bold">Myshkin451</h4>
          <p class="text-gray-500 dark:text-gray-400 max-w-sm leading-relaxed">
            A digital garden exploring the intersection of backend engineering, distributed systems, and artificial intelligence.
          </p>
        </div>
        
        <div>
          <h5 class="font-mono text-xs font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">Navigation</h5>
          <ul class="space-y-3 text-sm text-gray-500 dark:text-gray-400">
            <li><router-link to="/" class="hover:text-black dark:hover:text-white transition-colors">Home</router-link></li>
            <li><router-link to="/categories" class="hover:text-black dark:hover:text-white transition-colors">Categories</router-link></li>
            <li><router-link to="/guestbook" class="hover:text-black dark:hover:text-white transition-colors">Guestbook</router-link></li>
          </ul>
        </div>

        <div>
          <h5 class="font-mono text-xs font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">Social</h5>
          <ul class="space-y-3 text-sm text-gray-500 dark:text-gray-400">
            <li><a href="https://github.com/Achernar-Eridani" target="_blank" class="hover:text-black dark:hover:text-white transition-colors">GitHub</a></li>
            <li><a href="#" class="hover:text-black dark:hover:text-white transition-colors">RSS Feed</a></li>
          </ul>
        </div>
      </div>

      <div class="flex flex-col md:flex-row justify-between items-end border-t border-gray-100 dark:border-gray-800 pt-10">
        <div class="text-[10vw] leading-none font-bold text-gray-100 dark:text-[#111] select-none pointer-events-none -ml-2">
          M/451
        </div>
        <div class="text-xs font-mono text-gray-400 mb-2">
          &copy; {{ new Date().getFullYear() }} SHENZHEN / HANGZHOU.
        </div>
      </div>

    </div>
  </footer>
</template>