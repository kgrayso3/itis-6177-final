# ITIS 6177 Final Project: Azure Text-to-Speech API Documentation 

This API acts as a middleware service that accepts plain text input and returns synthesized speech audio using the Azure Cognitive Services Text-to-Speech API.

## Endpoint

### `POST http://64.225.10.109:3000/api/speak`

Convert a text string into an MP3 audio stream using a specified Azure neural voice.

---

## Request

### Headers

- `Content-Type: application/json`

### Body Parameters

| Field | Type   | Required | Description                                          |
| ----- | ------ | -------- | ---------------------------------------------------- |
| text  | string | Yes      | The message to synthesize into speech.               |
| voice | string | Yes      | The Azure Neural voice  to use for speech synthesis. |

### Example Request

```json
{
  "text": "This is a test.",
  "voice": "en-US-JennyNeural"
}
```

---

## Response

### Success

- **Status Code:** `200 OK`
- **Content-Type:** `audio/mpeg`
- **Body:** Binary MP3 stream of the spoken text.

### Error Responses

- `400 Bad Request` – Input is missing, too long, or invalid. *Specific error message examples shown below.* 
- `500 Internal Server Error` – An error occurred during speech synthesis.

---

## Validation Rules

All input is sanitized based on the following rules:

### Text

- Required (empty strings are not accepted) 
- Maximum of 100 characters (to allow for multiple tests without concern of hitting the Azure API free tier limits).
- Must not contain `<` or `>` characters.
- Supported languages include English (US), English (UK), Spanish (Spain), and Japanese. 
  - Male and female voices are provided for each supported language. Choose the voice that aligns with your language text. 

### Voice

- Required.
- Must match one of the following allowed voices:
  - `en-US-JennyNeural`
  - `en-US-GuyNeural`
  - `en-GB-LibbyNeural`
  - `en-GB-RyanNeural`
  - `es-ES-ElviraNeural`
  - `es-ES-AlvaroNeural`
  - `ja-JP-NanamiNeural`
  - `ja-JP-KeitaNeural`

---

## Example Errors

### Invalid Voice

```json
{
  "error": "Unsupported voice selection."
}
```

### Forbidden Characters in Text

```json
{
  "error": "Text contains forbidden characters like < or >."
}
```

### Text Too Long or Missing

```json
{
  "error": "Invalid or too long text input (max 1000 characters)."
}
```

---

## Testing With Postman

1. Set request type to `POST`
2. URL: `http://64.225.10.109:3000/api/speak`
3. Headers:
   - `Content-Type: application/json`
4. Body (raw, JSON):

```json
{
  "text": "Hello world!",
  "voice": "en-US-GuyNeural"
}
```

5. Click "Send". If valid, the response will be an audio stream in MP3 format.

## Testing with the Browser UI 

1. Visit `http://64.225.10.109:3000/` in your browser of choice 
2. Select your language and voice from the dropdowns 
3. Type your text into the text box (keeping in mind that it must be 100 characters or less). 
4. Click the "Speak" button. 
5. If valid, the audio file will load in the player below. 
