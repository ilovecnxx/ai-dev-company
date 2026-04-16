// CYBERBLOG Main Application
// ========================================

(function() {
  'use strict';

  // DOM Elements
  const header = document.getElementById('header');
  const postsGrid = document.getElementById('postsGrid');
  const emptyState = document.getElementById('emptyState');
  const tagCloud = document.getElementById('tagCloud');
  const recentPosts = document.getElementById('recentPosts');
  const searchBtn = document.getElementById('searchBtn');
  const searchModal = document.getElementById('searchModal');
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');
  const footerText = document.getElementById('footerText');

  // State
  let currentTag = null;
  let allPosts = [];

  // Initialize
  async function init() {
    // Start effects
    Effects.initParticles();

    // Header scroll effect
    window.addEventListener('scroll', handleScroll);

    // Load initial data
    await Promise.all([loadPosts(), loadTags()]);

    // Setup event listeners
    setupSearchModal();
    setupFooter();

    // Animate posts entrance
    animatePostCards();
  }

  // Scroll handler for header
  function handleScroll() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  // Load posts
  async function loadPosts(tag = null) {
    try {
      const posts = await API.getPosts(tag);
      allPosts = posts;
      renderPosts(posts);
      renderRecentPosts(posts.slice(0, 5));
    } catch (err) {
      console.error('Failed to load posts:', err);
      showEmptyState();
    }
  }

  // Load tags
  async function loadTags() {
    try {
      const tags = await API.getTags();
      renderTagCloud(tags);
    } catch (err) {
      console.error('Failed to load tags:', err);
    }
  }

  // Render posts
  function renderPosts(posts) {
    if (!posts.length) {
      showEmptyState();
      return;
    }

    hideEmptyState();
    postsGrid.innerHTML = posts.map((post, idx) => `
      <article class="post-card" data-slug="${post.slug}" style="animation-delay: ${idx * 0.1}s">
        <div class="post-card-header">
          <span class="post-date">${formatDate(post.created_at)}</span>
          <div class="post-tags">
            ${(post.tags || '').split(',').filter(t => t.trim()).slice(0, 2).map(t => `
              <span class="post-mini-tag">${t.trim()}</span>
            `).join('')}
          </div>
        </div>
        <h2 class="post-title">${escapeHtml(post.title)}</h2>
        <p class="post-excerpt">${escapeHtml(post.excerpt || '')}</p>
        <div class="post-footer">
          <span class="post-readmore">
            READ MORE
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </span>
        </div>
      </article>
    `).join('');

    // Add click handlers
    postsGrid.querySelectorAll('.post-card').forEach(card => {
      card.addEventListener('click', () => {
        const slug = card.dataset.slug;
        window.location.href = `/post/${slug}`;
      });
    });
  }

  // Render tag cloud
  function renderTagCloud(tags) {
    if (!tags.length) {
      tagCloud.innerHTML = '<span class="loading-text">No signals detected</span>';
      return;
    }

    tagCloud.innerHTML = tags.map(tag => `
      <button class="tag ${currentTag === tag.name ? 'active' : ''}" data-tag="${escapeHtml(tag.name)}">
        ${escapeHtml(tag.name)}
        <span class="tag-count">[${tag.count}]</span>
      </button>
    `).join('');

    // Add click handlers
    tagCloud.querySelectorAll('.tag').forEach(tagEl => {
      tagEl.addEventListener('click', async (e) => {
        Effects.createRipple(e, tagEl);
        const tag = tagEl.dataset.tag;

        if (currentTag === tag) {
          currentTag = null;
          tagCloud.querySelectorAll('.tag').forEach(t => t.classList.remove('active'));
          await loadPosts();
        } else {
          currentTag = tag;
          tagCloud.querySelectorAll('.tag').forEach(t => t.classList.remove('active'));
          tagEl.classList.add('active');
          await loadPosts(tag);
        }
      });
    });
  }

  // Render recent posts
  function renderRecentPosts(posts) {
    if (!posts.length) {
      recentPosts.innerHTML = '<span class="loading-text">Awaiting transmission</span>';
      return;
    }

    recentPosts.innerHTML = posts.map(post => `
      <a href="/post/${post.slug}" class="recent-post-item">
        <div class="recent-post-title">${escapeHtml(post.title)}</div>
        <div class="recent-post-date">${formatDate(post.created_at)}</div>
      </a>
    `).join('');
  }

  // Empty state
  function showEmptyState() {
    postsGrid.style.display = 'none';
    emptyState.style.display = 'block';
  }

  function hideEmptyState() {
    postsGrid.style.display = 'grid';
    emptyState.style.display = 'none';
  }

  // Search modal
  function setupSearchModal() {
    if (!searchBtn || !searchModal) return;

    searchBtn.addEventListener('click', openSearch);
    searchModal.addEventListener('click', (e) => {
      if (e.target === searchModal) closeSearch();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeSearch();
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        openSearch();
      }
    });

    let searchTimeout;
    searchInput.addEventListener('input', () => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(handleSearch, 300);
    });
  }

  function openSearch() {
    searchModal.classList.add('active');
    searchInput.focus();
    document.body.style.overflow = 'hidden';
  }

  function closeSearch() {
    searchModal.classList.remove('active');
    searchInput.value = '';
    searchResults.innerHTML = `
      <div class="search-hint">
        <span class="search-hint-text">Type to search across all posts</span>
      </div>
    `;
    document.body.style.overflow = '';
  }

  async function handleSearch() {
    const query = searchInput.value.trim();

    if (!query) {
      searchResults.innerHTML = `
        <div class="search-hint">
          <span class="search-hint-text">Type to search across all posts</span>
        </div>
      `;
      return;
    }

    try {
      const results = await API.search(query);

      if (!results.length) {
        searchResults.innerHTML = `
          <div class="search-hint">
            <span class="search-hint-text">No signals found for "${escapeHtml(query)}"</span>
          </div>
        `;
        return;
      }

      searchResults.innerHTML = results.map(post => `
        <div class="search-result-item" data-slug="${post.slug}">
          <div class="search-result-title">${escapeHtml(post.title)}</div>
          <div class="search-result-excerpt">${escapeHtml(post.excerpt || '')}</div>
        </div>
      `).join('');

      searchResults.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', () => {
          window.location.href = `/post/${item.dataset.slug}`;
          closeSearch();
        });
      });
    } catch (err) {
      console.error('Search failed:', err);
    }
  }

  // Footer terminal effect
  function setupFooter() {
    if (!footerText) return;

    const messages = [
      'Initializing neural link...',
      'Scanning quantum frequencies...',
      'Loading synaptic pathways...',
      'Connection established.',
      'Welcome to the future.'
    ];

    const msg = messages[Math.floor(Math.random() * messages.length)];
    Effects.typeText(footerText, msg, 40);
  }

  // Animate post cards
  function animatePostCards() {
    const cards = document.querySelectorAll('.post-card');
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }
        });
      },
      { threshold: 0.1 }
    );

    cards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(card);
    });
  }

  // Utilities
  function formatDate(dateStr) {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Start app
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
