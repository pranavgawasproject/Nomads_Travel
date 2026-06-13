import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/roamiq-logo-black.png";
import { FaTwitter, FaLinkedinIn } from "react-icons/fa";
import { FaGlobe, FaRupeeSign, FaFacebookF, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { AiOutlineClose } from "react-icons/ai";

const languages = [
  { code: "en-US", name: "English (US)" },
  { code: "en-IN", name: "English (IN)" },
  { code: "en-SG", name: "English (Singapore)" },
  { code: "hi-IN", name: "हिन्दी (India)" },
  { code: "es-ES", name: "Español (Spain)" },
  { code: "fr-FR", name: "Français (France)" },
  { code: "de-DE", name: "Deutsch (Germany)" },
];

const currencies = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "AED", name: "UAE Dirham", symbol: "د.إ" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "SGD", name: "Singapore Dollar", symbol: "$" },
];

const AiFooter = () => {
  const [showLangModal, setShowLangModal] = useState(false);
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [selectedLang, setSelectedLang] = useState(languages[0]);
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);

  const goToHostsPrivacy = () => {
    window.location.href = "/ai-privacy";
  };
  const goToHostsTC = () => {
    window.location.href = "/ai-terms-and-conditions";
  };
  const goToHostsContentCopyright = () => {
    window.location.href = "/ai-content-and-copyright";
  };
  const goToHostsContentUseRemoval = () => {
    window.location.href = "/ai-content-use-removal";
  };

  const footerSections = [
    {
      heading: "Services",
      links: [
        { name: "About", link: "/ai-about" },
        { name: "Career", link: "ai-career" },
        { name: "FAQs", link: "ai-faq" },
        // {
        //   name: "Content and Copyright Policy",
        //   link: goToHostsContentCopyright,
        // },
      ],
    },
    {
      heading: "Corporate",
      links: [
        { name: "Privacy", link: goToHostsPrivacy },
        { name: "T&C", link: goToHostsTC },
        { name: "Contact", link: "/ai-contact" },
        // {
        //   name: "Content Use & Removal Policy",
        //   link: goToHostsContentUseRemoval,
        // },
      ],
    },
  ];

  return (
    <>
      <div className="sticky bottom-0 z-10 bg-white/95 py-6 text-nano text-gray-600 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="flex flex-col items-center gap-2 sm:grid sm:grid-cols-[1fr_auto_1fr] sm:items-center">
          <span className="text-center sm:col-start-2">
            RoamIQ is in Beta and can make mistakes. Building the future of global
            explorer living, one update at a time. See Cookie Preferences.
          </span>
          <span className="text-center sm:col-start-3 sm:justify-self-end sm:pr-8">
            Version 2.7.3
          </span>
        </div>
      </div>
      <footer className="w-full bg-gray-100 text-black flex flex-col justify-center items-center shadow-lg">
        <div className="w-full flex flex-wrap justify-center lg:justify-between items-center pt-12 pb-8 px-4 md:px-20">
          {/* Left Section */}
          <div className="flex flex-col items-center lg:items-start mb-8 lg:mb-0 w-full lg:w-auto text-center lg:text-left">
            <img
              src={logo}
              className="w-36 cursor-pointer mb-4 mx-auto lg:mx-0"
              alt="logo"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            />
            <p className="text-sm leading-6">
              RoamIQ Technologies - SINGAPORE
              <br />
              <Link
                to="mailto:hello@roamiq.com"
                className="text-primary-blue lowercase hover:underline"
              >
                hello@roamiq.com
              </Link>
            </p>
          </div>

          {/* Links Section */}
          <div className="lg:w-fit w-full flex justify-center lg:justify-end">
            <div className="grid grid-cols-2 gap-x-10 text-center lg:text-left">
              {footerSections.map((section, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center lg:items-start"
                >
                  {section.links.map((linkObj, i) =>
                    typeof linkObj.link === "function" ? (
                      <span
                        key={i}
                        onClick={linkObj.link}
                        className="text-sm opacity-80 hover:text-gray-500 cursor-pointer uppercase p-2"
                      >
                        {linkObj.name}
                      </span>
                    ) : (
                      <Link
                        key={i}
                        to={linkObj.link}
                        className="text-sm opacity-80 hover:text-gray-500 uppercase p-2"
                      >
                        {linkObj.name}
                      </Link>
                    ),
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        {/* <div className="w-full text-center py-4 border-t border-gray-200 text-sm">
        © {new Date().getFullYear()} RoamIQ Technologies - SINGAPORE. All
        Rights Reserved.
      </div> */}
        {/* Copyright */}
        <div className="w-full flex flex-col items-center justify-center text-center py-6 border-t-2 border-white px-4 md:px-20 lg:flex-row lg:justify-between lg:text-left">
          {/* Left side — Copyright */}
          <div className="flex flex-col md:flex-row justify-center md:justify-start items-center gap-1 text-[10px] md:text-xs font-semibold text-gray-800 mb-3 lg:mb-0">
            <span>
              &copy; Copyright {new Date().getFullYear()}-
              {(new Date().getFullYear() + 1).toString().slice(-2)}
            </span>
            <span className="text-[10px] md:text-xs font-semibold md:ml-2">
              RoamIQ Technologies - SINGAPORE. All Rights Reserved.
            </span>
          </div>

          {/* Right side — Policy Links */}
          <div className="flex flex-col md:flex-row justify-center lg:justify-end items-center gap-4 text-[10px] md:text-xs text-gray-800 ">
            <span
              onClick={goToHostsContentCopyright}
              className="hover:opacity-100 hover:text-gray-500 uppercase text-center lg:text-right cursor-pointer"
            >
              Content and Copyright Policy
            </span>
            <span
              onClick={goToHostsContentUseRemoval}
              className="hover:opacity-100 hover:text-gray-500 uppercase text-center lg:text-right cursor-pointer"
            >
              Content Use & Removal Policy
            </span>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="w-full flex justify-center items-center gap-4 py-4 bg-gray-50 text-xs font-semibold border-t border-gray-200">
          {/* Language Selector */}
          <div
            onClick={() => setShowLangModal(true)}
            className="flex items-center gap-1 cursor-pointer hover:underline"
          >
            <FaGlobe className="text-[12px]" />
            <span>{selectedLang.name}</span>
          </div>

          {/* Currency Selector */}
          <div
            onClick={() => setShowCurrencyModal(true)}
            className="px-2 py-[2px] border border-gray-700 rounded-md flex items-center gap-1 cursor-pointer hover:underline"
          >
            {/* <FaRupeeSign className="text-[12px]" /> */}
            <span>{selectedCurrency.symbol}</span>
            <span>{selectedCurrency.code}</span>
          </div>

          <FaFacebookF className="text-[12px]" />
          <FaXTwitter className="text-[12px]" />
          <FaInstagram className="text-[12px]" />
        </div>

        {/* Language Modal */}
        {showLangModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
            <div className="bg-white rounded-lg max-w-2xl w-full p-6 relative overflow-y-auto max-h-[80vh]">
              <button
                onClick={() => setShowLangModal(false)}
                className="absolute top-3 right-3 text-gray-600 hover:text-black"
              >
                <AiOutlineClose size={20} />
              </button>
              <h2 className="text-lg font-semibold mb-4">
                Choose a language and region
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {languages.map((lang, index) => {
                  const isDisabled = index !== 0; // only FIRST item enabled

                  return (
                    <div
                      key={lang.code}
                      onClick={() => {
                        if (isDisabled) return; // block clicks
                        setSelectedLang(lang);
                        setShowLangModal(false);
                      }}
                      className={`border rounded-md px-3 py-2 
        ${isDisabled
                          ? "opacity-40 cursor-not-allowed"
                          : "cursor-pointer hover:border-black"
                        } 
        ${selectedLang.code === lang.code ? "border-black" : "border-gray-300"}
      `}
                    >
                      {lang.name}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Currency Modal */}
        {showCurrencyModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
            <div className="bg-white rounded-lg max-w-2xl w-full p-6 relative overflow-y-auto max-h-[80vh]">
              <button
                onClick={() => setShowCurrencyModal(false)}
                className="absolute top-3 right-3 text-gray-600 hover:text-black"
              >
                <AiOutlineClose size={20} />
              </button>
              <h2 className="text-lg font-semibold mb-4">Choose a currency</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {currencies.map((cur, index) => {
                  const isDisabled = index !== 0; // only FIRST item enabled

                  return (
                    <div
                      key={cur.code}
                      onClick={() => {
                        if (isDisabled) return; // block clicks
                        setSelectedCurrency(cur);
                        setShowCurrencyModal(false);
                      }}
                      className={`border rounded-md px-3 py-2 
        ${isDisabled
                          ? "opacity-40 cursor-not-allowed"
                          : "cursor-pointer hover:border-black"
                        } 
        ${selectedCurrency.code === cur.code
                          ? "border-black"
                          : "border-gray-300"
                        }
      `}
                    >
                      <div className="font-medium">{cur.name}</div>
                      <div className="text-sm text-gray-500">
                        {cur.code} — {cur.symbol}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </footer>
    </>
  );
};

export default AiFooter;
