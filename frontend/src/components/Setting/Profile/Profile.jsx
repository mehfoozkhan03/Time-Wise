// import { useDispatch, useSelector } from "react-redux";
// import { useEffect, useState } from "react";

// import { CiUser } from "react-icons/ci";
// import { MdOutlineEmail, MdLocationOn } from "react-icons/md";
// import { FaPhoneAlt } from "react-icons/fa";

// import Skeleton from "../../../components/Skeleton/Skeleton";
// import { updateProfile } from "../../../store/authSlice";

// import "./Profile.css";

// export const Profile = () => {
//   const dispatch = useDispatch();

//   const { user, isLoading, errorMessage } = useSelector(
//     (state) => state.auth
//   );

//   const [showSkeleton, setShowSkeleton] = useState(true);

//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     phone: "",
//     address: "",
//     bio: "",
//   });

//   const [isDirty, setIsDirty] = useState(false);

//   // Skeleton timer
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setShowSkeleton(false);
//     }, 1500);

//     return () => clearTimeout(timer);
//   }, []);

//   // Populate profile form
//   useEffect(() => {
//     if (user) {
//       setFormData({
//         firstName: user.firstName || "",
//         lastName: user.lastName || "",
//         email: user.email || "",
//         phone: user.phone || "",
//         address: user.address || "",
//         bio: user.bio || "",
//       });

//       setIsDirty(false);
//     }
//   }, [user]);

//   const handleChange = (event) => {
//     const { name, value } = event.target;

//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));

//     setIsDirty(true);
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     const result = await dispatch(updateProfile(formData));

//     if (updateProfile.fulfilled.match(result)) {
//       setIsDirty(false);
//     }
//   };

//   // =========================
//   // SKELETON UI
//   // =========================
//   if (showSkeleton || (!user && isLoading)) {
//     return (
//       <div className="setting-profile-container profile-skeleton">

//         {/* Profile Heading */}
//         <div className="setting-profile_heading profile-skeleton-header">
//           <Skeleton width="100px" height="28px" />

//           <div className="profile-skeleton-subtitle">
//             <Skeleton width="350px" height="16px" />
//           </div>
//         </div>

//         {/* Avatar Section */}
//         <div className="setting-avtar-main-container">
//           <div className="setting-avatar-heading">
//             <Skeleton width="80px" height="24px" />
//           </div>

//           <div className="setting-profile-card">
//             <div className="setting-avatar-container">
//               <Skeleton
//                 width="90px"
//                 height="90px"
//                 radius="50%"
//               />
//             </div>

//             <div className="setting-profile-info">
//               <Skeleton width="180px" height="24px" />

//               <div className="profile-skeleton-gap">
//                 <Skeleton width="180px" height="14px" />
//               </div>

//               <div className="profile-skeleton-upload">
//                 <Skeleton width="100px" height="16px" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Personal Information */}
//         <div className="personal-information-container">
//           <div className="personal-information-heading">
//             <Skeleton width="190px" height="24px" />
//           </div>

//           <div className="personal-information-form">
//             <div className="top-data">
//               {[1, 2, 3, 4].map((item) => (
//                 <div className="profile-skeleton-field" key={item}>
//                   <Skeleton width="110px" height="16px" />

//                   <div className="profile-skeleton-input">
//                     <Skeleton
//                       width="20px"
//                       height="20px"
//                       radius="50%"
//                     />

//                     <Skeleton
//                       width="100%"
//                       height="42px"
//                       radius="6px"
//                     />
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Bio */}
//             <div className="bio">
//               <Skeleton width="40px" height="16px" />

//               <div className="profile-skeleton-bio">
//                 <Skeleton
//                   width="100%"
//                   height="90px"
//                   radius="6px"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Save Changes */}
//         <div className="save_changes profile-skeleton-save">
//           <Skeleton width="130px" height="16px" />

//           <Skeleton
//             width="130px"
//             height="40px"
//             radius="8px"
//           />
//         </div>
//       </div>
//     );
//   }

//   // =========================
//   // USER DATA
//   // =========================
//   const fullName = `${user?.firstName || ""} ${
//     user?.lastName || ""
//   }`.trim();

//   const initials = `${user?.firstName?.[0] || ""}${
//     user?.lastName?.[0] || ""
//   }`.toUpperCase();

//   return (
//     <div className="setting-profile-container">

//       {/* Profile Heading */}
//       <div className="setting-profile_heading">
//         <h3>Profile</h3>
//         <p>Manage your personal information and public profile.</p>
//       </div>

//       {/* Avatar */}
//       <div className="setting-avtar-main-container">
//         <div className="setting-avatar-heading">
//           <h2>Avatar</h2>
//         </div>

//         <div className="setting-profile-card">
//           <div className="setting-avatar-container">
//             <div className="setting-avatar">
//               {initials || "U"}
//             </div>

//             <label
//               htmlFor="photo"
//               className="setting-camera-btn"
//             >
//               📷
//             </label>

//             <input
//               type="file"
//               id="photo"
//               accept="image/*"
//               hidden
//             />
//           </div>

//           <div className="setting-profile-info">
//             <h2>{fullName || "User"}</h2>

//             <p>JPG, PNG or WebP · Max 5 MB</p>

//             <label
//               htmlFor="photo"
//               className="setting-upload-link"
//             >
//               Upload photo
//             </label>
//           </div>
//         </div>
//       </div>

//       {/* Personal Information */}
//       <div className="personal-information-container">
//         <div className="personal-information-heading">
//           <h2>Personal Information</h2>
//         </div>

//         <form
//           id="profile-form"
//           className="personal-information-form"
//           onSubmit={handleSubmit}
//         >
//           <div className="top-data">

//             {/* Full Name */}
//             <div>
//               <label htmlFor="name">Full name</label>

//               <div>
//                 <CiUser />

//                 <input
//                   id="name"
//                   type="text"
//                   placeholder="Your full name"
//                   value={fullName || "User"}
//                   readOnly
//                 />
//               </div>
//             </div>

//             {/* Work Email */}
//             <div>
//               <label htmlFor="email">Work email</label>

//               <div>
//                 <MdOutlineEmail />

//                 <input
//                   id="email"
//                   type="email"
//                   name="email"
//                   placeholder="Your work email"
//                   value={formData.email}
//                   onChange={handleChange}
//                 />
//               </div>
//             </div>

//             {/* Phone */}
//             <div>
//               <label htmlFor="phone">Phone Number</label>

//               <div>
//                 <FaPhoneAlt />

//                 <input
//                   id="phone"
//                   type="tel"
//                   name="phone"
//                   placeholder="Your phone number"
//                   value={formData.phone}
//                   onChange={handleChange}
//                 />
//               </div>
//             </div>

//             {/* Address */}
//             <div>
//               <label htmlFor="address">Address</label>

//               <div>
//                 <MdLocationOn />

//                 <input
//                   id="address"
//                   type="text"
//                   name="address"
//                   placeholder="City, Country"
//                   value={formData.address}
//                   onChange={handleChange}
//                 />
//               </div>
//             </div>

//           </div>

//           {/* Bio */}
//           <div className="bio">
//             <label htmlFor="bio">Bio</label>

//             <textarea
//               id="bio"
//               name="bio"
//               rows={3}
//               placeholder="Tell us a little about yourself..."
//               value={formData.bio}
//               onChange={handleChange}
//             />
//           </div>
//         </form>
//       </div>

//       {/* Save Changes */}
//       <div className="save_changes">
//         <div>
//           <p>
//             {isDirty ? "Unsaved changes" : "All changes saved"}
//           </p>
//         </div>

//         <button
//           type="submit"
//           form="profile-form"
//           className="change-btn"
//           disabled={isLoading || !isDirty}
//         >
//           {isLoading ? "Saving..." : "Save Changes"}
//         </button>
//       </div>

//       {errorMessage && (
//         <p className="profile-error">{errorMessage}</p>
//       )}
//     </div>
//   );
// };



import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

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

import "./Profile.css";

export const Profile = () => {
  const dispatch = useDispatch();

  const { user, isLoading, errorMessage } = useSelector(
    (state) => state.auth
  );

  const [showSkeleton, setShowSkeleton] = useState(true);
  const [isDirty, setIsDirty] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

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

      setProfileImage(user.profileImage || null);
      setIsDirty(false);
    }
  }, [user]);

  // =========================
  // USER DATA
  // =========================

  const fullName = `${formData.firstName} ${formData.lastName}`.trim();

  const initials = `${formData.firstName?.[0] || ""}${
    formData.lastName?.[0] || ""
  }`.toUpperCase();

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
      completed: Boolean(profileImage),
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

    const imageUrl = URL.createObjectURL(file);

    setProfileImage(imageUrl);
    setIsDirty(true);
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

    setProfileImage(user.profileImage || null);
    setIsDirty(false);
  };

  // =========================
  // SAVE PROFILE
  // =========================

  const handleSubmit = async (event) => {
    event.preventDefault();

    const result = await dispatch(updateProfile(formData));

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

        <div className="profile-page-header">
          <Skeleton width="180px" height="28px" />
          <Skeleton width="120px" height="40px" />
        </div>

        <div className="profile-summary-card">
          <div className="profile-summary-left">
            <Skeleton
              width="110px"
              height="110px"
              radius="50%"
            />

            <div>
              <Skeleton width="180px" height="24px" />
              <Skeleton width="150px" height="16px" />
            </div>
          </div>

          <div className="profile-completion">
            <Skeleton width="160px" height="20px" />
            <Skeleton width="100%" height="12px" />
            <Skeleton width="180px" height="16px" />
          </div>
        </div>

        <div className="profile-section-card">
          <Skeleton width="200px" height="25px" />

          <div className="profile-form-grid">
            {[1, 2, 3, 4].map((item) => (
              <div key={item}>
                <Skeleton width="110px" height="16px" />
                <Skeleton
                  width="100%"
                  height="44px"
                  radius="10px"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="profile-section-card">
          <Skeleton width="150px" height="25px" />
          <Skeleton width="100%" height="100px" />
        </div>

        <div className="profile-bottom-bar">
          <Skeleton width="150px" height="20px" />
          <Skeleton width="140px" height="42px" />
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

            <div className="profile-avatar">

              {profileImage ? (
                <img src={profileImage} alt="Profile" />
              ) : (
                <span>{initials || "U"}</span>
              )}

            </div>

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
            disabled={!isDirty || isLoading}
          >
            <FaRedo />
            Reset Changes
          </button>

          <span className="profile-action-divider"></span>

          <button
            type="submit"
            form="profile-form"
            className="profile-save-btn"
            disabled={!isDirty || isLoading}
          >
            <FaCheck />

            {isLoading ? "Saving..." : "Save Changes"}
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