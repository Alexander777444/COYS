# COYS

Project name placeholder.

## Folder structure

```
COYS/
├── .github/workflows/
├── client/                  # React client (Vite)
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── errors/
│   │   ├── routes/
│   │   └── db/
│   ├── tests/
│   ├── .env.example
│   └── package.json
├── database/
│   ├── migrations/
│   └── README.md
├── docs/
│   └── decisions.md
├── AGENTS.md
├── README.md
└── .gitignore
```

## Run the server

```bash
cd server
cp .env.example .env
npm install
npm run dev
```

The API runs at http://localhost:3000. Health check: `GET /health`.

## Run the client

```bash
cd client
npm install
npm run dev
```

Vite serves the client at http://localhost:5173 by default.
