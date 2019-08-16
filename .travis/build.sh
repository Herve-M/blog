if [ "$TRAVIS_BRANCH" = "master" -a "$TRAVIS_PULL_REQUEST" = "false" ]
then
  hugo -b https://hervematysiak.eu/ --buildExpired --cleanDestinationDir
else
  hugo -b https://beta.hervematysiak.eu/ --buildDrafts --buildExpired --buildFuture --cleanDestinationDir
  html-minifier -c html-minifier.conf --input-dir public/ --output-dir public/ --file-ext html
fi
