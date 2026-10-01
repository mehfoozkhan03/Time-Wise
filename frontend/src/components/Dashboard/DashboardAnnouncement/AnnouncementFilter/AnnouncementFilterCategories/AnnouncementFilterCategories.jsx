import { AnnoucementDropdown } from "../../AnnoucementDropdown/AnnoucementDropdown";

export const AnnoucementFilterCategories = ({ category, setCategory }) => {

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
