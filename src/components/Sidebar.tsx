'use client';

import React from 'react'
import Link from 'next/link';
import {Ihome, Ichat, Ifriends, Igame, Irank, Ihistroy, Isettings} from '@/icons/icons'
const navigation = [
    {name: 'Home', href: '/dashboard', icon:Ihome },
    {name: 'Chat', href: '/Chat', icon:Ichat },
    {name: 'Friends', href: '/Friends', icon:Ifriends },
    {name: 'Game', href: '/Game', icon:Igame },
    {name: 'Rank', href: '/Rank', icon:Irank },
    {name: 'History', href: '/Histroy', icon:Ihistroy },
    {name: 'Settings', href: '/Settings', icon:Isettings }
];

export default  function Sidebar(){
    return (
          <div className="fixed w-[100px] h-[40%] top-1/2 -translate-y-1/2 items-center rounded-[40] ml-[30px]  bg-[#2E424F]">
            <div className="flex flex-col h-full justify-between items-center p-4 gap-3 overflow-auto ">
              {navigation.map((item) =>(
                  <Link key={item.name} href={item.href} className=" items-center group   ">
               <item.icon className="text-5xl w-[50px] h-[50px] fill-white" />
              </Link>
            ))}
            </div>
          </div>
      );
}