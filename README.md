# Game Scout

Game Scout is a full-stack web application that helps users track video game prices across multiple digital stores, manage wishlists, and monitor their gameplay statuses. 

Built with Next.js, React, and PostgreSQL, it integrates with an external Puppeteer-based scraper ([Game Scout Scraper Service](https://github.com/TomMilchman/game-scout-scraper-service)) to fetch prices from stores without public APIs, providing an intuitive, responsive interface for gamers.

[Video showcase](https://www.youtube.com/watch?v=TBwJrO03R2U)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Project Structure](#project-structure)

---

## Features

- **User Authentication**: Account creation and login using Clerk.
- **Wishlist Management**: Add, remove, and manage games on your wishlist.
- **Game Tracking**: Track gameplay status: playing, finished, completed, on-hold, dropped, or never played.
- **Price Comparison**: View prices from multiple stores including Steam, GOG, and GreenManGaming.
- **On-demand Price Scraping**: Fetch prices dynamically for stores without public APIs.
- **Responsive UI**: Mobile-friendly and desktop-ready interface.
- **Server Actions**: Efficient data fetching and server-side operations.

---

## Tech Stack

- **Frontend**: Next.js (App Router), React, TailwindCSS
- **Backend**: Next.js API Routes / Server Actions
- **Database**: PostgreSQL (accessed via `@neondatabase/serverless` npm package)
- **Authentication**: Clerk
- **Scraping**: Cheerio, Puppeteer (external project)
- **Other**: TypeScript, Node.js

---

## Architecture

1. **Frontend**: Next.js App Router with React components. Data fetching is done using Server Actions.
2. **Backend**: Server Actions that handle mutations and access PostgreSQL.
3. **Scrapers**: Puppeteer scrapers fetch game prices on-demand via the external scraper service. Steam API is used where available.
4. **Database**: PostgreSQL stores users, wishlists, game tracking data, ratings, and cached price information.
   
---

## Getting Started

### Prerequisites

- Node.js >= 20
- PostgreSQL
- Yarn or npm
- Clerk account for authentication
- [Game Scout Scraper Service](https://github.com/TomMilchman/game-scout-scraper-service) running locally or deployed for fetching prices from GOG and GreenManGaming.

### Installation

1. Clone the repository:

```bash
git clone https://github.com/TomMilchman/GameScout.git
cd GameScout
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

  Create a .env file in the root directory with:
  
  ```env
  DATABASE_URL=<url>
  SCRAPER_URL=<url-of-scraping-service>
  CLERK_SECRET_KEY=<key>
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<key>
  CLERK_WEBHOOK_SIGNING_SECRET=<key>
  STEAM_API_KEY=<your_steam_api_key>
  NODE_ENV=<development|production>
  ```

4. Run the development server:

```bash
npm run dev
```

Open http://localhost:3000 to view the app in the browser.

---

## Usage

1. Register a new account or log in via Clerk.

2. Browse or search for games to add to your wishlist.

3. Track your gameplay status for each game.

4. Check current prices across supported stores.

5. Use the on-demand scraping feature to fetch the latest prices from stores (available stores: Steam, GOG, GreenManGaming).

---

## Project Structure

```text
/app           - Next.js App Router pages and components
  /(protected)     - Protected pages
    /dashboard        - Dashboard with game tracking
    /game/[gameId]    - Game details with price comparison
    /search           - Search results page
    /wishlist         - Wishlist page
  /api/webhooks    - Clerk webhook endpoints
  /auth            - Login/Register pages
  /components      - Reusable TSX components
  /lib             - API helpers and utilities
  /server          - Server actions and backend logic
  /db              - SQL queries and DB interactions
  /services        - Steam API and other service integrations
  /utils           - Misc utility functions
/public        - Static assets and images
```
