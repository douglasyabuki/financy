# Financy

Financy is a full-stack personal finance organization application designed to help users manage their transactions and categories effectively.

## 🎨 Design

The user interface is based on:
[**View Figma Design**](https://www.figma.com/community/file/1580994817007013257/financy)

## 🏗️ Tech Stack

This project is a monorepo consisting of a **React** frontend and a **Node.js** backend, both built with **TypeScript**.

### Frontend (`/frontend`)

- **Framework**: React (Vite)
- **Language**: TypeScript
- **API Client**: Apollo Client (GraphQL)
- **Styling**: CSS / TailwindCSS (Optional)
- **Routing**: React Router

### Backend (`/backend`)

- **Runtime**: Node.js
- **Language**: TypeScript
- **API**: GraphQL (TypeGraphQL + Apollo Server)
- **Database ORM**: Prisma
- **Database**: SQLite (Default) / PostgreSQL
- **Dependency Injection**: tsyringe
- **Testing**: Vitest
- **Validation**: class-validator

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm

### Installation

1.  **Clone the repository**

    ```bash
    git clone https://github.com/douglasyabuki/financy.git
    cd financy
    ```

2.  **Setup Backend**

    ```bash
    cd backend
    npm install
    cp .env.example .env # Configure your environment variables
    npm run dev
    ```

3.  **Setup Frontend**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

## 🧪 Testing

The backend includes a comprehensive test suite covering services and resolvers.

```bash
cd backend
npm run test
```

## 📄 License

![Rocketseat Full Stack](https://ftr.rocketseat.com.br/assets/logos/ftr-logo-horizontal.svg)

> This is a postgraduate degree challenge from [Rocketseat](https://ftr.rocketseat.com.br).
