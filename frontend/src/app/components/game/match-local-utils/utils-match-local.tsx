import Cookie from "js-cookie";

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

export { checkInfoMatch }