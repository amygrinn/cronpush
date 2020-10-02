#!/bin/bash

rsync --recursive --delete \
  $TRAVIS_BUILD_DIR/bin \
  $TRAVIS_BUILD_DIR/package.json \
  $TRAVIS_BUILD_DIR/package-lock.json \
  $USER@$HOST:$PROJECT

ssh $USER@$HOST 'bash -sl' < $TRAVIS_BUILD_DIR/scripts/deploy_helper.sh
