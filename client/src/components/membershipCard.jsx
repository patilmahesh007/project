import React from "react";
import {Dumbbell} from "lucide-react";

const plans = [
  {
    id: 1,
    title: "Trial",
    price: "Free",
    description: "Try visiting us for 1 Day",
    features: [
      "Try using gym for 1 day",
  
    ],
  },
  {
    id: 2,
    title: "Monthly",
    price: "1300/Month",
    description: "Most popular",
    features: [
      "Monthly membership just 1300/month",
   
    ],
  },
  {
    id: 3,
    title: "Anual",
    price: "12000/Anum",
    description: "limited time offer",
    features: [
      "Anual membership at discounted price",
    
    ],
  },
];

function PricingPlans() {
  return (
    <div className="antialiased w-full h-full bg-black text-gray-400 font-inter p-10">
      <div className="container px-4 mx-auto">
        <div id="title" className="text-center my-10">
          <h1 className="font-bold text-4xl text-white">Pricing Plans</h1>
          <p className="text-light text-gray-500 text-xl">
            Here are our pricing plans
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-evenly gap-10 pt-10">
          {plans.map((plan) => (
            <div
              key={plan.id}
              id="plan"
              className="rounded-lg text-center overflow-hidden w-full transform hover:shadow-2xl hover:scale-105 transition duration-200 ease-in"
            >
              <div id="title" className="w-full py-5 border-b border-gray-800">
                <h2 className="font-bold text-3xl text-white">{plan.title}</h2>
                <h3 className="font-normal text-orange-500 text-xl mt-2">
                  {plan.price}
                </h3>
              </div>
              <div id="content">
                <div id="icon" className="my-5">
                  <Dumbbell 
                  className="w-16 h-16 mx-auto text-orange-500"
                  />
                  <p className="text-gray-500 text-sm pt-2">
                    {plan.description}
                  </p>
                </div>
                <div
                  id="contain"
                  className="leading-8 mb-10 text-lg font-light"
                >
                  <ul>
                    {plan.features.map((feature, idx) => (
                      <li key={idx}>{feature}</li>
                    ))}
                  </ul>
                  <div id="choose" className="w-full mt-10 px-6">
                    <a
                      href="#"
                      className="w-full block bg-gray-900 font-medium text-xl py-4 rounded-xl hover:shadow-lg transition duration-200 ease-in-out hover:bg-indigo-600 hover:text-white"
                    >
                      Choose
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PricingPlans;
