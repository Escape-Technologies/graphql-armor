const uuid = require('uuid');

const durationToMs = duration => (duration[0] * 1000) + (duration[1] / 1000000);

export default class MemoryReporter {
    private events;
    private hierarchy;

    private static findParent(route, root) {
        let cursor = root;
        const parentRoute = [...route];
        parentRoute.pop(); // Remove child

        parentRoute.forEach((step) => {
            const child = cursor.children.find(c => c.name === step);
            cursor = child;
        });

        return cursor;
    };

    private static insertHitInHierarchy(hit, root) {
        const route = hit.name.split('.');
        const duration = durationToMs(hit.duration);

        Array.from({length: route.length}, (x, i) => i).forEach((level) => {
            const resolverName = route[level];
            const levelRoute = route.filter((_, i) => i <= level);

            const parent = level === 0 ? root : MemoryReporter.findParent(levelRoute, root);

            let child = parent.children.find(c => c.name === resolverName);

            if (!child) {
                child = {
                    name: resolverName, value: 0, children: [], count:0
                };

                parent.children.push(child);
            }

            child.value += duration;
            child.count += 1;

            if (level === 0) {
                root.value += duration;
                root.count += 1;
            }
        });
    }

    private static handleEventEnd(hit, hierarchy) {
        hit.end = process.hrtime();
        hit.endDate = new Date();
        hit.duration = process.hrtime(hit.start);
        this.insertHitInHierarchy(hit, hierarchy);

        return hit;
    }


    constructor() {
        this.reset();
    }

    end(hit) {
        MemoryReporter.handleEventEnd(hit, this.hierarchy);
        const recursiveLog = (h: any, path: any[] = []) => {
            for (const child of h.children) recursiveLog(child, [...path, child.name]);
            if (h.children.length === 0) console.log("log", path.join("/"), h.value/h.count);
        }
        recursiveLog(this.hierarchy);

        hit.error = null;
    }

    newEvent(fn, args, name) {
        const hit = {id: uuid.v4(), name};
        this.events.push(hit);
        return hit;
    }

    start(hit) {
        hit.start = process.hrtime();
        hit.startDate = new Date();
    }

    error(hit, error) {
        MemoryReporter.handleEventEnd(hit, this.hierarchy);
        hit.error = error;
    }

    getHierarchy() {
        return this.hierarchy
    }

    getEvents() {
        return this.events
    }

    private reset() {
        this.events = [];
        this.hierarchy = {name: 'root', value: 0, children: [], count:0};
    }
}

