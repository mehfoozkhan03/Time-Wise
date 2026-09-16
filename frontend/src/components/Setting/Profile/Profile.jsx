// import { useSelector } from 'react-redux';

// import { CiUser } from "react-icons/ci";
// import { MdOutlineEmail } from "react-icons/md";
// import { FaPhoneAlt } from "react-icons/fa";
// import { MdLocationOn } from "react-icons/md";
// import "./Profile.css";

// export const Profile = () => {
//   const { user } = useSelector((state) => state.auth);
//   return (
//     <>
//       <div className="setting-profile-container">
//         {/* Profile heading */}
//         <div className="setting-profile_heading">
//           <h3>Profile</h3>
//           <p>Manage your personal information and public profile.</p>
//         </div>

//         {/* Avatar */}
//         <div className="setting-avtar-main-container">
//           <div className="setting-avatar-heading">
//             <h2>Avatar</h2>
//           </div>
//           <div className="setting-profile-card">
//             <div className="setting-avatar-container">
//               <div className="setting-avatar">{user
//                 ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()
//                 : "U"}</div>

//               <label
//                 for="photo"
//                 className="setting-camera-btn"
//               >
//                 📷
//               </label>

//               <input
//                 type="file"
//                 id="photo"
//                 accept="image/*"
//                 hidden
//               />
//             </div>

//             <div className="setting-profile-info">
//               <h2>{user
//                   ? `${user.firstName
//                       ?.charAt(0)
//                       .toUpperCase()}${user.firstName?.slice(1)} ${
//                       user.lastName?.charAt(0).toUpperCase() +
//                       user.lastName?.slice(1)
//                     }`
//                   : "User"}</h2>
//               <p>JPG, PNG or WebP · Max 5 MB</p>

//               <label
//                 for="photo"
//                 className="setting-upload-link"
//               >
//                 Upload photo
//               </label>
//             </div>
//           </div>
//         </div>

//         {/* Personal Information */}
//         <div className="personal-information-container">
//           <div className="personal-information-heading">
//             <h2>Personal Information</h2>
//           </div>
//           <form className="personal-information-form">
//             <div className="top-data">
//               <div>
//                 <label htmlFor="name">Full name</label>
//                 <div>
//                   <CiUser />
//                   <input
//                     type="text"
//                     placeholder="Your full name"
//                     value={user
//                   ? `${user.firstName
//                       ?.charAt(0)
//                       .toUpperCase()}${user.firstName?.slice(1)} ${
//                       user.lastName?.charAt(0).toUpperCase() +
//                       user.lastName?.slice(1)
//                     }`
//                   : "User"}
//                   />
//                 </div>
//               </div>
//               <div>
//                 <label htmlFor="work_email">Work email</label>
//                 <div>
//                   <MdOutlineEmail />
//                   <input
//                     type="email"
//                     placeholder="Your work email"
//                     value={user?.email ?? "No Email"}
//                   />
//                 </div>
//               </div>
//               <div>
//                 <label htmlFor="phone_number">Phone Number</label>
//                 <div>
//                   <FaPhoneAlt />
//                   <input
//                     type="tel"
//                     placeholder="Your phone number"
//                   />
//                 </div>
//               </div>
//               <div>
//                 <label htmlFor="location">Location</label>
//                 <div>
//                   <MdLocationOn />
//                   <input
//                     type="email"
//                     placeholder="City, Country"
//                   />
//                 </div>
//               </div>
//             </div>
//             <div className="bio">
//             <label htmlFor="">Bio</label>
//               <textarea
//                 rows={3}
//               >
//                 Senior Product Manager at Acme Corp. Passionate about building
//                 tools that help teams do their best work.
//               </textarea>
//             </div>
//           </form>
//         </div>

//         {/* Save changes */}
//         <div className="save_changes">
//           <div><p>Unsaved changes</p></div>
//           <button type="button" className="change-btn">Save Changes</button>
//         </div>
//       </div>
//     </>
//   );
// };


import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

import { CiUser } from "react-icons/ci";
import { MdOutlineEmail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";

import Skeleton from "../../../components/Skeleton/Skeleton";

import "./Profile.css";

export const Profile = () => {
  const { user } = useSelector((state) => state.auth);

  const [showSkeleton, setShowSkeleton] = useState(true);

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
  // SKELETON UI
  // =========================
  if (showSkeleton) {
    return (
      <div className="setting-profile-container">

        {/* Profile Heading Skeleton */}
        <div className="setting-profile_heading">
          <Skeleton width="100px" height="28px" />

          <div style={{ marginTop: "10px" }}>
            <Skeleton width="350px" height="16px" />
          </div>
        </div>

        {/* Avatar Skeleton */}
        <div className="setting-avtar-main-container">
          <div className="setting-avatar-heading">
            <Skeleton width="80px" height="24px" />
          </div>

          <div className="setting-profile-card">

            <div className="setting-avatar-container">
              <Skeleton
                width="90px"
                height="90px"
                radius="50%"
              />
            </div>

            <div className="setting-profile-info">
              <Skeleton width="180px" height="24px" />

              <div style={{ marginTop: "10px" }}>
                <Skeleton width="180px" height="14px" />
              </div>

              <div style={{ marginTop: "12px" }}>
                <Skeleton width="100px" height="16px" />
              </div>
            </div>

          </div>
        </div>

        {/* Personal Information Skeleton */}
        <div className="personal-information-container">

          <div className="personal-information-heading">
            <Skeleton width="190px" height="24px" />
          </div>

          <div className="personal-information-form">

            <div className="top-data">

              {[1, 2, 3, 4].map((item) => (
                <div key={item}>

                  <Skeleton width="100px" height="16px" />

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginTop: "8px",
                    }}
                  >
                    <Skeleton
                      width="20px"
                      height="20px"
                      radius="50%"
                    />

                    <Skeleton
                      width="100%"
                      height="40px"
                      radius="6px"
                    />
                  </div>

                </div>
              ))}

            </div>

            {/* Bio */}
            <div className="bio">

              <Skeleton width="40px" height="16px" />

              <div style={{ marginTop: "8px" }}>
                <Skeleton
                  width="100%"
                  height="80px"
                  radius="6px"
                />
              </div>

            </div>

          </div>
        </div>

        {/* Save Changes Skeleton */}
        <div
          className="save_changes"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Skeleton width="130px" height="16px" />

          <Skeleton
            width="130px"
            height="40px"
            radius="8px"
          />
        </div>

      </div>
    );
  }

  // =========================
  // ORIGINAL UI
  // =========================
  return (
    <div className="setting-profile-container">

      {/* Profile heading */}
      <div className="setting-profile_heading">
        <h3>Profile</h3>
        <p>Manage your personal information and public profile.</p>
      </div>

      {/* Avatar */}
      <div className="setting-avtar-main-container">

        <div className="setting-avatar-heading">
          <h2>Avatar</h2>
        </div>

        <div className="setting-profile-card">

          <div className="setting-avatar-container">

            <div className="setting-avatar">
              {user
                ? `${user.firstName?.[0] ?? ""}${
                    user.lastName?.[0] ?? ""
                  }`.toUpperCase()
                : "U"}
            </div>

            <label
              htmlFor="photo"
              className="setting-camera-btn"
            >
              📷
            </label>

            <input
              type="file"
              id="photo"
              accept="image/*"
              hidden
            />

          </div>

          <div className="setting-profile-info">

            <h2>
              {user
                ? `${user.firstName
                    ?.charAt(0)
                    .toUpperCase()}${user.firstName?.slice(1)} ${
                    user.lastName?.charAt(0).toUpperCase() +
                    user.lastName?.slice(1)
                  }`
                : "User"}
            </h2>

            <p>JPG, PNG or WebP · Max 5 MB</p>

            <label
              htmlFor="photo"
              className="setting-upload-link"
            >
              Upload photo
            </label>

          </div>

        </div>
      </div>

      {/* Personal Information */}
      <div className="personal-information-container">

        <div className="personal-information-heading">
          <h2>Personal Information</h2>
        </div>

        <form className="personal-information-form">

          <div className="top-data">

            <div>
              <label htmlFor="name">Full name</label>

              <div>
                <CiUser />

                <input
                  type="text"
                  placeholder="Your full name"
                  value={
                    user
                      ? `${user.firstName
                          ?.charAt(0)
                          .toUpperCase()}${user.firstName?.slice(1)} ${
                          user.lastName?.charAt(0).toUpperCase() +
                          user.lastName?.slice(1)
                        }`
                      : "User"
                  }
                  readOnly
                />
              </div>
            </div>

            <div>
              <label htmlFor="work_email">Work email</label>

              <div>
                <MdOutlineEmail />

                <input
                  type="email"
                  placeholder="Your work email"
                  value={user?.email ?? "No Email"}
                  readOnly
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone_number">
                Phone Number
              </label>

              <div>
                <FaPhoneAlt />

                <input
                  type="tel"
                  placeholder="Your phone number"
                />
              </div>
            </div>

            <div>
              <label htmlFor="location">Location</label>

              <div>
                <MdLocationOn />

                <input
                  type="text"
                  placeholder="City, Country"
                />
              </div>
            </div>

          </div>

          <div className="bio">

            <label htmlFor="bio">Bio</label>

            <textarea
              id="bio"
              rows={3}
              defaultValue="Senior Product Manager at Acme Corp. Passionate about building tools that help teams do their best work."
            />

          </div>

        </form>
      </div>

      {/* Save changes */}
      <div className="save_changes">
        <div>
          <p>Unsaved changes</p>
        </div>

        <button
          type="button"
          className="change-btn"
        >
          Save Changes
        </button>
      </div>

    </div>
  );
};