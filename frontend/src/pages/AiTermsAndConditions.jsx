import React from "react";

import { Link, useNavigate } from "react-router-dom";
import blueUnderline from "../assets/blue_underline.png";

const AiTermsAndConditions = () => {
    const navigate = useNavigate();

    const sections = [
        {
            title: "1. Introduction",
            content: (
                <>
                    Welcome to RoamIQ Technologies (SINGAPORE COMPANY) ("Company",
                    "we", "our", or "us"). These Terms and Conditions ("Terms") govern
                    your use of our SaaS platform, located at{" "}
                    {/* <span
            className="text-accent cursor-pointer"
            onClick={() => navigate("/hosts")}
          >
            www.yourdomain.com
          </span>{" "} */}
                    <span
                        className="text-accent underline cursor-pointer"
                        onClick={() => (window.location.href = "https://yourdomain.com")}
                    >
                        www.yourdomain.com
                    </span>
                    , and any services, features, or content provided by the platform
                    (collectively, the "Service").
                    <br />
                    <br />
                    By accessing or using the Service, you ("User", "you", or "your")
                    agree to comply with and be bound by these Terms. If you do not agree
                    with any part of these Terms, you must discontinue using the Service
                    immediately.
                </>
            ),
        },
        {
            title: "2. Eligibility",
            content:
                "To use the Service, you must be at least 18 years of age or have reached the legal age in your jurisdiction. By using the Service, you represent that you are of legal age and have the legal capacity to enter into a binding agreement.",
        },
        {
            title: "3. Account Registration",
            content: (
                <>
                    To access certain features of the Service, you must create an account.
                    You agree to provide accurate and complete information during
                    registration and to keep your account information updated. You are
                    responsible for maintaining the confidentiality of your account
                    credentials and for all activities that occur under your account.
                    <br />
                    <br />
                    We reserve the right to suspend or terminate your account if we
                    suspect unauthorized activity or if you breach these Terms.
                </>
            ),
        },
        {
            title: "4. Subscription and Payment",
            content: (
                <>
                    The Service is available on a subscription basis. By subscribing, you
                    agree to pay the fees indicated at the time of subscription, which may
                    vary based on the plan you choose.
                    <br />
                    <ul className="pl-5">
                        <li>
                            <b>Billing Cycle:</b> Subscriptions are billed on a monthly or
                            annual basis, depending on your plan.
                        </li>
                        <li>
                            <b>Automatic Renewal:</b> Subscriptions automatically renew at the
                            end of each billing cycle unless you cancel your subscription.
                        </li>
                        <li>
                            <b>Payment Methods:</b> We accept [list payment methods]. You
                            authorize us to charge your selected payment method for all
                            subscription fees.
                        </li>
                        <li>
                            <b>Refunds:</b> All fees are non-refundable, except where required
                            by law.
                        </li>
                    </ul>
                </>
            ),
        },
        {
            title: "5. License and Usage",
            content: (
                <>
                    We grant you a limited, non-exclusive, non-transferable, and revocable
                    license to access and use the Service for your internal business
                    purposes. You agree not to:
                    <br />
                    <br />
                    <ul className="pl-5">
                        <li>
                            Reverse engineer, decompile, or disassemble any part of the
                            Service.
                        </li>
                        <li>Use the Service to build a competing product.</li>
                        <li>
                            Misuse the Service, such as by introducing malware, spamming, or
                            disrupting the platform.
                        </li>
                    </ul>
                    <br />
                    We reserve the right to terminate or restrict your access to the
                    Service if we believe you have violated these Terms.
                </>
            ),
        },
        {
            title: "6. Intellectual Property",
            content:
                "All content, materials, trademarks, and technology on the platform, including the software and its features, are owned by or licensed to the Company and are protected by intellectual property laws. You may not copy, modify, distribute, or use any of these materials without prior written consent from the Company.",
        },
        {
            title: "7. Data Protection and Privacy",
            content: (
                <>
                    We value your privacy. Our collection, use, and storage of your data
                    are governed by our{" "}
                    <span
                        className="text-accent underline cursor-pointer"
                        onClick={() => navigate("/ai-privacy")}
                    >
                        Privacy Policy
                    </span>
                    . By using the Service, you consent to the collection and use of your
                    information as described in the Privacy Policy.
                </>
            ),
        },
        {
            title: "8. Third-Party Integrations",
            content:
                "Our platform may integrate with third-party services. We are not responsible for the availability, accuracy, or content of any third-party services or platforms. Your use of third-party integrations is subject to the terms and conditions of the respective third parties.",
        },
        {
            title: "9. Service Availability",
            content:
                "We strive to provide continuous access to the Service, but we do not guarantee that the Service will be available at all times. The Service may be interrupted for maintenance, updates, or technical reasons. We are not liable for any loss or damage resulting from interruptions in service.",
        },
        {
            title: "10. Modifications to the Service and Terms",
            content:
                "We may modify or update the Service, these Terms, or our pricing at any time. We will provide notice of significant changes by posting the updated Terms on our platform or by sending you a notification. Continued use of the Service after changes are made constitutes your acceptance of the new Terms.",
        },
        {
            title: "11. Termination",
            content: (
                <>
                    You may terminate your account at any time by contacting us or through
                    your account settings. We reserve the right to suspend or terminate
                    your account or access to the Service at our discretion, especially if
                    you breach these Terms.
                    <br />
                    Upon termination, you will lose access to the Service, and any data
                    associated with your account may be deleted.
                </>
            ),
        },
        {
            title: "12. Limitation of Liability",
            content: (
                <>
                    To the fullest extent permitted by law, the Company and its
                    affiliates, officers, employees, or agents shall not be liable for any
                    indirect, incidental, special, or consequential damages arising from
                    your use of the Service, including but not limited to loss of profits,
                    data, or business opportunities.
                    <br />
                    In no event shall our total liability exceed the amount you paid to
                    the Company for your use of the Service in the twelve (12) months
                    preceding the claim.
                </>
            ),
        },
        {
            title: "13. Indemnification",
            content:
                "You agree to indemnify and hold harmless the Company, its affiliates, employees, and agents from any claims, liabilities, damages, losses, or expenses arising from your use of the Service, your violation of these Terms, or your infringement of any intellectual property or other rights of a third party.",
        },
        {
            title: "14. Governing Law and Dispute Resolution",
            content:
                "These Terms are governed by the laws of Singapore, without regard to its conflict of law principles. Any disputes arising from or related to these Terms or the Service will be resolved through binding arbitration in accordance with the rules of the [Arbitration Association], and judgment on the award rendered by the arbitrator may be entered in any court having jurisdiction.",
        },
        {
            title: "15. Force Majeure",
            content:
                "We will not be liable for any failure or delay in the performance of our obligations due to events beyond our reasonable control, including but not limited to natural disasters, war, terrorism, cyber-attacks, strikes, or governmental actions.",
        },
        {
            title: "16. Severability",
            content:
                "If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions will remain in full force and effect.",
        },
        {
            title: "17. Entire Agreement",
            content:
                "These Terms, along with our Privacy Policy and any additional agreements or terms you agree to when using the Service, constitute the entire agreement between you and the Company regarding the Service and supersede any prior agreements.",
        },
        {
            title: "18. Contact Information",
            content: (
                <>
                    If you have any questions or concerns about these Terms, please
                    contact us at:
                    <br />
                    <br />
                    <div className="flex flex-col">
                        <span>RoamIQ Technologies</span>
                        <span>contact@roamiq.com</span>
                        <div className="flex flex-col mt-1">
                            <a className="text-accent" href="mailto:hello@roamiq.com">
                                hello@roamiq.com
                            </a>
                            <span
                                className="text-accent cursor-pointer"
                                onClick={() => navigate("/ai-contact")}
                            >
                                Contact us
                            </span>
                        </div>
                    </div>
                </>
            ),
        },
    ];

    return (
        <div className="animate-fade-in flex flex-col gap-10 px-6 md:px-12 lg:px-28 pb-8 md:pb-12 pt-0 text-gray-300">
            <div className="flex flex-col items-center relative font-heading uppercase font-bold text-gray-200 text-2xl md:text-4xl lg:text-5xl leading-tight">
                <div className="relative inline-block text-center">
                    <h3>TERMS AND CONDITIONS</h3>
                    <img
                        src={blueUnderline}
                        alt=""
                        className="absolute top-full left-1/2 -translate-x-1/2 w-full h-[40%]"
                    />
                </div>
            </div>

            <div className="space-y-8">
                {sections.map((section, i) => (
                    <div key={i}>
                        <div className="flex flex-col gap-4 font-sans">
                            <h4 className="font-sans text-lg md:text-xl lg:text-2xl font-semibold">
                                {section.title}
                            </h4>
                            <p className="text-content">{section.content}</p>
                        </div>
                        {i < sections.length - 1 && <hr className="border-glass-border" />}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AiTermsAndConditions;
