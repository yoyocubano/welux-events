
# Application Architecture

This document provides a high-level overview of the technical architecture for the "Weddings & Events Luxembourg" project.

## Core Philosophy

The architecture is designed to be modern, scalable, and maintainable. It follows a **Jamstack** approach, where the frontend is a statically-generated site that communicates with backend services via APIs. This results in a fast, secure, and decoupled system.

---

## 1. Frontend (Client)

The frontend is a single-page application (SPA) built with **React** and **Vite**.

-   **Framework**: [React](https://react.dev/) (v19) for building the user interface.
-   **Build Tool**: [Vite](https://vitejs.dev/) provides a fast and lean development experience.
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) is used for utility-first styling, enabling rapid and consistent UI development. Components from `shadcn/ui` provide a base for the design system.
-   **Routing**: [Wouter](https://github.com/molefrog/wouter) is a minimalist routing library for React, keeping the application bundle small.
-   **Internationalization (i18n)**: `i18next` and `react-i18next` are used to support multiple languages (English, French, Spanish, German, etc.).
-   **State Management**: Primarily managed through React's built-in hooks (`useState`, `useEffect`, `useContext`). The AI Chat Widget (`ChatWidget.tsx`) is a good example of a self-contained component with complex state management.

### Key Components

-   `App.tsx`: The root component that sets up routing and global providers.
-   `pages/`: Contains the main page components of the application (e.g., `Home.tsx`, `Portfolio.tsx`).
-   `components/`: Contains reusable UI components used across the application.
-   `components/ChatWidget.tsx`: A sophisticated, self-contained component that provides an AI-powered chat interface. It manages its own state, handles API interactions, and persists chat history to `localStorage`.

---

## 2. Backend (API)

The backend is composed of serverless functions, which are lightweight, event-driven, and scalable.

-   **Runtime**: Node.js.
-   **Framework**: The functions are written to be compatible with serverless environments like **Vercel** or **Netlify Functions**.
-   **API Endpoints**:
    -   `/api/chat`: Powers the "Rebeca AI" chat. It receives chat history, injects a system prompt with business logic and security rules, and communicates with the **DeepSeek AI** service.
    -   `/api/submit-inquiry`: Handles submissions from the contact form, saving the data to the database.

This serverless approach eliminates the need to manage a traditional server, reducing operational overhead and allowing the application to scale automatically based on demand.

---

## 3. Database

The database stores all persistent data for the application, such as portfolio projects, client inquiries, and service packages.

-   **Database Type**: MySQL-compatible (e.g., MySQL, PlanetScale, TiDB).
-   **ORM**: [Drizzle ORM](https://orm.drizzle.team/) is used for database access. It's a lightweight, TypeScript-native ORM that provides type safety and a SQL-like query builder.
-   **Schema**: The database schema is defined in `drizzle/schema.ts`. This file serves as the single source of truth for the database structure.
-   **Migrations**: Drizzle Kit is used to generate SQL migration files based on schema changes, allowing for version-controlled database updates.

### Data Flow Example (Client Inquiry)

1.  A user fills out the contact form on the frontend.
2.  The frontend sends a `POST` request to the `/api/submit-inquiry` endpoint.
3.  The serverless function validates the input data.
4.  Using Drizzle ORM, the function inserts a new record into the `clientInquiries` table in the database.
5.  The function returns a success response to the frontend.

---

## 4. Development & Deployment

-   **Package Manager**: [pnpm](https://pnpm.io/) is used for efficient dependency management.
-   **Local Development**: `pnpm dev` starts the Vite development server for the frontend and a local server for the API functions.
-   **Deployment**: The project is configured for easy deployment on platforms like **Vercel** or **Netlify**. These platforms automatically detect the frontend framework and serverless functions, building and deploying them accordingly.

This decoupled architecture makes the project robust and flexible, allowing different parts of the system to be developed, deployed, and scaled independently.
