import * as fs from 'fs'
import * as path from 'path'
const _ = require ('lodash');
import MemoryReporter from "../memory";

export default class HtmlReporter extends MemoryReporter {
    private compiled: any;

    constructor() {
        super();
        const template = fs.readFileSync(path.resolve(__dirname, './base.html'), {encoding: 'utf-8'});
        this.compiled = _.template(template);
    };

    getHtml() {
        return this.compiled({
            _, events: this.getEvents(), hierarchy: this.getHierarchy(),
        });
    }

}
