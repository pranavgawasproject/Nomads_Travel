import React from "react";
import { useNavigate } from "react-router-dom";
import blueUnderline from "../assets/blue_underline.png";

const AiContentAndCopyright = () => {
    const navigate = useNavigate();

    const sections = [
        {
            title: "Last Updated: 27th October 2025",
            content: (
                <>
                    <p>
                        Welcome to RoamIQ Platform (“RoamIQ”, “we”, “our”, or “us”). This{" "}
                        <b>Content and Copyright Policy</b> outlines how content is used,
                        credited, and protected across our platform.
                    </p>
                </>
            ),
        },
        {
            title: "1. Informational Purpose Only",
            content: (
                <>
                    <p>
                        RoamIQ is a explorer services and informational platform that aggregates
                        and presents publicly available information about coworking spaces,
                        coliving options, serviced apartments, working cafés, and related
                        lifestyle or travel services.
                    </p>
                    <p className="mt-2">
                        All such information, including images, brand names, or
                        descriptions, is shared solely for informational and reference
                        purposes to help users discover and compare global explorer-friendly
                        services.
                    </p>
                </>
            ),
        },
        {
            title: "2. No Ownership or Endorsement",
            content: (
                <>
                    <p>
                        RoamIQ does not claim ownership of any third-party logos, images,
                        descriptions, or business information displayed on the platform. All
                        trademarks, brand names, and intellectual property remain the
                        exclusive property of their respective owners.
                    </p>
                    <p className="mt-2">
                        The inclusion of third-party information does not imply endorsement,
                        partnership, or affiliation unless explicitly stated.
                    </p>
                </>
            ),
        },
        {
            title: "3. Non-Commercial Use",
            content: (
                <>
                    <p>
                        The content featured from other websites and platforms is not used
                        for direct monetization, resale, or advertising gain. RoamIQ’s purpose
                        is to inform and connect remote workers and travelers and remote professionals by
                        curating publicly available data in a transparent, good-faith
                        manner.
                    </p>
                </>
            ),
        },
        {
            title: "4. Source Attribution",
            content: (
                <>
                    <p>
                        Wherever possible, original sources are credited or linked back to
                        the respective websites or platforms. If any content owner believes
                        that their material has been used inappropriately or without proper
                        attribution, they may contact us at{" "}
                        <a href="mailto:hello@roamiq.com" className="text-accent ">
                            hello@roamiq.com
                        </a>
                        , and we will promptly review and remove or modify the content.
                    </p>
                </>
            ),
        },
        {
            title: "5. Limitation of Liability",
            content: (
                <>
                    <p>
                        RoamIQ and its team assume no responsibility or liability for any
                        errors, omissions, or reliance placed on the information displayed.
                        Users are advised to verify details directly with the respective
                        service providers or businesses before making any decisions or
                        bookings.
                    </p>
                </>
            ),
        },
        {
            title: "6. Consent",
            content: (
                <>
                    <p>
                        By using the RoamIQ platform, users acknowledge and agree to this
                        disclaimer and the purpose for which the information is provided.
                    </p>
                    <p className="mt-3">
                        Please click here to read the{" "}
                        <span
                            className="text-accent font-bold cursor-pointer"
                            onClick={() => navigate("/ai-content-use-removal")}
                        >
                            Content Use & Removal Policy.
                        </span>{" "}
                    </p>
                </>
            ),
        },
    ];

    return (
        <div className="animate-fade-in flex flex-col gap-10 px-6 md:px-12 lg:px-28 pb-8 md:pb-12 pt-0 text-gray-300">
            {/* Header */}
            <div className="flex flex-col items-center relative font-heading uppercase font-bold text-gray-200 text-2xl md:text-4xl lg:text-5xl leading-tight">
                <div className="relative inline-block text-center">
                    <h3>Content and Copyright Policy</h3>
                    <img
                        src={blueUnderline}
                        alt=""
                        className="absolute top-full left-1/2 -translate-x-1/2 w-full h-[40%]"
                    />
                </div>
            </div>

            {/* Sections */}
            <div className="space-y-8">
                {sections.map((section, i) => (
                    <div key={i}>
                        <div className="flex flex-col gap-4 font-sans">
                            <h4 className="font-sans text-lg md:text-xl lg:text-2xl font-semibold">
                                {section.title}
                            </h4>
                            <div className="text-content">{section.content}</div>
                        </div>
                        {i < sections.length - 1 && <hr className="border-glass-border" />}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AiContentAndCopyright;
