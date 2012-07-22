#!/bin/bash -e
. $HOME/.bash_profile
node scratch-for-web-loader/meta_join.ssjs
$YBUILD scratch-block-model scratch-block-render byob-model byob-render byob-render-tests
mkdir -p ../build/scratch-for-web-loader
# Also dumb as hell
rm -Rf ../build/byob-render/assets
cp -R byob-render/assets ../build/byob-render/
# This is dumb as hell, but for now, we're just copying the loader directly to the build output
cp scratch-for-web-loader/js/loader.js ../build/scratch-for-web-loader/scratch-for-web-loader.js
cp scratch-for-web-loader/js/loader.js ../build/scratch-for-web-loader/scratch-for-web-loader-min.js
cp scratch-for-web-loader/js/loader.js ../build/scratch-for-web-loader/scratch-for-web-loader-debug.js