import { AnnoucementDropdown } from "../../AnnoucementDropdown/AnnoucementDropdown";
import "./AnnoucementFilterPriorities.css";

export const AnnoucementFilterPriorities = ({priority,
  setPriority,}) => {

    const priorityOpt = [
        "All Priorities",
        "Normal",
        "Important",
        "Urgent"
    ]
  return (
    <>
      <AnnoucementDropdown
        options={priorityOpt}
        value={priority}
        onChange={setPriority}
      />
    </>
  );
};
