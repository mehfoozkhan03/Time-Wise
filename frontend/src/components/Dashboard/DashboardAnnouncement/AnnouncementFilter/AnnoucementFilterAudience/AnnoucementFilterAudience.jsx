import { useState } from "react";
import { AnnoucementDropdown } from "../../AnnoucementDropdown/AnnoucementDropdown";
import "./AnnoucementFilterAudience.css";

export const AnnouncementFilterAudience = () => {
    const [audience, setAudience] = useState("All Audience");

    const audienceOpt = [
        "All Audiences",
        "Everyone",
        "Department",
        "Role",
        "Specific Employees"
    ]
  return (
    <>
      <AnnoucementDropdown
        options={audienceOpt}
        value={audience}
        onChange={setAudience}
      />
    </>
  );
};
