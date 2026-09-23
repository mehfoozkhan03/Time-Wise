// import "./EmergencyContact.css";

// import { FaPhoneAlt } from "react-icons/fa";
// import { CiHeart } from "react-icons/ci";
// import { MdEmail } from "react-icons/md";
// import { MdEdit } from "react-icons/md";

// export const EmergencyContact = () => {
//     return(
//         <>
//             <section className="emergencyContact-section">
//                 <div className="emergency-header">
//                     <div><CiHeart /></div>
//                     <h3>Emergency Contact</h3>
//                 </div>
//                 <div className="emergencyContact-content">
//                     <div className="emergency-info">
//                         <div className="emergencyContact-details">
//                             <div className="emergencyContact-avatar"></div>
//                             <div className="emergency-name">
//                                 <h3>Sarah Mitchell</h3>
//                                 <span>Spouse · Primary Contact</span>
//                             </div>
//                         </div>
//                         <div className="emergency-phone-number">
//                             <div>
//                                 <FaPhoneAlt />
//                                 <span>Phone</span>
//                             </div>
//                             <div>+91 9262986281</div>
//                         </div>
//                         <div className="emergency-email">
//                             <div>
//                                 <MdEmail />
//                                 <span>Email</span>
//                             </div>
//                             <div>sarah.mitchell@gmail.com</div>
//                         </div>
//                         <div className="emergencyContact-edit">
//                             <button><MdEdit style={{fontSize: "17px"}} /> Edit Contact</button>
//                         </div>
//                     </div>
//                 </div>
//             </section>
//         </>
//     )
// }

import "./EmergencyContact.css";

import { FaPhoneAlt } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import { MdEmail, MdEdit } from "react-icons/md";

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { updateEmergencyContact } from "../../../store/authSlice";

export const EmergencyContact = () => {
  const dispatch = useDispatch();

  // Get logged-in user from Redux
  const user = useSelector((state) => state.auth.user);

  const [emergencyContact, setEmergencyContact] = useState({
    name: "",
    relationship: "",
    phone: "",
    email: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load existing emergency contact
  useEffect(() => {
    if (user?.emergencyContact) {
      setEmergencyContact({
        name: user.emergencyContact.name || "",
        relationship: user.emergencyContact.relationship || "",
        phone: user.emergencyContact.phone || "",
        email: user.emergencyContact.email || "",
      });
    }
  }, [user?.emergencyContact]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setEmergencyContact((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Save emergency contact
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

  return (
    <section className="emergencyContact-section">
      {/* Header */}
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
              {/* Contact Details */}
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

              {/* Phone */}
              {emergencyContact.phone && (
                <div className="emergency-phone-number">

                  <div>
                    <FaPhoneAlt />

                    <span>Phone</span>
                  </div>

                  <div>
                    {emergencyContact.phone}
                  </div>

                </div>
              )}

              {/* Email */}
              {emergencyContact.email && (
                <div className="emergency-email">

                  <div>
                    <MdEmail />

                    <span>Email</span>
                  </div>

                  <div>
                    {emergencyContact.email}
                  </div>

                </div>
              )}

              {/* Edit */}
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
            /* ================= EDIT FORM ================= */
            <form
              className="emergencyContact-form"
              onSubmit={handleSubmit}
            >

              {/* Name */}
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

              {/* Relationship */}
              <div className="form-group">
                <label>Relationship</label>

                <input
                  type="text"
                  name="relationship"
                  value={emergencyContact.relationship}
                  onChange={handleChange}
                  placeholder="e.g. Spouse, Father, Mother"
                  required
                />
              </div>

              {/* Phone */}
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

              {/* Email */}
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

              {/* Buttons */}
              <div className="emergencyContact-form-buttons">

                <button
                  type="submit"
                  disabled={saving}
                >
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