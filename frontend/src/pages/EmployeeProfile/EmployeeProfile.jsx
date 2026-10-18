import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import "./EmployeeProfile.css";

import Skeleton from "../../components/Skeleton/Skeleton";
import QuickStats from "../../components/employee/QuickStats/QuickStats";
import PerformanceSummary from "../../components/employee/PerformanceSummary/PerformanceSummary";
import { Achievements } from "../../components/employee/Achievements/Achievements";
import RecentActivity from "../../components/employee/RecentActivity/RecentActivity";
import { LeaveSummary } from "../../components/employee/LeaveSummary/LeaveSummary";
import { EmergencyContact } from "../../components/employee/EmergencyContact/EmergencyContact";
import { SocialLinks } from "../../components/employee/SocialLinks/SocialLinks";
import { PulseDot } from "../../components/PulseDot/pulseDot";
import { authService } from "../../services/authService";

import { MdClose } from "react-icons/md";

export default function EmployeeProfile({ userId: propUserId, onClose }) {
  const { userId: routeUserId } = useParams();
  const userId = propUserId || routeUserId;

  const { user: loggedInUser } = useSelector((state) => state.auth);

  const [viewedUser, setViewedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        setFetchError(false);
        setViewedUser(null);

        const response = await authService.getUserProfile(userId);

        if (isMounted) {
          setViewedUser(response.data.user || response.data);
        }
      } catch (error) {
        console.error("Failed to fetch employee profile:", error);

        if (isMounted) {
          setViewedUser(null);
          setFetchError(true);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (userId) {
      fetchProfile();
    } else {
      setViewedUser(null);
      setLoading(false);
      setFetchError(false);
    }

    return () => {
      isMounted = false;
    };
  }, [userId]);

  const user = userId ? viewedUser : loggedInUser;
  const isProfileLoading = userId ? loading : !loggedInUser;

  // =========================
  // SKELETON LOADER
  // =========================
  if (isProfileLoading) {
    return (
      <main className="employee_profile employee-profile-skeleton">
        {onClose && (
          <button
            type="button"
            className="employee-profile-close"
            onClick={onClose}
            aria-label="Close employee profile"
          >
            <MdClose />
          </button>
        )}

        {/* Profile Hero Skeleton */}
        <section className="profile_hero">
          <div className="profile_banner profile-banner-skeleton" />

          <div className="profile_content">
            <div className="profile_header">
              <Skeleton
                width="120px"
                height="120px"
                radius="50%"
              />

              <div className="profile_text">
                <Skeleton width="130px" height="16px" />

                <div className="profile-skeleton-name">
                  <Skeleton width="220px" height="32px" />
                </div>

                <div className="profile-skeleton-designation">
                  <Skeleton width="150px" height="18px" />
                </div>

                <div className="profile-skeleton-department">
                  <Skeleton width="110px" height="24px" radius="20px" />
                </div>
              </div>

              <div className="profile-skeleton-status">
                <Skeleton width="75px" height="28px" radius="20px" />
              </div>
            </div>

            {/* Information Cards Skeleton */}
            <div className="profile_information">
              {[1, 2, 3, 4].map((item) => (
                <div
                  className="profile_information_card"
                  key={item}
                >
                  <Skeleton width="75px" height="15px" />

                  <div className="profile-skeleton-info-value">
                    <Skeleton width="140px" height="20px" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Stats Skeleton */}
        <div className="profile-skeleton-stats">
          {[1, 2, 3, 4].map((item) => (
            <div className="profile-skeleton-stat-card" key={item}>
              <Skeleton width="42px" height="42px" radius="10px" />

              <div className="profile-skeleton-stat-text">
                <Skeleton width="90px" height="14px" />
                <Skeleton width="65px" height="25px" />
              </div>
            </div>
          ))}
        </div>

        {/* Profile Grid Skeleton */}
        <div className="profile_grid">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div className="profile-skeleton-panel" key={item}>
              <div className="profile-skeleton-panel-heading">
                <Skeleton width="145px" height="22px" />
                <Skeleton width="28px" height="28px" radius="8px" />
              </div>

              <div className="profile-skeleton-panel-content">
                <Skeleton width="100%" height="14px" />
                <Skeleton width="85%" height="14px" />
                <Skeleton width="65%" height="14px" />
              </div>
            </div>
          ))}
        </div>
      </main>
    );
  }

  // =========================
  // ERROR STATE
  // =========================
  if (!user || fetchError) {
    return (
      <main className="employee_profile">
        {onClose && (
          <button
            type="button"
            className="employee-profile-close"
            onClick={onClose}
            aria-label="Close employee profile"
          >
            <MdClose />
          </button>
        )}

        <div className="employee_loading">
          {fetchError
            ? "Unable to load employee profile. Please try again."
            : "Profile not found."}
        </div>
      </main>
    );
  }

  // =========================
  // PROFILE DATA
  // =========================
  const initials = `${user.firstName?.[0] ?? ""}${
    user.lastName?.[0] ?? ""
  }`.toUpperCase();

  const fullName = `${user.firstName || ""} ${
    user.lastName || ""
  }`.trim();

  const joinedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Not available";

  return (
    <main className="employee_profile">
      {onClose && (
        <button
          type="button"
          className="employee-profile-close"
          onClick={onClose}
          aria-label="Close employee profile"
        >
          <MdClose />
        </button>
      )}

      <section className="profile_hero">
        <div className="profile_banner" />

        <div className="profile_content">
          <div className="profile_header">
            <div className="profile_avatar">
              {user.profileImage ? (
                <img src={user.profileImage} alt={fullName} />
              ) : (
                initials
              )}
            </div>

            <div className="profile_text">
              <span className="profile_tag">
                {userId ? "Employee Profile" : "My Profile"}
              </span>

              <h1>{fullName}</h1>
              <p>{user.designation || "Employee"}</p>

              <span className="profile_department">
                {user.department || "General"}
              </span>
            </div>

            <div className="status_badge">
              <PulseDot />
              Active
            </div>
          </div>

          <div className="profile_information">
            <div className="profile_information_card">
              <span>Email</span>
              <h4>{user.email}</h4>
            </div>

            <div className="profile_information_card">
              <span>Role</span>
              <h4>
                {user.role
                  ? user.role.charAt(0).toUpperCase() +
                    user.role.slice(1)
                  : "Employee"}
              </h4>
            </div>

            <div className="profile_information_card">
              <span>Department</span>
              <h4>{user.department || "General"}</h4>
            </div>

            <div className="profile_information_card">
              <span>Joined</span>
              <h4>{joinedDate}</h4>
            </div>
          </div>
        </div>
      </section>

      <QuickStats />

      <div className="profile_grid">
        <PerformanceSummary />
        <RecentActivity />
        <Achievements />
        <LeaveSummary />
        <EmergencyContact />
        <SocialLinks />
      </div>
    </main>
  );
}
