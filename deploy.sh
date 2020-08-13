#!/bin/bash

cd cron-push
npm ci
npm test
# sudo systemctl restart cron-push
