import "./CommunityProfileCard.css";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import {
  HiOutlineChatBubbleLeft,
  HiOutlineShare,
  HiOutlineEllipsisHorizontal,
} from "react-icons/hi2";
import {
  clearCommunityProfile,
  fetchCommunityProfile,
} from "../../../../store/communityProfileSlice";

export const CommunityProfileCard = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();

  const { profile, isLoading, isError, errorMessage } = useSelector(
    (state) => state.communityProfile,
  );

  // ================= Fetch Profile =================

  useEffect(() => {
    if (userId) {
      dispatch(fetchCommunityProfile(userId));
    }

    return () => {
      dispatch(clearCommunityProfile());
    };
  }, [userId, dispatch]);

  // ================= Loading =================

  if (isLoading) {
    return (
      <main className="community-profile">
        <div className="community-profile-status">Loading profile...</div>
      </main>
    );
  }

  // ================= Error =================

  if (isError) {
    return (
      <main className="community-profile">
        <div className="community-profile-status">
          <h2>{errorMessage?.title || "Unable to load profile"}</h2>

          <p>{errorMessage?.message || "Something went wrong."}</p>
        </div>
      </main>
    );
  }

  // ================= No Profile =================

  if (!profile) {
    return (
      <main className="community-profile">
        <div className="community-profile-status">
          <h2>User not found</h2>
          <p>The requested community profile does not exist.</p>
        </div>
      </main>
    );
  }

  // ================= User Data =================

  const initials = `${profile.firstName?.[0] || ""}${
    profile.lastName?.[0] || ""
  }`.toUpperCase();

  const fullName =
    `${profile.firstName || ""} ${profile.lastName || ""}`.trim();

  // ================= Member Since =================

  const memberSince = profile.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-US", {
        month: "short",
        year: "2-digit",
      })
    : "-";

  // Stat data
  const statData = [
    {
      statCount: "0",
      statName: "POSTS",
    },
    {
      statCount: "0",
      statName: "LIKES RECEIVED",
    },
    {
      statCount: "0",
      statName: "COMMENTS",
    },
    {
      statCount: memberSince,
      statName: "MEMBER SINCE",
    },
  ];

  return (
    <>
      {/* ================= Profile Card ================= */}

      <section className="community-profile-card">
        {/* ================= Cover ================= */}

        <div className="community-profile-cover"></div>

        {/* ================= Profile Content ================= */}

        <div className="community-profile-content">
          {/* Avatar */}
          <div className="community-profile-avatar">
            {profile.profileImage ? (
              <img
                src={profile.profileImage}
                alt={fullName}
              />
            ) : (
              initials || "U"
            )}
          </div>

          <div className="community-profile-main">
            {/* ================= User Details ================= */}
            <div className="community-profile-details">
              <h1 className="community-profile-name">
                {fullName || "Unknown User"}
              </h1>

              <div className="community-profile-badges">
                <p className="community-profile-role">
                  {profile.designation || "Employee"}
                </p>
                <span className="community-profile-badge community-profile-badge-active">
                  <span className="community-profile-status-dot" />
                  Active in Community
                </span>
              </div>
            </div>

            {/* ================= Actions ================= */}

            <div className="community-profile-actions">
              <button className="community-profile-button community-profile-button-message">
                <HiOutlineChatBubbleLeft />

                <span>Message</span>
              </button>

              <button className="community-profile-button community-profile-button-share">
                <HiOutlineShare />

                <span>Share Profile</span>
              </button>

              <button className="community-profile-button community-profile-button-more">
                <HiOutlineEllipsisHorizontal />
              </button>
            </div>
          </div>
        </div>

        {/* ================= Divider ================= */}

        <div className="community-profile-divider" />

        {/* ================= Statistics ================= */}

        <div className="community-profile-stats">
          {statData &&
            statData.map((el, id) => (
              <div
                className="community-profile-stat"
                key={id}
              >
                <strong>{el.statCount}</strong>
                <span>{el.statName}</span>
              </div>
            ))}
        </div>
      </section>
    </>
  );
};
