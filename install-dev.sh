#!/bin/sh

echo "Installing development tools..."
yarn

echo "Initializing mookme..."
yarn dlx mookme init --only-hook --skip-types-selection

echo "Building GraphQL Armor"
yarn workspaces foreach -ptv run build

echo "Run commands using `yarn workspace @escape.tech/{pkg} {cmd}`"