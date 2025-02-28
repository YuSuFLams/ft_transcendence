'use client'
import {BarSearchIcon, Inotif} from '@/icons/icons'

export default function Topbar(){
    return (
          <div className="mr-[50px] items-center justify-between flex ml-[100px] w-[100vw-150px] h-[100px] top-0 " id="header">
            <div className="flex items-center justify-start ml-30 rounded-[25] w-[500px] h-[50px] bg-[#374151]">
              <BarSearchIcon className='ml-[20px] w-[30px] h-[30px]'/>
              <input type="text" placeholder="Search Here" className="ml-[10px] bg-[#374151] items-cente overflow-auto"/>
            </div>
            <div className="flex items-center justify-end gap-2 mr-[50px] ">
              <Inotif className='mr-[20px] w-[50px] h-[50px]'/>
              <Inotif className='mr-[20px] w-[50px] h-[50px]'/>
            </div>
          </div>
    )
}