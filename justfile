# Show all the commands
default:
  @just --list

# Run development server
dev:
  bun dev

# Seed initial data for the database
seed:
  bun run seed

# Run the services
services:
  nix run .#services
