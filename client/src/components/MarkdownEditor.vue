<template>
  <div class="markdown-editor">
    <label
      v-if="label"
      class="block text-gray-700 text-sm font-bold mb-2"
      >{{ label }}</label
    >
    <Editor
      :value="modelValue"
      @change="$emit('update:modelValue', $event)"
      :plugins="plugins"
      :locale="locale"
      :uploadImages="handleUpload"
    />
  </div>
</template>

<script setup>
import { Editor } from "@bytemd/vue-next";
import gfm from "@bytemd/plugin-gfm";
import highlight from "@bytemd/plugin-highlight";
import "bytemd/dist/index.css";
import api from "../api";

const props = defineProps({ modelValue: String, label: String });
const emit = defineEmits(["update:modelValue"]);

const plugins = [gfm(), highlight()];
const locale = { write: "编辑", preview: "预览", uploadImage: "上传图片" };

async function handleUpload(files) {
  const result = [];
  for (const file of files) {
    try {
      const fd = new FormData();
      fd.append("image", file);

      // { url, path }
      const { url, path } = await api.uploadPostImage(fd);

      result.push({ url, alt: file.name });
    } catch (err) {
      console.error("图片上传失败", err);
    }
  }
  return result;
}
</script>

<style scoped>
.markdown-editor :deep(.bytemd) {
  height: 500px;
}
</style>
