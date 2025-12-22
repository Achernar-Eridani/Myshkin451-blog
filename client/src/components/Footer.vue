<template>
  <footer class="border-t border-zinc-200/70 bg-white/45 py-12 dark:border-zinc-800/70 dark:bg-zinc-950/40">
    <div class="mx-auto max-w-6xl px-6">
      <div class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <div class="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">Myshkin451</div>
          <div class="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
            &copy; {{ new Date().getFullYear() }} · Built with Node.js & Vue 3 · Writing & shipping
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <a
            href="https://github.com/Achernar-Eridani"
            target="_blank"
            rel="noopener noreferrer"
            class="rounded-full border border-zinc-200 bg-white/70 px-4 py-2 text-sm text-zinc-800
                   transition hover:bg-white dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-200 dark:hover:bg-zinc-900/60"
          >
            GitHub
          </a>

          <a
            href="https://marketplace.visualstudio.com/"
            target="_blank"
            rel="noopener noreferrer"
            class="rounded-full border border-zinc-200 bg-white/70 px-4 py-2 text-sm text-zinc-800
                   transition hover:bg-white dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-200 dark:hover:bg-zinc-900/60"
          >
            Marketplace
          </a>

          <span class="text-xs text-zinc-500 dark:text-zinc-400">
            Less gimmick, more craft.
          </span>
        </div>
      </div>
    </div>
  </footer>
</template>
