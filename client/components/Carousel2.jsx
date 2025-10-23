import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import EventsService from "../services/eventsService";
import { Navigate, useNavigate } from "react-router-dom";

export default function Carousel2() {
    const navigate = useNavigate();

    const DEFAULT_ITEMS = [
  {
    id: 1,
    image:
      "https://www.warnermusic.de/uploads/media/image-1002-704/09/21529-FqJHoRqXsAEEs9h.jpg?v=1-7",
    title: "Event 1",
    description: "Exciting event happening soon!",
  },
  {
    id: 2,
    image:
      "https://igimage.indiaglitz.com/hindi/news/Adobe_Express_20230101_1213350_1-594.png",
    title: "Event 2",
    description: "Don't miss out on this one.",
  },
  {
    id: 3,
    image:
      "https://images.stockcake.com/public/2/3/9/2397d77f-af92-4b51-8bb9-d60d138cf4d0_large/vibrant-art-exhibition-stockcake.jpg",
    title: "Event 3",
    description: "Be part of something amazing.",
  },
];

const [items, setItems] = useState(DEFAULT_ITEMS);

useEffect(() => {
  const fetchCarouselEvents = async () => {
    try {
      const trendingEvents = await EventsService.getTrendingEvents();
      
      if (trendingEvents && trendingEvents.length > 0) {
        const carouselItems = trendingEvents.slice(0, 5).map(event => ({
          id: event.eventId || event.id, // Handle both field names
          image: event.imageUrl,
          title: event.name,
          description: `${event.eventDate} • ${event.venue}`,
        }));
        setItems(carouselItems);
      }
    } catch (error) {
      console.error("Error fetching carousel events:", error);
    }
  };

  fetchCarouselEvents();
}, []);

const handleItemClick = (itemId) => {
    if (itemId) {
      navigate(`/event/${itemId}`);
    }
  };

  var settings = {
    arrows: false,
    autoplay: true,
    autoplaySpeed: 4000,
    cssEase: "linear",
    className: "center",
    centerPadding: "60px",
    centerMode: true,
    dots: true,
    infinite: true,
    pauseOnHover: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  return (
    <Slider {...settings} className="mt-[7vh] mb-[10vh]">
      {items.map((item, idx) => {
        return (
            <div key={idx} className="h-[30vh] md:h-[55vh] px-5 relative cursor-pointer border-0" onClick={() => handleItemClick(item.id)}>
                <img src={item.image} alt={item.title}  className="w-full h-full object-cover rounded-lg"/>

                <div className="absolute bottom-4 left-10 text-white [text-shadow:0_0_10px_#fff]">
                <h3 className="text-xl font-bold drop-shadow-md">
                  {item.title}
                </h3>
                <p className="text-sm drop-shadow-md">{item.description}</p>
              </div>
            </div>
        )
      })}
    </Slider>
  );
}