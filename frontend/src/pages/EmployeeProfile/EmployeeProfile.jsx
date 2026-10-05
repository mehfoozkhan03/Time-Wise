import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import "./EmployeeProfile.css";
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

  const [viewedUser, setViewedUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);

        const response = await authService.getUserProfile(userId);

        setViewedUser(response.data.user || response.data);
      } catch (error) {
        console.error("Failed to fetch employee profile:", error);
        setViewedUser(null);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchProfile();
    }
  }, [userId]);
  const { user: loggedInUser } = useSelector((state) => state.auth);
  const user = userId ? viewedUser : loggedInUser;

  if (!user) {
    return (
      <main className="employee_profile">
        <div className="employee_loading">Loading profile...</div>
      </main>
    );
  }

  const initials =
    `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase();

  const fullName = `${user.firstName} ${user.lastName}`;

  const joinedDate = new Date(user.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

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
                <img
                  src={user.profileImage}
                  alt={fullName}
                />
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
                {user?.role
                  ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
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
