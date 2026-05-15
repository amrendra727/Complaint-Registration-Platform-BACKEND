const sosBtn = document.getElementById('sosBtn');
const alertsContainer = document.getElementById('alertsContainer');

async function sendSOS(latitude, longitude) {

    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const message = document.getElementById('message').value;

    const response = await fetch('http://localhost:3001/api/sos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name,
            phone,
            latitude,
            longitude,
            message
        })
    });

    const data = await response.json();

    if (data.success) {
        alert('🚨 SOS Sent Successfully');
        loadAlerts();
    }
}

sosBtn.addEventListener('click', () => {

    if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                sendSOS(latitude, longitude);
            },
            () => {
                alert('Location Permission Required');
            }
        );

    } else {
        alert('Geolocation not supported');
    }
});

async function loadAlerts() {
    try {
        const response = await fetch('http://localhost:3001/api/alerts');
        const alerts = await response.json();
        
        alertsContainer.innerHTML = '';
        
        alerts.forEach(alert => {
            const alertDiv = document.createElement('div');
            alertDiv.className = 'alert-box';
            alertDiv.innerHTML = `
                <p><strong>Name:</strong> ${alert.name || 'Unknown'}</p>
                <p><strong>Phone:</strong> ${alert.phone || 'N/A'}</p>
                <p><strong>Message:</strong> ${alert.message || 'No message provided'}</p>
                <p><strong>Time:</strong> ${new Date(alert.time).toLocaleString()}</p>
                <p><a href="https://www.google.com/maps/search/?api=1&query=${alert.latitude},${alert.longitude}" target="_blank" class="map-link">📍 View on Map</a></p>
            `;
            alertsContainer.appendChild(alertDiv);
        });
    } catch (error) {
        console.error("Failed to load alerts", error);
    }
}

// Initial load and polling every 5 seconds
loadAlerts();
setInterval(loadAlerts, 5000);
