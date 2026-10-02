import { AnnoucementDropdown } from "../../AnnoucementDropdown/AnnoucementDropdown";
import "./AnnoucementFilterNew.css";

export const AnnouncementFilterNew = ({ sort, setSort }) => {

  const newestOpt = ["Newest First", "Oldest First", "A-Z"];

  return (
    <>
      <AnnoucementDropdown
        options={newestOpt}
        value={sort}
        onChange={setSort}
      />
    </>
  );
};
