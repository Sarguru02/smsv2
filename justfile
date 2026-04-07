# Show all the commands
default:
  @just --list

# Run the frontend development server
[working-directory: "apps/web"]
frontend:
  pnpm dev

# Run backend server
[working-directory: "apps/api"]
backend:
  cargo run

# Run the services
services:
  nix run .#services
