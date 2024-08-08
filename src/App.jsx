
import { useState } from "react";
import AIGuess from "./Component/AiGuess";
import HumanGuess from "./Component/HumanGuess";

export default function Page() {
  const [currentGame, setCurrentGame] = useState("human");

  const changeGameMode = () => {
    if (currentGame === "ai") setCurrentGame("human");
    else setCurrentGame("ai");
  };

  return (
    <>


      {currentGame === "human" ? (
        <HumanGuess onGameEnd={changeGameMode} />
      ) : (
        <AIGuess onGameEnd={changeGameMode} />
      )}
    </>
  );
}
