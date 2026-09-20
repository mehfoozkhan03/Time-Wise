import { useState } from "react";
import { AnnoucementDropdown } from "../../AnnoucementDropdown/AnnoucementDropdown";
import "./AnnoucementFilterPriorities.css";

export const AnnoucementFilterPriorities = () => {
    const [priority, setPriority] = useState("All Priorities");

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
