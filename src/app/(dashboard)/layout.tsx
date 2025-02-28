'use client';

import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import React from 'react'


export default  function Layout({
  children,
}: {
  children: React.ReactNode;

}) {
    return (
        <div className="w-screen h-screen  bg-[#020D1A]">
            {/* <div className="top-0 left-4 w-[100px] h-full" id="sidebar">
              <div className="fixed w-[100px] h-[40%] top-1/2 -translate-y-1/2 items-center bg-radial from-[#3E586D] to-[#2E424F] rounded-[40] ml-[30px]">
                <div className="flex flex-col h-full justify-between p-4 gap-3 overflow-auto">
                  {navigation.map((item) =>(
                    <Link key={item.name} href={item.href} className="flex flex-col items-center group fill-white ">
                   <item.icon className="text-5xl w-[50px] h-[50px] fill-white " />
                  </Link>
                ))}
                </div>
              </div>
            </div> */}
            {/* <div>
              <Sidebar />
              <Topbar />
            </div> */}
            {/* <div className="top-0 left-4 w-[100px] h-full" id="sidebar">
            </div> */}
            <Sidebar />
            {/* <div className="w-full h-[150px] bg-[#020D1A] flex flex-col justify-center mr-[50px] ml-[50px]" id="header"> */}
            <div className='w-full h-[100px]'>
              <Topbar />
            </div>
            {/* </div> */}
            <div className="grid grid-cols-1 grid-rows-1 h-[calc(100vh-200px)] w-[calc(100vw-200px)] ml-[150px] mr-[50px] mt-[50px] mb-[50px] " id="main">
              {/* <div className="overflow-visible"> */}
                  {children}
              {/* </div> */}
            </div>
        </div>
    );
}