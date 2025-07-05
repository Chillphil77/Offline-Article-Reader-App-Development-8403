import React from 'react';
import { useNavigate } from 'react-router-dom';

const Reader = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 40 }}>
      <h1>Reading (Minimal Test)</h1>
      <button
        style={{ fontSize: 20, padding: '10px 20px', marginTop: 20 }}
        onClick={() => navigate('/library')}
      >
        Back to Library
      </button>
    </div>
  );
};

export default Reader;