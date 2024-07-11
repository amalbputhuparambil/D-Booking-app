import React from 'react'
import kannada_girl from '../../assets/images/kannada_girl.png'

const Banner: React.FC = () => {
  return (
    <>
    <div className="flex flex-col lg:flex-row items-center justify-between w-full   h-[80vh] py-0 lg:px-20 ">
    {/* h-[90vh] min-h-screen */}
      <div className="lg:w-1/2 flex flex-col items-start justify-center text-left px-8 lg:py-0">

        <h1 className="text-4xl lg:text-7xl font-semibold text-zinc-800 mb-10">
          More visibility and a better patient experience
        </h1>
        <h2 className="text-xl lg:text-2xl font-semibold text-zinc-800 mb-10">
          QuickDoc helps over a million patients connect and engage with practices just like yours.
        </h2>
        <button className="w-48 bg-green-700 text-white py-3 px-4 rounded-lg text-lg font-semibold hover:bg-green-600">
          Get started now
        </button>
      </div>
      <div className="lg:w-1/2  flex justify-center lg:justify-end mt-4 lg:mt-0">
        <img src={kannada_girl} alt="Banner Image" className="object-cover h-full max-w-full   md:w-6/7 pr-20" />
      </div>
    </div>
    </>
  );
};


export default Banner