import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useTransform } from "motion/react";
import { useNavigate } from "react-router-dom";
import EventsService from "../services/eventsService";

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

const DRAG_BUFFER = 0;
const VELOCITY_THRESHOLD = 500;
const GAP = 16;
const SPRING_OPTIONS = { type: "spring", stiffness: 300, damping: 30 };

// Maximum number of items we'll support for transforms
const MAX_ITEMS = 10;

export default function Carousel({
  autoplay = false,
  autoplayDelay = 3000,
  pauseOnHover = false,
  loop = false,
  round = false,
}) {
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const x = useMotionValue(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isResetting, setIsResetting] = useState(false);
  const [items, setItems] = useState(DEFAULT_ITEMS);

  // Pre-create all transforms for maximum possible items (to avoid hooks order change)
  const rotateTransforms = useRef([]);
  const itemWidth = containerWidth -48;
  const trackItemOffset = itemWidth + GAP;
  
  // Create transforms for max possible items
  for (let i = 0; i < MAX_ITEMS; i++) {
    const range = [
      -(i + 1) * trackItemOffset,
      -i * trackItemOffset,
      -(i - 1) * trackItemOffset,
    ];
    const outputRange = [90, 0, -90];
    // eslint-disable-next-line react-hooks/rules-of-hooks
    rotateTransforms.current[i] = useTransform(x, range, outputRange, { clamp: false });
  }

  // Fetch trending events on mount
  useEffect(() => {
    const fetchCarouselEvents = async () => {
      try {
        const trendingEvents = await EventsService.getEventsByCategory('trending');
        
        // Take first 5 events and format for carousel
        if (trendingEvents && trendingEvents.length > 0) {
          const carouselItems = trendingEvents.slice(0, 5).map(event => ({
            id: event.id,
            image: event.image,
            title: event.name,
            description: `${event.date} • ${event.venue}`,
          }));
          setItems(carouselItems);
        }
      } catch (error) {
        console.error("Error fetching carousel events:", error);
        // Keep default items on error
      }
    };

    fetchCarouselEvents();
  }, []);

  // Update container width on resize
  useEffect(() => {
    const updateWidth = () =>
      setContainerWidth(containerRef.current?.offsetWidth || 0);
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const carouselItems = loop ? [...items, items[0]] : items;

  // Hover pause
  useEffect(() => {
    if (pauseOnHover && containerRef.current) {
      const container = containerRef.current;
      const handleMouseEnter = () => setIsHovered(true);
      const handleMouseLeave = () => setIsHovered(false);
      container.addEventListener("mouseenter", handleMouseEnter);
      container.addEventListener("mouseleave", handleMouseLeave);
      return () => {
        container.removeEventListener("mouseenter", handleMouseEnter);
        container.removeEventListener("mouseleave", handleMouseLeave);
      };
    }
  }, [pauseOnHover]);

  // Autoplay
  useEffect(() => {
    if (autoplay && (!pauseOnHover || !isHovered)) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev === items.length - 1 && loop) return prev + 1;
          if (prev === carouselItems.length - 1) return loop ? 0 : prev;
          return prev + 1;
        });
      }, autoplayDelay);
      return () => clearInterval(timer);
    }
  }, [
    autoplay,
    autoplayDelay,
    isHovered,
    loop,
    items.length,
    carouselItems.length,
    pauseOnHover,
  ]);

  const effectiveTransition = isResetting ? { duration: 0 } : SPRING_OPTIONS;

  const handleAnimationComplete = () => {
    if (loop && currentIndex === carouselItems.length - 1) {
      setIsResetting(true);
      x.set(0);
      setCurrentIndex(0);
      setTimeout(() => setIsResetting(false), 50);
    }
  };

  const handleDragEnd = (_, info) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;
    if (offset < -DRAG_BUFFER || velocity < -VELOCITY_THRESHOLD) {
      setCurrentIndex((prev) => Math.min(prev + 1, carouselItems.length - 1));
    } else if (offset > DRAG_BUFFER || velocity > VELOCITY_THRESHOLD) {
      setCurrentIndex((prev) => Math.max(prev - 1, 0));
    }
  };

  const handleItemClick = (itemId) => {
    if (itemId) {
      navigate(`/event/${itemId}`);
    }
  };

  const dragProps = loop
    ? {}
    : {
        dragConstraints: {
          left: -trackItemOffset * (carouselItems.length - 1),
          right: 0,
        },
      };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden w-full mt-6 p-4 ${
        round ? "rounded-full" : "rounded-2xl"
      }`}
    >
      <motion.div
        className="flex"
        drag="x"
        {...dragProps}
        style={{
          gap: `${GAP}px`,
          perspective: 1000,
          perspectiveOrigin: `${
            currentIndex * trackItemOffset + itemWidth / 2
          }px 50%`,
          x,
        }}
        onDragEnd={handleDragEnd}
        animate={{ x: -(currentIndex * trackItemOffset) }}
        transition={effectiveTransition}
        onAnimationComplete={handleAnimationComplete}
      >
        {carouselItems.map((item, index) => {
          const rotateY = rotateTransforms.current[index];
          return (
            <motion.div
              key={index}
              className={`relative shrink-0 flex flex-col overflow-hidden cursor-grab active:cursor-grabbing ${
                round
                  ? "items-center justify-center text-center bg-[#060010]"
                  : "items-start justify-between bg-[#222] rounded-lg border border-[#fff]"
              }`}
              style={{
                width: itemWidth,
                height: round ? itemWidth : 350,
                rotateY: rotateY,
                ...(round && { borderRadius: "50%" }),
              }}
              transition={effectiveTransition}
              onClick={() => handleItemClick(item.id)}
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2RkZCIvPjx0ZXh0IHRleHQtYW5jaG9yPSJtaWRkbGUiIHg9IjQwMCIgeT0iMjAwIiBzdHlsZT0iZmlsbDojOTk5O2ZvbnQtd2VpZ2h0OmJvbGQ7Zm9udC1zaXplOjMwcHg7Zm9udC1mYW1pbHk6QXJpYWwsc2Fucy1zZXJpZiI+RXZlbnQgSW1hZ2U8L3RleHQ+PC9zdmc+';
                }}
              />
              <div className="absolute bottom-4 left-4 text-white [text-shadow:0_0_10px_#fff]">
                <h3 className="text-xl font-bold drop-shadow-md">
                  {item.title}
                </h3>
                <p className="text-sm drop-shadow-md">{item.description}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Pagination Dots */}
      <div
        className={`flex w-full justify-center ${
          round ? "absolute z-20 bottom-12 left-1/2 -translate-x-1/2" : ""
        }`}
      >
        <div className="mt-4 flex w-[150px] justify-between px-8">
          {items.map((_, index) => (
            <motion.div
              key={index}
              className={`h-2 w-2 rounded-full cursor-pointer transition-colors duration-150 ${
                currentIndex % items.length === index
                  ? round
                    ? "bg-white"
                    : "bg-[#333]"
                  : round
                  ? "bg-[#555]"
                  : "bg-[rgba(51,51,51,0.4)]"
              }`}
              animate={{
                scale: currentIndex % items.length === index ? 1.2 : 1,
              }}
              onClick={() => setCurrentIndex(index)}
              transition={{ duration: 0.15 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// import { useEffect, useState, useRef } from "react";
// import { motion, useMotionValue, useTransform } from "motion/react";
// import {
//   FiCircle,
//   FiCode,
//   FiFileText,
//   FiLayers,
//   FiLayout,
// } from "react-icons/fi";

// const DEFAULT_ITEMS = [
//   {
//     id: 1,
//     image:
//       "https://www.warnermusic.de/uploads/media/image-1002-704/09/21529-FqJHoRqXsAEEs9h.jpg?v=1-7",
//     title: "Event 1",
//     description: "Exciting event happening soon!",
//   },
//   {
//     id: 2,
//     image:
//       "https://igimage.indiaglitz.com/hindi/news/Adobe_Express_20230101_1213350_1-594.png",
//     title: "Event 2",
//     description: "Don’t miss out on this one.",
//   },
//   {
//     id: 3,
//     image:
//       "https://images.stockcake.com/public/2/3/9/2397d77f-af92-4b51-8bb9-d60d138cf4d0_large/vibrant-art-exhibition-stockcake.jpg",
//     title: "Event 3",
//     description: "Be part of something amazing.",
//   },
// ];

// const DRAG_BUFFER = 0;
// const VELOCITY_THRESHOLD = 500;
// const GAP = 16;
// const SPRING_OPTIONS = { type: "spring", stiffness: 300, damping: 30 };

// export default function Carousel({
//   items = DEFAULT_ITEMS,
//   autoplay = false,
//   autoplayDelay = 3000,
//   pauseOnHover = false,
//   loop = false,
//   round = false,
// }) {
//   const containerRef = useRef(null);
//   const x = useMotionValue(0);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isHovered, setIsHovered] = useState(false);
//   const [containerWidth, setContainerWidth] = useState(0);
//   const [isResetting, setIsResetting] = useState(false);

//   // Update container width on resize
//   useEffect(() => {
//     const updateWidth = () =>
//       setContainerWidth(containerRef.current?.offsetWidth || 0);
//     updateWidth();
//     window.addEventListener("resize", updateWidth);
//     return () => window.removeEventListener("resize", updateWidth);
//   }, []);

//   const itemWidth = containerWidth - 34; // Each card is 80% of container width
//   const trackItemOffset = itemWidth + GAP;

//   const carouselItems = loop ? [...items, items[0]] : items;

//   // Hover pause
//   useEffect(() => {
//     if (pauseOnHover && containerRef.current) {
//       const container = containerRef.current;
//       const handleMouseEnter = () => setIsHovered(true);
//       const handleMouseLeave = () => setIsHovered(false);
//       container.addEventListener("mouseenter", handleMouseEnter);
//       container.addEventListener("mouseleave", handleMouseLeave);
//       return () => {
//         container.removeEventListener("mouseenter", handleMouseEnter);
//         container.removeEventListener("mouseleave", handleMouseLeave);
//       };
//     }
//   }, [pauseOnHover]);

//   // Autoplay
//   useEffect(() => {
//     if (autoplay && (!pauseOnHover || !isHovered)) {
//       const timer = setInterval(() => {
//         setCurrentIndex((prev) => {
//           if (prev === items.length - 1 && loop) return prev + 1;
//           if (prev === carouselItems.length - 1) return loop ? 0 : prev;
//           return prev + 1;
//         });
//       }, autoplayDelay);
//       return () => clearInterval(timer);
//     }
//   }, [
//     autoplay,
//     autoplayDelay,
//     isHovered,
//     loop,
//     items.length,
//     carouselItems.length,
//     pauseOnHover,
//   ]);

//   const effectiveTransition = isResetting ? { duration: 0 } : SPRING_OPTIONS;

//   const handleAnimationComplete = () => {
//     if (loop && currentIndex === carouselItems.length - 1) {
//       setIsResetting(true);
//       x.set(0);
//       setCurrentIndex(0);
//       setTimeout(() => setIsResetting(false), 50);
//     }
//   };

//   const handleDragEnd = (_, info) => {
//     const offset = info.offset.x;
//     const velocity = info.velocity.x;
//     if (offset < -DRAG_BUFFER || velocity < -VELOCITY_THRESHOLD) {
//       setCurrentIndex((prev) => Math.min(prev + 1, carouselItems.length - 1));
//     } else if (offset > DRAG_BUFFER || velocity > VELOCITY_THRESHOLD) {
//       setCurrentIndex((prev) => Math.max(prev - 1, 0));
//     }
//   };

//   const dragProps = loop
//     ? {}
//     : {
//         dragConstraints: {
//           left: -trackItemOffset * (carouselItems.length - 1),
//           right: 0,
//         },
//       };

//   return (
//     <div
//       ref={containerRef}
//       className={`relative overflow-hidden w-full mt-6 p-4 ${
//         round ? "rounded-full" : "rounded-2xl"
//       }`}
//     >
//       <motion.div
//         className="flex"
//         drag="x"
//         {...dragProps}
//         style={{
//           gap: `${GAP}px`,
//           perspective: 1000,
//           perspectiveOrigin: `${
//             currentIndex * trackItemOffset + itemWidth / 2
//           }px 50%`,
//           x,
//         }}
//         onDragEnd={handleDragEnd}
//         animate={{ x: -(currentIndex * trackItemOffset) }}
//         transition={effectiveTransition}
//         onAnimationComplete={handleAnimationComplete}
//       >
//         {carouselItems.map((item, index) => {
//           const range = [
//             -(index + 1) * trackItemOffset,
//             -index * trackItemOffset,
//             -(index - 1) * trackItemOffset,
//           ];
//           const outputRange = [90, 0, -90];
//           const rotateY = useTransform(x, range, outputRange, { clamp: false });
//           return (
//             <motion.div
//               key={index}
//               className={`relative shrink-0 flex flex-col overflow-hidden cursor-grab active:cursor-grabbing ${
//                 round
//                   ? "items-center justify-center text-center bg-[#060010]"
//                   : "items-start justify-between bg-[#222] rounded-lg border border-[#fff]"
//               }`}
//               style={{
//                 width: itemWidth,
//                 height: round ? itemWidth : 350,
//                 rotateY: rotateY,
//                 ...(round && { borderRadius: "50%" }),
//               }}
//               transition={effectiveTransition}
//             >
//               <img
//                 src={item.image}
//                 alt={item.title}
//                 className="w-full h-full object-cover"
//               />
//               {/* <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 p-4">
//                 <h3 className="text-white font-bold text-lg">{item.title}</h3>
//                 <p className="text-gray-200 text-sm">{item.description}</p>
//               </div> */}
//               <div className="absolute bottom-4 left-4 text-white [text-shadow:0_0_10px_#fff]">
//                 <h3 className="text-xl font-bold drop-shadow-md">
//                   {item.title}
//                 </h3>
//                 <p className="text-sm drop-shadow-md">{item.description}</p>
//               </div>
//             </motion.div>
//           );
//         })}
//       </motion.div>

//       {/* Pagination Dots */}
//       <div
//         className={`flex w-full justify-center ${
//           round ? "absolute z-20 bottom-12 left-1/2 -translate-x-1/2" : ""
//         }`}
//       >
//         <div className="mt-4 flex w-[150px] justify-between px-8">
//           {items.map((_, index) => (
//             <motion.div
//               key={index}
//               className={`h-2 w-2 rounded-full cursor-pointer transition-colors duration-150 ${
//                 currentIndex % items.length === index
//                   ? round
//                     ? "bg-white"
//                     : "bg-[#333]"
//                   : round
//                   ? "bg-[#555]"
//                   : "bg-[rgba(51,51,51,0.4)]"
//               }`}
//               animate={{
//                 scale: currentIndex % items.length === index ? 1.2 : 1,
//               }}
//               onClick={() => setCurrentIndex(index)}
//               transition={{ duration: 0.15 }}
//             />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }