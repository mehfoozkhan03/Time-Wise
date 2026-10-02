import { useDispatch, useSelector } from "react-redux";

import { CiUser } from "react-icons/ci";
import { MdOutlineEmail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";

import Skeleton from "../../../components/Skeleton/Skeleton";

import "./Profile.css";
import { useEffect, useState } from "react";
import { updateProfile } from "../../../store/authSlice";

export const Profile = () => {
  // const { user, loading } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const { user, isLoading, errorMessage } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    bio: "",
  });

  const [isDirty, setIsDirty] = useState(false);

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

      setIsDirty(false);
    }
  }, [user]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setIsDirty(true);
  };

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
  if (isLoading && !user) {
    return (
      <div className="setting-profile-container">
        {/* Profile Heading Skeleton */}
        <div className="setting-profile_heading">
          <Skeleton
            width="100px"
            height="28px"
          />

          <div style={{ marginTop: "10px" }}>
            <Skeleton
              width="350px"
              height="16px"
            />
          </div>
        </div>

        {/* Avatar Skeleton */}
        <div className="setting-avtar-main-container">
          <div className="setting-avatar-heading">
            <Skeleton
              width="80px"
              height="24px"
            />
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
              <Skeleton
                width="180px"
                height="24px"
              />

              <div style={{ marginTop: "10px" }}>
                <Skeleton
                  width="180px"
                  height="14px"
                />
              </div>

              <div style={{ marginTop: "12px" }}>
                <Skeleton
                  width="100px"
                  height="16px"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information Skeleton */}
        <div className="personal-information-container">
          <div className="personal-information-heading">
            <Skeleton
              width="190px"
              height="24px"
            />
          </div>

          <div className="personal-information-form">
            <div className="top-data">
              {[1, 2, 3, 4].map((item) => (
                <div key={item}>
                  <Skeleton
                    width="100px"
                    height="16px"
                  />

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

            {/* Bio Skeleton */}
            <div className="bio">
              <Skeleton
                width="40px"
                height="16px"
              />

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
          <Skeleton
            width="130px"
            height="16px"
          />

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
      {/* Profile Heading */}
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

        <form
           id="profile-form"
          className="personal-information-form"
          onSubmit={handleSubmit}
        >
          <div className="top-data">
            {/* Full Name */}
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

            {/* Email */}
            <div>
              <label htmlFor="email">Work email</label>

              <div>
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

            {/* Phone */}
            <div>
              <label htmlFor="phone">Phone Number</label>

              <div>
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

            {/* Location */}
            <div>
              <label htmlFor="address">Address</label>

              <div>
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

          {/* Bio */}
          <div className="bio">
            <label htmlFor="bio">Bio</label>

            <textarea
              id="bio"
              name="bio"
              rows={3}
              placeholder="Tell us a little about yourself..."
              value={formData.bio}
              onChange={handleChange}
            />
          </div>
        </form>
      </div>

      {/* Save Changes */}
      <div className="save_changes">
        <div>
          <div>
            <p>{isDirty ? "Unsaved changes" : "All changes saved"}</p>
          </div>
        </div>

        <button
          type="submit"
          form="profile-form"
          className="change-btn"
          disabled={isLoading || !isDirty}
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};
