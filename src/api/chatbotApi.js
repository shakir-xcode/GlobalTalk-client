import axios from 'axios';
import { baseURI } from './appApi';

export const sendBotRequest = (query) => {
    const gptUri = baseURI + '/message/gptCall';
    return axios.post(gptUri, { query });

}








