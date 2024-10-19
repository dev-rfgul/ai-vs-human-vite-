
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

      <iframe width="560" height="315" src="https://www.youtube.com/embed/Zj_tFT49liU?si=Xhn0S97oBXaofWMe" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

      {currentGame === "human" ? (
        <HumanGuess onGameEnd={changeGameMode} />
      ) : (
        <AIGuess onGameEnd={changeGameMode} />
      )}
    </>
  );
}
