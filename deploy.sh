#! /bin/bash
npm run build
docker build -t datdevboi/slack-clone-server:latest .
docker push datdevboi/slack-clone-server:latest 