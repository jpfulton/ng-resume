#!/usr/bin/env bash

WORKING_DIR=$( pwd; )
FERN_BIN="./node_modules/.bin/fern"

echo "Current working directory: $WORKING_DIR"
echo "---"

echo "Using fern version: $( $FERN_BIN --version; )"

echo "Running fern generate with publish group..."
$FERN_BIN generate publish --log-level="debug"

echo "Complete."
