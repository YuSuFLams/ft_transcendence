import { BiError } from "react-icons/bi";
import { motion } from "framer-motion";

const Spinner = () => {
    return (
        <div className="fixed inset-0 w-screen h-screen flex overflow-hidden flex-col justify-center items-center bg-[#010d19] z-50">
            {/* Rotating Circle */}
            <div className="relative w-24 h-24 sm:w-32 sm:h-32">
                <div className="absolute inset-0 border-4 border-transparent border-t-[#4299E1] border-r-[#4299E1] rounded-full animate-spin-slow"></div>
                <div className="absolute inset-0 border-4 border-transparent border-b-[#3182CE] border-l-[#3182CE] rounded-full animate-spin-slow-reverse"></div>
            </div>

            {/* Loading Text */}
            <p className="bg-gradient-to-r from-[#4299E1] via-[#3182CE] to-[#2B6CB0] bg-clip-text text-transparent mt-8 
                text-[1rem] sm:text-[1.5rem] md:text-[2rem] xl:text-[2.2rem] font-bold animate-fade-in-out">
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
                    bg-[#010d19] overflow-hidden p-4">
                    {/* Error Text with Red Gradient */}
                    <p className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4D4D] to-[#FF0000] text-2xl sm:text-3xl md:text-4xl
                        xl:text-5xl font-extrabold font-[Font6] mb-4 text-center"> Error: {error}
                    </p>

                    {/* Error Description */}
                    <p className="text-[#c0c0c0] font-[Rock] text-base sm:text-lg md:text-xl font-medium mt-4 text-center max-w-md">
                        Oops! Something went wrong. Please try again later or contact support if the issue persists.
                    </p>

                    {/* Error Icon with Red Color */}
                    <div className="mt-6">
                        <BiError className="text-[#FF4D4D] text-6xl md:text-[8rem] lg:text-10xl xl:text-12xl mx-auto text-center font-[Font6] 
                            font-extrabold animate-pulse" />
                    </div>

                    {/* Retry Button with Red Gradient */}
                    <motion.button className="mt-8 px-6 py-2 bg-gradient-to-r from-[#FF4D4D] to-[#FF0000] text-[#ffffff] font-[Font2] font-extrabold 
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
            <body className="bg-[#010d19] w-full h-full">
                {children}
            </body>
        </html>
    );
};

export { LoadingSpinner, LoadingError, Pages };