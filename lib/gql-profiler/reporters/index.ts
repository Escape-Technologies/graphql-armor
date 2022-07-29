import nullReporterFactory from './null';
import memoryReporterFactory from './memory';
import htmlReporterFactory from './html';

export const nullReporter = nullReporterFactory;
export const memoryReporter = memoryReporterFactory;
export const htmlReporter = htmlReporterFactory;
