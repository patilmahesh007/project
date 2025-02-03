import React from "react";

const ReviewCard = ({ review, name, designation, image }) => {
  return (
    <div className=" shadow-lg rounded-lg p-6 w-full max-w-sm">
      <p className="text-white text-sm text-justify italic">{review}</p>

      <div className="flex text-white items-center mt-4">
        <img src={image} alt={name} className="w-12 h-12 rounded-full mr-4" />

        <div>
          <p className="font-bold text-white">{name}</p>
          <p className="text-white text-sm">{designation}</p>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
