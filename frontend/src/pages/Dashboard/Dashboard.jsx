import React, { useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import axiosInstance from '../../utils/axiosInstance';  
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';

const Dashboard = () => {

  const [userInfo,setUserInfo] = useState("");

  const getUserInfo = async () => {

    try {
        const response = await axiosInstance.get("/get-user");

        if(response.data && response.data.user) {
            setUserInfo(response.data.user);
        }
    }catch(error) { 
      console.log(error);
        if(error.response.status == 401) {
            localStorage.clear();
            navigate("/login");
        }
    }

  };

  useEffect(()=>{
    getUserInfo();
  },[]);

  return (
    <div className='flex'>
      <Sidebar/>
      <div className='flex flex-col gap-10 w-full'>
        <Header userInfo={userInfo}/>
        <div className='p-5'>
          <Outlet/>
        </div>
      </div>
    </div>
  )
}

export default Dashboard;
