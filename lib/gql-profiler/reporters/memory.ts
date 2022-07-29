/* eslint-disable no-param-reassign */
import uuid from 'uuid';

const durationToMs = duration => (duration[0] * 1000) + (duration[1] / 1000000);

const findParent = (route, root) => {
    let cursor = root;
    const parentRoute = [...route];
    parentRoute.pop(); // Remove child

    parentRoute.forEach((step) => {
        const child = cursor.children.find(c => c.name === step);
        cursor = child;
    });

    return cursor;
};

const insertHitInHierarchy = (hit, root) => {
    const route = hit.name.split('.');
    const duration = durationToMs(hit.duration);

    Array.from({length: route.length}, (x, i) => i).forEach((level) => {
        const resolverName = route[level];
        const levelRoute = route.filter((_, i) => i <= level);

        const parent = level === 0 ? root : findParent(levelRoute, root);

        let child = parent.children.find(c => c.name === resolverName);

        if (!child) {
            child = {
                name: resolverName, value: 0, children: [],
            };

            parent.children.push(child);
        }

        child.value += duration;

        if (level === 0) {
            root.value += duration;
        }
    });
};

const handleEventEnd = (hit, hierarchy) => {
    hit.end = process.hrtime();
    hit.endDate = new Date();
    hit.duration = process.hrtime(hit.start);
    insertHitInHierarchy(hit, hierarchy);

    return hit;
};

export default class MemoryReporter {
    private events;
    private hierarchy;
    private hit: any;

    constructor() {
        this.reset();
    }

    reset() {
        this.events = [];
        this.hierarchy = {name: 'root', value: 0, children: []};

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

    end() {
        handleEventEnd(this.hit, this.hierarchy);
        this.hit.error = null;
    }

    error(hit, error) {
        handleEventEnd(hit, this.hierarchy);
        hit.error = error;
    }

    getEvents() {
        return this.events
    }

    getHierarchy() {
        return this.hierarchy;
    };


}

