# RTPA Web - Tennis & Padel Club Management

This is a hobby project aimed at creating a free-to-use tool for tennis and padel clubs to manage court bookings and for players to find partners of a similar skill level.

## Live Application

[Link to the deployed application]() <!-- TODO: Add link to the deployed application -->

## 🚀 Features

-   **Club Management**: Create and manage your own tennis or padel club.
-   **Court Management**: Add and configure the courts for your club.
-   **Court Reservations**: Club members can easily view court availability and book their slots.
-   **Player Profiles**: Users can manage their profiles and club memberships.
-   **Skill-based Leaderboard**: A dynamic leaderboard ranks players based on their match results, helping players find suitable opponents.
-   **Match Result Tracking**: Players can submit their match results to update their leaderboard standings.

## 📸 Screenshots

<!-- TODO: Add screenshots of the application -->
*Placeholder for a screenshot of the club page.*

*Placeholder for a screenshot of the court booking calendar.*

*Placeholder for a screenshot of the leaderboard.*

## 💻 Tech Stack

-   **Framework**: [Next.js](https://nextjs.org/)
-   **Authentication**: [Clerk](https://clerk.com/)
-   **Database**: [PostgreSQL](https://www.postgresql.org/) hosted on [Neon](https://neon.tech/)
-   **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
-   **UI**: [React](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/), and [shadcn/ui](https://ui.shadcn.com/)
-   **Form Management**: [React Hook Form](https://react-hook-form.com/)
-   **Schema Validation**: [Zod](https://zod.dev/)

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