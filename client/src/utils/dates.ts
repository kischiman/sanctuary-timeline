export const formatDateHeader = (date: string): string => {
  const dateObj = new Date(date + 'T00:00:00');
  return dateObj.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
};

export const isToday = (date: string): boolean => {
  const today = new Date();
  const checkDate = new Date(date + 'T00:00:00');
  return checkDate.toDateString() === today.toDateString();
};

export const generateDateRange = (startDate: string, endDate: string): string[] => {
  const dates = [];
  const current = new Date(startDate + 'T00:00:00');
  const end = new Date(endDate + 'T00:00:00');
  
  while (current <= end) {
    dates.push(current.toISOString().split('T')[0]);
    current.setDate(current.getDate() + 1);
  }
  
  return dates;
};

export const getTodayDateString = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const isWeekend = (date: string): boolean => {
  const dateObj = new Date(date + 'T00:00:00');
  const dayOfWeek = dateObj.getDay();
  return dayOfWeek === 0 || dayOfWeek === 6; // Sunday = 0, Saturday = 6
};