#!/usr/bin/env bash

WORKING_DIR=$( pwd; )
LOCAL_API_URL="http://localhost:7071/api/openapi/v3.yml"
TARGET_API_YML_FILE="live-openapi.yml"

FERN_BIN="./node_modules/.bin/fern"

FERN_DIR="./fern"
FERN_GENERATORS_DIR="./fern/api"
REPLACEMENT_FERN_CONFIG="./resources/fern.config.json"
REPLACMENT_GENERATORS_YML="./resources/generators.yml"

echo "Initializing Fern from live API"
echo "---"
echo "Current working directory: $WORKING_DIR"
echo "Cleaning up existing fern directory..."
rm -rf $FERN_DIR
echo "---"

echo "Downloading OpenAPI document from local API..."
curl -s -o $TARGET_API_YML_FILE $LOCAL_API_URL
echo "---"

echo "Initializing fern from downloaded OpenAPI document"
echo "Using fern version: $( $FERN_BIN --version; )"
$FERN_BIN init --openapi $TARGET_API_YML_FILE

echo "Replacing generated fern artifacts with versioned resource files..."
cp -f -p $REPLACEMENT_FERN_CONFIG $FERN_DIR
cp -f -p $REPLACMENT_GENERATORS_YML $FERN_GENERATORS_DIR

echo "Running fern generate..."
$FERN_BIN generate --log-level="debug"

echo "---"
echo "Removing temporary copy of OpenAPI document..."
rm $TARGET_API_YML_FILE

echo "Complete."
