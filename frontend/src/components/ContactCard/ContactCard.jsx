import React from "react";

const ContactCard = () => {
  return (
    <div className="flex flex-col justify-between bg-[#525d72] rounded-lg border-2  h-full p-4">
      <h2 className="text-title text-primary">Speak with our property consultants</h2>
      <p className="text-base  text-white">
        With over 20 years of experience working for some of the biggest banks
        in the Dubai, they re here to support you every step of the way and make
        sure your clients get their mortgage approved & you get your commission.
      </p>
      <button className="w-full bg-primary rounded-lg py-4">
        Contact us
      </button>
    </div>
  );
};

export default ContactCard;
