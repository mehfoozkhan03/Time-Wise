
import "./SocialLinks.css";

import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { CiGlobe } from "react-icons/ci";
import { MdArrowRightAlt } from "react-icons/md";

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { updateSocialLinks } from "../../../store/authSlice";
import Skeleton from "../../Skeleton/Skeleton";

export const SocialLinks = () => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const authLoading = useSelector(
    (state) => state.auth.loading
  );

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [socialLinks, setSocialLinks] = useState({
    github: "",
    linkedin: "",
    portfolio: "",
  });

  useEffect(() => {
    if (user) {
      setSocialLinks({
        github: user.socialLinks?.github || "",
        linkedin: user.socialLinks?.linkedin || "",
        portfolio: user.socialLinks?.portfolio || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setSocialLinks((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      await dispatch(updateSocialLinks(socialLinks)).unwrap();

      setIsEditing(false);
      alert("Social links updated successfully!");
    } catch (error) {
      console.error("Social links update error:", error);
      alert(error || "Failed to update social links");
    } finally {
      setSaving(false);
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

  if (authLoading && !user) {
    return (
      <section className="socialLink-section socialLink-skeleton">
        <div className="socialLink-header">
          <Skeleton width="28px" height="28px" />

          <div className="social-skeleton-heading">
            <Skeleton width="115px" height="21px" />
            <Skeleton width="40px" height="16px" />
          </div>
        </div>

        <div className="socialLink-content">
          {[1, 2, 3].map((item) => (
            <div className="socialLink-list" key={item}>
              <div className="socialLink-left">
                <Skeleton width="38px" height="38px" borderRadius="8px" />

                <div className="social-skeleton-info">
                  <Skeleton width="75px" height="15px" />
                  <Skeleton width="180px" height="14px" />
                </div>
              </div>

              <Skeleton width="20px" height="20px" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="socialLink-section">
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

      <div className="socialLink-content">
        {socialLinkData.map((item) => (
          <div className="socialLink-list" key={item.fieldName}>
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

      {isEditing && (
        <div className="socialLink-actions">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      )}
    </section>
  );
};
