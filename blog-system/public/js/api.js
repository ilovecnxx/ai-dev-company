// CYBERBLOG API Client
// ========================================

const API = {
  baseUrl: '/api',

  async getPosts(tag = null) {
    const url = tag ? `${this.baseUrl}/posts?tag=${encodeURIComponent(tag)}` : `${this.baseUrl}/posts`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch posts');
    return res.json();
  },

  async getPost(slug) {
    const res = await fetch(`${this.baseUrl}/posts/${slug}`);
    if (!res.ok) throw new Error('Post not found');
    return res.json();
  },

  async createPost(data) {
    const res = await fetch(`${this.baseUrl}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create post');
    }
    return res.json();
  },

  async getTags() {
    const res = await fetch(`${this.baseUrl}/tags`);
    if (!res.ok) throw new Error('Failed to fetch tags');
    return res.json();
  },

  async search(query) {
    if (!query.trim()) return [];
    const res = await fetch(`${this.baseUrl}/search?q=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error('Search failed');
    return res.json();
  },

  async deletePost(slug) {
    const res = await fetch(`${this.baseUrl}/posts/${slug}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete post');
    return res.json();
  }
};
