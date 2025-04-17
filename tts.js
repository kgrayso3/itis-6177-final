const axios = require('axios');
require('dotenv').config();

const subscriptionKey = process.env.AZURE_SPEECH_KEY;
const region = 'eastus'; 

async function getToken() {
  try {
    const response = await axios.post(
      `https://${region}.api.cognitive.microsoft.com/sts/v1.0/issueToken`,
      null,
      {
        headers: {
          'Ocp-Apim-Subscription-Key': subscriptionKey,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching token:', error.response?.data || error.message);
    throw error;
  }
}

async function synthesizeSpeech(text, voiceName) {
  try {
    const token = await getToken();
    console.log('Access token acquired.');

    const ssml = `
      <speak version='1.0' xml:lang='en-US'>
        <voice name='${voiceName}'>
          ${text}
        </voice>
      </speak>
    `;

    const response = await axios.post(
      `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`,
      ssml,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/ssml+xml',
          'X-Microsoft-OutputFormat': 'audio-16khz-32kbitrate-mono-mp3',
          'User-Agent': 'azure-tts-node-client',
        },
        responseType: 'arraybuffer',
      }
    );

    return response.data; 

    /* fs.writeFileSync('output.mp3', response.data);
    console.log('🎉 Speech synthesized and saved as output.mp3'); */
    
  } catch (error) {
    console.error('Error synthesizing speech:', error.response?.data || error.message);
  }
}

module.exports = { synthesizeSpeech };
