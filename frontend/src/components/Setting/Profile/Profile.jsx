import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";

import { CiUser } from "react-icons/ci";
import {
  MdOutlineEmail,
  MdLocationOn,
} from "react-icons/md";

import {
  FaPhoneAlt,
  FaCamera,
  FaCheck,
  FaUser,
  FaPencilAlt,
  FaRedo,
} from "react-icons/fa";

import Skeleton from "../../../components/Skeleton/Skeleton";
import { updateProfile } from "../../../store/authSlice";
import ProfileAvatar from "../../../components/Common/ProfileAvatar/ProfileAvatar";

import "./Profile.css";

export const Profile = () => {
  const dispatch = useDispatch();

  const { user, isLoading, isUpdatingProfile, errorMessage } = useSelector(
    (state) => state.auth
  );

  const [showSkeleton, setShowSkeleton] = useState(true);
  const [isDirty, setIsDirty] = useState(false);
  const [profilePreview, setProfilePreview] = useState(null);
  const [profileFile, setProfileFile] = useState(null);
  const imageInputRef = useRef(null);
  const isSaving = isLoading || isUpdatingProfile;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    bio: "",
  });

  // =========================
  // SKELETON TIMER
  // =========================

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkeleton(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // =========================
  // POPULATE PROFILE FORM
  // =========================

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        bio: user.bio || "",
      });

      setProfilePreview(user.profileImage || null);
      setProfileFile(null);
      setIsDirty(false);
    }
  }, [user]);

  useEffect(() => () => {
    if (profilePreview?.startsWith("blob:")) URL.revokeObjectURL(profilePreview);
  }, [profilePreview]);

  // =========================
  // USER DATA
  // =========================

  const fullName = `${formData.firstName} ${formData.lastName}`.trim();

  // =========================
  // PROFILE COMPLETION
  // =========================

  const completionItems = [
    {
      label: "Basic Information",
      completed: Boolean(formData.firstName && formData.lastName),
    },
    {
      label: "Contact Details",
      completed: Boolean(formData.email && formData.phone && formData.address),
    },
    {
      label: "About Me",
      completed: Boolean(formData.bio.trim()),
    },
    {
      label: "Profile Photo",
      completed: Boolean(profilePreview),
    },
  ];

  const completedItems = completionItems.filter(
    (item) => item.completed
  ).length;

  const completionPercentage = Math.round(
    (completedItems / completionItems.length) * 100
  );

  // =========================
  // HANDLE INPUT CHANGE
  // =========================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setIsDirty(true);
  };

  // =========================
  // HANDLE PROFILE IMAGE
  // =========================

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      alert("Please upload a JPG, PNG or WebP image.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5 MB.");
      event.target.value = "";
      return;
    }

    setProfileFile(file);
    setProfilePreview(URL.createObjectURL(file));
    setIsDirty(true);
    event.target.value = "";
  };

  // =========================
  // RESET CHANGES
  // =========================

  const handleReset = () => {
    if (!user) return;

    setFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      phone: user.phone || "",
      address: user.address || "",
      bio: user.bio || "",
    });

    setProfilePreview(user.profileImage || null);
    setProfileFile(null);
    if (imageInputRef.current) imageInputRef.current.value = "";
    setIsDirty(false);
  };

  // =========================
  // SAVE PROFILE
  // =========================

  const handleSubmit = async (event) => {
    event.preventDefault();

    const profilePayload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      profilePayload.append(key, value);
    });
    if (profileFile) profilePayload.append("profileImage", profileFile);

    const result = await dispatch(updateProfile(profilePayload));

    if (updateProfile.fulfilled.match(result)) {
      setIsDirty(false);
    }
  };

  // =========================
  // SKELETON UI
  // =========================

  if (showSkeleton || (!user && isLoading)) {
    return (
      <div className="profile-settings-page profile-skeleton">
        {/* HEADER SKELETON */}
        <div className="profile-page-header">
          <div className="profile-page-heading">
            <Skeleton width="48px" height="48px" radius="12px" />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "6px",
              }}
            >
              <Skeleton width="180px" height="24px" />
              <Skeleton width="300px" height="14px" />
            </div>
          </div>
        </div>

        {/* SUMMARY CARD SKELETON */}
        <div className="profile-summary-card">
          <div className="profile-summary-left">
            <div className="profile-avatar-wrapper">
              <Skeleton
                width="115px"
                height="115px"
                radius="50%"
              />
            </div>

            <div className="profile-summary-info">
              <Skeleton width="180px" height="24px" />
              <div style={{ margin: "8px 0" }}>
                <Skeleton width="130px" height="15px" />
              </div>
              <div className="profile-contact-info">
                <Skeleton width="140px" height="15px" />
                <span className="profile-contact-divider"></span>
                <Skeleton width="180px" height="15px" />
              </div>
              <div style={{ marginTop: "10px" }}>
                <Skeleton width="100px" height="14px" />
              </div>
            </div>
          </div>

          <div className="profile-completion">
            <div className="completion-heading">
              <Skeleton width="140px" height="18px" />
              <Skeleton width="40px" height="18px" />
            </div>

            <div
              className="completion-progress"
              style={{ background: "transparent" }}
            >
              <Skeleton width="100%" height="8px" radius="20px" />
            </div>

            <div className="completion-checklist">
              {[1, 2, 3, 4].map((item) => (
                <div className="completion-item" key={item}>
                  <Skeleton width="17px" height="17px" radius="50%" />
                  <Skeleton width="120px" height="14px" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PERSONAL INFORMATION SKELETON */}
        <div className="profile-section-card">
          <div className="profile-section-heading">
            <Skeleton width="43px" height="43px" radius="10px" />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "6px",
              }}
            >
              <Skeleton width="180px" height="18px" />
              <Skeleton width="280px" height="13px" />
            </div>
          </div>

          <div className="profile-form-grid">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="profile-form-group">
                <Skeleton width="90px" height="15px" />
                <Skeleton
                  width="100%"
                  height="46px"
                  radius="10px"
                />
              </div>
            ))}
          </div>
        </div>

        {/* ABOUT ME SKELETON */}
        <div className="profile-section-card profile-bio-card">
          <div className="profile-section-heading">
            <Skeleton width="43px" height="43px" radius="10px" />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "6px",
              }}
            >
              <Skeleton width="120px" height="18px" />
              <Skeleton width="200px" height="13px" />
            </div>
          </div>

          <div className="profile-form-group">
            <Skeleton width="40px" height="15px" />
            <Skeleton width="100%" height="100px" radius="10px" />
          </div>
        </div>

        {/* BOTTOM SAVE BAR SKELETON */}
        <div className="profile-bottom-bar">
          <div className="profile-save-status">
            <Skeleton width="38px" height="38px" radius="50%" />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "6px",
              }}
            >
              <Skeleton width="130px" height="16px" />
              <Skeleton width="220px" height="13px" />
            </div>
          </div>

          <div className="profile-bottom-actions">
            <Skeleton width="130px" height="42px" radius="9px" />
            <span className="profile-action-divider"></span>
            <Skeleton width="130px" height="42px" radius="9px" />
          </div>
        </div>
      </div>
    );
  }

  // =========================
  // MAIN UI
  // =========================

  return (
    <div className="profile-settings-page">
      {/* ================= HEADER ================= */}

      <div className="profile-page-header">
        <div className="profile-page-heading">
          <div className="profile-heading-icon">
            <FaUser />
          </div>

          <div>
            <h2>Profile Settings</h2>
            <p>
              Manage your personal information and public profile.
            </p>
          </div>
        </div>
      </div>

      {/* ================= PROFILE SUMMARY ================= */}

      <div className="profile-summary-card">
        <div className="profile-summary-left">
          <div className="profile-avatar-wrapper">

            <ProfileAvatar
              user={{ ...user, ...formData, profileImage: profilePreview }}
              size={115}
              className="profile-settings-avatar"
            />

            <label
              htmlFor="profile-image"
              className="profile-camera-btn"
              title="Upload profile photo"
            >
              <FaCamera />
            </label>

            <input
              type="file"
              id="profile-image"
              accept="image/png, image/jpeg, image/webp"
              hidden
              ref={imageInputRef}
              onChange={handleImageChange}
            />
          </div>

          <div className="profile-summary-info">
            <h2>{fullName || "User"}</h2>

            <p className="profile-designation">
              {user?.designation || "Employee"}
            </p>

            <div className="profile-contact-info">
              <span>
                <MdLocationOn />
                {formData.address || "Add your location"}
              </span>

              <span className="profile-contact-divider"></span>

              <span>
                <MdOutlineEmail />
                {formData.email || "Add your email"}
              </span>
            </div>

            <label
              htmlFor="profile-image"
              className="profile-upload-link"
            >
              Upload photo
            </label>

            <p className="profile-image-hint">
              JPG, PNG or WebP · Max 5 MB
            </p>
          </div>
        </div>

        {/* PROFILE COMPLETION */}

        <div className="profile-completion">
          <div className="completion-heading">
            <h3>Profile Completion</h3>
            <span>{completionPercentage}%</span>
          </div>

          <div className="completion-progress">
            <div
              className="completion-progress-fill"
              style={{
                width: `${completionPercentage}%`,
              }}
            />
          </div>

          <div className="completion-checklist">
            {completionItems.map((item, index) => (
              <div
                className="completion-item"
                key={index}
              >
                <span
                  className={`completion-check ${
                    item.completed ? "completed" : ""
                  }`}
                >
                  {item.completed && <FaCheck />}
                </span>

                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= PERSONAL INFORMATION ================= */}

      <div className="profile-section-card">
        <div className="profile-section-heading">
          <div className="profile-section-icon">
            <FaUser />
          </div>

          <div>
            <h3>Personal Information</h3>
            <p>
              Update your basic details and contact information.
            </p>
          </div>
        </div>

        <form
          id="profile-form"
          onSubmit={handleSubmit}
        >
          <div className="profile-form-grid">
            {/* FULL NAME */}

            <div className="profile-form-group">
              <label htmlFor="fullname">
                Full name
              </label>

              <div className="profile-input-wrapper">
                <CiUser />

                <input
                  id="fullname"
                  type="text"
                  value={fullName}
                  placeholder="Your full name"
                  readOnly
                />
              </div>
            </div>

            {/* EMAIL */}

            <div className="profile-form-group">
              <label htmlFor="email">
                Work email
              </label>

              <div className="profile-input-wrapper">
                <MdOutlineEmail />

                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Your work email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* PHONE */}

            <div className="profile-form-group">
              <label htmlFor="phone">
                Phone Number
              </label>

              <div className="profile-input-wrapper">
                <FaPhoneAlt />

                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  placeholder="Your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* ADDRESS */}

            <div className="profile-form-group">
              <label htmlFor="address">
                Address
              </label>

              <div className="profile-input-wrapper">
                <MdLocationOn />

                <input
                  id="address"
                  type="text"
                  name="address"
                  placeholder="City, Country"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* ================= ABOUT ME ================= */}

      <div className="profile-section-card profile-bio-card">
        <div className="profile-section-heading">
          <div className="profile-section-icon">
            <FaPencilAlt />
          </div>

          <div>
            <h3>About Me</h3>
            <p>
              Tell us a little about yourself.
            </p>
          </div>
        </div>

        <div className="profile-form-group">
          <label htmlFor="bio">
            Bio
          </label>

          <textarea
            id="bio"
            name="bio"
            rows={4}
            maxLength={500}
            placeholder="Tell us a little about yourself..."
            value={formData.bio}
            onChange={handleChange}
          />

          <div className="profile-bio-counter">
            {formData.bio.length}/500
          </div>
        </div>
      </div>

      {/* ================= BOTTOM SAVE BAR ================= */}

      <div className="profile-bottom-bar">
        <div className="profile-save-status">
          <div className="profile-status-icon">
            <FaCheck />
          </div>

          <div>
            <h4>
              {isDirty ? "Unsaved changes" : "All changes saved"}
            </h4>

            <p>
              {isDirty
                ? "You have changes that haven't been saved yet."
                : "Your profile information is up to date."}
            </p>
          </div>
        </div>

        <div className="profile-bottom-actions">
          <button
            type="button"
            className="profile-reset-btn"
            onClick={handleReset}
            disabled={!isDirty || isSaving}
          >
            <FaRedo />
            Reset Changes
          </button>

          <span className="profile-action-divider"></span>

          <button
            type="submit"
            form="profile-form"
            className="profile-save-btn"
            disabled={!isDirty || isSaving}
          >
            <FaCheck />

            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* ================= ERROR ================= */}

      {errorMessage && (
        <p className="profile-error">
          {errorMessage}
        </p>
      )}
    </div>
  );
};
