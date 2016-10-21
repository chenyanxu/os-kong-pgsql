#!/usr/bin/env bash

echo "==> Waiting for Kong to be ready..."

#while ! nc -vz localhost 8000; do
while ! nc --recv-only --send-only -w 1 localhost 8000; do
  echo "==> $(date) Connecting to localhost port 8000..."
  sleep 1
done

echo "==> Kong ready."

echo "==> Kong auto configure..."

cd /tmp/setup-scripts

node index.js

/tmp/kong-plugins-setup.sh

echo "==> Kong auto configure done."
