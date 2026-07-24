import "./SocialLinks.css";

import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { CiGlobe } from "react-icons/ci";
import { MdArrowRightAlt } from "react-icons/md";
import { useSelector } from "react-redux";

export const SocialLinks = () => {
  const socialLinkData = [
    {
      icon: <FaGithub />,
      socialName: "GitHub",
      socialLink: "https://github.com/Rahmat-Ali-15",
    },
    {
      icon: <FaLinkedinIn />,
      socialName: "Linkedin",
      socialLink: "https://www.linkedin.com/in/md-rahmat-ali-049493328/",
    },
    {
      icon: <CiGlobe />,
      socialName: "Portfolio",
      socialLink: "https://github.com/Rahmat-Ali-15",
    },
  ];

  return (
    <>
      <section className="socialLink-section">
        <div className="socialLink-header">
          <div>
            <CiGlobe style={{ color: "#459cd1" }} />
          </div>
          <h3>Social Links</h3>
        </div>
        <div className="socialLink-content">
          {socialLinkData.map((item, i) => (
            <div className="socialLink-list" key={i}>
              <div>
                <div>{item.icon}</div>
                <div>
                  <p>{item.socialName}</p>
                  <a
                    href={item.socialLink}
                    target="_blank">{item.socialLink}</a>
                </div>
              </div>
              <div>
                <MdArrowRightAlt />
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};
