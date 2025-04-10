import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// 创建axios实例
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器添加token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    console.error('请求错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    console.error('响应错误:', error.response?.status, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API服务对象
const apiService = {
  // 获取文章列表
  async getPosts(params = {}) {
    try {
      console.log('Sending request to posts API with params:', params);
      const response = await api.get('/posts', { params });
      console.log('Posts API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('获取文章失败:', error);
      return []; // 返回空数组以避免UI错误
    }
  },
  
  // 获取分类列表
  async getCategories() {
    try {
      console.log('Fetching categories...');
      const response = await api.get('/categories');
      console.log('Categories API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('获取分类失败:', error);
      return [];
    }
  },
  
  // 获取标签列表
  async getTags() {
    try {
      console.log('Fetching tags...');
      const response = await api.get('/tags');
      console.log('Tags API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('获取标签失败:', error);
      return [];
    }
  },


  // 获取单篇文章详情
  async getPostById(id) {
    try {
      console.log(`Fetching post with id: ${id}`);
      const response = await api.get(`/posts/${id}`);
      console.log('Post detail API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('获取文章详情失败:', error);
      throw error; // 在文章详情页面，我们需要处理这个错误
    }
  },

  // 获取文章评论
  async getPostComments(postId) {
    try {
      console.log(`Fetching comments for post: ${postId}`);
      const response = await api.get(`/posts/${postId}/comments`);
      console.log('Comments API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('获取评论失败:', error);
      return [];
    }
  },

  // 添加评论
  async createComment(postId, commentData) {
    try {
      console.log(`Adding comment to post: ${postId}`, commentData);
      const response = await api.post(`/posts/${postId}/comments`, commentData);
      console.log('Add comment API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('添加评论失败:', error);
      throw error;
    }
  },

  // 更新评论
  async updateComment(commentId, content) {
    try {
      console.log(`Updating comment: ${commentId}`);
      const response = await api.put(`/comments/${commentId}`, { content });
      console.log('Update comment API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('更新评论失败:', error);
      throw error;
    }
  },

  // 删除评论
  async deleteComment(commentId) {
    try {
      console.log(`Deleting comment: ${commentId}`);
      const response = await api.delete(`/comments/${commentId}`);
      console.log('Delete comment API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('删除评论失败:', error);
      throw error;
    }
  }

};

export default apiService;