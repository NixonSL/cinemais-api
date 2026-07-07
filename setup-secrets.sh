#!/bin/bash

# Script para criar Docker Secrets para produção

echo "Creating Docker Secrets for Cinemais API..."

# Create secrets directory
mkdir -p secrets

# Generate random password if not provided
if [ -z "$POSTGRES_PASSWORD" ]; then
  POSTGRES_PASSWORD=$(openssl rand -base64 32)
  echo "Generated random password for PostgreSQL"
fi

# Create secret files
echo "$POSTGRES_USER" > secrets/postgres_user
echo "$POSTGRES_PASSWORD" > secrets/postgres_password

# Set file permissions
chmod 600 secrets/postgres_user
chmod 600 secrets/postgres_password

# Create Docker secrets
docker secret create cinemais_postgres_user secrets/postgres_user
docker secret create cinemais_postgres_password secrets/postgres_password

echo "Docker secrets created successfully!"
echo "Secret files are in ./secrets/ directory"
echo "Remember to remove the secret files after deployment: rm -rf secrets/"
