import axios from 'axios';


const apiUrl = 'https://api.openai.com/v1/chat/completions';
// const url = 'https://chatgpt-42.p.rapidapi.com/conversationgpt4'
// const apiKey = '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';
const apiKey = "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";


export const sendBotRequest = (query) => {

    const requestData = {
        model: 'gpt-3.5-turbo',
        messages: [
            { role: 'user', content: query },
        ],
        temperature: 0.7,
    };

    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
        }
    }

    return axios.post(apiUrl, requestData, config);

}








