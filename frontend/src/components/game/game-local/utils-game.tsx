import React from "react";
import Image from "next/image";

interface UserCardProps {
    name: string;
    picture: any;
    player: React.RefObject<HTMLInputElement | null>;
    error?: string;
}

const UserCard: React.FC<UserCardProps> = ({ name, picture, player, error }) => {
    return (
        <div className="flex flex-col items-center w-full sm:max-w-md md:max-w-lg lg:max-w-xl 
            bg-[#132031] p-4 sm:p-6 md:p-8 rounded-xl border border-gray-800 hover:border-blue-600 
            transition-all duration-300 shadow-lg hover:shadow-blue-600/20 transform hover:-translate-y-1">
            {/* Profile Picture */}
            <div className="relative w-32 sm:w-36 md:w-40 lg:w-44 h-32 sm:h-36 md:h-40 lg:h-44 rounded-full overflow-hidden border-2 
                border-blue-600 hover:border-blue-500 transition-colors duration-200">
                <Image className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                    src={picture}
                    alt={`${name}'s profile`}
                    width={128}
                    height={128}
                    priority
                />
            </div>

            {/* Name */}
            <h2 className="mt-4 sm:mt-5 md:mt-6 text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-gray-300 tracking-wide">{name}</h2>

            {/* Input Field */}
            <div className="relative w-full mt-4 sm:mt-5 md:mt-6">
                <input
                    ref={player}
                    className={`w-full px-3 py-4 sm:px-4 sm:py-2.5 md:px-5 md:py-3 rounded-md bg-gray-900 text-white 
                        text-base sm:text-md md:text-lg border ${error ? "border-red-500" : "border-gray-700"} 
                        focus:border-blue-600 focus:ring-2 focus:ring-blue-600/50 focus:outline-none 
                        placeholder:text-gray-500 transition-all duration-200`}
                    type="text"
                    placeholder={`Enter ${name}'s name`}
                    aria-label={`Name input for ${name}`}
                />
                {error && error !== "Players cannot have the same name" && error !== "Unique names required" && (
                    <p className="mt-1 text-xs sm:text-md md:text-lg text-red-500 font-medium line-clamp-2">
                        {error}
                    </p>
                )}
            </div>
        </div>
    );
};

export { UserCard };