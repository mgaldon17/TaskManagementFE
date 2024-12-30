#!/bin/bash

# Define variables
IMAGE_NAME="ghcr.io/mgaldon17/task-management-app-fe:latest"
GITHUB_USERNAME="mgaldon17"
GITHUB_TOKEN="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"

# Step 1: Build the Docker image
docker build -t $IMAGE_NAME .

# Step 2: Authenticate with GHCR
echo $GITHUB_TOKEN | docker login ghcr.io -u $GITHUB_USERNAME --password-stdin

if docker images | grep -q "$IMAGE_NAME"; then
  echo "Removing existing image: $IMAGE_NAME"
  docker rmi -f $IMAGE_NAME
else
  echo "No existing image found for $IMAGE_NAME"
fi

# Step 3: Push the image to GHCR
docker push $IMAGE_NAME

# Step 4: Cleanup
docker logout ghcr.io
