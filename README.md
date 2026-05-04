# DocGiaTruyen

A full-stack personal project for novel readers and writers. This repository contains a Spring Boot backend, a React frontend, and a starter AI/audio service.

## Overview

`DocGiaTruyen` is a story reading and writing platform that supports:
- user authentication and registration
- reader-facing novel browsing and detail pages
- author/creator dashboard for managing novels and chapters
- search and public novel listing
- cover image upload
- JWT-based security for API access

## Technology Stack

- Backend: Java, Spring Boot, Spring Security, Spring Data JPA
- Authentication: JWT
- Database: MySQL (via `mysql-connector-j`)
- Frontend: React, Vite, Tailwind CSS, Redux, React Router
- Optional service: FastAPI for AI / audio features
- Deployment helper: Docker Compose

## Project Structure

- `backend-core/`: main Spring Boot application
- `frontend-web/`: React single-page application
- `backend-ai-audio/`: starter FastAPI service for AI and audio features
- `infrastructure/docker-compose.yml`: local dev orchestration

## Current Features

- register and login with username/email
- token-based session management
- create, update and list novels
- view novels and read content
- search public novels
- upload novel cover images
- author dashboard and chapter editor pages in frontend

## Work In Progress

This project is still under development. Planned improvements include:
- full chapter content management
- more complete AI/audio integration
- better user profile and author controls
- responsive UI polish and error handling

## Running Locally

1. Start MySQL and update backend DB config in `backend-core/src/main/resources/application.yml`
2. Run backend:
   - `cd backend-core`
   - `./mvnw spring-boot:run` or use your IDE
3. Run frontend:
   - `cd frontend-web`
   - `npm install`
   - `npm run dev`
4. Optional AI/audio service:
   - `cd backend-ai-audio`
   - `pip install fastapi uvicorn`
   - `uvicorn main:app --reload`

## Running with Docker

If you want to start services using Docker Compose, use the infrastructure setup:

1. Ensure Docker Desktop is installed and running.
2. From the repository root, run:
   - `cd infrastructure`
   - `docker compose up --build`
3. The backend and frontend services will start together.
4. Stop the stack with:
   - `docker compose down`

> Note: Update Docker Compose service configuration if you need custom database credentials or ports.

## Notes

This README is intentionally temporary and will be updated as the project is completed.
