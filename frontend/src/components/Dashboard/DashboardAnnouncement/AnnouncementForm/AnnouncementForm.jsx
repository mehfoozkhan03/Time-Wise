import "./AnnouncementForm.css";
import { AnnoucementDropdown } from "../AnnoucementDropdown/AnnoucementDropdown";

import { useEffect, useState } from "react";
import { FaUpload } from "react-icons/fa6";


export const AnnouncementForm = ({ onClose }) => {

    const [category, setCategory] = useState("Company");
    
      const categoriesOpt = [
        "Company",
        "Holiday",
        "Policy",
        "Event",
        "Important",
        "HR",
        "Attendance",
        "Training",
        "Payroll",
        "Maintenance",
      ];

      useEffect(() => {
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = "";
        };
     }, []);

    return (
        <>
            <div className="announcementForm-overlay"></div>
            <section className="announcementForm-section">
                <div className="announcementForm-container">
                    <div className="announcementForm-heading">
                        <h3>Create New Announcement</h3>
                        <div className="close-announcementForm" onClick={onClose}>x</div>
                    </div>

                    {/* Basic Information */}
                    <div className="announcementForm-basinInformation">
                        <h3>BASIC INFORMATION</h3>
                        <div className="basinInformation-content">
                            <div>
                                <label htmlFor="title">Title</label>
                                <input type="text" placeholder="Announcement Title" />
                            </div>
                            <div className="basinInformation-category">
                                <div>
                                    <label htmlFor="category">Category</label>
                                    <AnnoucementDropdown options={categoriesOpt} value={category} onChange={setCategory} className="basinInformation-category-dropdown" />
                                </div>
                                <div className="basinInformation-priority">
                                    <label htmlFor="priority">Priority</label>
                                    <div>
                                        <div>Normal</div>
                                        <div>Important</div>
                                        <div>Urgent</div>
                                    </div>
                                </div>cle
                            </div>
                            <div className="basinInformation-description">
                                <label htmlFor="description">Description</label>
                                <textarea rows="6" placeholder="Write your announcement here..." />
                            </div>
                        </div>
                    </div>

                    {/* Publishing */}
                    <div className="announcementForm-publishing">
                        <div className="announcementForm-publish-content">
                            <h3>PUBLISHING</h3>
                            <div>
                                <div>Draft</div>
                                <div>Publish Now</div>
                                <div>Schedule</div>
                            </div>
                        </div>
                        <div className="announcementForm-expiry">
                            <div>
                                <h3>Expiry Date(Optional)</h3>
                                <input type="date" />
                            </div>
                            <div>
                                <h3>Expiry Time</h3>
                                <input type="time" />
                            </div>
                        </div>
                    </div>

                    {/* Audience */}
                    <div className="announcementForm-audience">
                        <div className="announcementForm-audience-heading">
                            <h3>AUDIENCE</h3>
                            <span>Who should receive this announcement?</span>
                        </div>
                        <div className="announcementForm-audience-type">
                            <div>Everyone</div>
                            <div>Department</div>
                            <div>Role</div>
                            <div>Specific Employees</div>
                        </div>
                    </div>

                    {/* Attachements */}
                    <div className="announcementForm-attachements">
                        <label className="attachment-label">ATTACHMENTS</label>
                        <div>
                            <input type="file" multiple hidden accept=".pdf,.doc,.docx,.xlsx,.xls,.jpg,.jpeg,.png"/>

                            <div className="announcementAttachment-upload-icon">
                                <FaUpload />
                            </div>

                            <div className="upload-main-text">
                                Drag & drop files here
                            </div>

                            <div className="upload-browse">
                                or <span>Browse files</span>
                            </div>

                            <div className="upload-types">
                                PDF, DOC, DOCX, XLSX, JPG, PNG
                            </div>
                        </div>
                    </div>

                    {/* Action */}
                    <div className="announcementForm-action">
                        <h3>Action Button</h3>
                        <div>
                            <div className="announcementForm-switchBtn">
                                <div></div>
                            </div>
                            <span>Add action button</span>
                        </div>
                    </div>

                    {/* Pin */}
                    <div className="announcementForm-pin">
                        <h3>PIN</h3>
                        <div>
                            <div>
                                <div className="announcementForm-switchBtn">
                                    <div></div>
                                </div>
                            </div>
                            <div>
                                <p>Pin this announcement</p>
                                <span>Pinned announcements appear at the top of the announcement list.</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Announcement form footer */}
                <div className="announcementForm-footer">
                    <div>
                        <div>Cancel</div>
                        <div>Save Draft</div>
                        <div>Preview</div>
                    </div>
                    <div>
                        Publish Announcement
                    </div>
                </div>
            </section>
        </>
    )
}