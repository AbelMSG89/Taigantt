// Type definitions for local frappe-gantt
export interface GanttTask {
  id: string | number;
  name: string;
  start: string;
  end: string;
  progress?: number;
  dependencies?: string;
  custom_class?: string;
  color_progress?: string;
}

export interface GanttOptions {
  view_mode?: 'Day' | 'Week' | 'Month' | 'Year';
  date_format?: string;
  show_expected_progress?: boolean;
  readonly?: boolean;
  language?: string;
  popup_trigger?: 'click' | 'hover';
  on_click?: (task: GanttTask) => void;
  on_date_change?: (task: GanttTask, start: Date, end: Date) => void;
  on_progress_change?: (task: GanttTask, progress: number) => void;
  on_view_change?: (mode: string) => void;
}

declare class Gantt {
  constructor(wrapper: string | HTMLElement | SVGElement, tasks: GanttTask[], options?: GanttOptions);
  change_view_mode(mode?: string): void;
  clear(): void;
  render(): void;
  refresh(tasks: GanttTask[]): void;
  hide_popup(): void;
  unselect_all(): void;
  scroll_today(): void;
}

export default Gantt;