import WorkHours from './WorkHours';

export default interface Barber {
  id: number;
  firstName: string;
  lastName: string;
  workHours: WorkHours[];
}
