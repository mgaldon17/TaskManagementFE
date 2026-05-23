export const PRIORITIES = ['LOW', 'NORMAL', 'URGENT'];

export const PRIORITY_LABELS = {
  LOW: 'Low',
  NORMAL: 'Normal',
  URGENT: 'Urgent',
};

export const isValidPriority = (value) => PRIORITIES.includes(value);
