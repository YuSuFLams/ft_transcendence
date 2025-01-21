
import { removeData } from "@/app/components/game/match-local/event-prematch-local";

const handleQuitGame = (
    socket: React.MutableRefObject<WebSocket | null>,
    router: any,
) => {

    if (socket.current && socket.current.readyState === WebSocket.OPEN) {
        try {
            // Send quit game message to the server
            socket.current.send( JSON.stringify({ action: "quitGame" }));

            // Remove cookies related to the game state
            removeData()
            // Navigate to the game-local page
            router.push("/game");
        } catch (error) {
            console.error("Error during quitting the game:", error);
        }
    } else {
        console.warn("WebSocket is not open or already closed.");
    }
};

export { handleQuitGame };