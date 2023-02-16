export default interface WorkHours {
  id: number;
  day: number;
  startHour: number;
  endHour: number;
  lunchTime: {
    startHour: number;
    durationMinutes: number;
  };
}
