#!/bin/sh
echo "\n\n\n\n\n---- Git hooks init (using mookme) ----"
yarn install
yarn dlx mookme init --only-hook --skip-types-selection

echo "\n\n\n\n\n---- Your working directory is all set :) ----"