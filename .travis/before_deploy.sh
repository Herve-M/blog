#!/bin/bash

eval "$(ssh-agent -s)"

if [ "$TRAVIS_BRANCH" = "master" -a "$TRAVIS_PULL_REQUEST" = "false" ]
then
  openssl aes-256-cbc -K $encrypted_04cedcf2d7b8_key -iv $encrypted_04cedcf2d7b8_iv -in .travis/site-deploy.enc -out /tmp/deploy-key -d
else
  openssl aes-256-cbc -K $encrypted_04cedcf2d7b8_key -iv $encrypted_04cedcf2d7b8_iv -in .travis/beta-deploy.enc -out /tmp/deploy-key -d
fi

chmod 600 /tmp/deploy-key
ssh-add /tmp/deploy-key
