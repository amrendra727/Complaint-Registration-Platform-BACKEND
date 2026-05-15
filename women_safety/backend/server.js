const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs-extra');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
// Serve the frontend folder as requested
app.use(express.static(path.join(__dirname, '../frontend')));

const DATA_FILE = path.join(__dirname, 'data', 'alerts.json');

async function readAlerts() {
    try {
        return await fs.readJson(DATA_FILE);
    } catch {
        return [];
    }
}

async function saveAlerts(alerts) {
    await fs.outputJson(DATA_FILE, alerts, { spaces: 2 });
}

app.post('/api/sos', async (req, res) => {
    try {
        // Updated to accept the data coming from your frontend (user_name, lat, lng)
        // alongside the new fields you requested.
        const { name, user_name, phone, latitude, lat, longitude, lng, message } = req.body;

        const alerts = await readAlerts();

        const newAlert = {
            id: Date.now(),
            name: name || user_name || 'Distressed User',
            phone: phone || 'Unknown',
            latitude: latitude || lat,
            longitude: longitude || lng,
            message: message || '',
            status: 'ACTIVE',
            time: new Date().toISOString()
        };

        alerts.unshift(newAlert);
        await saveAlerts(alerts);

        console.log('🚨 NEW SOS ALERT:', newAlert);

        res.json({
            success: true,
            alert: newAlert
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
});

app.get('/api/alerts', async (req, res) => {
    const alerts = await readAlerts();
    res.json(alerts.filter(a => a.status === 'ACTIVE'));
});

app.get('/api/alerts/history', async (req, res) => {
    const alerts = await readAlerts();
    res.json(alerts);
});

app.delete('/api/alerts/:id', async (req, res) => {
    try {
        const idToRemove = parseInt(req.params.id);
        let alerts = await readAlerts();
        const alertIndex = alerts.findIndex(a => a.id === idToRemove);
        if (alertIndex !== -1) {
            alerts[alertIndex].status = 'RESOLVED';
            alerts[alertIndex].resolvedAt = new Date().toISOString();
            await saveAlerts(alerts);
        }
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
});

app.post('/api/ai-analyze', async (req, res) => {
    const { message } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
        return res.status(500).json({ reply: 'AI is not configured. Please add GEMINI_API_KEY to backend/.env' });
    }

    try {
        // dynamic import for node fetch if needed, but since Node 18+ has fetch natively, we can just use fetch
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `You are a Women Safety AI Assistant. Provide short, practical, and highly actionable safety advice for this message: "${message}". Keep the response under 3 sentences.`
                        }]
                    }]
                })
            }
        );

        const data = await response.json();
        if (data.error) throw new Error(data.error.message);
        
        const aiReply = data.candidates[0].content.parts[0].text;
        res.json({ reply: aiReply });
    } catch (err) {
        console.error('AI Analyze Error:', err);
        res.status(500).json({ reply: 'I am experiencing a network issue. Please call emergency services directly if you are in danger.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
