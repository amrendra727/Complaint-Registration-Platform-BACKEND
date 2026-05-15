const express = require('express');
const cors = require('cors');
const fs = require('fs-extra');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_FILE = path.join(__dirname, 'data', 'alerts.json');

app.use(cors());
app.use(express.json());

// Serve static frontend files from the root frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

async function readAlerts() {
    try {
        if (!await fs.pathExists(DATA_FILE)) return [];
        return await fs.readJson(DATA_FILE);
    } catch (err) {
        return [];
    }
}

async function saveAlerts(alerts) {
    await fs.outputJson(DATA_FILE, alerts, { spaces: 2 });
}

app.post('/api/sos', async (req, res) => {
    try {
        const { name, phone, latitude, longitude, message } = req.body;
        const alerts = await readAlerts();
        const newAlert = {
            id: Date.now(),
            name: name || 'Distressed User',
            phone: phone || 'Unknown',
            latitude,
            longitude,
            message,
            status: 'ACTIVE',
            time: new Date().toISOString()
        };
        alerts.unshift(newAlert);
        await saveAlerts(alerts);
        console.log('🚨 NEW SOS ALERT:', newAlert);
        res.json({ success: true, alert: newAlert });
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
    res.json({ 
        analysis: "Please stay calm. Police has been notified of your location. Stay in a well-lit area if possible.",
        safety_score: 85
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
