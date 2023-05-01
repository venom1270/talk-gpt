import { json } from "@sveltejs/kit";
import { Configuration, OpenAIApi, CreateChatCompletionRequest, ChatCompletionRequestMessageRoleEnum } from "openai";
import { OPENAI_API_KEY } from '$env/static/private'

const configuration = new Configuration({
    apiKey: OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {

    const { prompt, language } = await request.json();
   
    console.log("Got prompt: " + prompt);

    let data;

    let systemPrompt: string = "";
    if (language === "en") {
        systemPrompt = "You are a friendly chatbot. Respond with maximum 20 words.";
    } else {
        systemPrompt = "Si prijazen za pogovarjanje. Odgovore omeji na 20 besed.";
    }
     

    console.log("System prompt: " + systemPrompt);

    const chatGptMessages = [
        {
                role: ChatCompletionRequestMessageRoleEnum.System,
                content: systemPrompt,
        },
         {
          role: ChatCompletionRequestMessageRoleEnum.User,
          content: prompt,
        }
      ]
    let openAiRequest: CreateChatCompletionRequest = {
        messages: chatGptMessages,
        model: 'gpt-3.5-turbo',
        max_tokens: 250,
        temperature: 0.5
    }

    try {
        data = await openai.createChatCompletion(openAiRequest)
    } catch (error) {
        /*if (error.response) {
            console.log(error.response.status);
            console.log(error.response.data);
        } else {
            console.log(error.message);
        }*/
        return json(error);
    }

    //console.log(data);
  
    if (data === undefined) {
      data = null;
    }

    return json(data?.data);

}