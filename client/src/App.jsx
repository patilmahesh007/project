import React, { useState, useRef, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroller";
import Navbar from "./components/Navbar";
import gym from "./assets/gym.jpg";
import { NavLink } from "react-router-dom";
import ReviewCard from "./components/ReviewCard";
import Footer from "./components/Footer";

function App() {
  const containerRef = useRef(null);
  const initialReviews = [
    {
      review:
        "I've never felt better! The trainers push you beyond limits while keeping it fun. The atmosphere is electric, and the equipment is top-notch. The community is supportive, making workouts something to look forward to every day. This gym is my second home now!",
      name: "Mahesh Patil",
      designation: "Trainer",
      image:
        "https://i.pinimg.com/236x/f9/a7/a3/f9a7a30e3f6cada77cbd30f47f5a430f.jpg",
    },
    {
      review:
        "This gym changed my life! The workouts are challenging yet rewarding. The trainers genuinely care about your progress. I love the energy here—everyone is motivated, and it keeps me pushing harder. If you want real results, this is the place to be!",
      name: "Sarthak Nawale",
      designation: "Trainer",
      image:
        "https://i.pinimg.com/236x/6e/2a/5f/6e2a5f5804e052f260902deb9108cdc8.jpg",
    },
    {
      review:
        "Absolutely love this gym! The vibe is unbeatable, and every session leaves me feeling stronger. The trainers provide excellent guidance, and the facilities are always clean and well-maintained. Joining was the best decision I’ve made for my health!",
      name: "Prathamesh",
      designation: "Trainer",
      image:
        "https://i.pinimg.com/236x/e4/4d/7a/e44d7ad06e35faef641a5981af86f218.jpg",
    },
  ];

  const [reviews, setReviews] = useState(initialReviews);
  const [loadCount, setLoadCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = () => {
    if (loadCount < 5) {
      setReviews((prev) => [...prev, ...initialReviews]);
      setLoadCount(loadCount + 1);
    } else {
      setHasMore(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (containerRef.current) {
        containerRef.current.scrollLeft += 1;
      }
    }, 20);
    return () => clearInterval(interval);
  }, []);

  const horizontalContainerStyle = {
    overflowX: "scroll",
    overflowY: "hidden",
    whiteSpace: "nowrap",
    padding: "20px 0",
    msOverflowStyle: "none",
    scrollbarWidth: "none",
  };

  return (
    <div>
      <Navbar bg="transparent" />

      <div
        className="relative w-full h-screen bg-cover bg-center flex items-center justify-start px-10 md:px-20"
        style={{ backgroundImage: `url(${gym})` }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 text-gray-200 space-y-1">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
            Train Hard<br /> Stay Strong<br /> Conquer Limits!
          </h1>
          <h2 className="text-lg md:text-xl lg:text-1xl pl-1 font-medium text-gray-300">
            Start your fitness journey today!<br /><br />
          </h2>
          <NavLink
            to="/membership"
            className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold text-lg transition duration-300 hover:bg-orange-600 active:bg-orange-700"
          >
            Join Now
          </NavLink>
        </div>
      </div>

      <div className="bg-black text-gray-200 py-8 px-20">
        <p className="text-orange-700">Reviews</p>
        <h1 className="text-3xl md:text-4xl font-bold">
          "Don't Just Take Our Word—Hear It From the Iron Warriors!"
        </h1>
        <div style={horizontalContainerStyle} ref={containerRef} className="no-scrollbar">
          <InfiniteScroll
            pageStart={0}
            loadMore={loadMore}
            hasMore={hasMore}
            loader={
              <div className="loader text-gray-400" key={0}>
                Loading...
              </div>
            }
            useWindow={false}
            threshold={100}
          >
            {reviews.map((review, index) => (
              <div key={index} className="inline-block mr-4">
                <ReviewCard
                  review={review.review}
                  name={review.name}
                  designation={review.designation}
                  image={review.image}
                />
              </div>
            ))}
          </InfiniteScroll>
        </div>
      </div>

      <Footer />

      <style
        dangerouslySetInnerHTML={{
          __html: `
            .no-scrollbar::-webkit-scrollbar {
              display: none;
            }
          `,
        }}
      />
    </div>
  );
}

export default App;
