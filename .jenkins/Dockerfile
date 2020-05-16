FROM node:stretch-slim

RUN apt update && apt install -y \
    wine64 \
    unzip \
 && rm -rf /var/lib/apt/lists/*

ENTRYPOINT /bin/bash
