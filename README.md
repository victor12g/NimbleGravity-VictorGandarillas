# Nimble Gravity Challenge — Victor Gandarillas

A React mini-app that connects to the Nimble Gravity candidate API, allowing a candidate to load their profile, browse open positions, and submit an application with a GitHub repository URL.

## Tech stack

- **React 18** + **Vite 5**
- Vanilla CSS (no UI libraries)

## Getting started

```bash
cp .env.example .env
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Environment variables

| Variable    | Description                                          | Default |
|-------------|------------------------------------------------------|---------|
| `BASE_URL`  | API base URL                                         | —       |
| `DEBUG_API` | Set to `true` to log all API requests and responses to the browser console | `false` |

## How it works

1. **Enter your email** and click **Load candidate** — fetches candidate data from the API.
2. **Browse open positions** — loaded automatically after candidate data is confirmed.
3. **Click a position** — opens a modal with a GitHub repository URL input.
4. **Submit your application** — sends a `POST` request with your candidate details and repo URL.

## Project structure

```
src/
├── App.jsx                    # State management and handlers
├── components/
│   ├── CandidateSection.jsx   # Email input and candidate info
│   ├── JobsSection.jsx        # Job listing grid
│   ├── ApplyModal.jsx         # Application modal with repo input
│   └── JobCard.jsx            # Individual job card
├── services/
│   └── api.js                 # API calls and validation helpers
└── styles.css
```