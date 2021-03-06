#!/bin/bash

# Kong Auto Configure
#
# This script will:
# 1. Wait for PostgreSQL to be ready
# 2. Start Kong
#

echo "==> Waiting for PostgreSQL to be ready..."

# Centos6 and Debian/Ubuntu
# while ! nc -z ${KONG_DATABASE_SERVICE_HOST} ${KONG_DATABASE_SERVICE_PORT}; do
# Centos7
# nc --version
# Ncat: Version 6.40 ( http://nmap.org/ncat )
# See: http://stackoverflow.com/questions/4922943/test-from-shell-script-if-remote-tcp-port-is-open
while ! nc --recv-only --send-only -w 1 ${KONG_DATABASE_SERVICE_HOST} ${KONG_DATABASE_SERVICE_PORT}; do
  echo "==> $(date) Connecting to database ${KONG_DATABASE_SERVICE_HOST} ${KONG_DATABASE_SERVICE_PORT}..."
  sleep 1
done

echo "==> PostgreSQL ready."

echo "==> Start Kong auto configure process..."

# Runs in the background then exits when complete
/start-auto-configure.sh &

echo "==> Started Kong auto configure process..."

echo "==> Starting  Kong..."

# Main foreground process``
kong start
