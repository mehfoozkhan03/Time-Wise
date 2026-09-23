import { NavLink } from "react-router-dom";

import { HiOutlineArrowLeft } from "react-icons/hi2";
import "./CommunityProfile.css";
import { CommunityProfileCard } from "./CommunityProfileCard/CommunityProfileCard";
import { ProfileSidebar } from "./ProfileSidebar/ProfileSidebar";
import { CommunityProfilePosts } from "./CommunityProfilePost/CommunityProfilePost";

export const CommunityProfile = () => {
  return (
    <main className="community-profile">
      {/* ================= Top Bar ================= */}

      <div className="community-profile-topbar">
        <NavLink
          to="/community"
          className="community-profile-back"
        >
          <HiOutlineArrowLeft />
          <span>Back to Community</span>
        </NavLink>
      </div>

      <CommunityProfileCard />

      <div className="communityProfile-content">
        <ProfileSidebar />
        <CommunityProfilePosts />
      </div>
    </main>
  );
};
