#!/usr/bin/env bash

WORKING_DIR=$( pwd; )
FERN_DIR="./fern"
GENERATED_DIR="./generated"

echo "Current working directory: $WORKING_DIR"
echo "---"

echo "Cleaning..."
rm -rf $FERN_DIR
rm -rf $GENERATED_DIR

echo "Complete."
