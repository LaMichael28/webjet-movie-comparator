# Webjet Movie Comparison App

A web app that compares movie listings and prices from two providers — Cinemaworld and Filmworld — helping users find the cheapest option.

---

## Tech Stack

- **Frontend:** React + Tailwind CSS  
- **Backend:** ASP.NET Core Web API (.NET 8)  
- **Caching:** In-memory caching with `IMemoryCache`  
- **Logging:** Serilog  
- **Deployment:** Docker + Docker Compose  

---

## Features

- Fetches and combines movie lists from two providers  
- Displays movie details with prices from both providers  
- Caches API responses for performance  
- Securely manages API tokens on backend  
- Includes Swagger UI for backend API documentation  
- Unit tests for backend API endpoints  

---

## Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/8.0)  
- [Node.js 18+](https://nodejs.org/)  
- [Docker Desktop](https://www.docker.com/products/docker-desktop)  
- Optional: Visual Studio Code or another editor  

---

## Setup and Running Locally

### 1. Configure environment variables

- Rename `.env.example` in `/backend` folder to `.env`  
- Add your Webjet API token:

```env
WEBJET_API_TOKEN={token}

### 2. Build and run with Docker

From the project root: docker-compose up --build
This will build both frontend and backend images and start containers.

### 3. Access the app

Frontend UI: http://localhost:3000
Backend Swagger API docs: http://localhost:5190/swagger

---

## Running Tests

Run backend unit tests: dotnet test

---

## Development Notes

The backend uses in-memory caching to reduce redundant external API calls.
API token is stored in environment variables and never exposed to frontend.
Logging via Serilog writes to console and daily rolling files.
Frontend uses React Hooks and shows skeleton loaders while fetching data.

---

## Challenges Faced

- TODO: Running frontend Jest tests tries to call actual API endpoints despite mocking axios, needing correct setup of mocks to prevent real network requests during tests.  
- Upgrading to the latest .NET 9 SDK caused compatibility and build issues; had to downgrade to .NET 8 to stabilize the project and get all dependencies working smoothly.  
- Handling transient errors and API rate limits required implementing retry policies and circuit breakers with Polly for robust HTTP client resilience.  
- Merging and deduplicating movie data from two different providers with inconsistent data fields needed careful grouping and fallback logic.  
- Ensuring a smooth UX with proper loading states, error handling, and retry options was key to handling unreliable external APIs.

---

## Future Work

- Complete CI/CD deployment pipeline for automated builds, tests, and releases.  
- Host backend and frontend applications on cloud platforms with proper domain and HTTPS setup.  
- Add user authentication and favorites list for personalized experiences.  
- Improve error monitoring and alerting with centralized log aggregation.

---