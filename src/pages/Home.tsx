import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import stockBarberPhoto from '../assets/images/image.jpg';
import '../assets/styles/home.scss';
import Appointment from '../interfaces/Appointment';
import { ErrorStates, InputValuesState } from '../interfaces/AppointmentForm';
import Barber from '../interfaces/Barber';
import Service from '../interfaces/Service';

function Home(): JSX.Element {
  const [barbers, setBarbers] = useState<Barber[]>([
    {
      id: 0,
      firstName: '',
      lastName: '',
      workHours: [
        {
          id: 0,
          day: 0,
          startHour: 0,
          endHour: 0,
          lunchTime: {
            startHour: 0,
            durationMinutes: 0,
          },
        },
      ],
    },
  ]);

  const [services, setServices] = useState<Service[]>([
    {
      id: 0,
      name: '',
      durationMinutes: 0,
      price: 0,
    },
  ]);

  const [timeOptions, setTimeOptions] = useState<JSX.Element[]>([]);

  // gets barbers from backend
  useEffect(() => {
    axios
      .get('/barbers')
      .then((response) => {
        setBarbers(response.data);
      })
      .catch(() => {
        alert('An unexpected error has occurred! Please try again later.');
      });
  }, []);

  // gets services from backend
  useEffect(() => {
    axios
      .get('/services')
      .then((response) => {
        setServices(response.data);
      })
      .catch(() => {
        alert('An unexpected error has occurred! Please try again later.');
      });
  }, []);

  const [errors, setErrors] = useState<ErrorStates>({
    name: false,
    email: false,
    phoneNumber: false,
    barber: false,
    service: false,
    date: false,
    time: false,
  });

  const [inputValues, setInputValues] = useState<InputValuesState>({
    fname: '',
    lname: '',
    email: '',
    phoneNumber: '',
    barber: 0,
    service: 0,
    date: '',
    time: '',
  });

  const [priceField, setPriceField] = useState<string>('Select any service.');

  function handleChange(
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ): void {
    setInputValues({
      ...inputValues,
      [e.target.name]: e.target.value,
    });
    setErrors({
      //clears field errors upon detecting a change
      ...errors,
      [e.target.name === 'fname' || e.target.name === 'lname' // checks if the field is one of the name fields (since both name fields share one error msg)
        ? 'name' // if it is, it clears the name fields error
        : e.target.name]: false, // if it isn't, it finds the field by name and clears its error
    });
    if (e.target.name === 'service') {
      updateTimeOptions(inputValues.date, inputValues.barber, +e.target.value);
      if (e.target.value !== '') {
        const price = services.find(
          (service) => service.id == +e.target.value
        )?.price;
        setPriceField(`Price is ${price} €`);
      } else setPriceField(`Select any service.`);
    }
    if (e.target.name === 'barber')
      updateTimeOptions(inputValues.date, +e.target.value, inputValues.service);
    if (e.target.name === 'date')
      updateTimeOptions(
        e.target.value,
        inputValues.barber,
        inputValues.service
      );
  }

  async function updateTimeOptions(
    selectedDate: string,
    selectedBarber: number,
    selectedService: number
  ) {
    if (barbers) {
      const date = new Date(selectedDate);
      const day = date.getDay();
      const barber = barbers.find((barber) => barber.id == selectedBarber);
      const startHour = moment(
        barber?.workHours[day - 1].startHour + '.00',
        'HH.mm'
      );

      const lunchStart = moment(
        barber?.workHours[day - 1].lunchTime.startHour + '.00',
        'HH.mm'
      );

      const lunchDuration =
        barber?.workHours[day - 1].lunchTime.durationMinutes;
      const lunchEnd = moment(
        barber?.workHours[day - 1].lunchTime.startHour + '.00',
        'HH.mm'
      ).add(lunchDuration, 'minutes');
      const endHour = moment(
        barber?.workHours[day - 1].endHour + '.00',
        'HH.mm'
      );
      const duration = services.find(
        (service) => service.id == selectedService
      )?.durationMinutes;
      // round starting minutes up to nearest 10
      // note that 59 will round up to 60, and moment.js handles that correctly
      startHour.minutes(Math.ceil(startHour.minutes() / 10) * 10);

      const result: string[] = [];

      const current = moment(startHour);

      while (current <= endHour) {
        result.push(current.format('HH.mm'));
        current.add(10, 'minutes');
      }

      const momentDate = moment(date, 'DD/MM/YYYY');

      const response = await axios.get('/appointments');

      const appointments: Appointment[] = response.data;

      const barberAppointments = appointments.filter(
        (appointment) => appointment.barberId == selectedBarber
      );

      const appointmentsFormatted = barberAppointments.map((appointment) => {
        return {
          start: moment(moment.unix(appointment.startDate), 'MM/DD/YYYY HH.mm'),
          serviceId: appointment.serviceId,
        };
      });

      const conflictingAppointments = appointmentsFormatted.filter(
        (appointment) => moment(appointment.start).isSame(momentDate, 'day')
      );

      const formattedConflicts = conflictingAppointments.map((appointment) => {
        const conflictDuration = services.find(
          (service) => service.id === appointment.serviceId
        )?.durationMinutes;
        return {
          start: moment(appointment.start).format('HH.mm'),
          duration: conflictDuration,
          end: moment(appointment.start)
            .add(conflictDuration, 'minutes')
            .format('HH.mm'),
        };
      });

      const availableIntervals = result.filter((time) => {
        let ok = true;
        const testStartTime = moment(time, 'HH.mm');
        const testEndTime = moment(time, 'HH.mm').add(duration, 'minutes');

        if (
          //////This makes sure that sessions dont go longer than the barber's shift
          testStartTime.isSame(endHour) ||
          testEndTime.isAfter(endHour) ||
          //////This makes sure that the sessions arent during the barber's lunch break
          testStartTime.isSame(lunchStart) ||
          testStartTime.isBetween(lunchStart, lunchEnd) ||
          testEndTime.isBetween(lunchStart, lunchEnd) ||
          (testStartTime.isBefore(lunchStart) &&
            testEndTime.isSameOrAfter(lunchEnd))
        )
          ok = false;

        formattedConflicts.forEach((conflict) => {
          const conflictStart = moment(conflict.start, 'HH.mm');
          const conflictEnd = moment(conflict.end, 'HH.mm');
          if (
            //////These make sure that appointments dont overlap other already-booked appointments
            testStartTime.isSame(conflictStart) ||
            testStartTime.isBetween(conflictStart, conflictEnd) ||
            testEndTime.isBetween(conflictStart, conflictEnd) ||
            (testStartTime.isBefore(conflictStart) &&
              testEndTime.isSameOrAfter(conflictEnd))
          ) {
            ok = false;
          }
        });
        return ok;
      });

      const formattedIntervals = availableIntervals.map((time) => (
        <option value={time} key={time}>
          {time}
        </option>
      ));
      setTimeOptions(formattedIntervals);
    }
  }

  function areInputsValid(): boolean {
    let inputsAreValid = true;
    const errorsTemporary = { ...errors };
    // validates first and last name
    if (inputValues.fname.length < 2 || inputValues.lname.length < 2) {
      errorsTemporary.name = true;
      inputsAreValid = false;
    }
    // regex that checks if email is valid
    let pattern =
      /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    if (pattern.test(inputValues.email) !== true) {
      errorsTemporary.email = true;
      inputsAreValid = false;
    }
    // regex that checks if phone number is slovenian, possibly inaccurate, numbers were copied from wikipedia
    pattern =
      /^(\+386|030|040|068|069|031|041|051|065|070|071|064|065|059|081|082|083)([0-9]{6}|[0-9]{8})$/gm;
    if (pattern.test(inputValues.phoneNumber) !== true) {
      errorsTemporary.phoneNumber = true;
      inputsAreValid = false;
    }
    // checks if barber is selected
    if (!inputValues.barber) {
      errorsTemporary.barber = true;
      inputsAreValid = false;
    }
    // checks if service is selected
    if (!inputValues.service) {
      errorsTemporary.service = true;
      inputsAreValid = false;
    }
    // checks if date is selected
    if (!inputValues.date) {
      errorsTemporary.date = true;
      inputsAreValid = false;
    }
    // checks if time is selected
    if (!inputValues.time) {
      errorsTemporary.time = true;
      inputsAreValid = false;
    }
    setErrors(errorsTemporary);
    return inputsAreValid;
  }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    e.preventDefault();
    if (!areInputsValid()) return;
    try {
      const response = await axios.post('/appointments', {
        startDate: moment(
          inputValues.date + ' ' + inputValues.time,
          'YYYY-MM-DD HH.mm'
        ).unix(),
        barberId: +inputValues.barber,
        serviceId: +inputValues.service,
      });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  const BarberOptions = barbers.map((barber) => {
    return (
      <option value={barber.id} key={barber.id}>
        {barber.firstName} {barber.lastName}
      </option>
    );
  });

  const ServiceOptions = services.map((service) => {
    return (
      <option value={service.id} key={service.id}>
        {service.name}
      </option>
    );
  });

  return (
    <div className="main">
      <header>
        <h1>BOOK YOUR BARBER</h1>
        <h3>
          Great Hair Doesn&apos;t Happen By Chance. It Happens By Appointment!
        </h3>
        <h3>So Don&apos;t Wait And Book Your Appointment Now!</h3>
      </header>
      <div className="container">
        <div className="image-container">
          <img src={stockBarberPhoto} />
        </div>
        <div className="form-container">
          <h2>BOOK YOUR APPOINTMENT</h2>
          <form onSubmit={handleSubmit}>
            <div className="field-group">
              <div className="field">
                <input
                  type="text"
                  name="fname"
                  placeholder="First Name"
                  value={inputValues.fname}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="field">
                <input
                  type="text"
                  name="lname"
                  placeholder="Last Name"
                  value={inputValues.lname}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            {errors.name && (
              <div className="error-msg">Please enter your full name</div>
            )}
            <div className="field-group">
              <div className="field">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  value={inputValues.email}
                  onChange={handleChange}
                />
              </div>
              <div className="field">
                <input
                  type="tel"
                  name="phoneNumber"
                  placeholder="Contact Number"
                  value={inputValues.phoneNumber}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="error-msg">
              <div>{errors.email && <>Please enter a valid email</>}</div>

              <div>{errors.phoneNumber && <>Please enter phone number</>}</div>
            </div>
            <div className="field-group">
              <div className="field">
                <select
                  name="barber"
                  required
                  value={inputValues.barber}
                  onChange={handleChange}
                >
                  <>
                    <option value={0} disabled hidden>
                      Select Barber
                    </option>
                    {BarberOptions}
                  </>
                </select>
              </div>
              <div className="field">
                <select
                  name="service"
                  required
                  value={inputValues.service}
                  onChange={handleChange}
                >
                  <>
                    <option value={0} disabled hidden>
                      Select Service
                    </option>
                    {ServiceOptions}
                  </>
                </select>
              </div>
            </div>
            <div className="error-msg">
              <div>{errors.barber && <>Please select a barber</>}</div>
              <div>{errors.service && <>Please select a service</>}</div>
            </div>
            <div className="field-group">
              <div className="field">
                <input
                  type="date"
                  name="date"
                  placeholder="Select Date"
                  value={inputValues.date}
                  onChange={handleChange}
                  required
                  disabled={
                    inputValues.barber && inputValues.service ? false : true
                  }
                />
              </div>
              <div className="field">
                <select
                  name="time"
                  required
                  value={inputValues.time}
                  onChange={handleChange}
                  disabled={
                    inputValues.barber &&
                    inputValues.service &&
                    inputValues.date
                      ? false
                      : true
                  }
                >
                  <option value="" disabled hidden>
                    Select Time
                  </option>
                  {timeOptions}
                </select>
              </div>
            </div>
            <div className="error-msg">
              <div>{errors.date && <>Please pick a date</>}</div>
              <div>{errors.time && <>Please pick a time</>}</div>
            </div>
            <div className="field-group">
              <input type="text" name="price" value={priceField} disabled />
            </div>
            <button type="submit">BOOK APPOINTMENT</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Home;
