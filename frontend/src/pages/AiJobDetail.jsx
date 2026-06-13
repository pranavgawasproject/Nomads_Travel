import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { HiOutlineArrowLeft } from "react-icons/hi";
import Container from "../components/Container";
import JobApplicationForm from "./JobApplicationForm";

const AiJobDetail = () => {
    const { title } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("description");
    const { pathname, state } = useLocation();
    const { about, responsibilities, qualifications, jobName } = state;
    const isHost = pathname.includes("host");

    return (
        <>
            <div className="animate-fade-in sticky top-0 z-40 bg-surface-50/95 py-3 backdrop-blur-sm md:px-10">
                <button
                    type="button"
                    onClick={() => navigate("/home")}
                    className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-accent bg-surface-50 text-accent"
                    aria-label="Go back to AI career"
                >
                    <HiOutlineArrowLeft size={18} />
                </button>
            </div>
            <Container>
                <div className="lg:px-10 px-6">
                    <h2 className="text-xl lg:text-3xl font-normal text-center mb-6">
                        {jobName?.split("-")?.length
                            ? jobName?.split("-")?.join(" ")?.toUpperCase()
                            : jobName}
                    </h2>

                    {/* Tabs */}
                    <div className="flex justify-center border-b border-glass-border mb-8">
                        <button
                            className={` font-medium w-full ${activeTab === "description"
                                ? "border-b-2 border-accent"
                                : "text-accent"
                                }`}
                            onClick={() => setActiveTab("description")}
                        >
                            JOB DESCRIPTION
                        </button>
                        <button
                            className={`px-6 py-2 font-medium w-full ${activeTab === "apply"
                                ? "border-b-2 border-accent "
                                : "text-accent"
                                }`}
                            onClick={() => setActiveTab("apply")}
                        >
                            APPLY NOW
                        </button>
                    </div>

                    {/* Content */}
                    {activeTab === "description" ? (
                        <div className="text-sm leading-relaxed text-gray-200 space-y-6">
                            {/* About the Job */}
                            <div>
                                <h3 className="text-lg font-semibold mb-2">About the Job</h3>
                                <p>{about}</p>
                            </div>

                            {/* Responsibilities */}
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Responsibilities</h3>
                                <ul className="space-y-2">
                                    {responsibilities && responsibilities.length > 0
                                        ? responsibilities.map((item, idx) => (
                                            <li key={idx} className="flex items-start gap-2">
                                                <span className="text-accent">✔</span>
                                                <span>{item}</span>
                                            </li>
                                        ))
                                        : []}
                                </ul>
                            </div>

                            {/* Qualifications */}
                            <div className="pb-8">
                                <h3 className="text-lg font-semibold mb-2">Qualifications</h3>
                                <ul className="space-y-2">
                                    {qualifications && qualifications.length > 0
                                        ? qualifications.map((item, idx) => (
                                            <li key={idx} className="flex items-start gap-2">
                                                <span className="text-accent">✔</span>
                                                <span>{item}</span>
                                            </li>
                                        ))
                                        : []}
                                </ul>
                            </div>

                            {/* Footer */}

                            <p className="text-sm pb-8 mt-0 border-t border-glass-border ">
                                Please send in your Resume to{" "}
                                <strong>
                                    Email :{" "}
                                    <a className="text-accent" href="mailto:careers@roamiq.com">
                                        careers@roamiq.com
                                    </a>
                                </strong>{" "}
                                if unable to apply now
                            </p>
                        </div>
                    ) : (
                        <JobApplicationForm title={title} />
                    )}
                </div>
            </Container>
        </>
    );
};

export default AiJobDetail;
