import React from "react";

import { Link, useNavigate } from "react-router-dom";
import blueUnderline from "../assets/blue_underline.png";

const AiPrivacy = () => {
    const navigate = useNavigate();
    const sections = [
        {
            // title: "Last Updated: 2nd October 2024",
            title: "",
            content: (
                <>
                    <p>
                        Welcome to RoamIQ Technologies (SINGAPORE COMPANY) ("Company",
                        "we", "our", or "us") is committed to protecting your privacy. This
                        Privacy Policy explains how we collect, use, disclose, and protect
                        your personal information when you use our SaaS platform (the
                        "Service"), located at{" "}
                        {/* <span
              className="text-primary-blue underline cursor-pointer"
              onClick={() => navigate("/hosts")}
            >
              www.yourdomain.com
            </span> */}
                        <span
                            className="text-primary-blue underline cursor-pointer"
                            onClick={() => (window.location.href = "https://yourdomain.com")}
                        >
                            www.yourdomain.com
                        </span>
                        , as well as your rights in relation to your personal data.
                        <br />
                        <br />
                        By accessing or using the Service, you agree to the terms of this
                        Privacy Policy. If you do not agree with our practices, please do
                        not use the Service.
                    </p>
                </>
            ),
        },
        {
            title: "1. Information We Collect",
            content: (
                <>
                    <p>
                        We collect the following types of information when you use our
                        platform:
                    </p>

                    <div className="flex flex-col gap-2 mt-2">
                        <p className="text-primary-blue italic">1.1 Personal Information</p>
                        <p>
                            This refers to any information that identifies you personally,
                            including but not limited to:
                        </p>
                        <ul className="pl-5 text-small">
                            <li>Name</li>
                            <li>Email address</li>
                            <li>Phone number</li>
                            <li>Company name</li>
                            <li>Billing and payment details</li>
                            <li>Job title</li>
                        </ul>
                    </div>

                    <div className="flex flex-col gap-2 mt-2">
                        <p className="text-primary-blue italic">1.2 Usage Data</p>
                        <p>
                            We may automatically collect information about how you use our
                            Service, including:
                        </p>
                        <ul className="pl-5 text-small">
                            <li>IP address</li>
                            <li>Browser type and version</li>
                            <li>Device type and operating system</li>
                            <li>Pages viewed and actions taken on our platform</li>
                            <li>Time and date of usage</li>
                            <li>Referring website addresses (URLs)</li>
                        </ul>
                    </div>

                    <div className="flex flex-col gap-2 mt-2">
                        <p className="text-primary-blue italic">
                            1.3 Cookies and Tracking Technologies
                        </p>
                        <p>
                            We use cookies, web beacons, and similar technologies to enhance
                            user experience, analyze site traffic, and improve our Service.
                            You can control the use of cookies at the individual browser
                            level. If you reject cookies, some features of the Service may not
                            function properly.
                        </p>
                    </div>
                </>
            ),
        },
        {
            title: "2. How We Use Your Information",
            content: (
                <>
                    <p>We use the information we collect for the following purposes:</p>
                    <br />
                    <ul className="pl-5">
                        <li>
                            <b>To Provide the Service:</b> We use your personal information to
                            manage your account, process payments, and provide access to the
                            platform.
                        </li>
                        <li>
                            <b>To Improve the Service:</b> We analyze usage data to enhance
                            the functionality, performance, and security of the platform.
                        </li>
                        <li>
                            <b>To Communicate with You:</b> We may send you important updates,
                            notifications, or promotional materials related to our Service.
                            You can opt out of marketing communications at any time.
                        </li>
                        <li>
                            <b>To Comply with Legal Obligations:</b> We may use your
                            information to comply with legal obligations, resolve disputes, or
                            enforce our agreements.
                        </li>
                    </ul>
                </>
            ),
        },
        {
            title: "3. How We Share Your Information",
            content: (
                <>
                    <p>
                        We do not sell, rent, or trade your personal information to third
                        parties. However, we may share your information in the following
                        circumstances:
                    </p>

                    <div className="flex flex-col gap-2 mt-2">
                        <p className="text-primary-blue italic">3.1 Service Providers</p>
                        <p>
                            We may share your information with trusted third-party service
                            providers that assist us in delivering the Service, such as
                            payment processors, hosting providers, customer support platforms,
                            and analytics services. These providers are bound by
                            confidentiality obligations and may not use your information for
                            any other purposes.
                        </p>
                    </div>

                    <div className="flex flex-col gap-2 mt-2">
                        <p className="text-primary-blue italic">3.2 Legal Obligations</p>
                        <p>
                            We may disclose your information if required by law, court order,
                            or other legal processes, or if we believe it is necessary to
                            protect our rights, property, or the safety of our users or
                            others.
                        </p>
                    </div>

                    <div className="flex flex-col gap-2 mt-2">
                        <p className="text-primary-blue italic">3.3 Business Transfers</p>
                        <p>
                            In the event of a merger, acquisition, sale of assets, or
                            bankruptcy, your personal information may be transferred to a new
                            entity. You will be notified if such a transfer occurs and
                            informed of any changes in this Privacy Policy.
                        </p>
                    </div>
                </>
            ),
        },
        {
            title: "4. Data Security",
            content:
                "We implement industry-standard security measures to protect your information from unauthorized access, loss, misuse, or alteration. While we strive to protect your personal information, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.",
        },
        {
            title: "5. Data Retention",
            content:
                "We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law. Once your data is no longer needed, we will delete or anonymize it.",
        },
        {
            title: "6. Your Data Protection Rights",
            content: (
                <>
                    <p>
                        Depending on your location, you may have the following rights
                        regarding your personal information:
                    </p>
                    <br />
                    <ul className="pl-5">
                        <li>
                            <b>Right to Access:</b> Request access to the personal information
                            we hold about you.
                        </li>
                        <li>
                            <b>Right to Rectification:</b> Request corrections to inaccurate
                            or incomplete personal information.
                        </li>
                        <li>
                            <b>Right to Erasure:</b> Request deletion of your personal
                            information under certain circumstances.
                        </li>
                        <li>
                            <b>Right to Restrict Processing:</b> Request that we limit
                            processing of your personal information.
                        </li>
                        <li>
                            <b>Right to Data Portability:</b> Request a copy of your personal
                            information in a structured format.
                        </li>
                        <li>
                            <b>Right to Object:</b> Object to processing of your personal
                            information based on legitimate interests.
                        </li>
                    </ul>
                    <p className="mt-3">
                        To exercise any of these rights, please contact us at{" "}
                        <a className="text-primary-blue" href="mailto:hello@roamiq.com">
                            hello@roamiq.com
                        </a>
                        . We may request information to verify your identity before
                        fulfilling your request.
                    </p>
                </>
            ),
        },
        {
            title: "7. International Data Transfers",
            content:
                "We may transfer your personal information to countries outside your jurisdiction. When we do so, we take appropriate steps to ensure that your data is handled securely and in accordance with this Privacy Policy and applicable data protection laws.",
        },
        {
            title: "8. Children's Privacy",
            content: (
                <>
                    <p>
                        Our Service is not intended for individuals under the age of 18. We
                        do not knowingly collect personal information from children. If you
                        believe we have collected personal data from a child, please contact
                        us at{" "}
                        <a className="text-primary-blue" href="mailto:hello@roamiq.com">
                            hello@roamiq.com
                        </a>
                        , and we will take appropriate steps to delete that information.
                    </p>
                </>
            ),
        },
        {
            title: "9. Changes to This Privacy Policy",
            content:
                "We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the updated Privacy Policy on our platform or by sending you an email notification. Your continued use of the Service after the changes are made will constitute acceptance of the revised policy.",
        },
        {
            title: "10. Contact Information",
            content: (
                <>
                    <p>
                        If you have any questions or concerns about this Privacy Policy,
                        please contact us at:
                    </p>
                    <div className="flex flex-col mt-2">
                        <span>RoamIQ Technologies</span>
                        <span>contact@roamiq.com</span>
                        <a
                            className="text-primary-blue mt-1"
                            href="mailto:hello@roamiq.com"
                        >
                            hello@roamiq.com
                        </a>
                        <span
                            className="text-primary-blue cursor-pointer max-w-fit"
                            onClick={() => navigate("/ai-contact")}
                        >
                            Contact us
                        </span>
                    </div>
                </>
            ),
        },
    ];

    return (
        <div className="flex flex-col gap-10 px-6 md:px-12 lg:px-28 pb-8 md:pb-12 pt-0 text-[#364D59]">
            <div className="flex flex-col items-center relative font-comic uppercase font-bold text-secondary-dark text-2xl md:text-4xl lg:text-5xl leading-tight">
                <div className="relative inline-block text-center">
                    <h3>Privacy Policy</h3>
                    <img
                        src={blueUnderline}
                        alt=""
                        className="absolute top-full left-1/2 -translate-x-1/2 w-full h-[40%]"
                    />
                </div>
            </div>

            <div className="space-y-8">
                {sections.map((section, i) => (
                    <div key={i} className="group">
                        <div className="flex flex-col gap-4 font-sans">
                            {section.title && (
                                <h4 className="font-sans text-lg md:text-xl lg:text-2xl font-semibold">
                                    {section.title}
                                </h4>
                            )}
                            <p className="text-content">{section.content}</p>
                        </div>
                        {i < sections.length - 1 && <hr className="border-gray-300" />}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AiPrivacy;
