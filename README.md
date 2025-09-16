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
- [Takeaways](#takeaways)

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
- **Database**: PostgreSQL (accessed via `@neondatabase/serverless` npm package), Drizzle ORM for migrations
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
   DATABASE_URL=<your_database_url>
   SCRAPER_URL=<url_of_scraping_service>
   CLERK_SECRET_KEY=<your_clerk_secret_key>
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<your_clerk_publishable_key>
   CLERK_WEBHOOK_SIGNING_SECRET=<your_clerk_webhook_secret>
   STEAM_API_KEY=<your_steam_api_key>
   NODE_ENV=development
   ```

4. Run database migrations:
   
   ```bash
   npx drizzle-kit generate
   npx drizzle-kit migrate
   ```

5. Port-forward localhost:3000:

   This application uses Clerk webhooks for user creation and deletion.

   To ensure new users are properly added to the database, expose your localhost address using port-forwarding (e.g., via VS Code or a tool like ngrok).

6. Run the development server:

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
/app             - Next.js App Router pages and components
  /(protected)     - Protected pages requiring authentication
    /dashboard        - Dashboard for tracking game status
    /game/[gameId]    - Game details and price comparison
    /search           - Search results page
    /wishlist         - User wishlist page
  /api/webhooks      - Clerk webhook endpoints for user creation and deletion
  /auth              - Login and registration pages
  /components        - Reusable TSX components
  /lib               - API helpers and utility functions
  /server            - Server actions and backend logic
  /db                - Raw SQL queries and DB interactions; includes schema and migrations
  /services          - Steam API and other service integrations
  /utils             - Miscellaneous utility functions
/public             - Static assets and images
```

---

## Takeaways

I built this project to reliably track the status of the video games I play while also monitoring prices for titles I'm interested in. What started as a personal need quickly grew into a full-stack application that balances usability with technical depth.

I chose Next.js as the framework to deepen my experience with modern JavaScript ecosystems and to explore the benefits of the App Router architecture. For the backend, I worked directly with raw SQL queries, complemented by Drizzle for table creation and migrations. This combination gave me practical experience in database design, query optimization, and server-side data handling beyond my academic background.

I also used TypeScript throughout the project to enforce type safety, reduce runtime errors, and make the codebase easier to maintain as the app grew. This decision not only improved developer confidence but also pushed me to write more consistent and scalable code.

Through this process, I gained hands-on experience in building scalable and maintainable systems: structuring server actions, implementing on-demand data scraping, and designing a responsive, user-friendly interface. More importantly, I learned how to approach complex problems systematically, integrate multiple technologies, and deliver solutions that balance functionality with performance.

This project strengthened my technical expertise while reinforcing my passion for building distributed, user-focused systems.
