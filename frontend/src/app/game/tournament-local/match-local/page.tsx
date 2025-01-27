"use client"

import Cookie from "js-cookie";
import * as THREE from "three";
import { useRouter } from "next/navigation";
import { Canvas } from "@react-three/fiber";
import React, { useEffect, useState, useRef } from "react";
import pictureLeft from "@/../public/Image/picture1.jpg";
import pictureRight from "@/../public/Image/picture2.jpg";
import Image from "next/image";
import axios from 'axios';
import { Ball, Paddle, Table } from "../../match-local/gameTable";
import { OrbitControls } from "@react-three/drei";
import { removeData } from "@/app/components/game/match-local/event-prematch-local";
import { handleKeyDown } from "@/app/components/game/match-local/mouve-paddle";

interface PlayerCradProps {
    player: string;
    picture: any;
}

const PlayerCrad: React.FC<PlayerCradProps> = ({ player, picture }) => {
    return (
        <div className="flex flex-col items-center space-y-4">
            {player && 
                <div className="flex flex-col items-center space-y-6 p-10 border-4 border-indigo-600 bg-gradient-to-b from-[#0A2C57] 
                    via-[#1A3B6B] to-gray-600 rounded-xl shadow-2xl w-[20em]">
                    <div>
                        <Image className="w-[10em] h-[10em] rounded-full border-4 border-gray-700 shadow-lg hover:scale-110 transition 
                            duration-300"width={140} height={140} src={picture} alt={`${player}'s profile picture`}/>
                    </div>

                    <div className="text-4xl font-bold font-[ssb] text-[#ECF0F1]">{player}</div>
                </div>
            }
        </div>
    )
}

const handleStartGame = (
    socket: React.RefObject<WebSocket | null>,
    setGameStarted: React.Dispatch<React.SetStateAction<boolean>>,
    player1: string,
    player2: string,
) => {
    const isStart = Cookie.get("gameStarted");
    if (socket.current && socket.current.readyState === WebSocket.OPEN && !isStart) {
        const idTournament = Cookie.get("idTournament");
        if (!idTournament) {
            console.error("Tournament ID not found in cookies.");
            return;
        }
        const idMatch = Cookie.get("idMatch");
        if (!idMatch) {
            console.error("Match ID not found in cookies.");
            return;
        }
        socket.current.send(JSON.stringify({ action: "startGame", idMatch: idMatch, idTournament: idTournament, player1: player1, player2: player2 }));
        Cookie.set("gameStarted", "true");
        setGameStarted(true);
    } else {
        console.warn("Socket is not ready or game already started.");
    }
};

interface ButtonGameProps {
	playerLeft: string;
	playerRight: string;
	socket: React.RefObject<WebSocket | null>;
	setGameStarted: React.Dispatch<React.SetStateAction<boolean>>;
}

const ButtonGame: React.FC<ButtonGameProps> = ({ playerLeft, playerRight, socket, setGameStarted }) => {
	return (
		<div className="mt-8 flex space-x-6">
			<button onClick={() => handleStartGame(socket, setGameStarted, playerLeft, playerRight)} className="w-full bg-[#1A2B47] text-2xl 
				text-white font-[ssb] px-8 rounded-xl shadow-lg hover:bg-gradient-to-l hover:from-blue-900 hover:to-blue-700 hover:scale-105 
				transition transform duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-blue-600 focus:ring-opacity-50 py-4"
			>
				Start Game
			</button>
		</div>
	)
}

interface cardPlayersProps {
	playerLeft: string;
	playerRight: string;
	socket: React.RefObject<WebSocket | null>;
	setGameStarted: React.Dispatch<React.SetStateAction<boolean>>;
}

const CardPlayers: React.FC<cardPlayersProps> = ({
	playerLeft, playerRight, socket, setGameStarted
}) => {
    return (

		<div className="flex flex-col items-center justify-center text-white space-y-12">
			{/* Title at the Top */}
            <div className="flex items-center justify-center">
				<h1 className="text-7xl font-extrabold tracking-wider font-[ssb] font-extrabold text-indigo-600"> Game Local </h1>
            </div>


			{/* Player Cards Section */}
			<div className="flex items-center justify-center space-x-12 p-8 rounded-xl shadow-2xl border-4 border-indigo-600">
				{/* Player Left Details */}
				<PlayerCrad player={playerLeft} picture={pictureLeft} />

				{/* VS Separator */}
				<div className="text-6xl font-extrabold text-yellow-400 font-[ssb] drop-shadow-2xl"> VS </div>

				{/* Player Right Details */}
				<PlayerCrad player={playerRight} picture={pictureRight} />
			</div>

			{/* Action Buttons Section */}
			<div className="w-full max-w-md">
				<ButtonGame playerLeft={playerLeft} playerRight={playerRight} socket={socket} setGameStarted={setGameStarted} />
			</div>
		</div>
    );
};


const getPlayers = async (
    setPlayerLeft: React.Dispatch<React.SetStateAction<string>>,
    setPlayerRight: React.Dispatch<React.SetStateAction<string>>,
    setIfGetPlayers: React.Dispatch<React.SetStateAction<boolean>>
) => {
    try {
        const token = Cookie.get("access");
        const idMatch = Cookie.get("idMatch");
        const idTournament = Cookie.get("idTournament");

        if (!token || !idMatch || !idTournament) {
            console.error("Missing required cookies.");
            return;
        }

        const response = await axios.get(`http://localhost:8000/api/tournament/local-tournament/match/${idTournament}/${idMatch}/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.data) {
            console.error("No data received from API");
            return;
        }
        console.log(response.data);

        // Uncomment and handle state updates
        setPlayerLeft(response.data.player1);
        setPlayerRight(response.data.player2);
        setIfGetPlayers(true);

    } catch (error) {
        console.error("An error occurred:", error);
    }
};


const openWebSocket = (
    token: string,
    socket: React.MutableRefObject<WebSocket | null>,
) => {
    // Ensure GameId exists before opening the WebSocket connection
    if (!token) return;
    
    const SOCKET_URL = `ws://localhost:8000/ws/match-local-tournament/?access_token=${token}`;

    // Create a new WebSocket instance
    socket.current = new WebSocket(SOCKET_URL);

    // Handle WebSocket events
    socket.current.onopen = () => {
        console.log("WebSocket connection opened");
		if (socket.current?.readyState === WebSocket.OPEN) {
			const game_started = Cookie.get("gameStarted");
			if (game_started) {
                const idGame = Cookie.get("idGame");
                const left_paddle = Cookie.get("left_paddle");
                const right_paddle = Cookie.get("right_paddle");
                const ball = Cookie.get("ball");
                const velocity = Cookie.get("velocity");
                const idTournament = Cookie.get("idTournament");
                const idMatch = Cookie.get("idMatch");
                if (!idTournament || !idMatch) return;
                socket.current.send(JSON.stringify({ action: "resetGame", idMatch: idMatch, idTournament: idTournament, idGame: idGame ? idGame : null, 
                    left_paddle: left_paddle ? left_paddle : null, right_paddle: right_paddle? right_paddle : null, 
                    ball:ball ? ball : null, velocity: velocity ? velocity : null }));
            }
        }
    };

    socket.current.onerror = (error) => {
        console.error("WebSocket Error:", error);
    };

    socket.current.onclose = () => {
        console.log("WebSocket connection closed");
    };

    // Cleanup on component unmount or when dependencies change
    return () => {
        socket.current?.close();
        
        console.log("WebSocket connection cleaned up");
    };
}

const listenConnection = (
    socket: React.MutableRefObject<WebSocket | null>, 
    setBallPosition: React.Dispatch<React.SetStateAction<{ x: number; y: number; z: number }>>,
    setScorePlayerLeft: React.Dispatch<React.SetStateAction<number>>,
    setScorePlayerRight: React.Dispatch<React.SetStateAction<number>>,
    setWinner: React.Dispatch<React.SetStateAction<string | null>>
) => {
    if (!socket.current) return;
    socket.current.onmessage = async (event) => {
        try {
            const message = JSON.parse(event.data);
            if (message.type === "startGame") {
                const idGame = message.data.idGame;
                Cookie.set("idGame", idGame);
            }
            if(message.type === "ball") {
                setBallPosition(message.data.ball);
                setScorePlayerLeft(message.data.score_p1);
                setScorePlayerRight(message.data.score_p2);
                const IdGame = message.data.id_game;
                Cookie.set("idGame", IdGame);
                if (message.data.winner === null){
                    Cookie.set("ball", JSON.stringify(message.data.ball));
                    Cookie.set("velocity", JSON.stringify(message.data.velocity));
                }
            }
            if (message.type === "endGame") {
                setTimeout(() => {
                    setWinner(message.data.winner);
                    Cookie.remove("idMatch")
                }, 500);
            }
        } catch (error) {
            console.error("Error parsing WebSocket message:", error);
        }
    };
}

interface TableLocalProps {
    playerLeft: string,
    playerRight: string,
    scorePlayerLeft: number,
    scorePlayerRight: number,
    positionPlayerPaddleLeft: number,
    positionPlayerPaddleRight: number,
    ballPosition: { x: number; y: number; z: number },
    ballRef: React.MutableRefObject<THREE.Mesh | null>,
    paddlePlayerRightRef: React.MutableRefObject<THREE.Mesh | null>,
    paddlePlayerLeftRef: React.MutableRefObject<THREE.Mesh | null>,
}

const TableLocal: React.FC<TableLocalProps> = (
    {
        playerLeft,
        playerRight,
        scorePlayerLeft,
        scorePlayerRight,
        positionPlayerPaddleLeft,
        positionPlayerPaddleRight,
        ballPosition,
        ballRef,
        paddlePlayerRightRef,
        paddlePlayerLeftRef,
    }
) => {
    return (
        <div className="w-screen h-screen bg-neutral-900 absolute flex flex-col justify-center items-center">
            {/* Scoreboard */}
            <div className="text-center space-y-4 absolute top-4 left-0 right-0 justify-center">
                <div className="flex justify-around font-[ssb] items-center space-x-8">
                    {/* Player Left */}
                    <div className="flex flex-col items-center">
                        <span className="text-2xl text-green-400 tracking-wider">{playerLeft}</span>
                        <span className="text-5xl font-extrabold text-white drop-shadow-md">
                            {scorePlayerLeft}
                        </span>
                    </div>
                    {/* Divider */}
                    <div className="text-3xl  text-gray-300 italic">VS</div>
                    {/* Player Right */}
                    <div className="flex flex-col items-center">
                        <span className="text-2xl text-green-400 tracking-wider">{playerRight}</span>
                        <span className="text-5xl font-extrabold text-white drop-shadow-md">
                            {scorePlayerRight}
                        </span>
                    </div>
                </div>
            </div>
            {/* Game Canvas */}
            <Canvas className="w-full h-full" camera={{ position: [-0.1, 8, 0], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <Table />
                <Ball ballRef={ballRef} ballPosition={ballPosition} />
                <Paddle ref={paddlePlayerRightRef} color="yellow" position={[positionPlayerPaddleRight, 0.3, 2.7]} />
                <Paddle ref={paddlePlayerLeftRef} color="red" position={[positionPlayerPaddleLeft, 0.3, -2.7]} />
                <OrbitControls />
            </Canvas>
            {/* Bottom Controls */}
        </div>
    )
}

const checkInfoMatch = (
    setPlayerLeft: React.Dispatch<React.SetStateAction<string>>,
    setPlayerRight: React.Dispatch<React.SetStateAction<string>>,
    setPositionPlayerPaddleLeft: React.Dispatch<React.SetStateAction<number>>,
    setPositionPlayerPaddleRight: React.Dispatch<React.SetStateAction<number>>,
    setGameStarted: React.Dispatch<React.SetStateAction<boolean>>,
) => {
    const playerleft = Cookie.get("player1");
    if (playerleft) setPlayerLeft(playerleft);
    const playerright = Cookie.get("player2");
    if (playerright) setPlayerRight(playerright);
    const paddleLeft = Cookie.get("left_paddle");
    if (paddleLeft) setPositionPlayerPaddleLeft(parseFloat(paddleLeft));
    const paddleRight = Cookie.get("right_paddle");
    if (paddleRight) setPositionPlayerPaddleRight(parseFloat(paddleRight));
    const game_started = Cookie.get("gameStarted");
    if (game_started) setGameStarted(true);
}



const MatchLocalTournament = () => {

    // Player Left 
    const [playerLeft, setPlayerLeft] = useState<string>("");
	const paddlePlayerLeftRef = useRef<THREE.Mesh | null>(null);
    const [positionPlayerPaddleLeft, setPositionPlayerPaddleLeft] = useState<number>(0);
    const [scorePlayerLeft, setScorePlayerLeft] = useState<number>(0);


    // Player Right
    const [playerRight, setPlayerRight] = useState<string>("");
	const paddlePlayerRightRef = useRef<THREE.Mesh | null>(null);
    const [positionPlayerPaddleRight, setPositionPlayerPaddleRight] = useState<number>(0);
    const [scorePlayerRight, setScorePlayerRight] = useState<number>(0);

    // Ball
	const ballRef = useRef<THREE.Mesh | null>(null);
    const [ballPosition, setBallPosition] = useState<{ x: number; y: number; z: number }>({ x: 0, y: 0.3, z: 0 });

    // Utils Match
    const [gameStarted, setGameStarted] = useState<boolean>(false);
    const [winner, setWinner] = useState<string | null>(null);
    const socket = useRef<WebSocket | null>(null);
	const token = Cookie.get("access");
    const router = useRouter();
    const [ifGetPlayers, setIfGetPlayers] = useState<boolean>(false);
    const [idTournament, setIdTournament] = useState<number | null>(null);

    
    useEffect(()=> {
        const isStarted = Cookie.get("gameStarted");
        const idTournament = Cookie.get("idTournament");
        if (isStarted) {
            setGameStarted(true);
        }
        if (idTournament) {
            setIdTournament(parseInt(idTournament));
        }
        if (!idTournament) {
            router.push("/game/tournament-local");
        }
    },[gameStarted, idTournament, router]);
    useEffect(() => {
		checkInfoMatch(setPlayerLeft, setPlayerRight, setPositionPlayerPaddleLeft, setPositionPlayerPaddleRight, setGameStarted);
	}, [gameStarted, playerLeft, playerRight, router]);


    useEffect(() => {
        getPlayers(setPlayerLeft, setPlayerRight, setIfGetPlayers);
    }, []);

    useEffect(() => {
        if (ifGetPlayers && token) {
            openWebSocket(token, socket);
        }
    }, [ifGetPlayers]);

    if (gameStarted) listenConnection(socket, setBallPosition, setScorePlayerLeft, setScorePlayerRight, setWinner);

    useEffect(() => {
        const handleKeyDownWrapper = (event: KeyboardEvent) => 
            handleKeyDown(event, socket, setPositionPlayerPaddleLeft, setPositionPlayerPaddleRight, paddlePlayerLeftRef, paddlePlayerRightRef  );

        setTimeout(() => {

            if (winner){
                removeData();
                router.push(`/game/tournament-local/${idTournament}`);
                console.log("this");
                setWinner(null);
            } 
        }, 1500);
        
        window.addEventListener('keydown', handleKeyDownWrapper);

        return () => {
            window.removeEventListener('keydown', handleKeyDownWrapper);
        };
    }, [setPositionPlayerPaddleLeft, setPositionPlayerPaddleRight, winner]);

    
    return (
        <div className="w-screen h-screen bg-gradient-to-b from-[#0A2C57] via-[#1A3B6B] to-gray-600 text-white flex flex-col font-sans">
            <main className="flex flex-col items-center justify-center flex-grow space-y-8">
                {!gameStarted ? (
                    <CardPlayers playerLeft={playerLeft} playerRight={playerRight} socket={socket} setGameStarted={setGameStarted}/>
                ):( 
                    <TableLocal playerLeft={playerLeft} playerRight={playerRight} scorePlayerLeft={scorePlayerLeft} 
                        scorePlayerRight={scorePlayerRight} positionPlayerPaddleLeft={positionPlayerPaddleLeft}
                        positionPlayerPaddleRight={positionPlayerPaddleRight} ballPosition={ballPosition} ballRef={ballRef} 
                        paddlePlayerRightRef={paddlePlayerRightRef} paddlePlayerLeftRef={paddlePlayerLeftRef}  />
                  )
                }
            </main>
        </div>
    );
}

export default MatchLocalTournament