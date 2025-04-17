const express = require('express');
const { synthesizeSpeech } = require('./tts');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

app.post('/api/speak', async (req, res) => {
  const { text, voice } = req.body;
  if (!text || !voice) return res.status(400).send('Missing text or voice');

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
