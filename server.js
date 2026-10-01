// Single entry point: run `node server.js` from the project root.
//
// This starts the API AND serves the built frontend (dist/) from the same
// port, if it has been built — so one command is enough to run the whole
// app. If dist/ doesn't exist yet, it still starts the API alone.
//
// First time / after changing frontend code:
//   npm install
//   npm run build
//   node server.js
// Then open http://localhost:4000
import './server/index.js'
