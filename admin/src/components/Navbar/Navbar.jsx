import React from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';

const Navbar = () => {
  return (
    <div className='navbar'>
        <div className='logo-container'>
            <span className='logo'>Cuisine</span>
            <span className='subtitle'>Admin Panel</span>
        </div>
        <img className='profile' src={assets.profile_image} alt="Profile" />
    </div>
  );
};

export default Navbar;
