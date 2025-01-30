import React from 'react';

const handleKeyDown = (
    event: KeyboardEvent,
    socket: React.MutableRefObject<WebSocket | null>
) => {
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
    if (action) {
        socket.current.send(JSON.stringify({ action: "paddle", ...action }));
    }
};

export { handleKeyDown };
