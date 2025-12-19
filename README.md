# Restaurant Search App

A web application that displays restaurants within a configurable radius of your location. Built with React, Vite, and Material UI.

## Features

- **Location-based search** - Uses browser geolocation or manual address entry
- **Configurable radius** - Search within 1, 5, 10, or 25 miles
- **Restaurant details** - View name, address, distance, cuisine, rating, and price level
- **Expandable cards** - Click any restaurant to see hours, phone, photos, and reviews
- **Pagination** - Browse through results 50 at a time
- **Responsive design** - Works on desktop and mobile

## Prerequisites

- Node.js 18+ 
- A Google Cloud account with the following APIs enabled:
  - Places API
  - Geocoding API

## Getting Started

### 1. Clone the repository

```bash
git clone git@github.com:avinci/rest-demo.git
cd rest-demo
```

### 2. Get a Google API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select an existing one)
3. Enable the **Places API** and **Geocoding API**
4. Go to **Credentials** and create an API key
5. (Recommended) Restrict the key to only the APIs you need

### 3. Configure environment

```bash
cd demo-rest
cp .env.example .env
```

Edit `.env` and add your API key:

```
VITE_GOOGLE_API_KEY=your_actual_api_key_here
```

### 4. Install dependencies

```bash
npm install
```

### 5. Run the development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

## Usage

1. **Allow location access** when prompted, or enter an address manually
2. **Select a search radius** from the dropdown (default: 5 miles)
3. **Browse restaurants** sorted by distance (nearest first)
4. **Click any restaurant** to expand and view more details
5. **Use pagination** to see more results

## Project Structure

```
demo-rest/
├── src/
│   ├── components/       # React components
│   ├── hooks/            # Custom React hooks
│   ├── services/         # API service functions
│   ├── utils/            # Utility functions and constants
│   ├── App.jsx           # Main app component
│   ├── main.jsx          # Entry point
│   └── theme.js          # Material UI theme
├── public/               # Static assets
└── docs/                 # Project documentation
```

## Documentation

- [Specification](docs/demo-rest-spec.md) - Product requirements and user stories
- [Implementation Plan](docs/demo-rest-plan.md) - Technical architecture and design
- [Implementation Notes](docs/demo-rest-impl.md) - Development notes

## API Costs

This app uses Google Places API which has usage-based pricing. See [Google Maps Platform Pricing](https://cloud.google.com/maps-platform/pricing) for details. 

**Tip:** Set up billing alerts in Google Cloud Console to monitor usage.

## License

MIT
