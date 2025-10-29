import React from 'react'
import ProfileInfo from '../cards/ProfileCard';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';

const Header = ({userInfo}) => {


  const navigate = useNavigate();

  const onLogout = () =>{
    localStorage.clear();
    navigate("/login");
  };

  console.log({userInfo});

  return (
    <div className='bg-white flex items-end  justify-end w-full px-6 py-2 drop-shadow'>
        <ProfileInfo userInfo={userInfo} onLogout={onLogout}/>
    </div>
  )
}

export default Header;
