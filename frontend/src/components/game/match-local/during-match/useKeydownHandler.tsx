import { useEffect } from "react";

export const handleKeyDown = (event: KeyboardEvent, socket: React.RefObject<WebSocket | null>) => {

    if (!socket.current || socket.current.readyState !== WebSocket.OPEN) return;

    const keyMap: Record<string, { direction: string; event: string }> = {
        d: { direction: "left", event: "D" },
        D: { direction: "left", event: "D" },
        a: { direction: "left", event: "A" },
        A: { direction: "left", event: "A" },
        ArrowLeft: { direction: "right", event: "ArrowLeft" },
        ArrowRight: { direction: "right", event: "ArrowRight" },
    };

    const action = keyMap[event.key];
    if (action) {socket.current.send(JSON.stringify({ action: "paddle", ...action }));}
};

export const useKeydownHandler = (socket: React.RefObject<WebSocket | null>) => {
    useEffect(() => {
        const handleKeyDownWrapper = (event: KeyboardEvent) => handleKeyDown(event, socket);

        window.addEventListener('keydown', handleKeyDownWrapper);

        return () => {
            window.removeEventListener('keydown', handleKeyDownWrapper);
        };
    }, [socket]);
};