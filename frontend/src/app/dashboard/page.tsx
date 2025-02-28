"use client";

const DashboardPage = () => {
    return (
        <div className="relative w-screen h-screen bg-gradient-to-br from-[#001219] via-[#031D44] to-[#062A78] overflow-hidden flex items-center justify-center">
			{/* Glowing Overlay */}
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.05)_0%,_rgba(0,0,0,0.8)_40%)]"></div>

            <h1 className="text-8xl">Home Page Text</h1>

			{/* Soft Moving Lights in the Background */}
			<div className="absolute w-[300px] h-[300px] bg-purple-400 rounded-full opacity-30 blur-3xl animate-move-up left-10 top-10"></div>
			<div className="absolute w-[200px] h-[200px] bg-blue-500 rounded-full opacity-30 blur-3xl animate-move-down right-20 bottom-20"></div>
		</div>
    )
}

export default DashboardPage;