import { useState } from "react";
import { AnnoucementDropdown } from "../../AnnoucementDropdown/AnnoucementDropdown";
import "./AnnoucementFilterNew.css";

export const AnnouncementFilterNew = () => {
  const [newest, setNewest] = useState("Newest First");

  const newestOpt = ["Newest First", "Oldest First", "A-Z"];

  return (
    <>
      <AnnoucementDropdown
        options={newestOpt}
        value={newest}
        onChange={setNewest}
      />
    </>
  );
};
