import React from 'react';
import axios from 'axios';
import Cookie from 'js-cookie';
import { PlayersProps } from './page';
import { FinalMatch, LeftSide, RightSide, SimeFinaleLeft, SemiFinaleRight } from './utilsTournament';

const TournamentCard8Plalyers: React.FC<{ Players: PlayersProps }> = ({ Players }) => {

    if (!Players.player1) {
        return <div>Loading...</div>;
    }
    
    return (
        <div className="flex justify-between h-full w-full max-w-[90rem] overflow-hidden items-center max-h-full p-8 space-x-8 w-screen relative">
            <div> <LeftSide Players={Players} /> </div>
            <div className="flex items-center h-full justify-arround space-x-16 relative"> <SimeFinaleLeft Players={Players} /> </div>
            <div> <FinalMatch Players={Players} /> </div>
            <div className="flex items-center h-full justify-arround space-x-16 relative"> <SemiFinaleRight Players={Players} /> </div>
            <div> <RightSide Players={Players} /> </div>
        </div>
    );
};


const TournamentCard4Plalyers: React.FC<{ Players: PlayersProps }> = ({ Players }) => {
    return (
        <div className="flex justify-between h-full w-full max-w-[90rem] overflow-hidden items-center max-h-full p-8 space-x-8 w-screen relative">
            <div className="flex items-center h-full justify-arround space-x-16 relative"> <SimeFinaleLeft Players={Players} /> </div>
            <div> <FinalMatch Players={Players} /> </div>
            <div className="flex items-center h-full justify-arround space-x-16 relative"> <SemiFinaleRight Players={Players} /> </div>
        </div>
    )
} 

const getTournamentLocalByID = async (id: string) => {
    try {
        const token = Cookie.get("access");
        if (!token) {
            console.error("No access token found");
            return null;
        }
        console.log("Tournament ID:", id);
        const response = await axios.get(`http://localhost:8000/api/tournament/local-tournament/${id}/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.data) {
            console.error("No data received from API");
            return null;
        }
        return response.data;
    } catch (error) {
        console.error("Error fetching tournament data:", error);
        return null;
    }
};

export { TournamentCard8Plalyers, getTournamentLocalByID, TournamentCard4Plalyers };