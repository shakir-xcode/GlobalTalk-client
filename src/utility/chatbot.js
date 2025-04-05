/*
import axios from 'axios';

const API_KEY = 'AIzaSyBWtAvINW3sBk5TViemGmdZ0NwfekyecAA'
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;


export const sendQuery = (query = "Explain how AI works in a few words") => {
const data = {
  contents: [
    {
      parts: [
        {
          text: query
        }
      ]
    }
  ]
};

const headers = {
  'Content-Type': 'application/json'
};


axios.post(url, data, { headers })
  .then(response => {
    console.log('Response:', response.data.candidates[0].content.parts[0].text);
  })
  .catch(error => {
    console.error('Error:', error.response?.data || error.message);
  });

}


*/


export async function sendQuery(query) {
const API_KEY = 'AIzaSyBWtAvINW3sBk5TViemGmdZ0NwfekyecAA'
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: query
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const res = await response.json();
    console.log(res.candidates[0].content.parts[0].text);
	
    return res;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

