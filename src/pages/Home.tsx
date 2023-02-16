import React, { useState } from 'react';
import stockBarberPhoto from '../assets/images/image.jpg';
import '../assets/styles/home.scss';
import { inputValuesState } from '../interfaces/AppointmentForm';

function Home(): JSX.Element {
  const [inputValues, setInputValues] = useState<inputValuesState>({
    fname: '',
    lname: '',
    email: '',
    phoneNumber: '',
    barber: '',
    service: '',
    date: new Date(),
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
    const pattern =
      /^(\+386|030|040|068|069|031|041|051|065|070|071|064|065|059|081|082|083)([0-9]{6}|[0-9]{8})$/gm; // regex that checkes if phone number is slovenian, possibly inaccurate, numbers were copied from wikipedia
    if (pattern.test(inputValues.phoneNumber) !== true) {
      alert('Phone no gud pls fix');
      return false;
    }
    return true;
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    areInputsValid();
    alert(JSON.stringify(inputValues));
  }

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
            <div className="field-group">
              <div className="field">
                <select
                  name="barber"
                  required
                  value={inputValues.barber}
                  onChange={handleChange}
                >
                  <option value="" disabled selected hidden>
                    Select Barber
                  </option>
                  <option value="1">Jože</option>
                  <option value="2">Janez</option>
                  <option value="3">Marko</option>
                </select>
              </div>
              <div className="field">
                <select
                  name="service"
                  required
                  value={inputValues.service}
                  onChange={handleChange}
                >
                  <option value="" disabled selected hidden>
                    Select Service
                  </option>
                  <option value="1">Shave</option>
                  <option value="2">Haircut</option>
                  <option value="3">Shave + Haircut</option>
                </select>
              </div>
            </div>
            <div className="field-group">
              <div className="field">
                <input
                  type="date"
                  name="date"
                  placeholder="Select Date"
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
                  <option value="" disabled selected hidden>
                    Select Time
                  </option>
                  <option value="1">10.00</option>
                  <option value="2">11.00</option>
                  <option value="3">12.00</option>
                </select>
              </div>
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
