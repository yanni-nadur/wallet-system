# Wallet System API

API for managing a financial wallet, built with NestJS and PostgreSQL, containerized with Docker for easier development and deployment.

---

## Contents

- [Description](#description)
- [Technologies](#technologies)
- [Requirements](#requirements)
- [Getting Started](#getting-started)
- [Main Endpoints](#main-endpoints)
- [Swagger Documentation](#swagger-documentation)
- [Environment Variables](#environment-variables)

---

## Description

This project implements a REST API for user financial management, allowing operations such as registration, login, deposits, transfers, and transaction reversals. The API is fully containerized with Docker to simplify the development environment, including hot reload and a PostgreSQL database container.

---

## Technologies

- [NestJS](https://nestjs.com/)
- [TypeORM](https://typeorm.io/)
- [PostgreSQL](https://www.postgresql.org/)
- Docker & Docker Compose
- Swagger (OpenAPI) for documentation

---

## Requirements

- Docker and Docker Compose installed
- Node.js (optional for local development without Docker)
- npm

---

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/yanni-nadur/wallet-system.git
cd wallet-system
```

2. Configure environment variables in the `.env` file (see example below).

3. Start containers using Docker Compose:

```bash
docker compose up --build
```

4. The API will be available at:

[http://localhost:3000](http://localhost:3000)

---

## Main Endpoints

| Method | Route                   | Description                         | Auth Required |
|--------|--------------------------|-------------------------------------|---------------|
| POST   | `/auth/login`            | User login                          | No            |
| POST   | `/user/register`         | Register new user                   | No            |
| GET    | `/user`                  | List users                          | Yes           |
| POST   | `/transaction/deposit`   | Deposit funds into wallet           | Yes           |
| POST   | `/transaction/transfer`  | Transfer funds to another user      | Yes           |
| POST   | `/transaction/reverse`   | Reverse a transaction               | Yes           |

---

## Swagger Documentation

Interactive documentation is available at:

[http://localhost:3000/api](http://localhost:3000/api)

There you can view models, test endpoints, and see examples.

---

## Environment Variables

Example `.env`:

```env
DB_HOST=postgres
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=wallet
JWT_SECRET=yourSuperSecretKeyHere
JWT_EXPIRES_IN=3600s
```
