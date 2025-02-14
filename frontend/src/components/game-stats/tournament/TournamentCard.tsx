import React from "react";
import { CalendarX } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { TournamentItem } from "../../utils/interface";
import { TournamentPreCard } from "./TournamentPreCard";
import { TournamentPopup } from "./TournamentPopup";

interface TournamentCardsProps {
  tournaments: TournamentItem[];
}

const TournamentCards: React.FC<TournamentCardsProps> = ({ tournaments }) => {
  const [selectedTournament, setSelectedTournament] = useState<TournamentItem | null>(null);

  const handleViewDetails = (tournament: TournamentItem) => setSelectedTournament(tournament);
  const handleCloseModal = () => setSelectedTournament(null);

    return (
        <div className="z-50 relative flex flex-col items-center justify-center h-full w-full">
            {tournaments.length === 0 ? (
                <div className="inset-0 flex flex-col items-center justify-center p-6 space-y-4">
                    <motion.div transition={{ delay: 0.3, duration: 0.5 }} className="flex flex-col items-center justify-center p-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <CalendarX className="w-24 h-24 sm:w-24 sm:h-24 md:w-28 md:h-28 text-blue-200 mb-4" />
                        <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-[Font6] font-bold text-blue-100 mb-2"> No Tournaments games available </p>
                        <p className="text-sm sm:text-md md:text-lg font-[TORAJA] font-semibold text-blue-300 text-center"> Please check back later for upcoming tournaments. </p>
                    </motion.div>
                </div>
            ) : (
                <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2  sm:grid-cols-2 grid-cols-1 gap-6 max-h-[60vh] overflow-auto p-6 w-full">
                    {tournaments.map((tournament) => ( <TournamentPreCard key={tournament.date} tournament={tournament} handleViewDetails={handleViewDetails} />))}
                </div>
            )}

            {selectedTournament && (<TournamentPopup handleClose={handleCloseModal} selectedTournament={selectedTournament} />)}
        </div>
    );
};

export default TournamentCards;