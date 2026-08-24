import "./DashboardEmployee.css";

import { FaPlus } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { MdEdit, MdDelete } from "react-icons/md";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { FaKey } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllUser,
  loadLessUsers,
  updateUserDepartment,
} from "../../../store/authSlice";
import { useEffect, useRef, useState } from "react";
import { DepartmentDropdown } from "../Dropdowns/DepartmentDropdown/DepartmentDropdown";
import { DesignationDropdown } from "../Dropdowns/DesignationDropdown/DesignationDropdown";
import { authService } from "../../../services/authService";

const departments = [
  "All",
  "Engineering",
  "Design",
  "HR",
  "Analytics",
  "Marketing",
];

const employeeDepartments = [
  "Engineering",
  "Design",
  "HR",
  "Analytics",
  "Marketing",
];

const employeeDesignations = [
  "Software Developer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "UI/UX Designer",
  "HR Executive",
  "Data Analyst",
  "Marketing Executive",
];

export const DashboardEmployee = () => {
  const dispatch = useDispatch();
  const { users, totalUsers, isLoading, search, currentPage } = useSelector(
    (state) => state.auth,
  );

  //# Search Employee by Name
  const [searchInput, setSearchInput] = useState("");

  const handleSearch = () => {
    dispatch(
      fetchAllUser({
        page: 1,
        department: selectedDepartment,
        status: selectedStatus,
        search: searchInput.trim(),
      }),
    );
  };

  //# This is for Getting more users & less users
  const handleLoadMore = () => {
    dispatch(
      fetchAllUser({
        page: currentPage + 1,
        department: selectedDepartment,
        status: selectedStatus,
        search,
      }),
    );
  };

  const handleLoadLess = () => {
    dispatch(loadLessUsers());
  };

  //# Filter DropDown

  const [openDropdown, setOpenDropdown] = useState(null);

  const [selectedDepartment, setSelectedDepartment] = useState("All");

  const [selectedStatus, setSelectedStatus] = useState("All");

  const dropdownRef = useRef(null);

  const statusOptions = ["All", "Active", "Inactive"];

  //# Department
  const handleDepartmentSelect = (department) => {
    setSelectedDepartment(department);
    setOpenDropdown(null);

    dispatch(
      fetchAllUser({
        page: 1,
        department,
        status: selectedStatus,
        search,
      }),
    );
  };

  //# Select Employee Department
  const handleDepartmentChange = (userId, department) => {
    dispatch(
      updateUserDepartment({
        userId,
        department,
      }),
    );
  };

  useEffect(() => {
    dispatch(
      fetchAllUser({
        page: 1,
        department: "All",
        status: "All",
        search: "",
      }),
    );
  }, [dispatch]);

  //# Select Employee Designation
  const handleDesignationChange = async (userId, designation) => {
    try {
      await authService.updateUserDesignation(userId, designation);

      dispatch(fetchAllUser());
    } catch (error) {
      console.error("Designation update failed:", error);
    }
  };

  //# Status
  const handleStatusSelect = (status) => {
    setSelectedStatus(status);
    setOpenDropdown(null);

    dispatch(
      fetchAllUser({
        page: 1,
        department: selectedDepartment,
        status,
        search,
      }),
    );
  };

  // # Dropdown useEffect
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <>
      <div className="dashboardEmployee-container">
        {/* Employee management header */}
        <div className="employee-management-header">
          <div className="employee-management-heading">
            <h3>Employee Management</h3>
            <span>
              {users.length} of {totalUsers} employees shown
            </span>
          </div>
          <div className="employee-management-right">
            <FaPlus style={{ color: "#6954b1" }} />
            <span>Add Employee</span>
          </div>
        </div>

        {/* Employee filter */}
        <div
          ref={dropdownRef}
          className="employe-search-filter"
        >
          <div className="dashboardEmployee-searchbar">
            <div className="dashboardEmployee-input-container">
              <FaSearch style={{ color: "#579cbd" }} />
              <input
                type="search"
                placeholder="Search employee..."
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                }}
              />
            </div>
            <div
              onClick={handleSearch}
              className="employee-searchBtn"
            >
              <button type="button">Search</button>
            </div>
          </div>
          <div className="dashboardEmployee-department">
            <div className="customDropdown">
              <button
                type="button"
                className="customDropdown-button"
                onClick={() =>
                  setOpenDropdown((prev) =>
                    prev === "department" ? null : "department",
                  )
                }
              >
                <span>{selectedDepartment}</span>

                <span
                  className={`customDropdown-arrow ${
                    openDropdown === "department"
                      ? "customDropdown-arrow-open"
                      : ""
                  }`}
                >
                  <MdOutlineKeyboardArrowDown />
                </span>
              </button>

              {openDropdown === "department" && (
                <div className="customDropdown-menu">
                  {departments.map((department) => (
                    <div
                      key={department}
                      className={`customDropdown-option ${
                        selectedDepartment === department
                          ? "customDropdown-option-active"
                          : ""
                      }`}
                      onClick={() => handleDepartmentSelect(department)}
                    >
                      {department}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="dashboardEmployee-filter">
            <div className="customDropdown">
              <button
                type="button"
                className="customDropdown-button"
                onClick={() =>
                  setOpenDropdown((prev) =>
                    prev === "status" ? null : "status",
                  )
                }
              >
                <span>{selectedStatus}</span>

                <span
                  className={`customDropdown-arrow ${
                    openDropdown === "status" ? "customDropdown-arrow-open" : ""
                  }`}
                >
                  <MdOutlineKeyboardArrowDown />
                </span>
              </button>

              {openDropdown === "status" && (
                <div className="customDropdown-menu">
                  {statusOptions.map((status) => (
                    <div
                      key={status}
                      className={`customDropdown-option ${
                        selectedStatus === status
                          ? "customDropdown-option-active"
                          : ""
                      }`}
                      onClick={() => handleStatusSelect(status)}
                    >
                      {status}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Employee details Table */}

        <div className="dahboardEmployee-details">
          <div className="dashboardEmployee-header">
            <div>EMPLOYEE</div>
            <div>DEPARTMENT</div>
            <div>DESIGNATION</div>
            <div>ROLE</div>
            <div>STATUS</div>
            <div>ACTIONS</div>
          </div>
          <div className="dashboardEmployee-users">
            {users &&
              users.map((el, id) => (
                <div
                  className="employee-users-container"
                  key={id}
                >
                  <div className="dashboardEmployee-information">
                    <div className="dashboardEmploye-avatar">
                      {el.firstName?.[0]?.toUpperCase()}
                      {el.lastName?.[0]?.toUpperCase()}
                    </div>
                    <div className="dashboardEmployee-name">
                      <p>
                        {el.firstName} {el.lastName}
                      </p>
                    </div>
                  </div>
                  <div className="dashboardEmployee-department-name">
                    {el.department ? (
                      <span>{el.department}</span>
                    ) : (
                      <DepartmentDropdown
                        departments={employeeDepartments}
                        onSelect={(department) =>
                          handleDepartmentChange(el._id, department)
                        }
                      />
                    )}
                  </div>
                  <div className="dashboardEmployee-designation">
                    {el.designation ? (
                      <span>{el.designation}</span>
                    ) : (
                      <DesignationDropdown
                        designations={employeeDesignations}
                        selectedDesignation={el.designation}
                        onSelect={(designation) =>
                          handleDesignationChange(el._id, designation)
                        }
                      />
                    )}
                  </div>
                  <div className="dashboardEmployee-role">{el.role}</div>
                  <div className="dashboardEmployee-status">
                    <div></div>
                    <span>{el.isOnline ? "Active" : "Inactive"}</span>
                  </div>
                  <div className="dashboardEmployee-actions">
                    <div className="dashboardEmployee-view">
                      <FaEyeSlash
                        style={{ color: "#479ef5", fontSize: "14px" }}
                      />
                      <span style={{ color: "#50bbf5" }}>View</span>
                    </div>
                    <div>
                      <MdEdit style={{ color: "#f8845d", fontSize: "14px" }} />
                      <span style={{ color: "#5bbaa7" }}>Edit</span>
                    </div>
                    <div>
                      <MdDelete
                        style={{ color: "#c44261", fontSize: "14px" }}
                      />
                    </div>
                    <div>
                      <FaKey style={{ color: "#fdcb4b", fontSize: "12px" }} />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div className="employeeDashboard-loadmore-btn">
          <button
            onClick={handleLoadLess}
            disabled={isLoading || currentPage <= 1}
          >
            Load Less
          </button>

          {users.length < totalUsers && (
            <button
              onClick={handleLoadMore}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Load More"}
            </button>
          )}
        </div>
      </div>
    </>
  );
};
