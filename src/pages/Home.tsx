import React from 'react';
import stockBarberPhoto from '../assets/images/image.jpg';

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
      {/* <div className="image-container">
        <img src={stockBarberPhoto} />
      </div> */}
      <div className="form-container">
        <h2>BOOK YOUR APPOINTMENT</h2>
        <form>
          <div>
            <input type="text" name="fname" placeholder="First Name" required />
            <input type="text" name="lname" placeholder="Last Name" required />
          </div>
          <div>
            <input type="email" name="email" placeholder="Email" required />
            <input
              type="tel"
              name="phoneNumber"
              placeholder="Contact Number"
              required
            />
          </div>
          <div>
            <select name="barber">
              <option value="">Select Barber</option>
              <option value="1">Jože</option>
              <option value="2">Janez</option>
              <option value="3">Marko</option>
            </select>
            <select name="service">
              <option value="">Select Service</option>
              <option value="1">Shave</option>
              <option value="2">Haircut</option>
              <option value="3">Shave + Haircut</option>
            </select>
          </div>
          <div>
            <input type="date" name="date" />
            <select name="time">
              <option value="">Select Time</option>
              <option value="1">10.00</option>
              <option value="2">11.00</option>
              <option value="3">12.00</option>
            </select>
          </div>
          <div>
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
  );
}

export default Home;
