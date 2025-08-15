import { streamText } from "ai";
import { openai } from "@ai-sdk/openai"

import readline from 'node:readline'
import { resourceLimits } from "node:worker_threads";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const messages = [
    {
        role: "system",
        content: "You are a helpful assistant."
    }
];

// This async function will handle the chat logic in a loop.
async function chat() {
    // 1. Ask the user for prompt input.
    rl.question('You: ', async (userInput) => {
        // ceck if the user wants to exit.
        if (userInput.toLowerCase() === 'exit' || userInput.toLowerCase() === 'quit'){
            console.log('Exiting chat. Goodbye!');
            rl.close();
            return;
        }
        
        // 2. Add the user message to the history
        messages.push({ role: "user", content: userInput });

        // 3. Call the AI model with the updated messages
        try {
            // 3. Call the AI with the entire conversation history
            const result = await streamText({
                model: openai('gpt-4'),
                messages,
            });

            // 4. Stream the AI response to the console
            process.stdout.write('Agent: ');
            let agentResponse = '';
            for await (const textPart of result.textStream) {
                process.stdout.write(textPart);
                agentResponse += textPart;
            }

            // 5. Add the AI response to the message history
            messages.push({ role: "assistant", content: agentResponse });
            console.log('\n'); // New line after the AI response

        } catch (error) { 
            console.error('Error during AI response:', error);
            messages.push({ role: "assistant", content: "Sorry, I encountered an error." });
        }

            // 6. Ask the next question
            chat(); // Call chat again to continue the conversation 

    });
}

console.log('Ai Chatbot started. Type "exit" or "quit" to end the chat.');
chat();