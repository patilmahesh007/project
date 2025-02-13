import React from 'react';

const ReviewCard = ({ review, name, designation, image }) => {
  return (
    <div className="rounded-lg shadow-md p-4 w-96 flex flex-col justify-start min-h-[250px]">
      <div className="flex items-center space-x-4 mb-4">
        <img
          src={image}
          alt={name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <h3 className="text-white font-semibold">{name}</h3>
          <p className="text-gray-400 text-sm">{designation}</p>
        </div>
      </div>
      <p className="text-gray-300 text-sm whitespace-normal break-words">
        {review}
      </p>
    </div>
  );
};

export default ReviewCard;
