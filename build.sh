# !/bin/bash

if [ "$CF_PAGES_BRANCH" == "production" ]; then
  hugo --environment production --buildExpired --minify
elif [ "$CF_PAGES_BRANCH" == "staging" ]; then
  hugo --environment staging --buildExpired --minify
fi