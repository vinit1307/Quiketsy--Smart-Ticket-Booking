import React from 'react';
import Carousel from "./Carousel";

const Home = () => {
  return (
    <div className="mt-9 w-full">
      <Carousel
        autoplay={true}
        autoplayDelay={3000}
        pauseOnHover={true}
        loop={true}
        round={false}
      />
    </div>
  );
};

export default Home;