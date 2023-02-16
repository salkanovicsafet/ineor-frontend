import React from 'react';
import stockBarberPhoto from '../assets/images/image.jpg';
import '../assets/styles/home.scss';

function Home(): JSX.Element {
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
          <form>
            <div className="field-group">
              <div className="field">
                <input
                  type="text"
                  name="fname"
                  placeholder="First Name"
                  required
                />
              </div>
              <div className="field">
                <input
                  type="text"
                  name="lname"
                  placeholder="Last Name"
                  required
                />
              </div>
            </div>
            <div className="field-group">
              <div className="field">
                <input type="email" name="email" placeholder="Email" required />
              </div>
              <div className="field">
                <input
                  type="tel"
                  name="phoneNumber"
                  placeholder="Contact Number"
                  required
                />
              </div>
            </div>
            <div className="field-group">
              <div className="field">
                <select name="barber" required>
                  <option value="" disabled selected hidden>
                    Select Barber
                  </option>
                  <option value="1">Jože</option>
                  <option value="2">Janez</option>
                  <option value="3">Marko</option>
                </select>
              </div>
              <div className="field">
                <select name="service" required>
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
                <select name="time" required>
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
              <input
                type="text"
                name="price"
                value="Select any service."
                disabled
              />
            </div>
            <button type="submit">BOOK APPOINTMENT</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Home;
