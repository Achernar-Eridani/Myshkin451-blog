// const { sequelize, User, Post, syncDatabase } = require('./models');

// async function testDatabase() {
// try {
//     await syncDatabase();
    
//     const testUser = await User.create({
//     username: 'testuser',
//     email: 'test@example.com',
//     password: 'password123',
//     isAdmin: true
//     });
    
//     console.log('测试用户创建成功:', testUser.username);
    
//     const testPost = await Post.create({
//     title: '测试文章',
//     content: '这是一篇测试文章的内容。',
//     userId: testUser.id
//     });
    
//     console.log('测试文章创建成功:', testPost.title);
//     console.log('文章slug自动生成为:', testPost.slug);
    
//     const userWithPosts = await User.findOne({
//     where: { id: testUser.id },
//     include: 'posts'
//     });
    
//     console.log(`用户 ${userWithPosts.username} 拥有 ${userWithPosts.posts.length} 篇文章`);
    
//     //await testPost.destroy();
//     //await testUser.destroy();
    
//     console.log('数据库测试完成！');
// } catch (error) {
//     console.error('测试失败:', error);
// } finally {
//     await sequelize.close();
// }
// }

// testDatabase();