import axios from 'axios';


const apiUrl = 'https://api.openai.com/v1/chat/completions';
const url = 'https://chatgpt-42.p.rapidapi.com/conversationgpt4'
const apiKey = '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';

export const sendBotRequest = (query) => {

    const requestData = {
        // model: 'gpt-3.5-turbo',
        messages: [
            { role: 'user', content: query },
        ],
        // temperature: 0.7,
        system_prompt: "",
        temperature: 0.9,
        top_k: 5,
        top_p: 0.9,
        max_tokens: 256,
        web_access: false
    };

    const config = {
        headers: {
            // Authorization: `Bearer ${apiKey}`,
            "X-RapidAPI-Key": "b865073daemshf674c74c7a23a93a1cp19e6f1jsnf23ac36a8ac7",
            "X-RapidAPI-Host": "chatgpt-42.p.rapidapi.com"
        }
    }

    return axios.post(apiUrl, requestData, config);

}








