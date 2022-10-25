#!/bin/sh

echo "Installing development tools..."
yarn

echo "Initializing mookme..."
yarn dlx @escape.tech/mookme init --only-hook --skip-types-selection

echo "Building GraphQL Armor..."
yarn build

echo "Run commands using 'yarn workspace @escape.tech/{pkg} {cmd}'"
