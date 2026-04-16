const express = require('express');
const path = require('path');
const database = require('./database');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize database
database.init();

// API Routes
app.get('/api/posts', (req, res) => {
  const { tag, limit = 50 } = req.query;
  const posts = database.getPosts({ tag, limit });
  res.json(posts);
});

app.get('/api/posts/:slug', (req, res) => {
  const post = database.getPostBySlug(req.params.slug);
  if (!post) {
    return res.status(404).json({ error: 'Signal lost... Post not found' });
  }
  res.json(post);
});

app.post('/api/posts', (req, res) => {
  const { title, content, tags, excerpt } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content required' });
  }
  const slug = generateSlug(title);
  const post = database.createPost({ title, slug, content, tags, excerpt });
  res.status(201).json(post);
});

app.get('/api/tags', (req, res) => {
  const tags = database.getAllTags();
  res.json(tags);
});

app.get('/api/search', (req, res) => {
  const { q } = req.query;
  if (!q) return res.json([]);
  const results = database.searchPosts(q);
  res.json(results);
});

app.delete('/api/posts/:slug', (req, res) => {
  const deleted = database.deletePost(req.params.slug);
  if (!deleted) {
    return res.status(404).json({ error: 'Post not found' });
  }
  res.json({ success: true });
});

// Serve editor page
app.get('/editor', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'editor.html'));
});

// Serve post page
app.get('/post/:slug', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'post.html'));
});

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-|-$/g, '')
    + '-' + Date.now().toString(36);
}

// Seed some demo posts if empty
database.seedDemoPosts();

app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════════╗
║  ███╗   ██╗███████╗ ██████╗ ██████╗  █████╗ ████████╗   ║
║  ████╗  ██║██╔════╝██╔═══██╗██╔══██╗██╔══██╗╚══██╔══╝   ║
║  ██╔██╗ ██║█████╗  ██║   ██║██████╔╝███████║   ██║      ║
║  ██║╚██╗██║██╔══╝  ██║   ██║██╔══██╗██╔══██║   ██║      ║
║  ██║ ╚████║███████╗╚██████╔╝██║  ██║██║  ██║   ██║      ║
║  ╚═╝  ╚═══╝╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝      ║
║                                                          ║
║  CYBERBLOG v1.0 // NEURAL INTERFACE ACTIVE              ║
║  Server running at http://localhost:${PORT}               ║
╚══════════════════════════════════════════════════════════╝
  `);
});
