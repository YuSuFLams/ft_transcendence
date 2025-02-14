import { BiError } from "react-icons/bi";
import { motion } from "framer-motion";

const Spinner = () => {
	return (
		<div className="fixed inset-0 w-screen h-screen flex overflow-hidden flex-col justify-center items-center 
			bg-gradient-to-br from-[#050026] via-[#11002D] to-[#002A52]">
			<div className="flex space-x-4">
				{[100, 200, 300].map((delay) => (
					<div key={delay} className="w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br from-[#041D2F] to-[#0A3B59] rounded-full 
						animate-bounce-slow drop-shadow-glow-blue"style={{ animationDelay: `${delay}ms` }}
					></div>
				))}
			</div>
	
			{/* Loading Text */}
			<p className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent mt-12 
            text-[1rem] sm:text-[2rem] md:text-[2.3rem] xl:text-[2.5rem] font-extrabold font-[Font2]">
				Loading... Just a moment!
			</p>
		</div>
	);
};


const LoadingSpinner: React.FC<{ formattedTitle: string }> = ({ formattedTitle }) => {
    return (
        <html lang="en">
            <head>
                <title> 
                    {formattedTitle === 'Home' 
                    ? 'Ping Pong | Your Ultimate Table Tennis Experience' 
                    : `Ping Pong | ${formattedTitle} - Explore More`} 
                </title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta name="description" content={`Explore the ${formattedTitle} page of Ping Pong, your ultimate table tennis experience.`} />
                <link rel="icon" href="/favicon.ico" />
            </head>
            <body>
                <Spinner />
            </body>
        </html>
    );
};
  
const LoadingError: React.FC<{ error: string }> = ({ error }) => {
    return (
        <html lang="en">
            <head>
                <title>Error | Ping Pong</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta name="description" content="An error occurred while loading the page." />
                <link rel="icon" href="/favicon.ico" />
            </head>
            <body>
                <div className="fixed inset-0 w-screen h-screen flex flex-col justify-center items-center 
                    bg-gradient-to-br from-[#050026] via-[#11002D] to-[#002A52] overflow-hidden p-4">
                    <p className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700 text-2xl sm:text-3xl md:text-4xl
                        xl:text-5xl font-extrabold font-[Font6] mb-4 text-center"> Error: {error}
                    </p>

                    <p className="text-gray-300 font-[Rock] text-base sm:text-lg md:text-xl font-medium mt-4 text-center max-w-md">
                        Oops! Something went wrong. Please try again later or contact support if the issue persists.
                    </p>

                    <div className="mt-6">
                        <BiError className="text-red-500 text-6xl md:text-[8rem] lg:text-10xl xl:text-12xl mx-auto text-center font-[Font6] 
                        font-extrabold animate-pulse" />
                    </div>

                    <motion.button className="mt-8 px-6 py-2 bg-gradient-to-r from-red-700 to-red-900 text-[#E8F9FD] font-[Font2] font-extrabold 
                        rounded-lg transition-all duration-300 text-[1.3rem] md:text-[1.6rem]" onClick={() => window.location.reload()}
                        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                        Retry
                    </motion.button>
                </div>
            </body>
        </html>
    );
};


interface PagesProps {
    formattedTitle: string;
    children: React.ReactNode;
}

const Pages: React.FC<PagesProps> = ({ formattedTitle, children }) => {
    return (
        <html lang="en">
            <head>
                <title>
                {formattedTitle === 'Home'
                    ? 'Ping Pong | Your Ultimate Table Tennis Experience'
                    : `Ping Pong | ${formattedTitle} - Explore More`}
                </title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta name="description" content={`Explore the ${formattedTitle} page of Ping Pong, your ultimate table tennis experience.`} />
                <link rel="icon" href="/favicon.ico" />
            </head>
            <body>
                {children}
            </body>
        </html>
    );
};

export { LoadingSpinner, LoadingError, Pages };