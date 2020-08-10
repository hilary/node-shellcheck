#!/usr/bin/env bash

set -e

[ -z "$DEBUG" ] || { export PS4='+ [shellcheck/${BASH_SOURCE##*/}:${LINENO}] '; set -x; }

# Download & Extract
node download.js
