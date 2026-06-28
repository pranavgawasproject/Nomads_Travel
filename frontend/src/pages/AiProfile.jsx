import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  InputAdornment,
  MenuItem,
  TextField,
} from "@mui/material";
import useAuth from "../hooks/useAuth";
import { useNavigate, useSearchParams } from "react-router-dom";
import useLogout from "../hooks/useLogout";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Reviews from "./Reviews";
import { showErrorAlert, showSuccessAlert } from "../utils/alerts";
import { Country } from "country-state-city";
import { HiCheck } from "react-icons/hi";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { FiUser, FiLock, FiHeart, FiStar } from "react-icons/fi";

const PROFILE_PROMPT =
  "The more details you fill in, the more customized support we can provide.";
const PROFILE_TYPING_SEEN_KEY = "roamiq-ai-profile-typing-seen";
const getFlagIconUrl = (isoCode) =>
  `https://flagcdn.com/24x18/${isoCode.toLowerCase()}.png`;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const contactCodeRegex = /^\+\d{1,4}$/;
const fullNameRegex = /^[A-Za-z][A-Za-z .'-]*$/;

const TABS = [
  { key: "profile", label: "Profile", icon: FiUser },
  { key: "password", label: "Password", icon: FiLock },
  { key: "favorites", label: "Favorites", icon: FiHeart },
  { key: "reviews", label: "Reviews", icon: FiStar },
];

const validateProfileForm = (values) => {
  const errors = {};
  const fullName = values.fullName.trim();
  const email = values.email.trim();
  const country = values.country.trim();
  const contactCode = values.contactCode.trim();
  const contactNumber = values.contactNumber.trim();

  if (!fullName) {
    errors.fullName = "Full Name is required";
  } else if (!/[A-Za-z]/.test(fullName)) {
    errors.fullName = "Full Name must include at least one letter";
  } else if (!fullNameRegex.test(fullName)) {
    errors.fullName =
      "Full Name can include letters, spaces, periods, apostrophes, and hyphens";
  }

  if (!email) {
    errors.email = "Email is required";
  } else if (!emailRegex.test(email)) {
    errors.email = "Enter a valid email address";
  }

  if (!country) {
    errors.country = "Current Country Of Residence is required";
  }

  if (!contactCode) {
    errors.contactCode = "Code is required";
  } else if (!contactCodeRegex.test(contactCode)) {
    errors.contactCode = "Enter a valid code";
  }

  if (!contactNumber) {
    errors.contactNumber = "Mobile number is required";
  } else if (!/^\d{6,15}$/.test(contactNumber)) {
    errors.contactNumber = "Enter a valid mobile number";
  } else if (contactCodeRegex.test(contactCode)) {
    const phoneNumber = parsePhoneNumberFromString(
      `${contactCode}${contactNumber}`,
    );

    if (!phoneNumber?.isValid()) {
      errors.contactNumber = "Enter a valid mobile number";
    }
  }

  return errors;
};

const AiProfile = () => {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();
  const { auth, setAuth } = useAuth();
  const logout = useLogout();

  const user = auth?.user || {};
  const userId = auth?.user?._id || auth?.user?.id;

  const [searchParams] = useSearchParams();
  const countries = useMemo(() => Country.getAllCountries(), []);

  const initialTab = searchParams.get("tab") || "profile";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [typedProfilePrompt, setTypedProfilePrompt] = useState("");

  const getPhonePrefixByCountryName = (countryName) => {
    const selectedCountry = countries.find((item) => item.name === countryName);
    return selectedCountry?.phonecode ? `+${selectedCountry.phonecode}` : "";
  };

  const initialProfileForm = useMemo(() => {
    const userCountry = user?.country || user?.countryOfResidence || "";
    const selectedCountry = countries.find((item) => item.name === userCountry);

    return {
      fullName: user?.fullName || "",
      email: user?.email || "",
      country: userCountry,
      state: user?.state || "",
      contactCode:
        user?.contactCode ||
        (selectedCountry?.phonecode ? `+${selectedCountry.phonecode}` : ""),
      contactNumber: user?.contactNumber || "",
      salary: user?.salary || "",
      designation: user?.designation || "",
      githubUrl: user?.githubUrl || "",
      linkedinUrl: user?.linkedinUrl || "",
      twitterUrl: user?.twitterUrl || "",
      travelTimeline: user?.travelTimeline || [],
    };
  }, [
    user?.fullName,
    user?.email,
    user?.country,
    user?.countryOfResidence,
    user?.state,
    user?.contactCode,
    user?.contactNumber,
    user?.salary,
    user?.designation,
    user?.githubUrl,
    user?.linkedinUrl,
    user?.twitterUrl,
    user?.travelTimeline,
    countries,
  ]);

  const [editMode, setEditMode] = useState(false);
  const [profileForm, setProfileForm] = useState(initialProfileForm);
  const [profileErrors, setProfileErrors] = useState({});

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (!auth?.user) navigate("/ai-login", { replace: true });
  }, [auth, navigate]);

  useEffect(() => {
    const tab = searchParams.get("tab") || "profile";
    setActiveTab(tab);
  }, [searchParams]);

  useEffect(() => {
    setProfileForm(initialProfileForm);
    setProfileErrors({});
  }, [initialProfileForm]);

  useEffect(() => {
    const hasSeenTypingEffect =
      typeof window !== "undefined" &&
      window.localStorage.getItem(PROFILE_TYPING_SEEN_KEY) === "true";

    if (hasSeenTypingEffect) {
      setTypedProfilePrompt(PROFILE_PROMPT);
      return;
    }

    setTypedProfilePrompt("");

    let index = 0;
    const typingInterval = setInterval(() => {
      index += 1;
      setTypedProfilePrompt(PROFILE_PROMPT.slice(0, index));

      if (index >= PROFILE_PROMPT.length) {
        clearInterval(typingInterval);
        if (typeof window !== "undefined") {
          window.localStorage.setItem(PROFILE_TYPING_SEEN_KEY, "true");
        }
      }
    }, 1);

    return () => clearInterval(typingInterval);
  }, []);

  const [newTimelineCity, setNewTimelineCity] = useState("");
  const [newTimelineCountry, setNewTimelineCountry] = useState("");
  const [newTimelineFrom, setNewTimelineFrom] = useState("");
  const [newTimelineTo, setNewTimelineTo] = useState("");
  const [newTimelineStatus, setNewTimelineStatus] = useState("past");

  const handleAddTimelineItem = () => {
    if (!newTimelineCity || !newTimelineCountry || !newTimelineFrom) {
      showErrorAlert("City, Country, and From Date are required");
      return;
    }
    const newItem = {
      city: newTimelineCity.trim(),
      country: newTimelineCountry.trim(),
      dateFrom: newTimelineFrom,
      dateTo: newTimelineTo,
      status: newTimelineStatus,
    };
    setProfileForm((prev) => ({
      ...prev,
      travelTimeline: [...(prev.travelTimeline || []), newItem],
    }));
    setNewTimelineCity("");
    setNewTimelineCountry("");
    setNewTimelineFrom("");
    setNewTimelineTo("");
    setNewTimelineStatus("past");
  };

  const handleRemoveTimelineItem = (indexToRemove) => {
    setProfileForm((prev) => ({
      ...prev,
      travelTimeline: prev.travelTimeline.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
    setProfileErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleCountryChange = (countryName) => {
    setProfileForm((prev) => ({
      ...prev,
      country: countryName,
      contactCode: getPhonePrefixByCountryName(countryName),
    }));
    setProfileErrors((prev) => ({
      ...prev,
      country: "",
      contactCode: "",
      contactNumber: "",
    }));
  };

  const selectedCountryData = useMemo(
    () =>
      countries.find((country) => country.name === profileForm.country) || null,
    [countries, profileForm.country],
  );

  const { mutate: updateProfile, isPending: isUpdatePending } = useMutation({
    mutationKey: ["updateProfile"],
    mutationFn: async ({ userId, profileData }) => {
      const response = await axiosPrivate.patch(
        `/user/profile/${userId}`,
        profileData,
      );
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["userProfile", data.user.id || data.user._id],
      });
      setAuth((prev) => ({ ...prev, user: data.user }));
      showSuccessAlert(data.message || "Profile updated successfully");
      setEditMode(false);
    },
    onError: (error) => {
      showErrorAlert(
        error.response?.data?.message || "Failed to update profile",
      );
    },
  });

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const { mutate: changePassword, isPending: isPasswordPending } = useMutation({
    mutationKey: ["changePassword"],
    mutationFn: async ({
      userId,
      oldPassword,
      newPassword,
      confirmPassword,
    }) => {
      const response = await axiosPrivate.patch(`/user/password/${userId}`, {
        oldPassword,
        newPassword,
        confirmPassword,
      });
      return response.data;
    },
    onSuccess: async (data) => {
      showSuccessAlert(data.message || "Password changed successfully");
      setPasswordForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      await logout();
      navigate("/ai-login", { replace: true });
    },
    onError: (error) => {
      showErrorAlert(
        error.response?.data?.message || "Failed to change password",
      );
    },
  });

  const handlePasswordSubmit = () => {
    const { oldPassword, newPassword, confirmPassword } = passwordForm;
    if (!oldPassword || !newPassword || !confirmPassword)
      return showErrorAlert("All fields are required");
    if (newPassword !== confirmPassword)
      return showErrorAlert("New passwords do not match");
    changePassword({ userId, oldPassword, newPassword, confirmPassword });
  };

  const handleProfileSubmit = () => {
    const errors = validateProfileForm(profileForm);
    setProfileErrors(errors);

    if (Object.keys(errors).length > 0) {
      return showErrorAlert(Object.values(errors)[0]);
    }

    updateProfile({
      userId,
      profileData: {
        ...profileForm,
        fullName: profileForm.fullName.trim(),
        email: profileForm.email.trim(),
        country: profileForm.country.trim(),
        contactCode: profileForm.contactCode.trim(),
        contactNumber: profileForm.contactNumber.trim(),
      },
    });
  };

  return (
    <div className="animate-fade-in min-h-screen bg-surface p-4 sm:p-6 lg:p-8">
      {/* Subtle background gradient glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute right-1/4 top-0 h-[400px] w-[400px] rounded-full bg-gradient-glow opacity-30 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl">
        {/* Profile Header */}
        <div className="glass-card mb-6 p-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              {/* Avatar with accent bg and initial */}
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent text-2xl font-bold text-surface shadow-glow-sm">
                {user?.fullName
                  ? user.fullName.charAt(0).toUpperCase()
                  : "U"}
              </div>
              <div>
                <h2 className="text-content font-semibold text-gray-200">
                  {user?.fullName || "User Name"}
                </h2>
                <p className="text-small text-gray-500">{user?.email || ""}</p>
              </div>
            </div>

            <p className="max-w-sm text-center text-tiny leading-relaxed text-gray-500 sm:text-right sm:text-small">
              {typedProfilePrompt}
            </p>
          </div>
        </div>

        {/* Tab Pills */}
        <div className="mb-6 flex flex-wrap gap-2">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-small font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-accent/15 text-accent shadow-glow-sm border border-accent/30"
                    : "border border-glass-border text-gray-400 hover:text-gray-200 hover:bg-glass hover:border-accent/20"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* PROFILE TAB */}
        {activeTab === "profile" && (
          <div className="glass-card animate-fade-in p-6 sm:p-8">
            <h2 className="gradient-text mb-6 text-center text-hero font-bold sm:text-left">
              My Profile
            </h2>

            {/* Personal Info */}
            <div className="py-4">
              <h3 className="mb-4 text-small font-semibold uppercase tracking-wider text-gray-400">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2">
                <TextField
                  label="Full Name"
                  variant="standard"
                  fullWidth
                  name="fullName"
                  value={profileForm.fullName}
                  onChange={handleProfileChange}
                  error={!!profileErrors.fullName}
                  helperText={profileErrors.fullName}
                  InputProps={{ readOnly: !editMode }}
                />
                <TextField
                  label="Email"
                  variant="standard"
                  fullWidth
                  name="email"
                  value={profileForm.email}
                  onChange={handleProfileChange}
                  error={!!profileErrors.email}
                  helperText={profileErrors.email}
                  InputProps={{ readOnly: true }}
                />
                <TextField
                  label="Current Country Of Residence"
                  variant="standard"
                  fullWidth
                  select
                  name="country"
                  value={profileForm.country}
                  onChange={(event) => handleCountryChange(event.target.value)}
                  error={!!profileErrors.country}
                  helperText={profileErrors.country}
                  disabled={!editMode}
                  SelectProps={{
                    renderValue: (value) => {
                      const selectedOption = countries.find(
                        (country) => country.name === value,
                      );

                      if (!selectedOption) {
                        return value;
                      }

                      return (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <img
                            src={getFlagIconUrl(selectedOption.isoCode)}
                            alt={`${selectedOption.name} flag`}
                            width={20}
                            height={15}
                            loading="lazy"
                          />
                          <span>{selectedOption.name}</span>
                        </Box>
                      );
                    },
                  }}
                >
                  <MenuItem value="" sx={{ fontWeight: 700 }}>
                    SELECT COUNTRY
                  </MenuItem>
                  {countries.map((country) => (
                    <MenuItem key={country.isoCode} value={country.name}>
                      <Box className="flex w-full items-center gap-2">
                        <HiCheck className="text-accent opacity-0 group-hover:opacity-100" size={16} />
                        <Box className="flex items-center gap-1">
                          <Box
                            component="img"
                            src={getFlagIconUrl(country.isoCode)}
                            alt={`${country.name} flag`}
                            sx={{ width: 20, height: 15, flexShrink: 0 }}
                            loading="lazy"
                          />
                          <span>{country.name}</span>
                        </Box>
                      </Box>
                    </MenuItem>
                  ))}
                </TextField>
                <Box sx={{ display: "flex", gap: 2, width: "100%" }}>
                  <TextField
                    label="Code"
                    variant="standard"
                    name="contactCode"
                    value={profileForm.contactCode}
                    error={!!profileErrors.contactCode}
                    helperText={profileErrors.contactCode}
                    InputProps={{
                      readOnly: true,
                      startAdornment: selectedCountryData?.isoCode ? (
                        <InputAdornment position="start">
                          <Box
                            component="img"
                            src={getFlagIconUrl(selectedCountryData.isoCode)}
                            alt={`${selectedCountryData.name} flag`}
                            sx={{ width: 20, height: 15, flexShrink: 0 }}
                            loading="lazy"
                          />
                        </InputAdornment>
                      ) : null,
                    }}
                    sx={{ width: "28%" }}
                  />
                  <TextField
                    label="Mobile"
                    variant="standard"
                    fullWidth
                    name="contactNumber"
                    value={profileForm.contactNumber}
                    onChange={handleProfileChange}
                    error={!!profileErrors.contactNumber}
                    helperText={profileErrors.contactNumber}
                    InputProps={{ readOnly: !editMode }}
                    sx={{ flex: 1 }}
                  />
                </Box>
                <TextField
                  label="Salary"
                  variant="standard"
                  fullWidth
                  name="salary"
                  value={profileForm.salary}
                  onChange={handleProfileChange}
                  InputProps={{ readOnly: !editMode }}
                />
                <TextField
                  label="Designation"
                  variant="standard"
                  fullWidth
                  name="designation"
                  value={profileForm.designation}
                  onChange={handleProfileChange}
                  InputProps={{ readOnly: !editMode }}
                />
                <TextField
                  label="GitHub Profile URL"
                  variant="standard"
                  fullWidth
                  name="githubUrl"
                  value={profileForm.githubUrl}
                  onChange={handleProfileChange}
                  InputProps={{ readOnly: !editMode }}
                />
                <TextField
                  label="LinkedIn Profile URL"
                  variant="standard"
                  fullWidth
                  name="linkedinUrl"
                  value={profileForm.linkedinUrl}
                  onChange={handleProfileChange}
                  InputProps={{ readOnly: !editMode }}
                />
                <TextField
                  label="Twitter / X Profile URL"
                  variant="standard"
                  fullWidth
                  name="twitterUrl"
                  value={profileForm.twitterUrl}
                  onChange={handleProfileChange}
                  InputProps={{ readOnly: !editMode }}
                />
              </div>

              {/* ── Travel Timeline Section ── */}
              <div className="mt-10 border-t border-glass-border pt-8">
                <h3 className="mb-6 text-small font-semibold uppercase tracking-wider text-gray-400">
                  Travel Timeline & History
                </h3>

                {/* Timeline Render */}
                {profileForm.travelTimeline && profileForm.travelTimeline.length > 0 ? (
                  <div className="relative pl-6 border-l-2 border-accent/20 space-y-6">
                    {profileForm.travelTimeline.map((item, idx) => (
                      <div key={idx} className="relative group">
                        {/* Dot */}
                        <span className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 border-surface flex items-center justify-center ${
                          item.status === 'current' ? 'bg-accent shadow-glow-sm' :
                          item.status === 'future' ? 'bg-indigo-500' : 'bg-gray-600'
                        }`} />
                        
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-tiny px-2 py-0.5 rounded-md font-bold bg-glass text-gray-300 mr-2 uppercase">
                              {item.status}
                            </span>
                            <span className="text-content font-bold text-gray-200">
                              {item.city}, {item.country}
                            </span>
                            <p className="text-small text-gray-500 mt-1">
                              {item.dateFrom} {item.dateTo ? `to ${item.dateTo}` : '(Current)'}
                            </p>
                          </div>
                          {editMode && (
                            <button
                              type="button"
                              onClick={() => handleRemoveTimelineItem(idx)}
                              className="text-red-400 hover:text-red-300 text-tiny bg-red-500/10 px-2.5 py-1 rounded-lg border border-red-500/20"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-small text-gray-500 italic text-center py-4">No travel plans or history added yet.</p>
                )}

                {/* Add Timeline Item Form (Only in editMode) */}
                {editMode && (
                  <div className="mt-8 rounded-2xl border border-glass-border bg-glass p-5 space-y-4">
                    <h4 className="text-small font-semibold text-gray-300">Add Destination</h4>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <TextField
                        label="City"
                        variant="standard"
                        fullWidth
                        value={newTimelineCity}
                        onChange={(e) => setNewTimelineCity(e.target.value)}
                      />
                      <TextField
                        label="Country"
                        variant="standard"
                        fullWidth
                        value={newTimelineCountry}
                        onChange={(e) => setNewTimelineCountry(e.target.value)}
                      />
                      <TextField
                        label="From Date"
                        type="date"
                        variant="standard"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={newTimelineFrom}
                        onChange={(e) => setNewTimelineFrom(e.target.value)}
                      />
                      <TextField
                        label="To Date (Optional)"
                        type="date"
                        variant="standard"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={newTimelineTo}
                        onChange={(e) => setNewTimelineTo(e.target.value)}
                      />
                      <TextField
                        label="Status"
                        variant="standard"
                        fullWidth
                        select
                        value={newTimelineStatus}
                        onChange={(e) => setNewTimelineStatus(e.target.value)}
                      >
                        <MenuItem value="past">Past Destination</MenuItem>
                        <MenuItem value="current">Current Location</MenuItem>
                        <MenuItem value="future">Upcoming Trip</MenuItem>
                      </TextField>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddTimelineItem}
                      className="mt-2 text-tiny bg-accent/20 hover:bg-accent/30 text-accent font-semibold px-4 py-2 rounded-xl border border-accent/30 transition-all shadow-glow-sm"
                    >
                      + Add Location
                    </button>
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                {editMode ? (
                  <>
                    <button
                      className="btn-primary w-full rounded-full font-semibold sm:w-auto sm:px-10"
                      onClick={handleProfileSubmit}
                      disabled={isUpdatePending}
                    >
                      {isUpdatePending ? "Submitting..." : "Submit"}
                    </button>
                    <button
                      className="btn-ghost w-full rounded-full sm:w-auto sm:px-10"
                      onClick={() => {
                        setProfileForm(initialProfileForm);
                        setProfileErrors({});
                        setEditMode(false);
                      }}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    className="btn-primary w-full rounded-full font-semibold sm:w-auto sm:px-10"
                    onClick={() => setEditMode(true)}
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* CHANGE PASSWORD TAB */}
        {activeTab === "password" && (
          <div className="glass-card animate-fade-in p-6 sm:p-8">
            <h2 className="gradient-text mb-6 text-center text-hero font-bold sm:text-left">
              Change Password
            </h2>

            <div className="mx-auto max-w-md space-y-5">
              <TextField
                label="Current Password"
                type="password"
                fullWidth
                variant="standard"
                name="oldPassword"
                value={passwordForm.oldPassword}
                onChange={handlePasswordChange}
              />
              <TextField
                label="New Password"
                type="password"
                fullWidth
                variant="standard"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
              />
              <TextField
                label="Confirm Password"
                type="password"
                fullWidth
                variant="standard"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
              />

              {/* Password Requirements */}
              <div className="rounded-xl border border-glass-border bg-surface-50 p-4">
                <p className="mb-2 text-tiny font-semibold text-gray-300">
                  Password Requirements
                </p>
                <ul className="ml-4 list-disc space-y-1 text-tiny text-gray-500">
                  <li>Must be at least 8 characters long.</li>
                  <li>Should include both uppercase and lowercase letters.</li>
                  <li>
                    Must contain at least one number or special character.
                  </li>
                </ul>
              </div>

              <div className="flex justify-center pt-2">
                <button
                  className="btn-primary w-full rounded-full font-semibold sm:w-auto sm:px-10"
                  onClick={handlePasswordSubmit}
                  disabled={isPasswordPending}
                >
                  {isPasswordPending ? "Submitting..." : "Change Password"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* FAVORITES TAB */}
        {activeTab === "favorites" && (
          <div className="glass-card animate-fade-in flex min-h-[200px] items-center justify-center p-8">
            <div className="text-center">
              <FiHeart className="mx-auto mb-3 h-8 w-8 text-gray-600" />
              <p className="text-content text-gray-500">
                Favorites coming soon
              </p>
            </div>
          </div>
        )}

        {/* REVIEWS TAB */}
        {activeTab === "reviews" && (
          <div className="animate-fade-in">
            <Reviews />
          </div>
        )}
      </div>
    </div>
  );
};

export default AiProfile;
