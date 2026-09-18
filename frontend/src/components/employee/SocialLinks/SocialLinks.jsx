import "./SocialLinks.css";

import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { CiGlobe } from "react-icons/ci";
import { MdArrowRightAlt } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { updateSocialLinks } from "../../../store/authSlice";

export const SocialLinks = () => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);

  const [isEditing, setIsEditing] = useState(false);

  const [socialLinks, setSocialLinks] = useState({
    github: user?.socialLinks?.github || "",
    linkedin: user?.socialLinks?.linkedin || "",
    portfolio: user?.socialLinks?.portfolio || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setSocialLinks((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      await dispatch(updateSocialLinks(socialLinks)).unwrap();

      setIsEditing(false);

      alert("Social links updated successfully!");
    } catch (error) {
      console.error("Social links update error:", error);
      alert(error || "Failed to update social links");
    }
  };

  const socialLinkData = [
    {
      icon: <FaGithub />,
      socialName: "GitHub",
      socialLink: socialLinks.github,
      fieldName: "github",
    },
    {
      icon: <FaLinkedinIn />,
      socialName: "LinkedIn",
      socialLink: socialLinks.linkedin,
      fieldName: "linkedin",
    },
    {
      icon: <CiGlobe />,
      socialName: "Portfolio",
      socialLink: socialLinks.portfolio,
      fieldName: "portfolio",
    },
  ];

  return (
    <section className="socialLink-section">
      {/* Header */}

      <div className="socialLink-header">
        <div>
          <CiGlobe style={{ color: "#459cd1" }} />
        </div>

        <div>
          <h3>Social Links</h3>

          <button
            type="button"
            onClick={() => setIsEditing((prev) => !prev)}
            className="socialLink-btn"
          >
            {isEditing ? "Cancel" : "Edit"}
          </button>
        </div>
      </div>

      {/* Content */}

      <div className="socialLink-content">
        {socialLinkData.map((item, i) => (
          <div
            className="socialLink-list"
            key={i}
          >
            <div className="socialLink-left">
              <div className="socialLink-icon">{item.icon}</div>

              <div className="socialLink-info">
                <p>{item.socialName}</p>

                {isEditing ? (
                  <input
                    type="url"
                    name={item.fieldName}
                    value={item.socialLink}
                    onChange={handleChange}
                    placeholder={`Enter your ${item.socialName} URL`}
                  />
                ) : item.socialLink ? (
                  <a
                    href={item.socialLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.socialLink}
                  </a>
                ) : (
                  <span className="no-social-link">Not added</span>
                )}
              </div>
            </div>

            <div>
              <MdArrowRightAlt />
            </div>
          </div>
        ))}
      </div>

      {/* Save */}

      {isEditing && (
        <div className="socialLink-actions">
          <button
            type="button"
            onClick={handleSave}
          >
            Save Changes
          </button>
        </div>
      )}
    </section>
  );
};
