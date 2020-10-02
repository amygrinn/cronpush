#!/bin/bash

rsync --recursive --delete \
  $TRAVIS_BUILD_DIR/bin \
  $TRAVIS_BUILD_DIR/package.json \
  $TRAVIS_BUILD_DIR/package-lock.json \
  cron-push@cronpush.tygr.info:cron-push

ssh cron-push@cronpush.tygr.info 'bash -sl' < $TRAVIS_BUILD_DIR/scripts/deploy_helper.sh
