import axios from 'axios';
import React, { useEffect, useState } from 'react';
import '../assets/styles/success.scss';

function Home(): JSX.Element {
  const [gifSrc, setgifSrc] = useState<string>('');

  async function getGif() {
    const response = await axios.get(
      'https://api.giphy.com/v1/gifs/search?api_key=KeTn0RgXZQF8EDkUGgQmSaJYuWPEz5mI&q=barber'
    );
    const gifs = response.data.data;
    const randomGifUrl =
      gifs[Math.floor(Math.random() * gifs.length)].images.original.url; //gets random gif from array and takes its url
    setgifSrc(randomGifUrl);
  }

  useEffect(() => {
    getGif();
  }, []);

  return (
    <div className="success-page__main">
      <h4>APPOINTMENT SUCCESSFULLY BOOKED</h4>
      <div className="gif-container">
        <img src={gifSrc} />
      </div>
    </div>
  );
}

export default Home;
