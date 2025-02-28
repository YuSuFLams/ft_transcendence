'use client';
import React, { useState } from 'react';
import dynamic from "next/dynamic";
import {GameWin, GameLosses, MatchPlayed, StatsIcon } from '@/icons/icons';
const StatsGame = dynamic(() => import('@/components/Stats'), { ssr: false });
import CalendarData from '@/components/Calendar';
// import { Calendar } from "@/components/ui/calendar"
// import ModelRenderer from "@/components/model-renderer";
import ModelRenderer from '@/components/model-renderer';
import { SelverBd,GoldeBd,BronzeBd,MythicBd } from '@/icons/Badges';
import { ChatStarter, FirstPaddle, FriendlyCircle, PingPongLegend, RisingStar, RisingStarII, RisingStarIII, SocialStar, TournamentChampion, TournamentChampionII, TournamentChampionIII, FriendlyCircleII} from '@/icons/achevments';

export default function dashboard(){
    const [chartDropDown, setchartDropDown] = useState(false);
    const [timeDropDown, settimeDropDown] = useState(false);
    const [chartType, setChartType] = useState("BarChart");
    const [TimeFrame, setTimeFrame] = useState("Months");
    const [date, setDate] = React.useState<Date | undefined>(new Date());
    const toggleDropdownChart = () => {
        setchartDropDown(!chartDropDown);
    };
    const toggleDropdownTime = () => {
        settimeDropDown(!timeDropDown);
    };

    return (
        <div className="grid grid-cols-4 grid-rows-[0.25fr_1fr_1fr_1fr_1fr]  gap-2" id="mainContent">
            <div className="grid col-span-4 grid-flow-col-dense my-auto" id="uman">
                <div className="items-center mx-auto" id="win">
                    <GameWin className='overflow-visible'/>
                </div>
                <div className="items-center mx-auto" id="lose">
                    <GameLosses className='overflow-visible'/>
                </div>
                <div className="items-center mx-auto" id="total">
                    <MatchPlayed className='overflow-visible'/>
                </div>
            </div>
            <div className="col-span-2 bg-[#1E2934] rounded-[40] h-[400px] gap-2" id="statistic">
                <div className="flex flex-rows">
                    <div className="overflow-visible items-center justify-items-center opacity-100 mt-[50px] ml-[15px]" id="grap">
                        <StatsGame width={1640} height={350} type={chartType} time={TimeFrame}/>
                    </div>
                    <div className='flex flex-col gap-16'>
                        <div className="justify-items-center items-center top-1/2 -translate-y-1/2 mr-[20px] relative">
                            <button 
                                onClick={toggleDropdownChart}
                                className="text-white bg-[#2E424F] hover:bg-[#415d70] font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
                                type="button"
                            >
                                ChartType
                                <svg className="w-2.5 h-2.5 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1l4 4 4-4" />
                                </svg>
                            </button>
                            {chartDropDown && (
                                <div className="absolute z-10 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow-lg w-44 dark:bg-gray-700">
                                    <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                                        <li>
                                            <button onClick={() => [setChartType("BarChart"),setchartDropDown(false)]} className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                                Bar Chart
                                            </button>
                                        </li>
                                        <li>
                                            <button onClick={() => [setChartType("LineChart"),setchartDropDown(false)]} className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                                Line Chart
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                        <div className="justify-items-center items-center mr-[50px]  relative">
                            <button 
                                onClick={toggleDropdownTime}
                                className="text-white bg-[#2E424F] hover:bg-[#415d70] font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
                                type="button"
                            >
                                TimeFrame
                                <svg className="w-2.5 h-2.5 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1l4 4 4-4" />
                                </svg>
                            </button>
                            {timeDropDown && (
                                <div className="absolute z-10 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow-lg w-44 dark:bg-gray-700">
                                    <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                                        <li>
                                            <button onClick={() => [setTimeFrame("Weeks"),settimeDropDown(false)]}  className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                                Weeks
                                            </button>
                                        </li>
                                        <li>
                                            <button onClick={() => [setTimeFrame("Months"),settimeDropDown(false)]}  className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                                Months
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-[#1E2934] col-span-1 row-span-1 overflow-visible rounded-[40] items-center flex justify-center text-xl" id="cal">
            {/* <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                numberOfMonths={3}
                className=" items-center  text-white self-center place-content-center justify-items-center"
                /> */}
                <CalendarData />
            </div>
            <div className= "col-span-1 row-span-4 rounded-[40] scrollbar-hide" id="graph">
                <div className="grid grid-cols-1 grid-flow-row h-[97%] gap-4 scrollbar-hide overflow-auto overflow-y-scroll ml-[25px] mr-[25px] mt-[25px]">
                    <div className="overflow-visible  h-[170px]">
                        <FirstPaddle pathData='false'/>
                    </div>
                    <div className="overflow-visible  h-[170px]">
                        <FriendlyCircle pathData='false'/>
                    </div>
                    <div className="overflow-visible  h-[170px]">
                        <ChatStarter pathData='false'/>
                    </div>
                    <div className="overflow-visible  h-[170px]">
                        <RisingStar pathData='false'/>
                    </div>
                    <div className="overflow-visible  h-[170px]">
                        <RisingStarII pathData='true'/>
                    </div>
                    <div className="overflow-visible  h-[170px]">
                        <RisingStarIII pathData='true'/>
                    </div>
                    <div className="overflow-visible  h-[170px]">
                        <FriendlyCircleII pathData='false'/>
                    </div>
                    <div className="overflow-visible  h-[170px]">
                        <SocialStar pathData='false'/>
                    </div>
                    <div className="overflow-visible  h-[170px]">
                        <TournamentChampion pathData='false'/>
                    </div>
                    <div className="overflow-visible  h-[170px]">
                        <TournamentChampionII pathData='false'/>
                    </div>
                    <div className="overflow-visible  h-[170px]">
                        <TournamentChampionIII pathData='false'/>
                    </div>
                    <div className="overflow-visible  h-[170px]">
                        <PingPongLegend pathData='false'/>
                    </div>
                </div>
            </div>
            <div className="bg-[#1E2934] col-span-2 row-span-2 overflow-visible rounded-[40] w-full h-auto grid-flow-row-dense" id="overview">
                {/* <div className='grid grid-cols-4 items-center self-center place-content-center justify-items-center gap-24 mt-[36px] rounded-[40]'>
                    <div>
                        <BronzeBd className='items-center justify-center justify-items-center opacity-1' />
                    </div>
                    <div>
                        <SelverBd className='items-center justify-center justify-items-center' />
                    </div>
                    <div>
                        <GoldeBd className='items-center justify-center justify-items-center' />
                    </div>
                    <div>
                        <MythicBd className='items-center justify-center justify-items-center' />
                    </div>
                </div> */}
                <div className='flex flex-col w-full h-full'>
                    <ModelRenderer />
                </div>
            </div>
            <div className="bg-gray-700 row-span-2 overflow-visible rounded-[40]" id="card">Card</div>
            <div className="bg-gray-700 col-span-3 overflow-visible rounded-[40]" id="ld">Ld</div>
        </div>
    )
}