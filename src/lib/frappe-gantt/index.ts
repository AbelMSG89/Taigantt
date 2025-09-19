// Re-export the Gantt class from the local library
// @ts-ignore
import Gantt from './src/index.js';

export default Gantt;
export { Gantt };
export type { GanttTask, GanttOptions } from './types.js';