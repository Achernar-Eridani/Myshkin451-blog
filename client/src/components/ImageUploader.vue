<template>
  <div class="image-uploader">
    <!-- 预览 -->
    <div v-if="imageUrl" class="mb-3">
      <img
        :src="imageUrl"
        :alt="label"
        class="max-h-48 rounded-lg border shadow-sm object-cover"
      />
      <button
        @click="removeImage"
        class="mt-2 text-red-600 text-sm hover:text-red-800"
      >
        删除图片
      </button>
    </div>

    <!-- 上传 -->
    <div
      v-if="!imageUrl || allowReplace"
      class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors"
      :class="{ 'cursor-pointer': !uploading }"
      @click="!uploading && triggerFileInput()"
      @dragover.prevent="dragover = true"
      @dragleave.prevent="dragover = false"
      @drop.prevent="onDrop"
      :style="dropzoneStyle"
    >
      <input
        type="file"
        ref="fileInput"
        @change="onFileChange"
        class="hidden"
        accept="image/*"
      />

      <div v-if="uploading">
        <div
          class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto mb-2"
        ></div>
        <p class="text-gray-600">上传中...</p>
      </div>

      <div v-else>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-12 w-12 mx-auto text-gray-400 mb-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <p class="text-gray-600 mb-1">
          {{ label || "点击或拖放图片到此处上传" }}
        </p>
        <p class="text-gray-500 text-xs">支持 JPG、PNG、GIF，最大 5 MB</p>
      </div>
    </div>

    <!-- 错误 -->
    <div v-if="error" class="mt-2 text-red-600 text-sm">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import api from "../api";

const props = defineProps({
  value: String, // v-model 绑定到相对路径
  label: String,
  uploadType: {
    type: String,
    default: "post", // 'avatar' | 'post'
  },
  allowReplace: { type: Boolean, default: true },
  postId: { type: [Number, String], default: null },
});

const emit = defineEmits(["update:value", "upload-success", "upload-error"]);

// state
const imageUrl = ref("");              // 直接存绝对 URL，方便预览
const uploading = ref(false);
const error = ref("");
const fileInput = ref(null);
const dragover = ref(false);

// 初始值（父组件可能传入已保存的相对路径）
if (props.value) {
  const base = import.meta.env.VITE_API_URL || window.location.origin;
  imageUrl.value = props.value.startsWith("http")
    ? props.value
    : base + props.value;
}

// style
const dropzoneStyle = computed(() =>
  dragover.value
    ? "border-color:#3b82f6;background-color:rgba(59,130,246,.05)"
    : ""
);

// helpers
const triggerFileInput = () => fileInput.value.click();

const onFileChange = (e) => {
  const file = e.target.files[0];
  if (file) uploadImage(file);
  e.target.value = null; // 允许重复选同一文件
};

const onDrop = (e) => {
  dragover.value = false;
  const file = e.dataTransfer.files[0];
  if (!file || !file.type.startsWith("image/"))
    return (error.value = "请上传有效图片");
  uploadImage(file);
};

async function uploadImage(file) {
  // 校验
  if (file.size > 5 * 1024 * 1024) return (error.value = "图片最大 5 MB");
  error.value = "";
  uploading.value = true;

  try {
    const fd = new FormData();
    props.uploadType === "avatar"
      ? fd.append("avatar", file)
      : fd.append("image", file);

    let res;
    if (props.uploadType === "avatar") {
      res = await api.uploadAvatar(fd);
    } else if (props.postId) {
      res = await api.uploadPostCover(props.postId, fd);
    } else {
      res = await api.uploadPostImage(fd);
    }

    // 后端统一 {url, path}
    const { url, path } = res;

    imageUrl.value = url;      // 绝对 URL  → 预览
    emit("update:value", path); // 相对路径  → 存库
    emit("upload-success", url);
  } catch (err) {
    console.error(err);
    error.value = "上传失败，请重试";
    emit("upload-error", err);
  } finally {
    uploading.value = false;
  }
}

function removeImage() {
  imageUrl.value = "";
  emit("update:value", "");
}
</script>
