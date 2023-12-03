#!/bin/bash

set -e

IMAGE_NAME="market-maker"

echo "Building Docker image..."
docker build -t $IMAGE_NAME .

if [ $(docker ps -q -f name=$IMAGE_NAME) ]; then
    echo "Stopping existing container..."
    docker stop $IMAGE_NAME
    echo "Removing existing container..."
    docker rm $IMAGE_NAME
fi


echo "Running Docker container..."
docker run --env-file .env -d --name $IMAGE_NAME $IMAGE_NAME
