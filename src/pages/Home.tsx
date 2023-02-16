import axios from 'axios';
import React, { useEffect, useState } from 'react';
import stockBarberPhoto from '../assets/images/image.jpg';
import '../assets/styles/home.scss';
import { ErrorStates, InputValuesState } from '../interfaces/AppointmentForm';
import Barber from '../interfaces/Barber';

function Home(): JSX.Element {
  const [barbers, setBarbers] = useState<Barber[]>([
    {
      id: 0,
      firstName: '',
      lastName: '',
      workHours: [],
    },
  ]);

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
    barber: '',
    service: '',
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
    if (e.target.name === 'service' && e.target.value !== '') {
      switch (e.target.value) {
        case '1':
          setPriceField('Price is 15 €');

          break;
        case '2':
          setPriceField('Price is 20 €');
          break;
        case '3':
          setPriceField('Price is 30 €');
          break;
      }
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

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    areInputsValid();
    alert(JSON.stringify(inputValues));
  }

  const BarberOptions = barbers.map((barber) => {
    return (
      <option value={barber.id} key={barber.id}>
        {barber.firstName} {barber.lastName}
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
                    <option value="" disabled hidden>
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
                  <option value="" disabled hidden>
                    Select Service
                  </option>
                  <option value="1">Shave</option>
                  <option value="2">Haircut</option>
                  <option value="3">Shave + Haircut</option>
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
                />
              </div>
              <div className="field">
                <select
                  name="time"
                  required
                  value={inputValues.time}
                  onChange={handleChange}
                >
                  <option value="" disabled hidden>
                    Select Time
                  </option>
                  <option value="1">10.00</option>
                  <option value="2">11.00</option>
                  <option value="3">12.00</option>
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
