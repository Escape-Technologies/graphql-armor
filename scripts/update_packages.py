"""
Update all Node packages to the latest version
"""

import os

s="""./examples/apollo/package.json
./examples/nestjs/package.json
./examples/yoga/package.json
./packages/graphql-armor/package.json
./packages/plugins/block-field-suggestions/package.json
./packages/plugins/character-limit/package.json
./packages/plugins/cost-limit/package.json
./packages/plugins/max-aliases/package.json
./packages/plugins/max-depth/package.json
./packages/plugins/max-directives/package.json
./packages/plugins/max-tokens/package.json
./packages/types/package.json
./services/docs/package.json"""

if not os.path.exists("scripts/update_packages.py"):
    print("Run this script from the root of the repository with:")
    print("	   python3 scripts/update_packages.py")
    exit(1)

for path in s.split("\n"):
	dir = "/".join(path.split("/")[:-1])
	os.system(f"cd {dir}; npx npm-check-updates -u; yarn install")
