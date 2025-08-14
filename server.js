import { generateText } from "ai";
import { openai } from "@ai-sdk/openai"

generateText({

    model: openai("gpt-4"),
    prompt: "What is the capital of France?",

}).then((result) => console.log(result.text))
.catch(console.error);

