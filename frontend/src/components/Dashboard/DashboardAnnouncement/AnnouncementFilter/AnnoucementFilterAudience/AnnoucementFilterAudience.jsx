import { AnnoucementDropdown } from "../../AnnoucementDropdown/AnnoucementDropdown";
import "./AnnoucementFilterAudience.css";

export const AnnouncementFilterAudience = ({ audience, setAudience }) => {
  const audienceOpt = [
    "All Audiences",
    "Everyone",
    "Department",
    "Role",
    "Specific Employees",
  ];
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
