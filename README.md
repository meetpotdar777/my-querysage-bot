QuerySage Discord Bot 🤖
This project implements a simulated Discord bot, QuerySage, built using React and powered by the Gemini API. Its primary function is to answer user questions based on a provided FAQ.md file. This application simulates the bot's core logic within a web browser, allowing for easy testing and interaction without needing a live Discord connection.

Features ✨
FAQ-Based Answers: QuerySage uses content from your FAQ.md file to answer user queries.

Gemini API Integration: Leverages Google's Gemini API for powerful natural language processing.

Conversational Responses: Includes basic, pre-programmed responses for common greetings to enhance user experience.

Local Simulation: Runs entirely in your browser, simplifying development and testing.

API Key and FAQ Input: Provides a user-friendly interface to input your Gemini API key and paste your FAQ content.

Getting Started with Create React App 🚀
This project was bootstrapped with Create React App.

Available Scripts
In the project directory, you can run:

npm start
Runs the app in the development mode.
Open http://localhost:3000 to view it in your browser.

The page will reload when you make changes.
You may also see any lint errors in the console.

npm test
Launches the test runner in the interactive watch mode.
See the section about running tests for more information.

npm run build
Builds the app for production to the build folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.
Your app is ready to be deployed!

See the section about deployment for more information.

npm run eject
Note: this is a one-way operation. Once you eject, you can't go back!

If you aren't satisfied with the build tool and configuration choices, you can eject at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except eject will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use eject. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

How to Use QuerySage (in Simulation) 👇
Run the application: Use npm start (or your preferred method for a React app) to launch the simulation in your browser.

Provide your Gemini API Key: You'll see an input field for "Your Gemini API Key (Required)". Enter your key here. For security reasons, avoid hardcoding your API key directly into the App.js file for production deployments.

Paste your FAQ.md content: In the large text area, paste the complete content of your Frequently Asked Questions Markdown file.

Initialize the bot: Click the "Initialize QuerySage" button.

Start asking questions! Once initialized, type your questions into the chat input field. QuerySage will attempt to answer them using your provided FAQ content or its general knowledge (if the FAQ doesn't have a direct answer), based on the configured prompt.

Learn More 📚
You can learn more in the Create React App documentation.

To learn React, check out the React documentation.

Code Splitting
This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

Analyzing the Bundle Size
This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

Making a Progressive Web App
This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

Advanced Configuration
This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

Deployment
This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

npm run build fails to minify
This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify