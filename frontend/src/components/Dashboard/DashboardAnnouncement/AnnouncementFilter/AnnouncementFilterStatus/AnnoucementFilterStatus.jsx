import { useState } from "react";
import { AnnoucementDropdown } from "../../AnnoucementDropdown/AnnoucementDropdown";
import "./AnnoucementFilterStatus.css";

export const AnnouncementFilterStatus = () => {
  const [status, setStatus] = useState("All Status");
  const statusOpt = ["All Status", "Published", "Scheduled", "Draft", "Expired"];
  return (
    <>
      <AnnoucementDropdown
        options={statusOpt}
        value={status}
        onChange={setStatus}
      />
    </>
  );
};
