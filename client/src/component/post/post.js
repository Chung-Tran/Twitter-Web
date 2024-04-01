// Menu.js
import React from 'react';
import { AiOutlineSetting } from "react-icons/ai";
import { CiImageOn } from "react-icons/ci";
import { AiOutlineFileGif } from "react-icons/ai";
import { AiOutlineUnorderedList } from "react-icons/ai";
import { BsEmojiSmile } from "react-icons/bs";
import { SlCalender } from "react-icons/sl";
import { CiLocationOn } from "react-icons/ci";
import { BsTwitterX } from 'react-icons/bs';
import { TiTick } from "react-icons/ti";
import { CgMoreAlt } from "react-icons/cg";
import { FaRegComment } from "react-icons/fa";
import { GiRapidshareArrow } from "react-icons/gi";
import { AiOutlineHeart } from "react-icons/ai";
import { BsReverseListColumnsReverse } from "react-icons/bs";
import { PiBookmarkSimple } from "react-icons/pi";
import styles from './post.module.css'
import { AiOutlineUpload } from "react-icons/ai";

const post = () => {
  return (
    <div className={styles.container}>
      <div className={styles.icon2}>
        <div>For you</div>
        <div>Following</div>
        <div>
          <AiOutlineSetting />
        </div>
      </div>
      <div className={styles.post}>
          <div>T</div>
          <div>What is happening?!</div>
      </div>
      <nav>
        <ul className={styles.listIcon}>
          <li><CiImageOn /></li>
          <li><AiOutlineFileGif /></li>
          <li><AiOutlineUnorderedList /></li>
          <li><BsEmojiSmile /></li>
          <li><SlCalender /></li>
          <li><CiLocationOn /><span>POST</span></li>
        </ul>
      </nav>
      <div className={styles.customPost}>
        <div className={styles.customPostContent}>
          <div className={styles.userAvatar}><BsTwitterX /></div>
          <div>
            <div className={styles.userInfo}>
              <div className={styles.name}>Elon Musk</div>
              <span><TiTick /></span> 
              <div className={styles.email}>@gmail.com</div>
              <div className={styles.time}>Time</div>
              <div className={styles.more}><CgMoreAlt /></div>
            </div>
            <div className={styles.caption}>Caption goes here</div>
            <div className={styles.image}>
              <img src="/logo512.png" alt="Example Image" width={50}/>
            </div>
          </div>
        </div>
        <nav className={styles.nav}>
          <ul className={styles.iconList}>
            <li><FaRegComment className={styles.icon} /></li>
            <li><GiRapidshareArrow className={styles.icon} /></li>
            <li><AiOutlineHeart className={styles.icon} /></li>
            <li><BsReverseListColumnsReverse className={styles.icon} /></li>
          </ul>
          <ul className={styles.iconList}>
            <li><PiBookmarkSimple className={styles.noname} /></li>
            <li><AiOutlineUpload className={styles.noname} /></li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default post;