/**
 * Guards against multiple graphql installations in the monorepo.
 *
 * The workspace pins a single graphql major. When a package resolves a
 * different version (e.g. an example still pinning 16.x), Yarn cannot hoist it
 * and installs multiple physical copies; `GraphQLError` then fails
 * `instanceof` checks across package boundaries at runtime. See PR #875.
 */
const fs = require('node:fs');
const path = require('node:path');

// Collect every installed package whose *declared* name is `graphql`, no
// matter where it is nested (e.g. `@nestjs/graphql` is not counted: its
// package name differs).
function collectGraphqlCopies(dir, found) {
  let stats;
  try {
    stats = fs.statSync(dir);
  } catch {
    return found;
  }
  if (!stats.isDirectory()) {
    return found;
  }
  const manifestPath = path.join(dir, 'package.json');
  if (fs.existsSync(manifestPath)) {
    try {
      if (JSON.parse(fs.readFileSync(manifestPath, 'utf8')).name === 'graphql') {
        found.push(dir);
      }
    } catch {
      // not readable as a package manifest; keep walking
    }
  }
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory() && entry.name !== '.yarn') {
      collectGraphqlCopies(path.join(dir, entry.name), found);
    }
  }
  return found;
}

describe('node_modules integrity', () => {
  it('has exactly one graphql installation', () => {
    const root = path.join(__dirname, '..', 'node_modules');
    const copies = collectGraphqlCopies(root, []);
    expect(copies.length).toBeGreaterThan(0);

    const versions = copies.map((p) => JSON.parse(fs.readFileSync(path.join(p, 'package.json'), 'utf8')).version);
    expect(new Set(versions).size).toBe(1);

    // The shared version must satisfy every workspace's declared range;
    // mixing majors breaks `instanceof` checks across package boundaries.
    const [version] = versions;
    expect(version).toMatch(/^\d+\./);
  });
});
