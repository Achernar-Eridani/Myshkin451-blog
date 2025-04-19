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
  },

  // 用户登录
  async login(credentials) {
    try {
      console.log('User login attempt:', credentials.email);
      const response = await api.post('/users/login', credentials);
      console.log('Login API response:', response.data);
      
      // 存储用户数据和token
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      console.error('登录失败:', error);
      throw error;
    }
  },

  // 用户注册
  async register(userData) {
    try {
      console.log('User registration attempt:', userData.email);
      const response = await api.post('/users/register', userData);
      console.log('Register API response:', response.data);
      
      // 如果注册成功并返回token，自动登录
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      console.error('注册失败:', error);
      throw error;
    }
  },

    // 创建文章
  async createPost(postData) {
    try {
      console.log('Creating post:', postData);
      const response = await api.post('/posts', postData);
      console.log('Create post response:', response.data);
      return response.data;
    } catch (error) {
      console.error('创建文章失败:', error);
      throw error;
    }
  },

  // 更新文章
  async updatePost(id, postData) {
    try {
      console.log(`Updating post ${id}:`, postData);
      const response = await api.put(`/posts/${id}`, postData);
      console.log('Update post response:', response.data);
      return response.data;
    } catch (error) {
      console.error('更新文章失败:', error);
      throw error;
    }
  },

// 上传文章图片
async uploadPostImage(formData) {
  try {
    console.log('上传图片...');
    // 使用正确的路径
    const response = await api.post('/uploads/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    console.log('上传成功:', response.data);
    
    // 根据后端uploadController.js的返回结构
    return {
      url: response.data.imagePath, // 使用后端返回的图片路径
      title: ''
    };
  } catch (error) {
    console.error('上传图片失败:', error);
    throw error;
  }
},

  // 上传文章封面
  async uploadPostCover(postId, formData) {
    try {
      const response = await api.post(`/posts/${postId}/cover`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Upload cover response:', response.data);
      return response.data;
    } catch (error) {
      console.error('上传封面失败:', error);
      throw error;
    }
  },

  // 上传用户头像
  async uploadAvatar(formData) {
    try {
      const response = await api.post('/upload/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Upload avatar response:', response.data);
      return response.data;
    } catch (error) {
      console.error('上传头像失败:', error);
      throw error;
    }
  },

  // 搜索文章
  async searchPosts(params = {}) {
    try {
      console.log('Searching posts with params:', params);
      const response = await api.get('/posts/search', { params });
      console.log('Search results:', response.data);
      return response.data;
    } catch (error) {
      console.error('搜索文章失败:', error);
      // 返回空结果而不是抛出错误，以便前端可以处理
      return { 
        posts: [], 
        pagination: { 
          total: 0, 
          totalPages: 0, 
          currentPage: 1, 
          hasMore: false 
        } 
      };
    }
  },

    // 用户个人中心相关API
  async getUserProfile() {
    try {
      const response = await api.get('/users/profile');
      return response.data;
    } catch (error) {
      console.error('获取用户资料失败:', error);
      throw error;
    }
  },

  async updateUserProfile(profileData) {
    try {
      const response = await api.put('/users/profile', profileData);
      return response.data;
    } catch (error) {
      console.error('更新用户资料失败:', error);
      throw error;
    }
  },

  async updatePassword(passwordData) {
    try {
      const response = await api.put('/users/password', passwordData);
      return response.data;
    } catch (error) {
      console.error('更新密码失败:', error);
      throw error;
    }
  },

  async getUserPosts() {
    try {
      console.log('API调用: 获取用户文章');
      const response = await api.get('/users/posts');
      console.log('API响应: 用户文章', response.data);
      return response.data;
    } catch (error) {
      console.error('获取用户文章失败:', error);
      return { posts: [] }; // 返回空数组而不是抛出错误
    }
  },

  async getUserComments() {
    try {
      console.log('API调用: 获取用户评论');
      const response = await api.get('/users/comments');
      console.log('API响应: 用户评论', response.data);
      return response.data;
    } catch (error) {
      console.error('获取用户评论失败:', error);
      return { comments: [] }; // 返回空数组而不是抛出错误
    }
  },

  // 用户登出
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log('User logged out');
  }

  

};

export default apiService;