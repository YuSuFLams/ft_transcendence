"use client";

import React, { useEffect, useState } from 'react';
import { Steps, theme } from 'antd';
import FirstStep from './page';
import SecondStep from './verify-code/page';
import ThirdStep from './confirm-pass/page';
import Success from './successfull/page';
import { use } from 'framer-motion/m';
import { Point } from "../utils/background";

const steps = [
  {
    title: 'First',
    content: <FirstStep />,
  },
  {
    title: 'Second',
    content: <SecondStep />,
  },
  {
    title: 'Third',
    content: <ThirdStep />,
  },
  {
    title: 'Last',
    content: <Success />,
  }
];

const App: React.FC = () => {
  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);

  const updateStep = () => {
    const stepCompleted = sessionStorage.getItem("step");
    
    if (stepCompleted && (stepCompleted === "1" || stepCompleted === "2" || stepCompleted === "3" || stepCompleted === "0")) {
      const stepNumber = parseInt(stepCompleted, 10);
      if (!isNaN(stepNumber) && stepNumber >= 0 && stepNumber < steps.length) {
        setCurrent(stepNumber);
      }
    } else {
      setCurrent(0);
    }
  };
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  // Function to check screen size
  const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 500); // Example threshold for small screens (< 1024px)
  };

  useEffect(() => {
    updateStep(); // Initial check on mount

    const interval = setInterval(() => {
      updateStep(); // Check for changes every second
    }, 3000);

    return () => {
      clearInterval(interval); // Cleanup on unmount
    };
  }, []);
  useEffect(() => {
    // Set initial screen size check
    handleResize();

    // Add event listener to track window resizing
    window.addEventListener('resize', handleResize);

    // Cleanup listener on unmount
    return () => window.removeEventListener('resize', handleResize);
}, []);

const items = steps.map((item) => ({ key: item.title, title: !isSmallScreen ? item.title : ""}));


return (
  <div className="fixed w-full h-full bg-[#050A30]  top-0 left-0 flex items-center justify-center">
    <div className="z-[50] min-w-[330px] h-[60%] max-h-[400px] w-[95%] max-w-[700px] bg-[#164773] rounded-3xl shadow-lg flex flex-col">
        <Steps 
        className="p-4  rounded-t-xl lg:rounded-t-3xl justify-between w-full" 
        current={current} 
        items={items}
        style={{ display: 'flex', flexDirection: 'row', color: token.colorPrimary, backgroundColor: "#b6a972" }} // Force steps to display in a row
      />
      <div className=" w-full rounded-b-3xl flex-grow mb-12">
        {steps[current].content}
      </div>
    </div>
    <Point />
  </div>
);

};

export default App;
