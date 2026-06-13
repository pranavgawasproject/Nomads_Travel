import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Container from "../components/Container";

const AiVisaSupportThankYou = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [typedMessage, setTypedMessage] = useState("");
  const selectedState = searchParams.get("state");
  const selectedCountry = searchParams.get("country");
  const selectedContinent = searchParams.get("continent");

  const destinationPath = useMemo(() => {
    if (!selectedCountry) {
      return "";
    }

    const params = new URLSearchParams({
      country: selectedCountry,
    });

    if (selectedState) {
      params.set("state", selectedState);
    }

    if (selectedContinent) {
      params.set("continent", selectedContinent);
    }

    return `/ai-verticals?${params.toString()}`;
  }, [selectedContinent, selectedCountry, selectedState]);

  const formattedCountry = useMemo(() => {
    if (!selectedCountry) {
      return "your selected country";
    }

    return selectedCountry
      .split(/[-_\s]+/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(" ");
  }, [selectedCountry]);

  const message = `Thank you for the suggestion. Redirecting you to ${formattedCountry} for now`;

  useEffect(() => {
    setTypedMessage("");

    let index = 0;
    const typeInterval = setInterval(() => {
      index += 1;
      setTypedMessage(message.slice(0, index));

      if (index >= message.length) {
        clearInterval(typeInterval);
      }
    }, 7);

    return () => clearInterval(typeInterval);
  }, [message]);

  useEffect(() => {
    if (!destinationPath) {
      return undefined;
    }

    const redirectTimeout = setTimeout(() => {
      if (typeof window !== "undefined") {
        window.sessionStorage.removeItem("aiSearchBarBadges");
      }
      navigate(destinationPath);
    }, 7000);

    return () => {
      clearTimeout(redirectTimeout);
    };
  }, [destinationPath, navigate]);

  return (
    <div className="bg-surface text-gray-200 font-sans animate-fade-in">
      <Container padding={false}>
        <section className="min-h-[85vh] flex items-center justify-center py-8">
          <div className="w-full max-w-3xl px-6 md:px-10 text-center glass-card py-12 md:py-14">
            <p className="text-xl leading-relaxed font-heading min-h-[72px]">
              {typedMessage}
            </p>
          </div>
        </section>
      </Container>
    </div>
  );
};

export default AiVisaSupportThankYou;
