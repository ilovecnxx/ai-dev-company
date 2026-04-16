const express = require('express');
const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const app = express();
const PORT = 80;
const DATA_DIR = './data';
const POSTS_FILE = path.join(DATA_DIR, 'posts.json');

// 确保数据目录存在
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// 初始化 posts 文件
if (!fs.existsSync(POSTS_FILE)) {
  fs.writeFileSync(POSTS_FILE, JSON.stringify([], null, 2));
}

// 中间件
app.use(express.json());
app.use(express.static('public'));

// 辅助函数
function readPosts() {
  return JSON.parse(fs.readFileSync(POSTS_FILE, 'utf8'));
}

function writePosts(posts) {
  fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2));
}

// 路由: 获取所有文章
app.get('/api/posts', (req, res) => {
  const posts = readPosts();
  res.json(posts.map(p => ({
    id: p.id,
    title: p.title,
    excerpt: p.content.substring(0, 100) + '...',
    date: p.date
  })));
});

// 路由: 获取单篇文章
app.get('/api/posts/:id', (req, res) => {
  const posts = readPosts();
  const post = posts.find(p => p.id === parseInt(req.params.id));
  if (!post) return res.status(404).json({ error: 'Post not found' });
  res.json(post);
});

// 路由: 创建文章
app.post('/api/posts', (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content required' });
  }

  const posts = readPosts();
  const newPost = {
    id: Date.now(),
    title,
    content,
    date: new Date().toISOString()
  };
  posts.unshift(newPost);
  writePosts(posts);

  res.json(newPost);
});

// 路由: 删除文章
app.delete('/api/posts/:id', (req, res) => {
  const posts = readPosts();
  const index = posts.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Post not found' });

  posts.splice(index, 1);
  writePosts(posts);
  res.json({ success: true });
});

// 主页
app.get('/', (req, res) => {
  const posts = readPosts();
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI DEV COMPANY Blog</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; color: #333; }
    .container { max-width: 800px; margin: 0 auto; padding: 20px; }
    header { background: #2c3e50; color: white; padding: 20px 0; margin-bottom: 30px; }
    header h1 { text-align: center; font-size: 2em; }
    .post-card { background: white; padding: 20px; margin-bottom: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .post-card h2 { color: #2c3e50; margin-bottom: 10px; }
    .post-card .date { color: #888; font-size: 0.9em; margin-bottom: 10px; }
    .post-card .excerpt { color: #555; line-height: 1.6; }
    .post-content { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); line-height: 1.8; }
    .post-content h1 { margin-bottom: 20px; }
    .post-content p { margin-bottom: 15px; }
    .post-content pre { background: #f8f8f8; padding: 15px; border-radius: 4px; overflow-x: auto; }
    .btn { display: inline-block; padding: 10px 20px; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer; text-decoration: none; }
    .btn:hover { background: #2980b9; }
    .form-group { margin-bottom: 15px; }
    .form-group label { display: block; margin-bottom: 5px; font-weight: 600; }
    .form-group input, .form-group textarea { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; }
    .form-group textarea { min-height: 200px; }
    .nav { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .editor { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
  </style>
</head>
<body>
  <header><h1>AI DEV COMPANY Blog</h1></header>
  <div class="container" id="app">
    <div class="nav">
      <a href="/" class="btn">← 返回列表</a>
      <button class="btn" onclick="showEditor()">写文章</button>
    </div>
    <div id="content"></div>
  </div>
  <script>
    const app = document.getElementById('content');

    function loadPosts() {
      fetch('/api/posts')
        .then(r => r.json())
        .then(posts => {
          app.innerHTML = posts.map(p => \`
            <div class="post-card">
              <h2>\${p.title}</h2>
              <div class="date">\${new Date(p.date).toLocaleString()}</div>
              <div class="excerpt">\${p.excerpt}</div>
              <br>
              <a href="/?post=\${p.id}" class="btn">阅读更多</a>
            </div>
          \`).join('');
        });
    }

    function loadPost(id) {
      fetch('/api/posts/' + id)
        .then(r => r.json())
        .then(post => {
          document.title = post.title + ' - Blog';
          app.innerHTML = \`
            <div class="post-content">
              <h1>\${post.title}</h1>
              <div class="date">\${new Date(post.date).toLocaleString()}</div>
              <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
              <div>\${marked.parse(post.content)}</div>
            </div>
          \`;
        });
    }

    function showEditor() {
      app.innerHTML = \`
        <div class="editor">
          <h2>写文章</h2>
          <div class="form-group">
            <label>标题</label>
            <input type="text" id="title" placeholder="文章标题">
          </div>
          <div class="form-group">
            <label>内容 (Markdown)</label>
            <textarea id="content" placeholder="支持 Markdown 语法"></textarea>
          </div>
          <button class="btn" onclick="submitPost()">发布</button>
          <button class="btn" style="background:#999" onclick="loadPosts()">取消</button>
        </div>
      \`;
    }

    function submitPost() {
      const title = document.getElementById('title').value;
      const content = document.getElementById('content').value;
      if (!title || !content) return alert('请填写标题和内容');

      fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content })
      }).then(() => loadPosts());
    }

    // 路由处理
    const params = new URLSearchParams(window.location.search);
    const postId = params.get('post');
    if (postId) loadPost(postId);
    else loadPosts();
  </script>
</body>
</html>
  `;
  res.send(html);
});

app.listen(PORT, () => {
  console.log('Blog running on http://localhost:' + PORT);
});