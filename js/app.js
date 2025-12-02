/* ============================================
   ShoreSquad - Main Application
   ============================================ */

// ---- APP STATE ----
const AppState = {
    currentView: 'map',
    userLocation: null,
    map: null,
    events: [],
    crew: [],
    currentUser: {
        id: 'user_' + Date.now(),
        name: 'Shore Explorer',
        bio: 'Beach cleanup enthusiast',
        avatar: '🏄',
        joinedDate: new Date(),
        stats: {
            cleanupsJoined: 0,
            totalImpact: 0,
            streak: 0
        }
    },
    settings: {
        notificationsEnabled: true,
        shareLocation: true
    }
};

// ---- INITIALIZATION ----
document.addEventListener('DOMContentLoaded', () => {
    console.log('🌊 ShoreSquad Loading...');
    
    initializeApp();
    loadPersistedData();
    setupEventListeners();
    setupNotifications();
    
    console.log('✅ ShoreSquad Ready!');
});

function initializeApp() {
    // Initialize map
    initializeMap();
    
    // Set default date to today
    const now = new Date();
    document.getElementById('event-date').value = now.toISOString().slice(0, 16);
    
    // Load initial data
    fetchWeather();
    loadEventsFromStorage();
    displayProfileData();
}

// ---- MAP INITIALIZATION ----
function initializeMap() {
    // Initialize Leaflet map
    AppState.map = L.map('map').setView([34.0195, -118.4912], 13); // Default: Santa Monica
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors',
        className: 'map-tiles'
    }).addTo(AppState.map);
    
    // Add custom markers for demo events
    addDemoMarkers();
    
    // Handle map clicks for geolocation
    AppState.map.on('click', (e) => {
        console.log('Map clicked:', e.latlng);
    });
}

function addDemoMarkers() {
    const demoEvents = [
        {
            name: 'Marina Beach Cleanup',
            lat: 34.0195,
            lng: -118.4912,
            participants: 12,
            date: 'Today 2:00 PM'
        },
        {
            name: 'Malibu Shoreline Sweep',
            lat: 34.0294,
            lng: -118.6835,
            participants: 8,
            date: 'Tomorrow 10:00 AM'
        },
        {
            name: 'Venice Beach Cleanup Squad',
            lat: 33.9850,
            lng: -118.4695,
            participants: 15,
            date: 'Dec 2, 3:00 PM'
        }
    ];
    
    demoEvents.forEach(event => {
        const marker = L.marker([event.lat, event.lng], {
            icon: L.divIcon({
                className: 'event-marker',
                html: '🌊',
                iconSize: [32, 32]
            })
        }).addTo(AppState.map);
        
        marker.bindPopup(`
            <div style="padding: 10px;">
                <strong>${event.name}</strong><br/>
                👥 ${event.participants} joining<br/>
                📅 ${event.date}
            </div>
        `);
    });
}

// ---- GEOLOCATION ----
function getUserLocation() {
    if (!navigator.geolocation) {
        showNotification('Geolocation not supported', 'error');
        return;
    }
    
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            AppState.userLocation = { lat: latitude, lng: longitude };
            
            // Center map on user
            AppState.map.setView([latitude, longitude], 14);
            
            // Add user marker
            L.marker([latitude, longitude], {
                icon: L.divIcon({
                    className: 'user-marker',
                    html: '📍',
                    iconSize: [40, 40]
                })
            }).addTo(AppState.map).bindPopup('Your Location');
            
            showNotification('Location found! 📍', 'success');
        },
        (error) => {
            console.error('Geolocation error:', error);
            showNotification('Could not access location', 'error');
        }
    );
}

// ---- WEATHER ----
async function fetchWeather() {
    try {
        // Fetch 4-day weather forecast from NEA API
        const forecastUrl = 'https://api.data.gov.sg/v1/environment/4-day-weather-forecast';
        
        const response = await fetch(forecastUrl);
        const data = await response.json();
        
        if (data.items && data.items.length > 0) {
            const forecastData = data.items[0];
            displayForecast(forecastData);
            
            // Update header with current conditions (use first day forecast)
            if (forecastData.forecasts && forecastData.forecasts.length > 0) {
                const today = forecastData.forecasts[0];
                displayWeatherData({
                    temp: Math.round((today.temperature.low + today.temperature.high) / 2),
                    condition: today.forecast,
                    icon: getWeatherIcon(today.forecast),
                    humidity: (today.relative_humidity.low + today.relative_humidity.high) / 2,
                    windSpeed: (today.wind.speed.low + today.wind.speed.high) / 2
                });
            }
        }
    } catch (error) {
        console.error('Weather fetch error:', error);
        // Fallback to mock data
        displayWeatherData({
            temp: 22,
            condition: 'Sunny',
            icon: '☀️',
            humidity: 65,
            windSpeed: 3.6
        });
    }
}

function displayForecast(forecastData) {
    const container = document.getElementById('forecast-container');
    container.innerHTML = '';
    
    if (!forecastData.forecasts) return;
    
    forecastData.forecasts.forEach((day, index) => {
        const date = new Date(day.date);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        const card = document.createElement('div');
        card.className = 'forecast-card';
        card.innerHTML = `
            <div class="forecast-date">${dayName}</div>
            <div class="forecast-date" style="font-size: 0.8rem; color: #999;">${dateStr}</div>
            <div class="forecast-icon">${getWeatherIcon(day.forecast)}</div>
            <div class="forecast-condition">${day.forecast}</div>
            <div class="forecast-temps">
                <span class="temp-low">${day.temperature.low}°C</span>
                <span class="temp-high">${day.temperature.high}°C</span>
            </div>
            <div class="forecast-details">
                <span class="humidity">💧 ${Math.round((day.relative_humidity.low + day.relative_humidity.high) / 2)}%</span>
                <span class="wind">💨 ${Math.round((day.wind.speed.low + day.wind.speed.high) / 2)} m/s</span>
            </div>
        `;
        container.appendChild(card);
    });
    
    // Update last modified timestamp
    if (forecastData.update_timestamp) {
        const updateTime = new Date(forecastData.update_timestamp);
        const timeStr = updateTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        document.getElementById('forecast-update').textContent = `Last updated: ${timeStr}`;
    }
}

function getWeatherIcon(condition) {
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes('thundery') || conditionLower.includes('thunder')) return '⛈️';
    if (conditionLower.includes('shower') || conditionLower.includes('rain')) return '🌧️';
    if (conditionLower.includes('cloud') || conditionLower.includes('cloudy')) return '☁️';
    if (conditionLower.includes('sunny') || conditionLower.includes('sun')) return '☀️';
    if (conditionLower.includes('clear')) return '🌤️';
    if (conditionLower.includes('wind')) return '💨';
    if (conditionLower.includes('haze')) return '😶';
    return '🌥️';
}

function displayWeatherData(weather) {
    document.getElementById('weather-temp').textContent = `${Math.round(weather.temp)}°C`;
    document.getElementById('weather-condition').textContent = weather.condition;
    document.getElementById('weather-icon').textContent = weather.icon;
}

// ---- NAVIGATION ----
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const viewName = e.currentTarget.dataset.view;
        switchView(viewName);
    });
});

function switchView(viewName) {
    // Update active button
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-view="${viewName}"]`).classList.add('active');
    
    // Hide all views
    document.querySelectorAll('.view').forEach(view => view.classList.remove('active'));
    
    // Show target view
    const viewElement = document.getElementById(`${viewName}-view`);
    if (viewElement) {
        viewElement.classList.add('active');
        AppState.currentView = viewName;
        
        // Handle view-specific initialization
        if (viewName === 'map' && AppState.map) {
            setTimeout(() => AppState.map.invalidateSize(), 100);
        }
    }
}

// ---- MAP CONTROLS ----
document.getElementById('locate-btn').addEventListener('click', getUserLocation);

document.getElementById('create-event-btn').addEventListener('click', () => {
    document.getElementById('event-modal').classList.remove('hidden');
});

// ---- NEXT CLEANUP BUTTON ----
document.getElementById('join-next-cleanup-btn').addEventListener('click', () => {
    const nextCleanupEvent = {
        id: 'event_pasir_ris_' + Date.now(),
        name: 'Pasir Ris Beach Cleanup',
        location: 'Pasir Ris - Street View Asia',
        coordinates: { lat: 1.381497, lng: 103.955574 },
        description: 'Join us for a beach cleanup at Pasir Ris! Help keep our beaches clean and beautiful.',
        participants: [AppState.currentUser.id],
        createdBy: AppState.currentUser.id,
        createdAt: new Date().toISOString(),
        featured: true
    };
    
    // Check if user is already participating
    const alreadyJoined = AppState.events.some(e => e.id === nextCleanupEvent.id && e.participants.includes(AppState.currentUser.id));
    
    if (alreadyJoined) {
        showNotification('✅ You\'re already joined for this cleanup!', 'info');
    } else {
        AppState.events.push(nextCleanupEvent);
        saveEventsToStorage();
        showNotification('🌊 You\'ve joined the Pasir Ris cleanup! See you there! 🎉', 'success');
    }
});

// ---- EVENT MODAL ----
document.getElementById('event-cancel').addEventListener('click', () => {
    document.getElementById('event-modal').classList.add('hidden');
    document.getElementById('event-form').reset();
});

document.querySelector('.modal-close').addEventListener('click', () => {
    document.getElementById('event-modal').classList.add('hidden');
});

document.getElementById('event-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const event = {
        id: 'event_' + Date.now(),
        name: document.getElementById('event-name').value,
        date: document.getElementById('event-date').value,
        location: document.getElementById('event-location').value,
        description: document.getElementById('event-description').value,
        maxPeople: parseInt(document.getElementById('event-max-people').value),
        participants: [AppState.currentUser.id],
        createdBy: AppState.currentUser.id,
        createdAt: new Date().toISOString()
    };
    
    AppState.events.push(event);
    saveEventsToStorage();
    
    showNotification(`🎉 Event "${event.name}" created!`, 'success');
    document.getElementById('event-modal').classList.add('hidden');
    document.getElementById('event-form').reset();
});

// ---- CREW MANAGEMENT ----
document.getElementById('invite-crew-btn').addEventListener('click', () => {
    const email = prompt('Enter email to invite:');
    if (email) {
        AppState.crew.push({
            id: 'crew_' + Date.now(),
            email: email,
            joinedAt: new Date(),
            status: 'pending'
        });
        saveCrew();
        showNotification(`📬 Invite sent to ${email}!`, 'success');
        displayCrew();
    }
});

function displayCrew() {
    const crewList = document.getElementById('crew-list');
    
    if (AppState.crew.length === 0) {
        crewList.innerHTML = '<p class="placeholder">No crew members yet. Start your squad!</p>';
        return;
    }
    
    crewList.innerHTML = AppState.crew.map(member => `
        <div class="crew-member">
            <div class="crew-avatar">👤</div>
            <div class="crew-name">${member.email.split('@')[0]}</div>
            <div class="crew-role">${member.status}</div>
        </div>
    `).join('');
}

// ---- PROFILE ----
function displayProfileData() {
    document.getElementById('profile-name').textContent = AppState.currentUser.name;
    document.getElementById('profile-bio').textContent = AppState.currentUser.bio;
    document.getElementById('profile-avatar').textContent = AppState.currentUser.avatar;
    
    // Update stats
    document.getElementById('cleanup-count').textContent = AppState.currentUser.stats.cleanupsJoined;
    document.getElementById('impact-count').textContent = AppState.currentUser.stats.totalImpact + ' kg';
    document.getElementById('streak-count').textContent = AppState.currentUser.stats.streak + ' days';
}

document.getElementById('notifications-toggle').addEventListener('change', (e) => {
    AppState.settings.notificationsEnabled = e.target.checked;
    saveSettings();
    showNotification(
        `🔔 Notifications ${e.target.checked ? 'enabled' : 'disabled'}`,
        'info'
    );
});

document.getElementById('location-toggle').addEventListener('change', (e) => {
    AppState.settings.shareLocation = e.target.checked;
    saveSettings();
});

document.getElementById('export-data-btn').addEventListener('click', () => {
    const data = {
        user: AppState.currentUser,
        events: AppState.events,
        crew: AppState.crew,
        settings: AppState.settings
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'shoresquad-data.json';
    link.click();
    
    showNotification('📥 Data exported!', 'success');
});

// ---- NOTIFICATIONS ----
function setupNotifications() {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
}

function showNotification(message, type = 'info') {
    const container = document.getElementById('notification-container');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.setAttribute('role', 'alert');
    notification.textContent = message;
    
    container.appendChild(notification);
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// ---- STORAGE ----
function saveEventsToStorage() {
    localStorage.setItem('shoresquad_events', JSON.stringify(AppState.events));
}

function loadEventsFromStorage() {
    const stored = localStorage.getItem('shoresquad_events');
    if (stored) {
        AppState.events = JSON.parse(stored);
    }
}

function saveCrew() {
    localStorage.setItem('shoresquad_crew', JSON.stringify(AppState.crew));
}

function loadCrew() {
    const stored = localStorage.getItem('shoresquad_crew');
    if (stored) {
        AppState.crew = JSON.parse(stored);
        displayCrew();
    }
}

function saveSettings() {
    localStorage.setItem('shoresquad_settings', JSON.stringify(AppState.settings));
}

function loadSettings() {
    const stored = localStorage.getItem('shoresquad_settings');
    if (stored) {
        AppState.settings = JSON.parse(stored);
    }
}

function loadPersistedData() {
    loadCrew();
    loadSettings();
    loadEventsFromStorage();
}

// ---- KEYBOARD ACCESSIBILITY ----
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.getElementById('event-modal').classList.add('hidden');
    }
});

// ---- PERFORMANCE OPTIMIZATION ----
// Lazy load images
if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[data-lazy]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.lazy;
                img.removeAttribute('data-lazy');
                observer.unobserve(img);
            }
        });
    });
    lazyImages.forEach(img => imageObserver.observe(img));
}

// Request idle callback for non-critical tasks
if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
        console.log('🌊 ShoreSquad idle optimization complete');
    });
}

// ---- EVENT DELEGATION ----
document.addEventListener('click', (e) => {
    // Handle dynamic elements
    if (e.target.closest('.event-item-delete')) {
        const eventId = e.target.closest('.event-item').dataset.eventId;
        deleteEvent(eventId);
    }
});

function deleteEvent(eventId) {
    AppState.events = AppState.events.filter(e => e.id !== eventId);
    saveEventsToStorage();
    showNotification('Event removed', 'info');
}

// ---- CONSOLE LOGGING ----
console.log('%c🌊 ShoreSquad v1.0', 'color: #0066CC; font-size: 20px; font-weight: bold;');
console.log('%cRally your crew, track weather, and hit the next beach cleanup!', 'color: #00CC66; font-size: 14px;');
