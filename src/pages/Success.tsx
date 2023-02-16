import React from 'react';
import '../assets/styles/success.scss';

function Home(): JSX.Element {
  return (
    <div className="success-page__main">
      <h4>APPOINTMENT SUCCESSFULLY BOOKED</h4>
      <div className="gif-container">
        <img src="https://media1.giphy.com/media/xT0Gqvf58aRHQMeodG/giphy.gif?cid=07797d3d4m8wbjhmh9dog5azxp6jd2o2vrl38sk0jeww946m&rid=giphy.gif&ct=g" />
      </div>
    </div>
  );
}

export default Home;
