<template>
  <article
    class="group relative overflow-hidden rounded-2xl border border-zinc-200/70 bg-white/60 shadow-sm backdrop-blur
           transition hover:-translate-y-[1px] hover:border-zinc-300 hover:bg-white
           dark:border-zinc-800/70 dark:bg-zinc-900/30 dark:hover:border-zinc-700 dark:hover:bg-zinc-900/45"
  >
    <!-- Cover -->
    <router-link :to="`/posts/${article.id}`" class="block">
      <div class="relative aspect-[16/10] overflow-hidden border-b border-zinc-200/60 dark:border-zinc-800/60">
        <img
          v-if="validImage"
          :src="article.coverImage"
          :alt="article.title"
          class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          @error="handleImageError"
        />
        <div v-else class="h-full w-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
          <div class="text-xs uppercase tracking-[0.25em] text-zinc-500 dark:text-zinc-400">
            Myshkin451
          </div>
        </div>

        <div
          class="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100
                 [background-image:linear-gradient(to_top,rgba(0,0,0,0.20),transparent_60%)]"
        ></div>
      </div>
    </router-link>

    <!-- Body -->
    <div class="p-5">
      <div class="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
        <span>{{ formatDate(article.createdAt) }}</span>

        <template v-if="article.category">
          <span class="opacity-50">·</span>
          <router-link
            :to="`/categories/${article.category.slug || article.category.id}`"
            class="truncate hover:text-zinc-900 dark:hover:text-white"
          >
            {{ article.category.name }}
          </router-link>
        </template>

        <span v-if="article.views != null" class="ml-auto opacity-70">
          {{ article.views }} views
        </span>
      </div>

      <router-link :to="`/posts/${article.id}`" class="block">
        <h3
          class="mt-3 text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50
                 decoration-zinc-300 underline-offset-4 group-hover:underline"
        >
          {{ article.title }}
        </h3>
      </router-link>

      <p class="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 line-clamp-3">
        {{ article.excerpt || stripHtml(article.content) }}
      </p>

      <div v-if="article.tags && article.tags.length" class="mt-4 flex flex-wrap gap-2">
        <router-link
          v-for="tag in article.tags.slice(0, 4)"
          :key="tag.id"
          :to="`/tags/${tag.slug || tag.id}`"
          class="rounded-full border border-zinc-200/70 bg-white/70 px-2.5 py-1 text-xs text-zinc-700
                 transition hover:bg-white hover:border-zinc-300
                 dark:border-zinc-800/70 dark:bg-zinc-950/30 dark:text-zinc-200 dark:hover:bg-zinc-900/60"
        >
          # {{ tag.name }}
        </router-link>
      </div>
    </div>
  </article>
</template>

<script setup>
import { defineProps, ref, computed } from 'vue';

const props = defineProps({
  article: {
    type: Object,
    required: true,
    default: () => ({ tags: [] })
  }
});

const imageLoadError = ref(false);

const validImage = computed(() => {
  return props.article.coverImage &&
    props.article.coverImage.trim() !== '' &&
    !imageLoadError.value;
});

const handleImageError = () => {
  imageLoadError.value = true;
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const stripHtml = (html) => {
  if (!html) return '';
  const tmp = document.createElement('DIV');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};
</script>
