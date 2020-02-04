#!/bin/bash

cd cron-push
git pull
yarn
yarn test-server
yarn build
yarn serve

