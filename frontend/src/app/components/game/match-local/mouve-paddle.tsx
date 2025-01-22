import React from 'react';
import * as THREE from 'three';
import Cookie from "js-cookie";

const lerp = (start: number, end: number, t: number) => {
    return start + (end - start) * t;
};

const updatePaddlePosition = (
    socket: React.MutableRefObject<WebSocket | null>,
    paddleRef: React.MutableRefObject<THREE.Mesh | null>,
    setPosition: React.Dispatch<React.SetStateAction<number>>,
    targetPosition: number,
    direction: string,
    lerpSpeed:number
) => {
    if (paddleRef.current) {
        const currentPosition = paddleRef.current.position.x;
        const newPosition = lerp(currentPosition, targetPosition, lerpSpeed);

        paddleRef.current.position.x = newPosition;

        setPosition(newPosition);

        if (socket.current && socket.current.readyState === WebSocket.OPEN ) {
            socket.current.send(JSON.stringify({ action: "paddle", direction: direction, paddlePosition: newPosition }));
        }
        if (direction === "left") {
            Cookie.set("left_paddle", newPosition.toString());
        } else if (direction === "right") {
            Cookie.set("right_paddle", newPosition.toString());
        }
    }
};

const handleKeyDown = (
    event: KeyboardEvent,
    socket: React.MutableRefObject<WebSocket | null>,
    setPositionPlayerPaddleLeft: React.Dispatch<React.SetStateAction<number>>,
    setPositionPlayerPaddleRight: React.Dispatch<React.SetStateAction<number>>,
    playerPaddleLeftRef: React.MutableRefObject<THREE.Mesh | null>,
    playerPaddleRightRef: React.MutableRefObject<THREE.Mesh | null>,
) => {
    const tableWidth = 3;
    const halfWidth = tableWidth / 2;

    const moveAmount = 0.3;
    const lerpSpeed = 0.3;

    

    if (event.key === "D" || event.key === "d") {
        setPositionPlayerPaddleLeft(prevPos => {
            const newPosition = Math.max(prevPos - moveAmount, -halfWidth + 0.4);
            updatePaddlePosition(socket, playerPaddleLeftRef, setPositionPlayerPaddleLeft, newPosition, "left", lerpSpeed);
            return newPosition;
        });
    } else if (event.key === "a" || event.key === "A") {
        setPositionPlayerPaddleLeft(prevPos => {
            const newPosition = Math.min(prevPos + moveAmount, halfWidth - 0.4);
            updatePaddlePosition(socket, playerPaddleLeftRef, setPositionPlayerPaddleLeft, newPosition, "left", lerpSpeed);
            return newPosition;
        });
    }

    if (event.key === "ArrowLeft") {
        setPositionPlayerPaddleRight(prevPos => {
            const newPosition = Math.max(prevPos - moveAmount, -halfWidth + 0.4);
            updatePaddlePosition(socket, playerPaddleRightRef, setPositionPlayerPaddleRight, newPosition, "right", lerpSpeed);
            return newPosition;
        });
    } else if (event.key === "ArrowRight") {
        setPositionPlayerPaddleRight(prevPos => {
            const newPosition = Math.min(prevPos + moveAmount, halfWidth - 0.4);
            updatePaddlePosition(socket, playerPaddleRightRef, setPositionPlayerPaddleRight, newPosition, "right", lerpSpeed);
            return newPosition;
        });
    }
};

export { handleKeyDown };