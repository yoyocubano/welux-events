# Weddings & Events Luxembourg

A professional and elegant website for a premier wedding and event photography/videography service in Luxembourg.

---

## ✨ Key Features

-   **Elegant Design**: A sophisticated color palette and typography designed to feel luxurious.
-   **Dynamic Portfolio**: A filterable gallery showcasing different types of events.
-   **"Rebeca AI" Chat Concierge**: An intelligent virtual assistant to help users and capture leads.
-   **Service Packages**: Detailed presentation of photography and video services.
-   **Client Inquiry System**: A comprehensive form that captures leads and notifies the business owner.
-   **Multilingual**: Supports English, French, Spanish, German, and more.
-   **Responsive Design**: Fully optimized for a seamless experience on mobile, tablet, and desktop.

---

## 🏛️ Architecture

The project is built using a modern **Jamstack architecture**, ensuring it is fast, scalable, and secure. The frontend is a statically-generated site that communicates with backend services via serverless APIs.

For a detailed explanation of the frontend, backend, and database structure, please see the **[Application Architecture Document](ARCHITECTURE.md)**.

---

## 🚀 Technology Stack

-   **Frontend**: React 19, Vite, Tailwind CSS, Wouter (Routing)
-   **Deployment**: Cloudflare Pages (Primary). Ready for Vercel, Netlify, or Hostinger.
-   **Backend**: Cloudflare Functions (Primary). Adaptable to standard Node.js.
-   **Database**: MySQL-compatible (via PlanetScale, TiDB, etc.)
-   **ORM**: Drizzle ORM
-   **AI Chat**: DeepSeek API
-   **Testing**: Vitest

---

## 📦 Getting Started

1.  **Install dependencies:**
    ```bash
    pnpm install
    ```

2.  **Set up the database:**
    ```bash
    pnpm db:push
    ```

3.  **Run the development server:**
    ```bash
    pnpm dev
    ```

---

## 🧪 Testing

-   **Run unit and integration tests:**
    ```bash
    pnpm test
    ```

-   **Check for TypeScript errors:**
    ```bash
    pnpm check
    ```

---

## 🎨 Brand Identity & Colors

The project uses two distinct color schemes to separate the general website experience from the premium chat interface.

#### 1. General Site (Modern Elegant)

| Color             | Hex       | Usage                               |
| :---------------- | :-------- | :---------------------------------- |
| **Soft Black**      | `#1E1E1E` | Main text, headings                 |
| **Light Champagne** | `#FAF8F6` | Main background                     |
| **Soft Gold**       | `#9F8F6A` | Accents, subtle borders             |
| **Pure White**      | `#FFFFFF` | Cards, content backgrounds          |

#### 2. Chat Widget (Dark Luxury)

| Color               | Hex       | Usage                               |
| :------------------ | :-------- | :---------------------------------- |
| **Luxembourg Gold**   | `#D4AF37` | **Buttons, User Message Bubbles**   |
| **Deep Black**        | `#0F0F0F` | Chat background                     |
| **Surface Black**     | `#141414` | Header, inputs                      |
| **Dark Graphite**     | `#2A2A2A` | AI message bubbles                  |
| **Platinum Grey**     | `#E5E5E5` | Contrast text                       |

---

## 📄 License

This project is licensed under the **MIT License**.

---

*Developed with ❤️ to capture perfect moments in Luxembourg.*
