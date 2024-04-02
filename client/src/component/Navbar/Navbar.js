import React from 'react';
import { BsTwitterX } from 'react-icons/bs';
import { AiFillHome } from "react-icons/ai";
import { AiOutlineSearch } from "react-icons/ai";
import { BsBell } from "react-icons/bs";
import { SlEnvolopeLetter } from "react-icons/sl";
import { IoListSharp } from "react-icons/io5";
import { PiBookmarkSimple } from "react-icons/pi";
import { BsFillPeopleFill } from "react-icons/bs";
import { BsPerson } from "react-icons/bs";
import { CiCircleMore } from "react-icons/ci";
import styles from './Navbar.css';

const Navbar = () => {
  return (
    <div className={styles.container}>
        <div className={styles.content}>
            <div className={styles.icon}>
                <BsTwitterX style={{ margin: 'auto', width: '10%', height: '10%', maxHeight: '400px', color: 'white' }} />
            </div>
            <nav>
                <ul>
                    <li><AiFillHome /><span>Home</span></li>
                    <li><AiOutlineSearch /><span>Explore</span></li>
                    <li><BsBell /><span>Notifications</span></li>
                    <li><SlEnvolopeLetter /><span>Messages</span></li>
                    <li><IoListSharp /><span>Lists</span></li>
                    <li><PiBookmarkSimple /><span>Notifications</span></li>
                    <li><BsFillPeopleFill /><span>Bookmarks</span></li>
                    <li><BsTwitterX /><span>Communities</span></li>
                    <li><BsPerson /><span>Premium</span></li>
                    <li><CiCircleMore /><span>Profile</span></li>
                </ul>
            </nav>
            <div
                style={{
                    border: '2px solid #007bff',
                    borderRadius: '30px',
                    width: '160px',
                    height: '40px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: 'white',
                    backgroundColor: '#1e9be3',
                }}
                >
                POST
            </div>
            <div style={{ display: 'flex', height: '200px', alignItems: 'flex-end' }}>
            <div
                style={{
                width: '50px',
                height: '50px',
                backgroundColor: 'brown',
                borderRadius: '50px',
                marginRight: '20px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'white',
                fontFamily: 'bold',
                }}
            >T</div>
            <div
                style={{
                color:'white',
                }}
            >
                Email content goes here
            </div>
            </div>
        </div>
    </div>
  );
}

export default Navbar;
