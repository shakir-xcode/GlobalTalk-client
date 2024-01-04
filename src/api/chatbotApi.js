import axios from 'axios';


const apiUrl = 'https://api.openai.com/v1/chat/completions';
const apiKey = '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';

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
            Authorization: `Bearer ${apiKey}`,
        }
    }

    return axios.post(apiUrl, requestData, config);

}








