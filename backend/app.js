require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Initialize Supabase REST client (no database password needed!)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const createBeautifulPage = (title, message, emoji) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" rel="stylesheet">
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: 'Inter', sans-serif;
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #333;
    }
    .card {
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(10px);
      padding: 3rem 4rem;
      border-radius: 20px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.2);
      text-align: center;
      transform: translateY(0);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .card:hover {
      transform: translateY(-5px);
      box-shadow: 0 25px 50px rgba(0,0,0,0.3);
    }
    h1 {
      margin: 0;
      font-size: 3rem;
      font-weight: 800;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 1rem;
    }
    p {
      font-size: 1.2rem;
      color: #666;
      margin: 0;
      font-weight: 400;
    }
    .emoji {
      font-size: 4rem;
      margin-bottom: 1rem;
      display: inline-block;
      animation: float 3s ease-in-out infinite;
    }
    @keyframes float {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-15px); }
      100% { transform: translateY(0px); }
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="emoji">${emoji}</div>
    <h1>${title}</h1>
    <p>${message}</p>
  </div>
</body>
</html>
`;

app.get('/', (req, res) => {
  res.send(createBeautifulPage('App Page', 'Welcome to the main application page.', '🚀'));
});

const createColorfulHelloPage = () => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hello Page</title>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@700;900&display=swap" rel="stylesheet">
  <style>
    body {
      margin: 0;
      padding: 0;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-family: 'Outfit', sans-serif;
      background: linear-gradient(45deg, #ff0055, #00eeff, #ffea00, #ff00e6);
      background-size: 400% 400%;
      animation: gradientBG 10s ease infinite;
      overflow: hidden;
    }
    @keyframes gradientBG {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    .neon-text {
      font-size: 6rem;
      font-weight: 900;
      color: #fff;
      text-transform: uppercase;
      text-shadow: 
        0 0 10px rgba(255, 255, 255, 0.8),
        0 0 20px rgba(255, 0, 85, 0.8),
        0 0 30px rgba(255, 0, 85, 0.8),
        0 0 40px rgba(0, 238, 255, 0.8),
        0 0 70px rgba(0, 238, 255, 0.8);
      animation: pulse 2s infinite alternate;
      text-align: center;
      margin: 0;
    }
    .subtitle {
      font-size: 2rem;
      color: #fff;
      margin-top: 10px;
      font-weight: 700;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
      animation: slideUp 1s ease-out;
    }
    .circles {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      z-index: -1;
      margin: 0;
      padding: 0;
    }
    .circles li {
      position: absolute;
      display: block;
      list-style: none;
      width: 20px;
      height: 20px;
      background: rgba(255, 255, 255, 0.2);
      animation: animate 25s linear infinite;
      bottom: -150px;
      border-radius: 50%;
    }
    .circles li:nth-child(1) { left: 25%; width: 80px; height: 80px; animation-delay: 0s; }
    .circles li:nth-child(2) { left: 10%; width: 20px; height: 20px; animation-delay: 2s; animation-duration: 12s; }
    .circles li:nth-child(3) { left: 70%; width: 20px; height: 20px; animation-delay: 4s; }
    .circles li:nth-child(4) { left: 40%; width: 60px; height: 60px; animation-delay: 0s; animation-duration: 18s; }
    .circles li:nth-child(5) { left: 65%; width: 20px; height: 20px; animation-delay: 0s; }
    .circles li:nth-child(6) { left: 75%; width: 110px; height: 110px; animation-delay: 3s; }
    .circles li:nth-child(7) { left: 35%; width: 150px; height: 150px; animation-delay: 7s; }
    .circles li:nth-child(8) { left: 50%; width: 25px; height: 25px; animation-delay: 15s; animation-duration: 45s; }
    .circles li:nth-child(9) { left: 20%; width: 15px; height: 15px; animation-delay: 2s; animation-duration: 35s; }
    .circles li:nth-child(10) { left: 85%; width: 150px; height: 150px; animation-delay: 0s; animation-duration: 11s; }
    @keyframes animate {
      0% { transform: translateY(0) rotate(0deg); opacity: 1; border-radius: 0; }
      100% { transform: translateY(-1000px) rotate(720deg); opacity: 0; border-radius: 50%; }
    }
    @keyframes pulse {
      0% { transform: scale(1); }
      100% { transform: scale(1.05); }
    }
    @keyframes slideUp {
      0% { transform: translateY(50px); opacity: 0; }
      100% { transform: translateY(0); opacity: 1; }
    }
  </style>
</head>
<body>
  <ul class="circles">
    <li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li>
  </ul>
  <h1 class="neon-text">HELLO! ✨</h1>
  <div class="subtitle">A vibrant and colorful experience</div>
</body>
</html>
`;

app.get('/hello', (req, res) => {
  res.send(createColorfulHelloPage());
});

app.post('/api/generate-question', async (req, res) => {
  const { complaintText } = req.body;

  if (!complaintText) {
    return res.status(400).json({ error: 'Complaint text is required.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    return res.status(500).json({ error: 'AI features are not configured on the server. Please check the API key.' });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `User complaint: ${complaintText}. Ask one short and relevant follow-up question.`
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    if (!data.candidates || data.candidates.length === 0) {
      return res.status(500).json({ error: 'No response from AI.' });
    }

    const question = data.candidates[0].content.parts[0].text;
    res.json({ question });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: 'Error generating question.' });
  }
});

app.post('/api/complaints', async (req, res) => {
  const { name, city, mobile, complaint, ai_question, ai_answer } = req.body;
  if (!name || !city || !mobile || !complaint) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const { data, error } = await supabase
      .from('complaints')
      .insert([{
        name,
        city,
        mobile,
        complaint,
        ai_question: ai_question || null,
        ai_answer: ai_answer || null
      }])
      .select();

    if (error) throw error;

    res.status(201).json({ message: 'Complaint registered successfully!', complaint: data[0] });
  } catch (err) {
    console.error('Database insertion error:', err);
    res.status(500).json({ error: 'Database error. Please try again later.' });
  }
});

app.get('/api/complaints', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('complaints')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error('Database fetching error:', err);
    res.status(500).json({ error: 'Database error. Please try again later.' });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});