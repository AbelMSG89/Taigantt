export const GANTT_CONFIG = {
  view_mode: 'Week',
  date_format: 'YYYY-MM-DD',
  popup_trigger: 'click',
  language: 'en'
} as const;

export const GANTT_VIEW_MODES = {
  QUARTER_DAY: 'Quarter Day',
  HALF_DAY: 'Half Day', 
  DAY: 'Day',
  WEEK: 'Week',
  MONTH: 'Month',
  YEAR: 'Year'
} as const;