import React from 'react'
import { AiOutlineSearch } from "react-icons/ai";
import { CgMoreAlt } from "react-icons/cg";
import styles from './Menu.module.css'

const Menu = () => {
  return (
    <div className='homepage-menu'>
        <nav className={styles.search}>
          <ul>
            <li><span><AiOutlineSearch /></span>Search</li>
          </ul>
        </nav>
        <div className={styles.subscribe}>
          <nav>
            <ul>
              <li>Subscribe to Premium</li>
              <li>Subscribe to unclock new features and if eligible, receive a share of ads revenue.</li>
              <li>Subscribe</li>
            </ul>
          </nav>
        </div>
        <div className={styles.trends}>
          <div>Trends for you</div>
          <nav>
            <ul>
              <li>Trending in Vietnam<CgMoreAlt /></li>
              <li>Thơm</li>
              <li>6,540 posts</li>
            </ul>
          </nav>
          
          <nav>
            <ul>
              <li>Trending in Vietnam<CgMoreAlt /></li>
              <li>Thơm</li>
              <li>6,540 posts</li>
            </ul>
          </nav>
          
          <nav>
            <ul>
              <li>Trending in Vietnam<CgMoreAlt /></li>
              <li>Thơm</li>
              <li>6,540 posts</li>
            </ul>
          </nav>
          
          <nav>
            <ul>
              <li>Trending in Vietnam<CgMoreAlt /></li>
              <li>Thơm</li>
              <li>6,540 posts</li>
            </ul>
          </nav>
          <nav>
            <ul>
              <li>Trending in Vietnam<CgMoreAlt /></li>
              <li>Thơm</li>
              <li>6,540 posts</li>
            </ul>
          </nav>
          
          <nav>
            <ul>
              <li>Trending in Vietnam<CgMoreAlt /></li>
              <li>Thơm</li>
              <li>6,540 posts</li>
            </ul>
          </nav>
          
          <nav>
            <ul>
              <li>Trending in Vietnam<CgMoreAlt /></li>
              <li>Thơm</li>
              <li>6,540 posts</li>
            </ul>
          </nav>
        </div>
        
    </div>
  )
}

export default Menu