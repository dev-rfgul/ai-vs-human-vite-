import React, { useState, useEffect } from "react";
import axios from "axios";

import { userScore, aiScore } from '../userScore/ScoreSlice';
import { useDispatch, useSelector } from "react-redux";


const HumanGuess = ({ onGameEnd }) => {


    const [userGuess, setUserGuess] = useState("");
    const [message, setMessage] = useState("");
    const [aiGuess, setAIGuess] = useState(0);
    const [error, setError] = useState("");
    const [userScore, setUserScore] = useState(0);
    const [aiScore, setAIScore] = useState(0);


    const dispatch = useDispatch();
    const score = useSelector((state) => state.value)

    const minRange = 1;
    const maxRange = 100;

    const GROQ_API_KEY = "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";

    useEffect(() => {
        aiGeneratedNumber();
    }, []);

    const aiGeneratedNumber = () => {
        const requestData = {
            messages: [
                {
                    role: "system",
                    content: `Generate a single, random integer between ${minRange} and ${maxRange}. Only provide the number without any additional text, explanations, or formatting   `,
                },
            ],
            model: "llama3-8b-8192",
        };
        console.log("AI Generated Number" + requestData.messages[0].content);

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
                    console.log("AI Generated Number" + extractedNumber);
                } else {
                    setError("Failed to extract a valid integer from AI response");
                }
            })
            .catch((error) => {
                setError("Error fetching AI-generated number. Please try again.");
            });
    };

    const extractIntegerFromParagraph = (paragraph) => {
        const pattern = /\b\d+\b/;
        const match = paragraph.match(pattern);
        return match ? parseInt(match[0]) : null;
    };

    const handleSubmit = () => {
        if (userGuess < minRange || userGuess > maxRange) {
            setMessage(`Please enter a number between ${minRange} and ${maxRange}.`);
            return;
        }

        if (aiGuess !== null) {
            if (parseInt(userGuess) === aiGuess) {
                setMessage("You won!");
                setUserScore(userScore + 1);
                localStorage.setItem("userScore", userScore);
                const scoreToDisplay= localStorage.getItem("userScore");
                dispatch(userScore(scoreToDisplay));
            } else if (parseInt(userGuess) > aiGuess) {
                setMessage("The Number is Greater than the Generated Number.");
            } else if (parseInt(userGuess) < aiGuess) {
                setMessage("The Number is Less than the Generated Number.");
            } else {
                setMessage("You lost.");
            }
        } else {
            setMessage("AI number not generated yet.");
        }
    };

    const handleReset = () => {
        setUserGuess("");
        setMessage("");
        setError("");
        aiGeneratedNumber();
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
                <h1 className="text-5xl font-bold text-blue-500 mb-6 text-center">User Will Guess</h1>
                <p className="text-gray-600 mb-6 text-2xl text-center">Guess a number between 1 and 100</p>
                <input
                    type="number"
                    value={userGuess}
                    onChange={(e) => setUserGuess(e.target.value)}
                    className="w-full text-black px-4 py-3 border border-gray-300 rounded-md mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex justify-between mb-6">
                    <button
                        onClick={handleSubmit}
                        className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Start Game
                    </button>
                    <button
                        onClick={handleReset}
                        className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                        Reset
                    </button>
                    <button
                        onClick={onGameEnd}
                        className="bg-yellow-500 text-white px-6 py-2 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    >
                        Change Mode
                    </button>
                </div>
                {message && <p className="text-green-500 mt-4 text-2xl text-center">{message}</p>}


                {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

                <div className="flex justify-between mt-6">
                    <div className="bg-gray-200 rounded-lg p-4 w-1/2 mr-2">
                        <h2 className="text-center text-xl font-semibold text-gray-700">User Score</h2>
                        <p className="text-center text-2xl font-bold text-gray-800">{score}</p>
                    </div>
                    <div className="bg-gray-200 rounded-lg p-4 w-1/2 ml-2">
                        <h2 className="text-center text-xl font-semibold text-gray-700">AI Score</h2>
                        <p className="text-center text-2xl font-bold text-gray-800">{aiScore}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
// adding text to check wether the github stats counter increases or not

export default HumanGuess;
