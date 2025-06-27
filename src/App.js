import React, { useState, useEffect } from 'react';

// Main App component for the simulated Discord bot
const App = () => {
    // === OPTION TO HARDCODE GEMINI API KEY HERE (NOT RECOMMENDED FOR PRODUCTION) ===
    // To use a hardcoded key, uncomment the line below and replace "YOUR_GEMINI_API_KEY_HERE"
    // Then, uncomment the `useState` line that uses `MY_HARDCODED_GEMINI_API_KEY`.
    const MY_HARDCODED_GEMINI_API_KEY = "PUT_YOUR_GEMINI_API_KEY_HERE"; // Replace with your actual key

    // State variables for various inputs and bot functionality
    // Initialize with a hardcoded key if MY_HARDCODED_GEMINI_API_KEY is defined and you wish to use it.
    // Otherwise, keep it as an empty string to rely on user input.
    const [geminiApiKey, setGeminiApiKey] = useState(MY_HARDCODED_GEMINI_API_KEY || ''); // Initialize with hardcoded key or empty string
    // ==============================================================================

    const [botToken, setBotToken] = useState(''); // Discord Bot Token (for conceptual display)
    const [faqContent, setFaqContent] = useState(''); // Content of the FAQ.md file
    const [userInput, setUserInput] = useState(''); // User's question input
    const [chatHistory, setChatHistory] = useState([]); // Stores simulated chat messages
    const [isBotInitialized, setIsBotInitialized] = useState(false); // Flag for bot readiness
    const [isLoading, setIsLoading] = useState(false); // Loading indicator for API calls
    const [errorMessage, setErrorMessage] = useState(''); // To display API or parsing errors

    // Effect to handle initial setup or API key changes
    useEffect(() => {
        // If the hardcoded key is initially set, or the user enters it, clear any error messages.
        if (geminiApiKey) {
            setErrorMessage(''); // Clear previous errors if API key is provided
        }
    }, [geminiApiKey]); // Re-run if geminiApiKey changes (e.g., from user input or hardcode)

    /**
     * Handles the initialization of the bot.
     * In a real bot, this would involve connecting to Discord and setting up event listeners.
     * Here, it just enables the chat interface.
     */
    const handleInitializeBot = () => {
        if (!geminiApiKey) {
            setErrorMessage('Please enter your Gemini API Key to initialize the bot.');
            return;
        }
        if (!faqContent) {
            setErrorMessage('Please paste your FAQ.md content.');
            return;
        }
        setIsBotInitialized(true);
        setChatHistory([{ sender: 'Bot', message: 'QuerySage Initialized! Ready to answer questions from your FAQ. Try asking something.' }]);
        setErrorMessage('');
    };

    /**
     * Handles the user asking a question to the bot.
     * This function constructs the prompt and calls the Gemini API.
     * @param {string} question - The question asked by the user.
     */
    const handleAskQuestion = async (question) => {
        if (!question.trim()) return;

        // Add user's question to chat history
        setChatHistory(prev => [...prev, { sender: 'User', message: question }]);
        setUserInput(''); // Clear input field

        setIsLoading(true);
        setErrorMessage('');

        try {
            let botResponseText = '';
            const normalizedQuestion = question.toLowerCase().trim();

            // --- Basic conversational responses for common greetings/meta questions ---
            if (normalizedQuestion === 'hello' || normalizedQuestion === 'hi' || normalizedQuestion === 'hey') {
                botResponseText = 'Hello there! I\'m QuerySage. How can I help you today with information from the FAQ?';
            } else if (normalizedQuestion === 'what is faq?' || normalizedQuestion === 'what is faq') {
                botResponseText = 'FAQ stands for Frequently Asked Questions. I can answer questions using the content of the FAQ you provided.';
            } else if (normalizedQuestion === 'i have a doubt' || normalizedQuestion === 'i have a query') {
                botResponseText = 'Please ask your question. I will try to answer based on the provided FAQ content, or use my general knowledge if it\'s not there.';
            }
            else {
                // --- Refined prompt to allow more general and creative answers ---
                const prompt = `You are a helpful Discord bot named QuerySage.
Your main goal is to answer user questions.
First, try to find answers within the provided FAQ content. If the FAQ directly addresses the question, provide the answer from the FAQ.
If the answer is not in the FAQ, use your general knowledge to provide a helpful and relevant response.
Strive to be informative and engaging.

FAQ Content:
---
${faqContent}
---

User Question:
${question}

Your Answer:`;

                // Prepare the payload for the Gemini API
                const payload = {
                    contents: [{ role: "user", parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: 0.7, // Increased temperature for more diverse and "extraordinary" answers
                        maxOutputTokens: 200, // Limit response length
                    },
                };

                // Gemini API endpoint (assuming gemini-2.0-flash model)
                const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`;

                // Make the fetch call to the Gemini API
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`API error: ${response.status} - ${errorData.error.message || 'Unknown error'}`);
                }

                const result = await response.json();

                if (result.candidates && result.candidates.length > 0 &&
                    result.candidates[0].content && result.candidates[0].content.parts &&
                    result.candidates[0].content.parts.length > 0) {
                    botResponseText = result.candidates[0].content.parts[0].text;
                } else {
                    console.warn("Unexpected Gemini API response structure:", result);
                    botResponseText = "I encountered an issue trying to find an answer. Please try again.";
                }
            }

            // Add bot's response to chat history
            setChatHistory(prev => [...prev, { sender: 'Bot', message: botResponseText }]);

        } catch (error) {
            console.error("Error asking question:", error);
            setErrorMessage(`Failed to get bot response: ${error.message}. Check your API key and network connection.`);
            setChatHistory(prev => [...prev, { sender: 'Bot', message: 'I am currently unable to provide an answer due to an error.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
            <div className="bg-gray-800 rounded-2xl shadow-xl p-6 w-full max-w-2xl border border-gray-700">
                <h1 className="text-4xl font-extrabold text-white mb-6 text-center">
                    QuerySage Discord Bot <span className="text-purple-400">🤖</span>
                </h1>

                {!isBotInitialized ? (
                    // Bot Initialization Section
                    <div className="flex flex-col gap-4 mb-6">
                        <p className="text-gray-300 text-center">
                            This is a simulated Discord bot. Paste your FAQ.md content and provide your Gemini API key to test it!
                        </p>
                        <input
                            type="text"
                            placeholder="Discord Bot Token (optional, for display)"
                            className="p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={botToken}
                            onChange={(e) => setBotToken(e.target.value)}
                        />
                        <input
                            type="password" // Use password type for API key for security (even if client-side)
                            placeholder="Your Gemini API Key (Required)"
                            className="p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={geminiApiKey} // Display current key if hardcoded or previously entered
                            onChange={(e) => setGeminiApiKey(e.target.value)}
                        />
                        <textarea
                            placeholder="Paste your FAQ.md content here..."
                            rows="10"
                            className="p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                            value={faqContent}
                            onChange={(e) => setFaqContent(e.target.value)}
                        ></textarea>
                        {errorMessage && <p className="text-red-400 text-center">{errorMessage}</p>}
                        <button
                            onClick={handleInitializeBot}
                            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl transition duration-300 transform hover:scale-105 shadow-lg"
                        >
                            Initialize QuerySage
                        </button>
                    </div>
                ) : (
                    // Chat Interface
                    <div className="flex flex-col h-[500px]">
                        <div className="flex-grow bg-gray-700 rounded-xl p-4 overflow-y-auto mb-4 custom-scrollbar">
                            {chatHistory.map((msg, index) => (
                                <div key={index} className={`mb-2 ${msg.sender === 'User' ? 'text-right' : 'text-left'}`}>
                                    <span className={`inline-block p-2 rounded-lg text-sm max-w-[80%] ${
                                        msg.sender === 'User' ? 'bg-blue-600 text-white ml-auto' : 'bg-gray-600 text-gray-200 mr-auto'
                                    }`}>
                                        <strong>{msg.sender}:</strong> {msg.message}
                                    </span>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="text-center mt-4">
                                    <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-purple-400 motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                                        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
                                    </div>
                                    <p className="text-gray-400 text-sm mt-2">QuerySage is thinking...</p>
                                </div>
                            )}
                        </div>

                        {errorMessage && <p className="text-red-400 text-center mb-4">{errorMessage}</p>}

                        <div className="flex gap-3">
                            <input
                                type="text"
                                placeholder="Ask QuerySage a question..."
                                className="flex-grow p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter' && !isLoading) {
                                        handleAskQuestion(userInput);
                                    }
                                }}
                                disabled={isLoading}
                            />
                            <button
                                onClick={() => handleAskQuestion(userInput)}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition duration-300 transform hover:scale-105 shadow-md"
                                disabled={isLoading}
                            >
                                Ask
                            </button>
                        </div>
                        <button
                            onClick={() => setIsBotInitialized(false)}
                            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-xl mt-4 transition duration-300 shadow-md"
                        >
                            Reset Bot
                        </button>
                    </div>
                )}
            </div>
            {/* Custom scrollbar style, as Tailwind doesn't provide it directly */}
            <style>
                {`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #3b4555;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #888;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #555;
                }
                `}
            </style>
        </div>
    );
};

export default App;
