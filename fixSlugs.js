// fixSlugs.js
const { sequelize, Tag, Category } = require('./models');
const slugify = require('slugify');

async function generateProperSlug(name) {
  // 复制相同的逻辑以确保一致性
  let tempSlug = slugify(name, {
    lower: true,      // 转为小写
    strict: true,     // 移除特殊字符
    locale: 'zh'      // 中文支持
  });
  
  // 如果生成的 slug 为空（可能只有中文字符时）
  if (!tempSlug || tempSlug.length === 0) {
    tempSlug = 'item-' + Date.now().toString(36);
  }
  
  // 如果 slug 只包含数字，添加前缀
  if (/^\d+$/.test(tempSlug)) {
    tempSlug = 'item-' + tempSlug;
  }
  
  // 确保唯一性
  return tempSlug + '-' + Math.floor(Math.random() * 1000).toString();
}

async function fixCategorySlugs() {
  const categories = await Category.findAll();
  console.log(`找到 ${categories.length} 个分类`);
  
  for (const category of categories) {
    const oldSlug = category.slug;
    
    // 检查是否需要修复
    if (!oldSlug || oldSlug.trim() === '' || /^\d+$/.test(oldSlug)) {
      const newSlug = await generateProperSlug(category.name);
      category.slug = newSlug;
      await category.save();
      console.log(`已修复分类: "${category.name}" 的slug: ${oldSlug || '空'} -> ${newSlug}`);
    } else {
      console.log(`分类 "${category.name}" 的slug无需修复: ${oldSlug}`);
    }
  }
}

async function fixTagSlugs() {
  const tags = await Tag.findAll();
  console.log(`找到 ${tags.length} 个标签`);
  
  for (const tag of tags) {
    const oldSlug = tag.slug;
    
    // 检查是否需要修复
    if (!oldSlug || oldSlug.trim() === '' || /^\d+$/.test(oldSlug)) {
      const newSlug = await generateProperSlug(tag.name);
      tag.slug = newSlug;
      await tag.save();
      console.log(`已修复标签: "${tag.name}" 的slug: ${oldSlug || '空'} -> ${newSlug}`);
    } else {
      console.log(`标签 "${tag.name}" 的slug无需修复: ${oldSlug}`);
    }
  }
}

async function main() {
  try {
    console.log('开始修复分类slug...');
    await fixCategorySlugs();
    
    console.log('\n开始修复标签slug...');
    await fixTagSlugs();
    
    console.log('\n所有slug修复完成!');
  } catch (error) {
    console.error('修复过程中出错:', error);
  } finally {
    await sequelize.close();
  }
}

main();