export interface InputValuesState {
  fname: string;
  lname: string;
  email: string;
  phoneNumber: string;
  barber: number | '';
  service: number | '';
  date: string;
  time: string | '';
}

export interface ErrorStates {
  name: boolean;
  email: boolean;
  phoneNumber: boolean;
  barber: boolean;
  service: boolean;
  date: boolean;
  time: boolean;
}
