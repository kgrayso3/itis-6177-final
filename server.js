const express = require('express');
const { synthesizeSpeech } = require('./tts');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

app.post('/api/speak', async (req, res) => {
  const { text, voice } = req.body;

  if (!text || !voice) return res.status(400).send('Missing text or voice');

  if (typeof text !== 'string' || text.trim().length === 0 || text.length > 100) {
    return res.status(400).send('Invalid or too long text input (max 100 characters).');
  }

  if (/[<>]/.test(text)) {
    return res.status(400).send('Text contains forbidden characters like < or >.');
  }

  const allowedVoices = [
    'en-US-JennyNeural', 'en-US-GuyNeural',
    'en-GB-LibbyNeural', 'en-GB-RyanNeural',
    'es-ES-ElviraNeural', 'es-ES-AlvaroNeural',
    'ja-JP-NanamiNeural', 'ja-JP-KeitaNeural'
  ];

  if (!allowedVoices.includes(voice)) {
    return res.status(400).send('Unsupported voice selection.');
  }

  try {
    const audioBuffer = await synthesizeSpeech(text, voice);
    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Disposition': 'inline; filename="speech.mp3"',
    });
    res.send(audioBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).send('Text-to-speech error');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
