import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components';

const Navbar = () => {

  const navigate = useNavigate();

  const navigationHandler = (path) => {
    navigate(path);
  };

  return (
    <nav className="bg-background-color shadow-md py-4">
      <div className="container mx-auto flex items-center justify-between px-6">
        <div className="text-3xl font-bold text-primary-color">
          <Link to="/">Navbar</Link>
        </div>

        <div className='flex gap-2'>
          {/* <Button text={'Login'} onClick={()=>{navigationHandler('/login')}} /> */}
          {/* <Button text={'Register'} onClick={()=>{navigationHandler('/register')}} /> */}
          <Button text={'Dashboard'} onClick={()=>{navigationHandler('/dashboard')}} />
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
