#!/bin/bash

#Init
MY_DIR=$(dirname $(readlink -f $0))

##INCLUDE
#Options
# GET CURRENT DATETIME
NOW=$(date +"%d_%m_%Y")
LOG_FILE="/tmp/hugo-$NOW.log"
#Functions
source "${MY_DIR}/inc.func.sh"

displayTitle "Hugo build script"

BUILD_ACTION=false
SYNC_ACTION=false
TARGET="no target given see -h"

function usage()
{
    echo ""
    echo "./build.sh"
    echo "-h |--help"
    echo "-v |--version"
    echo "-t | --type         | Version to build [beta,site]"
    echo "-s | --sync         | Sync to host"
    echo ""
}

function versions() {
  echo "Tools version:"
  echo $(hugo version)
  echo "NPM: "$(npm --version)
}

function build() {
  if [ $1 = "beta" ]; then
    displayAndExec "Building site            " "hugo -b https://beta.hervematysiak.eu/ --buildDrafts --buildExpired --buildFuture --cleanDestinationDir"
  elif [ $1 = "site" ]; then
    displayAndExec "Building site            " "hugo -b https://hervematysiak.eu/ --buildExpired --cleanDestinationDir"
  else
    displayErrorAndExit 1 "No action defined for $1"
  fi
  displayAndExec "Minifing HTML            " "html-minifier -c html-minifier.conf --input-dir public/ --output-dir public/ --file-ext html"
}

function sync() {
  if [ $1 = "beta" ]; then
    displayAndExec "Syncing                  " "rsync -rptDv --delete-after --chown=site102:www-data  public/ site102@hervematysiak.eu:/var/www/sites/beta.hervematysiak.eu/web/"
  elif [ $1 = "site" ]; then
    displayAndExec "Syncing                  " "rsync -rptDv --delete-after --chown=site101:www-data  public/ site101@hervematysiak.eu:/var/www/sites/hervematysiak.eu/web/"
  else
    displayErrorAndExit 1 "No action defined for $1"
  fi
}

while [ "$1" != "" ]; do
    PARAM=`echo $1 | awk -F= '{print $1}'`
    VALUE=`echo $1 | awk -F= '{print $2}'`
    case $PARAM in
        -h | --help)
          usage
          exit
            ;;
        -v | --version)
		     versions
         exit
            ;;
        -t | --type)
          BUILD_ACTION=true
          TARGET=$VALUE
            ;;
        -s | --sync)
          SYNC_ACTION=true
            ;;
        *)
            echo "ERROR: unknown parameter \"$PARAM\""
            usage
            exit 1
            ;;
    esac
    shift
done

#
if [ "$BUILD_ACTION" = true ]; then {
  build $TARGET
}
fi
if [ "$SYNC_ACTION" = true ]; then {
  sync $TARGET
}
fi
