import { useState } from "react";
import { AnnoucementDropdown } from "../../AnnoucementDropdown/AnnoucementDropdown";

export const AnnoucementFilterCategories = () => {
  const [category, setCategory] = useState("All Categories");

  const categoriesOpt = [
    "All Categories",
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

  return (
    <>
      <AnnoucementDropdown
        options={categoriesOpt}
        value={category}
        onChange={setCategory}
      />
    </>
  );
};
