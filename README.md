# RTPA Web - Tennis & Padel Club Management

This is a hobby project aimed at creating a free-to-use tool for tennis and padel clubs to manage court bookings and for players to find partners of a similar skill level.


## 🚀 Features

-   **Club Management**: Create and manage your own tennis or padel club.
-   **Court Management**: Add and configure the courts for your club.
-   **Court Reservations**: Club members can easily view court availability and book their slots.
-   **Player Profiles**: Users can manage their profiles and club memberships.
-   **Skill-based Leaderboard**: A dynamic leaderboard ranks players based on their match results, helping players find suitable opponents.
-   **Match Result Tracking**: Players can submit their match results to update their leaderboard standings.

## 💻 Tech Stack

-   **Framework**: [Next.js](https://nextjs.org/)
-   **Authentication**: [Clerk](https://clerk.com/)
-   **Database**: [PostgreSQL](https://www.postgresql.org/) hosted on [Neon](https://neon.tech/)
-   **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
-   **UI**: [React](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/), and [shadcn/ui](https://ui.shadcn.com/)
-   **Form Management**: [React Hook Form](https://react-hook-form.com/)
-   **Schema Validation**: [Zod](https://zod.dev/)


## 📸 Screenshots

### Home page
![Home page](https://github.com/rodhd/rtpa-web/blob/main/docs/screenshots/home.png?raw=true)

### Club page
![Club page](https://github.com/rodhd/rtpa-web/blob/main/docs/screenshots/club.png?raw=true)

### Club management
![Club management](https://github.com/rodhd/rtpa-web/blob/main/docs/screenshots/club-management.png?raw=true)

### Court booking
![Court booking](https://github.com/rodhd/rtpa-web/blob/main/docs/screenshots/court-booking.png?raw=true)

### Match results
![Match results](https://github.com/rodhd/rtpa-web/blob/main/docs/screenshots/match-results.png?raw=true)

### My reservations
![My reservations](https://github.com/rodhd/rtpa-web/blob/main/docs/screenshots/reservations.png?raw=true)

## 🛠️ Getting Started

### Prerequisites

-   Node.js
-   pnpm
-   A PostgreSQL database (e.g., from Neon)

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/rtpa-web-supabase.git
    ```
2.  Navigate to the project directory:
    ```bash
    cd rtpa-web
    ```
3.  Install dependencies:
    ```bash
    pnpm install
    ```
4.  Set up your environment variables by creating a `.env.local` file. You can copy the example file:
    ```bash
    cp .env.example .env.local
    ```
5.  Update `.env.local` with your database and Clerk credentials.

6.  Run database migrations:
    ```bash
    pnpm migrate
    ```

7.  Start the development server:
    ```bash
    pnpm dev
    ```

The application should now be running at `http://localhost:3000`.