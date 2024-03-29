import React from 'react';

const NotFound = () => {
  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  };

  const contentStyle = {
    textAlign: 'center',
  };

  const headingStyle = {
    fontSize: '3rem',
    marginBottom: '20px',
  };

  const paragraphStyle = {
    fontSize: '1.5rem',
  };

  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        <h2 style={headingStyle}>404 - Page Not Found</h2>
        <p style={paragraphStyle}>The page you are looking for does not exist.</p>
      </div>
    </div>
  );
};

export default NotFound;
