import { useState } from "react";
import AIGuess from "./Component/AiGuess";
import HumanGuess from "./Component/HumanGuess";

export default function Page() {
  const [currentGame, setCurrentGame] = useState("human");

  const changeGameMode = () => {
    setCurrentGame((prevGame) => (prevGame === "ai" ? "human" : "ai"));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0f172a] p-4">
      {/* Video Title */}
      <h2 className="text-white text-2xl font-bold mb-4">Watch the video if the API is not working</h2>

      {/* YouTube Video - Matching background */}
      <div className="w-full max-w-3xl mb-8 bg-white rounded-lg shadow-md p-4">
        <iframe
          className="w-full h-64 md:h-80 lg:h-96"
          src="https://www.youtube.com/embed/Zj_tFT49liU?si=Xhn0S97oBXaofWMe"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>

      {/* Game Mode Toggle */}
      <div >
        {currentGame === "human" ? (
          <HumanGuess onGameEnd={changeGameMode} />
        ) : (
          <AIGuess onGameEnd={changeGameMode} />
        )}

        <div className=" flex items-center justify-center">
          <button
            onClick={changeGameMode}
            className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {currentGame === "human" ? "Switch to AI Mode" : "Switch to Human Mode"}
          </button>
        </div>
      </div>
    </div>
  );
}
