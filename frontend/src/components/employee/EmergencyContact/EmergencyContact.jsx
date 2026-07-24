import "./EmergencyContact.css";

import { FaPhoneAlt } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import { MdEmail } from "react-icons/md";
import { MdEdit } from "react-icons/md";

export const EmergencyContact = () => {
    return(
        <>
            <section className="emergencyContact-section">
                <div className="emergency-header">
                    <div><CiHeart /></div>
                    <h3>Emergency Contact</h3>
                </div>
                <div className="emergencyContact-content">
                    <div className="emergency-info">
                        <div className="emergencyContact-details">
                            <div className="emergencyContact-avatar"></div>
                            <div className="emergency-name">
                                <h3>Sarah Mitchell</h3>
                                <span>Spouse · Primary Contact</span>
                            </div>
                        </div>
                        <div className="emergency-phone-number">
                            <div>
                                <FaPhoneAlt />
                                <span>Phone</span>
                            </div>
                            <div>+91 9262986281</div>
                        </div>
                        <div className="emergency-email">
                            <div>
                                <MdEmail />
                                <span>Email</span>
                            </div>
                            <div>sarah.mitchell@gmail.com</div>
                        </div>
                        <div className="emergencyContact-edit">
                            <button><MdEdit /> Edit</button>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}