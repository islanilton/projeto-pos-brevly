# Brev.ly - URL Shortener Service

A URL shortener service built with Node.js, Fastify, TypeScript, and PostgreSQL.

## Features

- [x] Create shortened URLs
  - [x] Validate URL format
  - [x] Prevent duplicate shortened URLs
- [x] Delete URLs
- [x] Redirect to original URL
- [x] List all URLs
- [x] Track URL access count
- [x] Export URLs to CSV
  - [x] Access CSV through CDN (Amazon S3, Cloudflare R2, etc)
  - [x] Generate unique random filename
  - [x] Performant listing
  - [x] CSV fields: Original URL, Shortened URL, Access Count, Creation Date

## Tech Stack
- Node.js
- Fastify
- TypeScript
- PostgreSQL
- Drizzle ORM
- Cloudflare (for CSV storage)
- Docker

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Copy the environment variables:
   ```bash
   cp .env.example .env
   ```

4. Start the development environment:
   ```bash
   docker-compose up -d
   ```

5. Run the migrations:
   ```bash
   pnpm db:migrate
   ```

6. Start the development server:
   ```bash
   pnpm dev
   ```

## Development

- `pnpm dev` - Start the development server
- `pnpm test` - Run tests
- `pnpm test:watch` - Run tests in watch mode
- `pnpm db:generate` - Generate database migrations
- `pnpm db:migrate` - Run database migrations
- `pnpm db:studio` - Open Drizzle Studio
- `pnpm format` - Format code
- `pnpm lint` - Lint code
- `pnpm check` - Check code
- `pnpm build` - Build the application
- `pnpm start` - Start the production server

## Docker

Build the Docker image:
```bash
docker build -t brevly .
```

Run the Docker container:
```bash
docker run -p 3333:3333 brevly
```

## License

ISC 