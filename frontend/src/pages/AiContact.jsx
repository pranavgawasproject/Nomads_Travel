import React, { useState } from "react";
import axios from "../utils/axios";
import { FaMapMarkerAlt } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import Spinners from "../components/Spinner";
import {
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Button,
    Grid,
    Box,
    CircularProgress,
} from "@mui/material";
import Container from "../components/Container";
import { Controller, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
// import toast from "react-hot-toast";
import { isValidInternationalPhone } from "../utils/validators";
import { showErrorAlert, showSuccessAlert } from "../utils/alerts";

const AiContact = () => {
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        mobile: "",
        typeOfPartnerShip: "",
        message: "",
    });

    const { control, handleSubmit, reset } = useForm({
        defaultValues: {
            name: "",
            email: "",
            mobile: "",
            typeOfPartnerShip: "",
            message: "",
        },
    });

    const handleCloseModal = () => setShowModal(false);

    const { mutate: submitContactForm, isPending: isContactPending } =
        useMutation({
            mutationFn: async (data) => {
                const response = await axios.post("forms/add-new-b2c-form-submission", {
                    ...data,
                    sheetName: "Connect_with_us",
                });
                return response.data;
            },
            onSuccess: (data) => {
                showSuccessAlert("Form submitted successfully");
                reset();
            },
            onError: (error) => {
                showErrorAlert(error.response.data.message);
            },
        });

    const floatingLabelSx = {
        color: "black",
        "&.Mui-focused": { color: "#1976d2" },
        "&.MuiInputLabel-shrink": { color: "#1976d2" },
    };

    return (
        <div className="bg-white text-black font-sans">
            {/* About & Form */}
            {/* <section className="py-10 px-4 md:px-20"> */}
            <Container padding={false}>
                <section className="min-h-[85vh] flex items-center justify-center">
                    <div className="w-full max-w-5xl">
                        {/* About Us */}
                        {/* <div className="space-y-6">
              <h2 className="text-title font-semibold uppercase">About RoamIQ</h2>
              <p className="text-tiny leading-relaxed">
                <strong>RoamIQ</strong> is redefining the global future of work
                and mobility for the growing Digital Explorer's & Explorer Businesses
                Ecosystem.
              </p>
              <p className="text-tiny leading-relaxed">
                We are building a unified digital ecosystem that connects the
                world’s{" "}
                <strong>
                  remote professionals, remote workers and travelers, and flexible enterprises
                </strong>{" "}
                to the spaces and services they need — anywhere, anytime.
              </p>
              <p className="text-tiny leading-relaxed">
                Through our platform, Explorer's can discover and book curated
                Explorer Businesses such as
                <strong>
                  {" "}
                  co-working spaces, co-living communities, serviced apartments,
                  hostels, workation spaces and working cafés
                </strong>{" "}
                — seamlessly integrated under our brand.
              </p>
              <p className="text-tiny leading-relaxed">
                As global work patterns evolve, RoamIQ empowers people and
                companies to operate <strong>borderlessly</strong>, supporting
                the new generation of professionals who value{" "}
                <strong>freedom, flexibility, and community </strong>
                over location.
              </p>

          
              <h3 className="font-semibold uppercase mt-8">OUR MISSION</h3>
              <ul className="list-disc ml-6 text-tiny leading-relaxed">
                <li>
                  To support and activate 100% of the World's Explorer Businesses
                  under one roof
                </li>
                <li>
                  To simplify the global remote work experience by connecting
                  individuals and organizations with a trusted explorer businesses
                  network of work, stay, and lifestyle solutions across the
                  world.
                </li>
              </ul>

      
              <h3 className="font-semibold uppercase mt-8">OUR VISION</h3>
              <ul className="list-disc ml-6 text-tiny leading-relaxed">
                <li>
                  To become the world’s leading platform for borderless living
                  and working — enabling a truly global, connected, and mobile
                  workforce.
                </li>
                <li>
                  Build the LARGEST Community of EXPLORERS & EXPLORER BUSINESS ACROSS
                  THE WORLD!
                </li>
              </ul>

       
              <h3 className="font-semibold uppercase mt-8">OUR EDGE</h3>
              <ul className="list-disc ml-6 text-tiny leading-relaxed">
                <li>
                  World's LARGEST Integrated curated platform combining{" "}
                  <strong>work, stay, and travel services</strong>
                </li>
                <li>
                  B2B Partnerships across major digital-explorer destinations
                </li>
                <li>
                  Data-driven insights into global mobility and workforce trends
                </li>
                <li>
                  Designed for both <strong>individual professionals</strong>{" "}
                  and <strong>remote-first teams</strong>
                </li>
              </ul>

              <p className="text-tiny leading-relaxed">
                At RoamIQ, we’re not just following the future of work —{" "}
                <strong>we’re building it.</strong>
              </p>

              <p className="text-tiny font-semibold">
                A Platform which is an Early Adaptation of our Future Lifestyle!
              </p>
            </div> */}

                        {/* Connect With Us - MUI Styled Form */}
                        <div className="md:px-20 lg:px-40">
                            <Box
                                component="form"
                                onSubmit={handleSubmit((data) => submitContactForm(data))}
                                sx={{ mt: 0 }}
                                className="bg-gray-50/50 p-6 md:p-10 rounded-2xl border border-gray-100 shadow-sm"
                            >
                                <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold uppercase mb-8 text-center">
                                    Connect With Us
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                                    {/* Name */}
                                    <Controller
                                        name="name"
                                        control={control}
                                        rules={{ required: "Name is required" }}
                                        render={({ field, fieldState }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                label="Name"
                                                variant="standard"
                                                required
                                                error={!!fieldState.error}
                                                helperText={fieldState.error?.message}
                                                InputLabelProps={{ sx: floatingLabelSx }}
                                            />
                                        )}
                                    />

                                    {/* Email */}
                                    <Controller
                                        name="email"
                                        control={control}
                                        rules={{
                                            required: "Email is required",
                                            pattern: {
                                                value: /^\S+@\S+$/i,
                                                message: "Invalid email address",
                                            },
                                        }}
                                        render={({ field, fieldState }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                label="Email"
                                                variant="standard"
                                                required
                                                error={!!fieldState.error}
                                                helperText={fieldState.error?.message}
                                                InputLabelProps={{ sx: floatingLabelSx }}
                                            />
                                        )}
                                    />

                                    {/* Mobile */}
                                    <Controller
                                        name="mobile"
                                        control={control}
                                        rules={{
                                            required: "Mobile number is required",
                                            validate: isValidInternationalPhone,
                                        }}
                                        render={({ field, fieldState }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                label="Mobile Number"
                                                variant="standard"
                                                required
                                                error={!!fieldState.error}
                                                helperText={fieldState.error?.message}
                                                InputLabelProps={{ sx: floatingLabelSx }}
                                            />
                                        )}
                                    />

                                    {/* Reason to Connect */}
                                    <Controller
                                        name="typeOfPartnerShip"
                                        control={control}
                                        rules={{ required: "Please select a partnership type" }}
                                        render={({ field, fieldState }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                required
                                                variant="standard"
                                                error={!!fieldState.error}
                                                label="Reason to Connect"
                                                select
                                                helperText={fieldState?.error?.message}
                                                InputLabelProps={{ sx: floatingLabelSx }}
                                            >
                                                <MenuItem value="" disabled>
                                                    Select Type
                                                </MenuItem>
                                                <MenuItem value="Explorer Booking Query">
                                                    Explorer Booking Query
                                                </MenuItem>
                                                <MenuItem value="Workation Booking Query">
                                                    Workation Booking Query
                                                </MenuItem>
                                                <MenuItem value="Suggest Business Addition">
                                                    Suggest Business Addition
                                                </MenuItem>
                                                <MenuItem value="Become an Explorer Contributor">
                                                    Become an Explorer Contributor
                                                </MenuItem>
                                                <MenuItem value="Become an Explorer Blogger">
                                                    Become an Explorer Blogger
                                                </MenuItem>
                                                <MenuItem value="PR Related Query">
                                                    PR Related Query
                                                </MenuItem>
                                                <MenuItem value="Join Our Team">
                                                    Join Our Team
                                                </MenuItem>
                                            </TextField>
                                        )}
                                    />

                                    {/* Message */}
                                    <div className="md:col-span-2">
                                        <Controller
                                            name="message"
                                            control={control}
                                            rules={{ required: "Message is required" }}
                                            render={({ field, fieldState }) => (
                                                <TextField
                                                    {...field}
                                                    fullWidth
                                                    multiline
                                                    minRows={4}
                                                    label="Message"
                                                    variant="standard"
                                                    required
                                                    error={!!fieldState.error}
                                                    helperText={fieldState.error?.message}
                                                    InputLabelProps={{ sx: floatingLabelSx }}
                                                />
                                            )}
                                        />
                                    </div>

                                    {/* Button */}
                                    <div className="pt-6 md:col-span-2 text-center">
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            disabled={isContactPending}
                                            sx={{
                                                bgcolor: "black",
                                                borderRadius: 20,
                                                px: { xs: 6, md: 14 },
                                                py: 1.5,
                                                fontSize: "1rem",
                                                fontWeight: "600",
                                                "&:hover": { bgcolor: "#333" },
                                                width: { xs: "100%", md: "auto" },
                                            }}
                                        >
                                            {isContactPending && (
                                                <CircularProgress
                                                    size={16}
                                                    sx={{ color: "white", mr: 1 }}
                                                />
                                            )}
                                            {isContactPending ? "CONNECTING..." : "CONNECT"}
                                        </Button>
                                    </div>
                                </div>
                            </Box>
                        </div>
                    </div>
                </section>
            </Container>

            {/* Maps */}
            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 md:px-20 pb-10"> */}
            {/* <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8  pb-10">
          <div className="shadow-md">
            <iframe
              title="Singapore Office"
              className="w-full h-[25rem]"
              loading="lazy"
              src="https://www.google.com/maps?q=77%20HIGH%20STREET%2C%20%2310-12B%20HIGH%20STREET%20PLAZA%2C%20SINGAPORE%20179433&output=embed"></iframe>
            <div className="p-4 flex gap-2 text-sm items-start">
              <FaMapMarkerAlt className="mt-1 text-black" />
              <span>
                SINGAPORE OFFICE - RoamIQ Technologies, 77 HIGH STREET,
                #10-12B HIGH STREET PLAZA, SINGAPORE 179433
              </span>
            </div>
          </div>
          <div className="shadow-md">
            <iframe
              title="India Office"
              className="w-full h-[25rem]"
              loading="lazy"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3844.7765664747362!2d73.83261987495516!3d15.496445985103028!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bbfc1d2e05cbef3%3A0xa643703ebcc4db43!2sBIZ%20Nest%20-%20Co-Working%20Space%2C%20Workations%20%26%20Meeting%20Zone%20in%20Goa!5e0!3m2!1sen!2sin!4v1723627911486!5m2!1sen!2sin"></iframe>
            <div className="p-4 flex gap-2 text-sm items-start">
              <FaMapMarkerAlt className="mt-1 text-black" />
              <span>
                INDIA OFFICE - RoamIQ Technologies, BIZ NEST CO-WORKING,
                SUNTECK KANAKA CORPORATE PARK, 701 - B, PATTO CENTRE, PANJIM,
                GOA - 403001
              </span>
            </div>
          </div>
        </div>
      </Container> */}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
                    <div className="bg-white rounded shadow-lg w-full max-w-md p-6 relative">
                        <button
                            onClick={handleCloseModal}
                            className="absolute top-2 right-2 text-gray-600 hover:text-black"
                        >
                            <AiOutlineClose size={20} />
                        </button>
                        <h3 className="text-lg font-bold mb-2">Success</h3>
                        <p className="text-sm mb-4">
                            Your enquiry has been submitted successfully!
                        </p>
                        <div className="text-right">
                            <button
                                onClick={handleCloseModal}
                                className="bg-black text-white px-4 py-2 rounded hover:opacity-90"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Loading Spinner */}
            {loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
                    <Spinners animation="border" variant="dark" />
                </div>
            )}
        </div>
    );
};

export default AiContact;
