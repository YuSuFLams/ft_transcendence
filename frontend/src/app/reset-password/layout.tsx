"use client";

import FirstStep from '@/components/reset-password/first/first-step';
import SecondStep from '@/components/reset-password/second/second-step';
import ThirdStep from '@/components/reset-password/third/third-step';
import Success from '@/components/reset-password/fourth/fourth-step';
import React, { useEffect, useState } from 'react';
import { Steps, theme } from 'antd';
import Cookie from 'js-cookie';

const steps = [
    { title: 'First', content: <FirstStep />},
    { title: 'Second', content: <SecondStep />},
    { title: 'Third', content: <ThirdStep />},
    { title: 'Last', content: <Success />}
];

const App: React.FC = () => {
	const { token } = theme.useToken();
	const [current, setCurrent] = useState(0);
	const [isSmallScreen, setIsSmallScreen] = useState(false);

	const updateStep = () => {
		const stepCompleted = Cookie.get("step");
		
		if (stepCompleted && (stepCompleted === "1" || stepCompleted === "2" || stepCompleted === "3" || stepCompleted === "0")) {
			const stepNumber = parseInt(stepCompleted, 10);
			if (!isNaN(stepNumber) && stepNumber >= 0 && stepNumber < steps.length) {
				setCurrent(stepNumber);
			}
		} else {
			setCurrent(0);
		}
	};

	const handleResize = () => {setIsSmallScreen(window.innerWidth < 500);};

	useEffect(() => {
		updateStep();

		const interval = setInterval(() => {updateStep();}, 3000);

		return () => {clearInterval(interval);};
	}, []);

	useEffect(() => {
		handleResize();

		window.addEventListener('resize', handleResize);

		return () => window.removeEventListener('resize', handleResize);
	}, []);

	const items = steps.map((item) => ({ key: item.title, title: !isSmallScreen ? item.title : ""}));


	return (
		<div className="absolute w-full h-full flex items-center justify-center">
			<div className="z-[50] relative min-w-[330px] h-[60%] max-h-[400px] w-[95%] max-w-[700px] bg-[#011C40] rounded-xl shadow-lg flex flex-col">
				<Steps className="p-4 font-bold  rounded-t-xl justify-between w-full" current={current} items={items}
					style={{ display: 'flex', flexDirection: 'row', color: token.colorPrimary, backgroundColor: "#5650f0" }}
				/>
				
				<div className="w-full relative rounded-b-xl flex-grow"> {steps[current].content}</div>
			</div>
		</div>
	);

};

export default App;
