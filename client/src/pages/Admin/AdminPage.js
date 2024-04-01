// AdminPage.js
import React from 'react';
import Navbar from '../../component/Navbar/Navbar.js';
import Menu from '../../component/Menu/Menu.js';
import Post from '../../component/post/post.js';

const HomePage = () => {
  return (
    <div className='container'>
      <div style={{display: 'flex'}}>
        <Navbar />
        <Post />
        <Menu />
      </div>
    </div>
  );
};

export default HomePage;
