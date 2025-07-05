import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useArticles } from '../context/ArticleContext';

const Reader = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { articles, deleteArticle, updateArticle } = useArticles();

  const article = articles.find(a => a.id === id);

  if (!article) {
    return (
      <div style={{ padding: 40 }}>
        <h1>Article not found</h1>
        <button onClick={() => navigate('/library')}>Back to Library</button>
      </div>
    );
  }

  const handleDelete = () => {
    deleteArticle(article.id);
    navigate('/library');
  };

  const handleArchive = () => {
    updateArticle(article.id, { archived: true });
    navigate('/library');
  };

  return (
    <div style={{ padding: 40, maxWidth: 800, margin: '0 auto' }}>
      <button onClick={() => navigate('/library')} style={{ marginBottom: 20 }}>
        Back to Library
      </button>
      <h1 style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 10 }}>{article.title}</h1>
      <div style={{ color: '#666', marginBottom: 10 }}>
        {article.author} • {article.domain} • {article.readTime} min read
      </div>
      <div style={{ marginBottom: 30 }}>{article.content}</div>
      <button onClick={handleDelete} style={{ marginRight: 10, background: '#ef4444', color: 'white', padding: '8px 16px', border: 'none', borderRadius: 4 }}>
        Delete Article
      </button>
      <button onClick={handleArchive} style={{ background: '#f59e0b', color: 'white', padding: '8px 16px', border: 'none', borderRadius: 4 }}>
        Archive Article
      </button>
    </div>
  );
};

export default Reader;