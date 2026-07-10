import "../../components/Setting/Profile.css";

import { CiUser } from "react-icons/ci";
import { MdOutlineEmail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";

export const Profile = () => {
  return (
    <>
      <div className="profile-container">
        {/* Profile heading */}
        <div className="profile_heading">
          <h3>Profile</h3>
          <p>Manage your personal information and public profile.</p>
        </div>

        {/* Avatar */}
        <div className="avtar-main-container">
          <div className="avatar-heading">
            <h2>Avatar</h2>
          </div>
          <div class="profile-card">
            <div class="avatar-container">
              <div class="avatar">SK</div>

              <label
                for="photo"
                class="camera-btn"
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

            <div class="profile-info">
              <h2>Silent Killer</h2>
              <p>JPG, PNG or WebP · Max 5 MB</p>

              <label
                for="photo"
                class="upload-link"
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
                  />
                </div>
              </div>
              <div>
                <label htmlFor="phone_number">Phone Number</label>
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
                    type="email"
                    placeholder="City, Country"
                  />
                </div>
              </div>
            </div>
            <div className="bio">
            <label htmlFor="">Bio</label>
              <textarea
                rows={3}
              >
                Senior Product Manager at Acme Corp. Passionate about building
                tools that help teams do their best work.
              </textarea>
            </div>
          </form>
        </div>

        {/* Save changes */}
        <div className="save_changes">
          <div><p>Unsaved changes</p></div>
          <button type="button" className="change-btn">Save Changes</button>
        </div>
      </div>
    </>
  );
};
