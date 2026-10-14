
import "./EmergencyContact.css";

import { FaPhoneAlt } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import { MdEmail, MdEdit } from "react-icons/md";

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { updateEmergencyContact } from "../../../store/authSlice";
import Skeleton from "../../Skeleton/Skeleton";

export const EmergencyContact = () => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const authLoading = useSelector(
    (state) => state.auth.loading
  );

  const [emergencyContact, setEmergencyContact] = useState({
    name: "",
    relationship: "",
    phone: "",
    email: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user?.emergencyContact) {
      setEmergencyContact({
        name: user.emergencyContact.name || "",
        relationship: user.emergencyContact.relationship || "",
        phone: user.emergencyContact.phone || "",
        email: user.emergencyContact.email || "",
      });
    } else if (user) {
      setEmergencyContact({
        name: "",
        relationship: "",
        phone: "",
        email: "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setEmergencyContact((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await dispatch(
        updateEmergencyContact(emergencyContact)
      ).unwrap();

      alert("Emergency contact updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Emergency Contact Update Error:", error);
      alert(error || "Failed to update emergency contact.");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading && !user) {
    return (
      <section className="emergencyContact-section emergency-skeleton">
        <div className="emergency-header">
          <Skeleton width="28px" height="28px" />
          <Skeleton width="180px" height="22px" />
        </div>

        <div className="emergencyContact-content">
          <div className="emergencyContact-details">
            <Skeleton width="54px" height="54px" borderRadius="50%" />

            <div className="emergency-skeleton-details">
              <Skeleton width="150px" height="18px" />
              <Skeleton width="190px" height="14px" />
            </div>
          </div>

          <div className="emergency-skeleton-field">
            <Skeleton width="80px" height="15px" />
            <Skeleton width="65%" height="16px" />
          </div>

          <div className="emergency-skeleton-field">
            <Skeleton width="80px" height="15px" />
            <Skeleton width="75%" height="16px" />
          </div>

          <Skeleton width="125px" height="38px" />
        </div>
      </section>
    );
  }

  return (
    <section className="emergencyContact-section">
      <div className="emergency-header">
        <div>
          <CiHeart />
        </div>
        <h3>Emergency Contact</h3>
      </div>

      <div className="emergencyContact-content">
        <div className="emergency-info">
          {!isEditing ? (
            <>
              <div className="emergencyContact-details">
                <div className="emergencyContact-avatar">
                  {emergencyContact.name
                    ? emergencyContact.name.charAt(0).toUpperCase()
                    : "?"}
                </div>

                <div className="emergency-name">
                  <h3>
                    {emergencyContact.name || "No contact added"}
                  </h3>

                  <span>
                    {emergencyContact.relationship
                      ? `${emergencyContact.relationship} · Primary Contact`
                      : "Add your emergency contact"}
                  </span>
                </div>
              </div>

              {emergencyContact.phone && (
                <div className="emergency-phone-number">
                  <div>
                    <FaPhoneAlt />
                    <span>Phone</span>
                  </div>
                  <div>{emergencyContact.phone}</div>
                </div>
              )}

              {emergencyContact.email && (
                <div className="emergency-email">
                  <div>
                    <MdEmail />
                    <span>Email</span>
                  </div>
                  <div>{emergencyContact.email}</div>
                </div>
              )}

              <div className="emergencyContact-edit">
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                >
                  <MdEdit style={{ fontSize: "17px" }} />
                  Edit Contact
                </button>
              </div>
            </>
          ) : (
            <form
              className="emergencyContact-form"
              onSubmit={handleSubmit}
            >
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={emergencyContact.name}
                  onChange={handleChange}
                  placeholder="Enter contact name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Relationship</label>
                <input
                  type="text"
                  name="relationship"
                  value={emergencyContact.relationship}
                  onChange={handleChange}
                  placeholder="e.g. Father, Mother"
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={emergencyContact.phone}
                  onChange={handleChange}
                  placeholder="+91 9876543210"
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={emergencyContact.email}
                  onChange={handleChange}
                  placeholder="example@gmail.com"
                  required
                />
              </div>

              <div className="emergencyContact-form-buttons">
                <button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save Contact"}
                </button>

                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  disabled={saving}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
