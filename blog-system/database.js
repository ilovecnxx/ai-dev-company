const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'blog.db');
let db;

function init() {
  db = new Database(dbPath);

  db.exec(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      excerpt TEXT,
      content TEXT NOT NULL,
      tags TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
    CREATE INDEX IF NOT EXISTS idx_posts_created ON posts(created_at);
  `);

  db.exec(`
    CREATE VIRTUAL TABLE IF NOT EXISTS posts_fts USING fts5(
    title, excerpt, content, tags,
    content='posts',
    content_rowid='id'
  );
  `);

  // Triggers for FTS sync
  db.exec(`
    CREATE TRIGGER IF NOT EXISTS posts_ai AFTER INSERT ON posts BEGIN
      INSERT INTO posts_fts(rowid, title, excerpt, content, tags)
      VALUES (new.id, new.title, new.excerpt, new.content, new.tags);
    END;

    CREATE TRIGGER IF NOT EXISTS posts_ad AFTER DELETE ON posts BEGIN
      INSERT INTO posts_fts(posts_fts, rowid, title, excerpt, content, tags)
      VALUES('delete', old.id, old.title, old.excerpt, old.content, old.tags);
    END;

    CREATE TRIGGER IF NOT EXISTS posts_au AFTER UPDATE ON posts BEGIN
      INSERT INTO posts_fts(posts_fts, rowid, title, excerpt, content, tags)
      VALUES('delete', old.id, old.title, old.excerpt, old.content, old.tags);
      INSERT INTO posts_fts(rowid, title, excerpt, content, tags)
      VALUES (new.id, new.title, new.excerpt, new.content, new.tags);
    END;
  `);
}

function getPosts({ tag, limit = 50 } = {}) {
  let sql = 'SELECT * FROM posts';
  const params = {};

  if (tag) {
    sql += ' WHERE tags LIKE @tag';
    params.tag = `%${tag}%`;
  }

  sql += ' ORDER BY created_at DESC LIMIT @limit';
  params.limit = limit;

  const stmt = db.prepare(sql);
  return stmt.all(params);
}

function getPostBySlug(slug) {
  const stmt = db.prepare('SELECT * FROM posts WHERE slug = ?');
  return stmt.get(slug);
}

function createPost({ title, slug, content, tags, excerpt }) {
  const stmt = db.prepare(`
    INSERT INTO posts (title, slug, content, tags, excerpt)
    VALUES (@title, @slug, @content, @tags, @excerpt)
  `);

  try {
    const result = stmt.run({ title, slug, content, tags, excerpt });
    return getPostBySlug(slug);
  } catch (err) {
    if (err.message.includes('UNIQUE constraint')) {
      throw new Error('Post with this title already exists');
    }
    throw err;
  }
}

function deletePost(slug) {
  const stmt = db.prepare('DELETE FROM posts WHERE slug = ?');
  const result = stmt.run(slug);
  return result.changes > 0;
}

function getAllTags() {
  const stmt = db.prepare('SELECT tags FROM posts WHERE tags IS NOT NULL AND tags != ""');
  const rows = stmt.all();

  const tagCount = {};
  rows.forEach(row => {
    const tags = row.tags.split(',').map(t => t.trim()).filter(t => t);
    tags.forEach(tag => {
      tagCount[tag] = (tagCount[tag] || 0) + 1;
    });
  });

  return Object.entries(tagCount)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

function searchPosts(query) {
  const stmt = db.prepare(`
    SELECT p.* FROM posts p
    JOIN posts_fts fts ON p.id = fts.rowid
    WHERE posts_fts MATCH ?
    ORDER BY rank
    LIMIT 20
  `);

  try {
    return stmt.all(query + '*');
  } catch {
    // Fallback to LIKE search if FTS fails
    const likeStmt = db.prepare(`
      SELECT * FROM posts
      WHERE title LIKE ? OR excerpt LIKE ? OR content LIKE ?
      ORDER BY created_at DESC
      LIMIT 20
    `);
    const pattern = `%${query}%`;
    return likeStmt.all(pattern, pattern, pattern);
  }
}

function seedDemoPosts() {
  const count = db.prepare('SELECT COUNT(*) as c FROM posts').get();
  if (count.c > 0) return;

  const demoPosts = [
    {
      title: '神经网络架构的演化史',
      slug: 'neural-network-evolution-' + Date.now().toString(36),
      excerpt: '从感知机到Transformer，深度学习架构如何塑造了现代AI的思维方式',
      content: `# 神经网络架构的演化史

从1958年Frank Rosenblatt提出感知机开始，神经网络走过了漫长的道路。每一个架构的出现，都是人类对"智能"本质理解的深化。

## 感知机时代

感知机是最简单的人工神经网络，只能处理线性可分问题。它的出现引发了第一次AI浪潮，却也因为Minsky的批评而跌入寒冬。

## 多层感知器

反向传播算法的提出让训练多层网络成为可能。1986年，Rumelhart和Hinton的工作让神经网络重新焕发生机。

## 卷积神经网络

LeCun的卷积神经网络在图像识别领域取得了突破性进展。局部感受野和权重共享的设计，完美契合了图像的空间结构。

## 循环神经网络

LSTM和GRU解决了长期依赖问题，让神经网络能够处理序列数据。NLP领域迎来了爆发式发展。

## Transformer革命

2017年，Attention is All You Need横空出世。自注意力机制让并行训练成为可能，也催生了GPT、BERT等大语言模型。

> "我们应该追求的是让机器像人类一样思考，还是让机器解决人类的问题？"——这个问题或许永远没有标准答案。`,
      tags: 'AI,深度学习,神经网络'
    },
    {
      title: '量子计算：下一个纪元',
      slug: 'quantum-computing-next-era-' + (Date.now() + 1).toString(36),
      excerpt: '当量子比特开始"纠缠"，经典计算的边界正在被重新定义',
      content: `# 量子计算：下一个纪元

量子计算不仅仅是一种更快的计算方式，它是计算范式的根本性革命。

## 量子比特 vs 经典比特

经典比特只能是0或1，而量子比特可以处于叠加态。这意味着n个量子比特可以同时表示2^n个状态。

## 量子纠缠

爱因斯坦称之为"鬼魅般的超距作用"。两个纠缠的量子比特，无论相隔多远，测量一个必然影响另一个。

## 量子门

单比特门如Hadamard门创造叠加态，CNOT门创造纠缠。组合这些门，我们可以构建任意量子算法。

## 实际应用

- **密码学**：Shor算法可在多项式时间内分解大数
- **药物研发**：模拟分子相互作用
- **优化问题**：量子退火寻找全局最优解

量子计算的未来，不是取代经典计算机，而是在特定领域发挥其独特优势。`,
      tags: '量子计算,物理,未来'
    },
    {
      title: '元宇宙的底层基础设施',
      slug: 'metaverse-infrastructure-' + (Date.now() + 2).toString(36),
      excerpt: '去中心化身份、实时渲染、数字孪生——构建沉浸式数字世界的技术基石',
      content: `# 元宇宙的底层基础设施

元宇宙不是一夜之间出现的，它是多项技术成熟后的必然产物。

## 去中心化身份 (DID)

用户的数字身份应该属于自己的。区块链技术让这成为可能，ENS域名、WebAuthn认证都在向这个方向努力。

## 实时渲染引擎

Unreal Engine 5的Nanite和Lumen技术让实时全局光照成为现实。虚拟世界与现实世界的视觉边界正在模糊。

## 数字孪生

现实世界的每一个物体都可以有对应的数字副本。工业元宇宙已经在大规模应用。

## 空间计算

Apple Vision Pro展示了空间计算的无限可能。未来的界面不再是屏幕，而是整个空间。

元宇宙的终极形态，或许是让数字世界和物理世界完全融合。`,
      tags: '元宇宙,Web3,AR/VR'
    },
    {
      title: '生命科学的数字化转型',
      slug: 'life-science-digitalization-' + (Date.now() + 3).toString(36),
      excerpt: '当基因编辑遇见人工智能，精准医疗的时代正在加速到来',
      content: `# 生命科学的数字化转型

生物学正在从实验科学转变为数据科学。

## 基因组测序

2003年完成人类基因组计划耗资30亿美元，如今只需要几百美元。这种指数级的成本下降正在革命化医疗诊断。

## CRISPR基因编辑

基因编辑不再是科幻。CRISPR-Cas9技术让定向修改DNA成为可能，遗传疾病的治疗看到了曙光。

## AI驱动的药物研发

AlphaFold预测了几乎所有已知蛋白质的结构。AI正在大幅缩短新药研发的周期。

## 数字孪生人体

从细胞到器官，数字孪生技术让医生可以在虚拟人体上测试治疗方案。

生命科学的突破正在加速，而数字化是这一切的催化剂。`,
      tags: '生物科技,AI,医疗'
    },
    {
      title: '太空经济的黎明',
      slug: 'space-economy-dawn-' + (Date.now() + 4).toString(36),
      excerpt: '从星链到月球采矿，人类正在成为真正的多行星物种',
      content: `# 太空经济的黎明

SpaceX的可回收火箭改变了整个航天工业的经济模型。

## 卫星互联网

星链计划发射数万颗低轨卫星，为全球提供高速互联网服务。这是人类历史上最大的卫星星座。

## 商业航天

蓝色起源、维珍银河让太空旅游成为现实。更重要的是，它们降低了进入太空的成本门槛。

## 资源开采

月球上的氦-3可能是未来核聚变的燃料。小行星采矿听起来像科幻，但已经开始商业化探索。

## 深空探测

火星殖民不再只是梦想。SpaceX的星际飞船计划在2030年前实现载人火星任务。

太空不再是少数国家的领地，它是人类共同的未来。`,
      tags: '太空,商业航天,未来'
    }
  ];

  const stmt = db.prepare(`
    INSERT INTO posts (title, slug, excerpt, content, tags)
    VALUES (@title, @slug, @excerpt, @content, @tags)
  `);

  const insertMany = db.transaction((posts) => {
    for (const post of posts) {
      stmt.run(post);
    }
  });

  insertMany(demoPosts);
  console.log('[CYBERBLOG] Demo posts seeded successfully');
}

module.exports = { init, getPosts, getPostBySlug, createPost, deletePost, getAllTags, searchPosts, seedDemoPosts };
