import React, { useState, useEffect } from "react";
// import Sound from "react-sound";
import axios from "axios";

const AIGuess = ({ onGameEnd }) => {
    const [number, setNumber] = useState("");
    const [AIGuess, setAIGuess] = useState("");
    const [attempts, setAttempts] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [gameWon, setGameWon] = useState(false);
    const [userScore, setUserScore] = useState(0);
    const [aiScore, setAIScore] = useState(0);
    const [audioPlaying, setAudioPlaying] = useState(false);
    const [minRange, setMinRange] = useState(1);
    const [maxRange, setMaxRange] = useState(100);

    const getNumberFromUser = (event) => {
        const value = event.target.value;
        if (value >= 1 && value <= 100) {
            setNumber(value);
        }
    };

    const playAudio = () => {
        setAudioPlaying(true);
    };

    const handleReset = () => {
        setNumber("");
        setAIGuess("");
        setAttempts(0);
        setGameOver(false);
        setGameWon(false);
        setUserScore(0);
        setAIScore(0);
        setAudioPlaying(false);
        setMinRange(1);
        setMaxRange(100);
    };

    const getCompletionFromAI = () => {
        const GROQ_API_KEY = "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";
        const requestData = {
            messages: [
                {
                    role: "system",
                    content: `Generate a random integer between ${minRange} and ${maxRange} without any extra text.`,
                },
            ],
            model: "llama3-8b-8192",
        };

        axios
            .post("https://api.groq.com/openai/v1/chat/completions", requestData, {
                headers: {
                    Authorization: `Bearer ${GROQ_API_KEY}`,
                    "Content-Type": "application/json",
                },
            })
            .then((response) => {
                const data = response.data.choices[0].message.content;
                const extractedNumber = extractIntegerFromParagraph(data);
                if (extractedNumber !== null) {
                    setAIGuess(extractedNumber);
                    setAttempts(1);
                } else {
                    console.error("Failed to extract a valid integer from AI response");
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };

    const generateNextNumber = (greaterThan) => {
        if (attempts < 15) {
            const newMin = greaterThan ? AIGuess + 1 : minRange;
            const newMax = greaterThan ? maxRange : AIGuess - 1;

            setMinRange(newMin);
            setMaxRange(newMax);

            const GROQ_API_KEY = "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";
            const requestData = {
                messages: [
                    {
                        role: "system",
                        content: `Generate a random integer between ${newMin} and ${newMax} without any extra text.`,
                    },
                ],
                model: "llama3-8b-8192",
            };

            axios
                .post("https://api.groq.com/openai/v1/chat/completions", requestData, {
                    headers: {
                        Authorization: `Bearer ${GROQ_API_KEY}`,
                        "Content-Type": "application/json",
                    },
                })
                .then((response) => {
                    const data = response.data.choices[0].message.content;
                    const extractedNumber = extractIntegerFromParagraph(data);
                    if (extractedNumber !== null) {
                        setAIGuess(extractedNumber);
                        setAttempts((prev) => prev + 1);
                        if (extractedNumber === parseInt(number)) {
                            handleGameWon();
                        }
                    } else {
                        console.error("Failed to extract a valid integer from AI response");
                    }
                })
                .catch((error) => {
                    console.error("Error:", error);
                });
        } else {
            handleGameOver();
        }
    };

    const handleGameOver = () => {
        setGameOver(true);
        setUserScore((prev) => prev + 1);
    };

    const handleGameWon = () => {
        setGameWon(true);
        setAIScore((prev) => prev + 1);
    };

    const extractIntegerFromParagraph = (paragraph) => {
        const pattern = /\b\d+\b/;
        const match = paragraph.match(pattern);
        return match ? parseInt(match[0]) : null;
    };

    return (
        <div className="relative min-h-screen bg-gray-900 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
            <div>
                <Sound
                    url="/sound.mp3"
                    playStatus={audioPlaying ? Sound.status.PLAYING : Sound.status.STOPPED}
                    volume={100}
                />
            </div>
            <div className="text-center bg-white p-6 sm:p-8 md:p-10 rounded-lg shadow-2xl max-w-lg w-full mx-auto">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 sm:mb-6 text-blue-500">
                    AI Will Guess
                </h1>
                <div className="flex flex-col items-center text-center">
                    <input
                        onChange={getNumberFromUser}
                        placeholder="Enter the Number from 1 - 100"
                        type="number"
                        value={number}
                        className="w-full text-black px-4 py-3 border border-gray-300 rounded-md mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <div className="flex justify-between  mb-6 space-x-2">
                        <button
                            onClick={() => {
                                getCompletionFromAI();
                                playAudio();
                            }}
                            className=" bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Start Game
                        </button>
                        <button
                            onClick={handleReset}
                            className="flex-1 bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                            Reset
                        </button>
                        <button
                            onClick={() => onGameEnd()}
                            className=" bg-yellow-500 text-white px-6 py-2 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        >
                            Change Mode
                        </button>
                    </div>

                    {attempts > 0 && !gameOver && !gameWon && (
                        <div className="text-center mt-8">
                            <h2 className="text-2xl text-black font-bold mb-4">
                                AI Generated Number: {AIGuess}
                            </h2>
                            <div className="mt-4 flex justify-center space-x-2">
                                <button
                                    onClick={() => generateNextNumber(true)}
                                    className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition duration-300"
                                >
                                    Greater
                                </button>
                                <button
                                    onClick={() => generateNextNumber(false)}
                                    className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition duration-300"
                                >
                                    Smaller
                                </button>
                            </div>
                        </div>
                    )}

                    {gameOver && (
                        <div className="text-center mt-8">
                            <h2 className="text-2xl text-black font-bold mb-4">AI Lose</h2>
                            <button
                                onClick={() => {
                                    setGameOver(false);
                                    setAttempts(0);
                                    setAIGuess("");
                                    setMinRange(1);
                                    setMaxRange(100);
                                }}
                                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
                            >
                                Reset Game
                            </button>
                        </div>
                    )}

                    {gameWon && (
                        <div className="text-center mt-8">
                            <h2 className="text-2xl text-black font-bold mb-4">AI Wins</h2>
                            <button
                                onClick={() => {
                                    setGameWon(false);
                                    setAttempts(0);
                                    setAIGuess("");
                                    setMinRange(1);
                                    setMaxRange(100);
                                }}
                                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
                            >
                                Reset Game
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex justify-between mt-6 space-x-2">
                    <div className="bg-gray-200 rounded-lg p-4 w-1/2">
                        <h2 className="text-center text-xl font-semibold text-gray-700">User Score</h2>
                        <p className="text-center text-2xl font-bold text-gray-800">{userScore}</p>
                    </div>
                    <div className="bg-gray-200 rounded-lg p-4 w-1/2">
                        <h2 className="text-center text-xl font-semibold text-gray-700">AI Score</h2>
                        <p className="text-center text-2xl font-bold text-gray-800">{aiScore}</p>
                    </div>
                </div>
            </div>
        </div>


    );
};

export default AIGuess;
