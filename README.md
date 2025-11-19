# Civix-Server

Small Express + MongoDB backend for the Civix project.

This README describes the code in this repository, what was changed during the debugging session, how the server works, available endpoints and how to run and test locally.

---

## Project overview

- Node.js + Express server that connects to a MongoDB Atlas database.
- Collections used: `issues`, `contributions`, `users`.
- The server exposes REST endpoints to create/read/update/delete issues, record contributions, and query by email, status or issue id.

Notes from this session

- `node_modules/` was added to `.gitignore` and removed from the index locally to avoid re-committing.
- A number of routing and defensive fixes were applied so literal routes (like `/issues/recent`, `/issues/resolved`) do not get mistakenly matched as `:id`, and queries that expect an ObjectId validate input before constructing one.
- A route to fetch contributions for a given issue was corrected to query the `contributions` collection (route: `/issues/contributions/:id`). The handler was also made tolerant of `issueId` stored as either a string or ObjectId.
- IMPORTANT: At one point credentials were present in source. If you ever committed credentials, rotate them immediately. Replace secrets with environment variables in `.env` and add `.env` to `.gitignore`.

---

## Tech stack

- Node.js (tested on v22)
- Express
- MongoDB Atlas
- mongodb Node driver (package.json contains `mongodb` dependency)
- dotenv (for environment variables)
- cors

---

## How it works

1. Server reads environment variables (via `dotenv`) for DB credentials.
2. `MongoClient` connects to the Atlas cluster using the `mongodb+srv://` URI.
3. After connection, route handlers use the connected client to query or modify `issues`, `contributions`, and `users` collections.
4. Routes return JSON responses. Some endpoints accept query parameters (e.g. `/issues?email=...`).

---

## Environment variables

Create a `.env` file in the project root with:

```
DB_USER=<mongodb-username>
DB_PASSWORD=<mongodb-password>
PORT=3000
```

Do NOT commit `.env` to git.

---

## Install & run (Windows PowerShell)

Small Express + MongoDB backend for the Civix project.

This README gives a concise project overview, lists the main technologies and features, documents dependencies, and explains how to run the project locally. It also points to the important endpoints and useful links.
npm install

# create .env with DB credentials (see above)

- Node.js + Express server that connects to a MongoDB Atlas database.
- Collections used: `issues`, `contributions`, `users`.
- The server exposes REST endpoints to create/read/update/delete issues, record contributions, and query by email, status, or issue id.

# or with nodemon during development

npx nodemon index.js

- `node_modules/` was added to `.gitignore` and removed from the index locally to avoid re-committing.
- Routing and defensive fixes were applied so literal routes (like `/issues/recent`, `/issues/resolved`) are registered before parameterized routes and so id parameters are validated before being converted to `ObjectId`.
- The contributions-by-issue route was fixed to query the `contributions` collection and is tolerant of `issueId` stored as a string or an ObjectId.
- IMPORTANT: If credentials were ever committed, rotate them immediately. Use environment variables (`.env`) and keep `.env` in `.gitignore`.

```powershell
$env:NODE_OPTIONS='--tls-min-v1.2'
node index.js
Main technologies
- Node.js (v18+ recommended)
- Express.js (HTTP server)
- MongoDB Atlas (hosted database)
- `mongodb` Node.js driver
- `dotenv` for environment variables
- `cors` for cross-origin requests

Optional / developer tools
- `nodemon` for development auto-reload
- `git` for version control
Base URL: `http://localhost:3000`

Issues

- GET /issues

  - Optional query: `?email=someone%40example.com`

Screenshot (optional)

If you want to include a screenshot, add an image file to `docs/screenshot.png` and the README will reference it here. Example Markdown:

```

![Civix Server screenshot](docs/screenshot.png)

````
  - Returns all issues or issues filtered by `email`.

- GET /issues/recent

  - Returns most recent 6 issues, sorted by `date`.

- GET /issues/resolved

  - Issues with `status: "ended"`.

- GET /issues/pending


Example public links
- Live demo: *add your live URL here if available*
- Project repository: https://github.com/MD-Saadman-Fuad/Civix-Server
- Issue tracker / project board: *add link if you use GitHub Issues or a project board*
  - Issues with `status: "ongoing"`.

- GET /issues/:id

  - Fetch single issue by ObjectId. The server will try to construct an ObjectId from the `:id` parameter — if the id is invalid you'll receive a 400 error (if validation is enabled in your copy of the code).

- POST /issues

  - Create a new issue. Send JSON body with issue fields.

- PUT /issues/:id

  - Update an issue. Send JSON body with updated fields.

- DELETE /issues/:id
  - Delete by id.

Contributions

- GET /contributions

  - Optional query: `?email=someone%40example.com`
  - Returns contributions, optionally filtered by contributor email.

- GET /contributions/:id

  - Fetch contribution by its ObjectId.

- POST /contributions

  - Create a contribution. Example body fields:

  ```json
  {
    "issueId": "6915bbc0bbe7cd9c877085d5",
    "issueTitle": "Broken public Toilet at Rampura",
    "amount": 400,
    "contributorName": "Saad",
    "email": "md.saadman.fuad@gmail.com",
    "phone": "01914995953",
    "address": "Kawla Dhaka",
    "date": "2025-11-13T11:58:53.179Z",
    "additionalInfo": "Need to Do it fast"
  }
````

- GET /issues/contributions/:id
  - Returns contributions for a given `issueId` (the `:id` can be a stored string id or an ObjectId). Example:
    `GET /issues/contributions/6915bbc0bbe7cd9c877085d5`

Useful examples (PowerShell)

```powershell
# Get recent issues in browser-safe form (URL-encoded email)
Invoke-RestMethod -Method GET -Uri "http://localhost:3000/issues?email=md.saadman.fuad%40gmail.com"

# Get contributions for an issue
Invoke-RestMethod -Method GET -Uri "http://localhost:3000/issues/contributions/6915bbc0bbe7cd9c877085d5"
```

---

## Notes & recommendations

- Security: rotate any database credentials that were accidentally committed. Move secrets to `.env` and do not commit them.
- Consistency: decide whether `issueId` in the `contributions` collection should be stored as a string or an ObjectId. Using ObjectId (MongoDB type) is recommended for consistent querying and indexing.
- Indexing: add indexes on fields used frequently in queries (e.g., `contributions.issueId`, `issues.email`, `issues.status`) to improve performance.
- Validation: add input validation (e.g., `express-validator` or a schema) for POST/PUT endpoints.
- Error handling: consider adding a centralized Express error handler to return structured error responses and avoid server crashes.

---

If you want, I can:

- Add a small HTML viewer route to make testing `/my-issues` easier in a browser (no URL-encoding).
- Add a migration script to convert all `issueId` strings to ObjectId (if you choose that direction).
- Add simple tests or a Postman collection.

Which of those would you like next?
