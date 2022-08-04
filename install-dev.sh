#!/bin/sh

echo "Installing development tools..."
yarn

echo "Initializing mookme..."
yarn dlx mookme init --only-hook --skip-types-selection

echo "Building GraphQL Armor"
yarn workspace @escape.tech/graphql-armor build

echo "Run commands using `yarn workspace @escape.tech/{pkg} {cmd}`"