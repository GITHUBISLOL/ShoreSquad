# ShoreSquad
# Rally your crew, track weather, and hit the next beach cleanup!

## Project Structure

```
ShoreSquad/
├── index.html              # HTML5 boilerplate with semantic structure
├── css/
│   └── styles.css          # Responsive styles with color palette
├── js/
│   └── app.js              # Main application logic
├── sw.js                   # Service Worker for PWA
├── .gitignore              # Git configuration
├── .env.example            # Environment variables template
└── README.md               # Project documentation
```

## Getting Started

### Prerequisites
- Live Server extension for VS Code
- Modern browser with geolocation support
- Node.js (optional, for future backend integration)

### Installation & Setup

1. **Clone or download the project**
   ```bash
   cd ShoreSquad
   ```

2. **Install Live Server Extension in VS Code**
   - Open VS Code Extensions (Ctrl+Shift+X)
   - Search for "Live Server" by Ritwick Dey
   - Click Install

3. **Start the development server**
   - Right-click `index.html`
   - Select "Open with Live Server"
   - Browser opens at `http://localhost:5500`

4. **Initialize Git Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial ShoreSquad commit"
   ```

## Features

### 🗺️ Interactive Map
- Real-time beach cleanup events on Leaflet map
- Geolocation support to find cleanups near you
- Click to view event details and join

### 🌤️ Weather Integration
- Current weather conditions at selected location
- Temperature, humidity, and wind speed
- Helps plan beach cleanup timing

### 👥 Crew Management
- Create and invite crew members
- Track crew statistics (cleanups, impact, streak)
- Social features for team coordination

### 🎯 Event Creation
- Easy event creation modal
- Set date, time, location, and capacity
- Share with crew for group coordination

### 📊 Profile & Achievements
- Personal dashboard with stats
- Badge system for milestones
- Customizable profile settings
- Data export functionality

### 📱 Progressive Web App
- Works offline with Service Worker
- Responsive design for all devices
- Add to home screen capability
- Fast loading with caching

## Technology Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with custom properties
- **Vanilla JavaScript** - No dependencies (except Leaflet & OpenWeatherMap)
- **Leaflet.js** - Lightweight mapping library
- **LocalStorage** - Client-side data persistence

### Performance Optimizations
- Lazy loading for images
- Service Worker caching strategy
- Minified assets
- CSS Grid & Flexbox for responsive layouts
- Debounced event handlers

### Accessibility
- WCAG AA compliance
- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- High contrast mode support
- Dark mode support

## Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Ocean Blue | #0066CC | Primary buttons, headers, accents |
| Sandy Beige | #F4E4C1 | Secondary buttons, backgrounds |
| Eco Green | #00CC66 | Success states, accent features |
| Dark Slate | #2D3436 | Text, contrast |
| Coral | #FF6B6B | Error states, alerts |

## API Integrations

### OpenWeatherMap
- Endpoint: `https://api.openweathermap.org/data/2.5/weather`
- Free tier available
- Set API key in environment variables

### Leaflet Map
- Endpoint: `https://unpkg.com/leaflet@1.9.4`
- OpenStreetMap tiles included
- No API key required

## Environment Variables

Create `.env` file (not included in git):
```
WEATHER_API_KEY=your_openweathermap_key
MAP_CENTER_LAT=34.0195
MAP_CENTER_LNG=-118.4912
```

## Browser Support

- Chrome/Edge 88+
- Firefox 87+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Metrics

- **Lighthouse Score**: Target 90+
- **Page Load Time**: < 2s on 4G
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s

## UX Design Principles

1. **Mobile-First** - Optimized for touch and small screens
2. **Accessibility** - Inclusive design for all users
3. **Social-Centric** - Easy crew coordination
4. **Clarity** - Minimal friction, clear CTAs
5. **Gamification** - Badges and leaderboards
6. **Responsiveness** - Smooth animations and feedback

## JavaScript Features

### State Management
- Centralized `AppState` object
- Persistent storage with localStorage
- Event-driven architecture

### Interactivity
- Geolocation API for user positioning
- Weather API integration
- Modal dialogs for event creation
- Dynamic crew management
- Real-time notifications

### Performance
- Event delegation for dynamic elements
- RequestIdleCallback for optimization
- Intersection Observer for lazy loading
- Service Worker caching

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make changes and test locally
3. Commit: `git commit -m "Add your feature"`
4. Push: `git push origin feature/your-feature`
5. Create Pull Request

## Future Enhancements

- [ ] Real-time chat for crew coordination
- [ ] Image upload for cleanup documentation
- [ ] Social media integration
- [ ] Leaderboards and rankings
- [ ] Backend API for data persistence
- [ ] Mobile app (React Native)
- [ ] Environmental impact calculator
- [ ] Sponsorship/donation integration
- [ ] Community event calendar
- [ ] Analytics dashboard

## License

MIT License - Feel free to use ShoreSquad for your beach cleanup initiatives!

## Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing documentation
- Test in different browsers

---

**🌊 Rally your crew, track weather, and hit the next beach cleanup with ShoreSquad!**
