import { AnnoucementDropdown } from "../../AnnoucementDropdown/AnnoucementDropdown";
import "./AnnoucementFilterStatus.css";

export const AnnouncementFilterStatus = ({
  status,
  setStatus,
}) => {
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
