# !/bin/bash

if [ "$CF_PAGES_BRANCH" == "production" ]; then
  hugo --environment production --buildExpired --minify
elif [ "$CF_PAGES_BRANCH" == "staging" ]; then
  hugo --environment staging --buildDrafts --buildExpired --buildFuture --minify
fi

cp config/$CF_PAGES_BRANCH/_headers public/_headers
cp config/$CF_PAGES_BRANCH/_redirects public/_redirects