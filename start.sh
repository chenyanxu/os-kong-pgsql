#!/bin/bash

# Kong Auto Configure
#
# This script will:
# 1. Wait for PostgreSQL to be ready
# 2. Start Kong
#

echo "==> Waiting for PostgreSQL to be ready..."

while ! nc -z ${KONG_DATABASE_SERVICE_HOST} ${KONG_DATABASE_SERVICE_PORT}; do
  echo "==> $(date) Connecting to ${KONG_DATABASE_SERVICE_HOST} ${KONG_DATABASE_SERVICE_PORT}..."
  sleep 1
done

echo "==> PostgreSQL ready."

# echo "==> Start Kong auto configure process..."

# /startup-auto-configure.sh &

# echo "==> Started Kong auto configure process"

echo "==> Starting  Kong..."

kong start
