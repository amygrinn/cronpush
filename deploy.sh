#!/bin/bash

cd cron-push
git pull
npm install --production=false
npm run build
npm run serve
