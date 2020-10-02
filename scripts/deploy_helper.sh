#!/bin/bash

cd $PROJECT
npm ci
npm test
sudo systemctl restart $PROJECT
