import monitor from './monitor';
import { nullReporter } from './reporters';

const traverseResolvers = (resolvers, reporter, getResolverName, namePrefix) => {
    const wrapped = {};

    Object.keys(resolvers).forEach((key) => {
        const resolver = resolvers[key];
        const name = getResolverName(namePrefix, key, resolver);

        if (typeof resolver === 'object') {
            wrapped[key] = traverseResolvers(resolver, reporter, getResolverName, name);
        } else if (typeof resolver === 'function') {
            wrapped[key] = monitor(resolver, reporter, name);
        } else {
            wrapped[key] = resolver;
        }
    });

    return wrapped;
};

const defaultOptions = {
    enabled: true,
    disableInProduction: true,
    env: process && process.env && process.env.NODE_ENV, // === 'production',
    reporter: nullReporter,
    getResolverName: (prefix = 'ROOT', key) => (prefix === 'ROOT' ? key : `${prefix}.${key}`),
};

export default (resolvers, options = {}) => {
    const config = { ...defaultOptions, ...options };

    if (!config.enabled || (config.disableInProduction && config.env === 'production')) {
        return resolvers;
    }

    const reporter = typeof config.reporter === 'function' ? config.reporter() : config.reporter;

    return traverseResolvers(resolvers, reporter, config.getResolverName, undefined);
};
