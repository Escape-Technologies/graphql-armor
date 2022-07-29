export default (fn, reporter, name) => async (...args) => {
    const evt = reporter.newEvent && reporter.newEvent(fn, args, name);

    if (reporter.start) {
        reporter.start(evt);
    }

    try {
        const result = await fn(...args);

        if (reporter.end) {
            reporter.end(evt, result);
        }

        return result;
    } catch (err) {
        if (reporter.error) {
            reporter.error(evt, err);
        }

        throw err;
    }
};
