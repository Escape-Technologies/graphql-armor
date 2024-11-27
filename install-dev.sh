#!/bin/sh

echo "Installing development tools..."
yarn

echo "Initializing gookme..."
curl https://raw.githubusercontent.com/LMaxence/gookme/refs/heads/main/scripts/install.sh | $(command -v bash || command -v sh || command -v ash)

echo "Building GraphQL Armor..."
yarn build

echo "Run commands using 'yarn workspace @escape.tech/{pkg} {cmd}'"
