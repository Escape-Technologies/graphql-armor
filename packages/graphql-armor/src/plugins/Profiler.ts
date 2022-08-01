import { ArmorPlugin } from '../ArmorPlugin';
import { PluginConfig } from '../types';
const fs = require('fs');

export type ProfilerConfig = {
  Profiler?: {} & PluginConfig;
};
export const DefaultProfilerConfig = {
  _namespace: 'Profiler',
  enabled: true,
};

class WeightsStore {
  private store: Record<string, number> = {};
  private mustSave = false;
  private perfPath = 'perf-store.json';

  constructor() {
    try {
      this.store = JSON.parse(fs.readFileSync(this.perfPath));
    } catch (e) {
      console.log('WARNING: Could not load perf.json.');
    }

    // auto save
    setInterval(() => {
      this.save();
    }, 1000);
  }

  public knows(key) {
    return this.store[key] !== undefined;
  }

  public get(key) {
    return this.store[key];
  }

  public add(key, dt) {
    this.store[key] = dt;
    this.mustSave = true;
  }

  private save() {
    if (!this.mustSave) return;

    console.log('SAVING');
    fs.writeFileSync(this.perfPath, JSON.stringify(this.store, null, 4));

    this.mustSave = false;
  }
}

export const WEIGHTS = new WeightsStore();

const registerPerf = (name: string, df: number) => {
  console.log(name, df);
  WEIGHTS.add(name, df);
};
const getResolverName = (prefix: string, key) => (prefix === 'ROOT' ? key : `${prefix}/${key}`);

const monitor =
  (fn, reporter, name) =>
  async (...args) => {
    const t0 = performance.now();
    try {
      const result = await fn(...args);
      return wrapFunc(result, reporter, name);
    } catch (err) {
      throw err;
    } finally {
      const dt = performance.now() - t0;
      registerPerf(name, dt);
    }
  };

const wrapFunc = (
  resolvers,
  reporter,
  namePrefix = 'ROOT', // resolvers
) => {
  const wrapped = {};

  Object.keys(resolvers).forEach((key) => {
    const resolver = resolvers[key];
    const name = getResolverName(namePrefix, key);

    if (typeof resolver === 'object') {
      wrapped[key] = wrapFunc(resolver, reporter, name);
    } else if (typeof resolver === 'function') {
      wrapped[key] = monitor(resolver, reporter, name);
    } else {
      wrapped[key] = resolver;
    }
  });

  return wrapped;
};
const wrapResolvers = (resolvers) => {
  const config = {
    reporter: {},
  };

  const reporter = typeof config.reporter === 'function' ? config.reporter() : config.reporter;

  return wrapFunc(resolvers, reporter);
};

export class Profiler extends ArmorPlugin {
  apolloPatchConfig(apolloConfig): any {
    apolloConfig.resolvers = wrapResolvers(apolloConfig.resolvers);
    return apolloConfig;
  }
}
