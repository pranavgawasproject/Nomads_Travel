import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const faqs = [
    {
      question: "Who can get a mortgage in the Dubai?",
      answer:
        "Getting a mortgage in the Dubai is possible for most people, including Dubai Nationals, Dubai Residents (expats living in Dubai), and non-residents. The process, particularly rates and terms, will differ depending on your residency status.",
    },
    {
      question: "Can BRIDG support in providing Mortgage to Non-Residents of Dubai?",
      answer:
        "Yes, and in fact we specialise in providing mortgage to Non-Residents of Dubai.",
    },
    {
      question: "Which Country Citizens can invest in Real Estate in Dubai?",
      answer: "Any Country Citizen can invest in Dubai Real Estate.",
    },
    {
      question: "Which Country Citizen can get a mortgage in Dubai?",
      answer: "Any Country Citizen can get a mortgage in Dubai.",
    },
    {
      question: "What type of properties can be mortgaged?",
      answer:
        "Any type of property can be mortgaged i.e. New Apartment, Resale Apartment, Land, Plots, Commercial Property, Buildings etc.",
    },
    {
      question: "What is the minimum downpayment required?",
      answer:
        "Downpayment could range from 15% to 40% depending on the profile and structure of the deal.",
    },
    {
      question:
        "Who will help me in finding the correct mortgage and paperwork and disbursement?",
      answer:
        "BRIDG will support you from start till end and do all your work related to your mortgage.",
    },
  ];
  

const Accordion = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="max-w-8xl mx-auto py-12">
      <h2 className="text-3xl font-semibold mb-6">Frequently asked questions</h2>
      <div className="border rounded-lg shadow-md">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b last:border-none">
            <button
              className="w-full flex justify-between items-center py-4 px-6 text-left text-lg font-medium transition-all duration-300 hover:bg-gray-100"
              onClick={() => toggleFAQ(index)}
            >
              {faq.question}
              {openIndex === index ? <FaChevronUp /> : <FaChevronDown />}
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openIndex === index ? "max-h-[200px] opacity-100 py-2 px-6" : "max-h-0 opacity-0"
              }`}
            >
              {faq.answer}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Accordion;
