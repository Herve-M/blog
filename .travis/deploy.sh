#!/bin/bash

if [ "$TRAVIS_TEST_RESULT" = "1" ]
then
  exit
fi

if [ "$TRAVIS_BRANCH" = "master" -a "$TRAVIS_PULL_REQUEST" = "false" ]
then
  rsync -e "ssh -i /tmp/deploy-key" -rptDv --delete-after --chown=site101:www-data public/ site101@hervematysiak.eu:/var/www/sites/hervematysiak.eu/web/
else
  rsync -e "ssh -i /tmp/deploy-key" -rptDv --delete-after --chown=site102:www-data public/ site102@hervematysiak.eu:/var/www/sites/beta.hervematysiak.eu/web/
fi
