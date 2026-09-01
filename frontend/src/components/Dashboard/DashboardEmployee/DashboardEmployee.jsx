import "./DashboardEmployee.css";

import { FaPlus } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { MdEdit, MdDelete, MdCheck, MdClose } from "react-icons/md";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { FaKey } from "react-icons/fa";

import { useDispatch, useSelector } from "react-redux";

import {
  fetchAllUser,
  loadLessUsers,
  updateUser,
  updateUserRole,
} from "../../../store/authSlice";

import { authService } from "../../../services/authService";

import { useEffect, useRef, useState } from "react";

import { DepartmentDropdown } from "../Dropdowns/DepartmentDropdown/DepartmentDropdown";
import { DesignationDropdown } from "../Dropdowns/DesignationDropdown/DesignationDropdown";
import { RoleDropdown } from "../Dropdowns/RoleDropdown/RoleDropdown";

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

const employeeRoles = ["Admin", "Manager", "Employee"];

export const DashboardEmployee = () => {
  const dispatch = useDispatch();

  const { users, totalUsers, isLoading, search, currentPage } = useSelector(
    (state) => state.auth,
  );

  //# Search Employee by Name
  const [searchInput, setSearchInput] = useState("");

  //# Filter Dropdown
  const [openDropdown, setOpenDropdown] = useState(null);

  const [selectedDepartment, setSelectedDepartment] = useState("All");

  const [selectedStatus, setSelectedStatus] = useState("All");

  const [selected, setSelected] = useState("");

  const dropdownRef = useRef(null);

  const statusOptions = ["All", "Active", "Inactive"];

  //# =========================
  //# EDIT STATE
  //# =========================

  // Currently editing employee
  const [editingUserId, setEditingUserId] = useState(null);

  // Temporary data while editing
  const [editData, setEditData] = useState({
    firstName: "",
    lastName: "",
    department: "",
    designation: "",
    role: "",
  });

  //# =========================
  //# SEARCH
  //# =========================

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

  //# =========================
  //# LOAD MORE
  //# =========================

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

  //# =========================
  //# LOAD LESS
  //# =========================

  const handleLoadLess = () => {
    dispatch(loadLessUsers());
  };

  //# =========================
  //# FILTER DROPDOWN
  //# =========================

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

  const handleDesignationChange = async (userId, designation) => {
    try {
      await authService.updateUserDesignation(userId, designation);

      dispatch(
        fetchAllUser({
          page: 1,
          department: selectedDepartment,
          status: selectedStatus,
          search,
        }),
      );
    } catch (error) {
      console.error("Designation update failed:", error);
    }
  };

  const handleRoleChange = (userId, role) => {
    dispatch(
      updateUserRole({
        userId,
        role,
      }),
    );
  };

  //# =========================
  //# FETCH USERS
  //# =========================

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

  //# =========================
  //# OUTSIDE CLICK
  //# =========================

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

  //# =========================
  //# EDIT EMPLOYEE
  //# =========================

  const handleEdit = (user) => {
    // Set current employee as editing
    setEditingUserId(user._id);

    // Copy existing data into temporary state
    setEditData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      department: user.department || "",
      designation: user.designation || "",
      role: user.role || "",
    });
  };

  //# =========================
  //# EDIT INPUT CHANGE
  //# =========================

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //# =========================
  //# EDIT DEPARTMENT CHANGE
  //# =========================

  const handleEditDepartmentChange = (department) => {
    setEditData((prev) => ({
      ...prev,
      department,
    }));
  };

  //# =========================
  //# EDIT DESIGNATION CHANGE
  //# =========================

  const handleEditDesignationChange = (designation) => {
    setEditData((prev) => ({
      ...prev,
      designation,
    }));
  };

  //# =========================
  //# CANCEL EDIT
  //# =========================

  const handleCancelEdit = () => {
    setEditingUserId(null);

    setEditData({
      firstName: "",
      lastName: "",
      department: "",
      designation: "",
      role: "",
    });
  };

  const handleEditRoleChange = (role) => {
    setEditData((prev) => ({
      ...prev,
      role,
    }));
  };

  //# =========================
  //# SAVE EDIT
  //# =========================

  const handleSaveEdit = async (userId) => {
    // Basic validation
    if (!editData.firstName.trim()) {
      alert("First name is required.");
      return;
    }

    if (!editData.lastName.trim()) {
      alert("Last name is required.");
      return;
    }

    if (!editData.department) {
      alert("Department is required.");
      return;
    }

    if (!editData.designation) {
      alert("Designation is required.");
      return;
    }

    if (!editData.role) {
      alert("Role is required.");
      return;
    }

    try {
      await dispatch(
        updateUser({
          userId,

          firstName: editData.firstName.trim(),

          lastName: editData.lastName.trim(),

          department: editData.department,

          designation: editData.designation,
          role: editData.role,
        }),
      ).unwrap();

      // Close edit mode after successful update
      handleCancelEdit();
    } catch (error) {
      console.error("Employee update failed:", error);

      alert(
        error?.message ||
          error ||
          "Failed to update employee. Please try again.",
      );
    }
  };

  return (
    <>
      <div className="dashboardEmployee-container">
        {/* ========================= */}
        {/* EMPLOYEE MANAGEMENT HEADER */}
        {/* ========================= */}

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

        {/* ========================= */}
        {/* EMPLOYEE FILTER */}
        {/* ========================= */}

        <div
          ref={dropdownRef}
          className="employe-search-filter"
        >
          {/* SEARCH */}
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

          {/* DEPARTMENT FILTER */}
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

          {/* STATUS FILTER */}
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

        {/* ========================= */}
        {/* EMPLOYEE DETAILS TABLE */}
        {/* ========================= */}

        <div className="dahboardEmployee-details">
          {/* TABLE HEADER */}

          <div className="dashboardEmployee-header">
            <div>EMPLOYEE</div>

            <div>DEPARTMENT</div>

            <div>DESIGNATION</div>

            <div>ROLE</div>

            <div>STATUS</div>

            <div>ACTIONS</div>
          </div>

          {/* USERS */}

          <div className="dashboardEmployee-users">
            {users &&
              users.map((el) => {
                // Check if this row is being edited
                const isEditing = editingUserId === el._id;

                return (
                  <div
                    className={`employee-users-container ${
                      isEditing ? "employee-users-container-editing" : ""
                    }`}
                    key={el._id}
                  >
                    {/* ========================= */}
                    {/* EMPLOYEE NAME */}
                    {/* ========================= */}

                    <div className="dashboardEmployee-information">
                      {/* AVATAR */}

                      <div className="dashboardEmploye-avatar">
                        {isEditing
                          ? editData.firstName?.[0]?.toUpperCase()
                          : el.firstName?.[0]?.toUpperCase()}

                        {isEditing
                          ? editData.lastName?.[0]?.toUpperCase()
                          : el.lastName?.[0]?.toUpperCase()}
                      </div>

                      {/* NAME */}

                      <div className="dashboardEmployee-name">
                        {isEditing ? (
                          <div className="employee-edit-name">
                            <input
                              type="text"
                              name="firstName"
                              value={editData.firstName}
                              onChange={handleEditChange}
                              placeholder="First name"
                            />

                            <input
                              type="text"
                              name="lastName"
                              value={editData.lastName}
                              onChange={handleEditChange}
                              placeholder="Last name"
                            />
                          </div>
                        ) : (
                          <p>
                            {el.firstName} {el.lastName}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* ========================= */}
                    {/* DEPARTMENT */}
                    {/* ========================= */}

                    <div className="dashboardEmployee-department-name">
                      {isEditing ? (
                        <DepartmentDropdown
                          departments={employeeDepartments}
                          selectedDepartment={editData.department}
                          onSelect={handleEditDepartmentChange}
                        />
                      ) : el.department ? (
                        <span>{el.department}</span>
                      ) : (
                        <DepartmentDropdown
                          departments={employeeDepartments}
                          selectedDepartment={el.department}
                          onSelect={(department) =>
                            handleDepartmentChange(el._id, department)
                          }
                        />
                      )}
                    </div>

                    {/* ========================= */}
                    {/* DESIGNATION */}
                    {/* ========================= */}

                    <div className="dashboardEmployee-designation">
                      {isEditing ? (
                        <DesignationDropdown
                          designations={employeeDesignations}
                          selectedDesignation={editData.designation}
                          onSelect={handleEditDesignationChange}
                        />
                      ) : el.designation ? (
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

                    {/* Role */}
                    <div className="dashboardEmployee-role">
                      {isEditing ? (
                        <RoleDropdown
                          roles={employeeRoles}
                          selectedRole={editData.role}
                          onSelect={handleEditRoleChange}
                        />
                      ) : el.role ? (
                        <span>{el.role}</span>
                      ) : (
                        <RoleDropdown
                          roles={employeeRoles}
                          selectedRole={el.role}
                          onSelect={(role) => handleRoleChange(el._id, role)}
                        />
                      )}
                    </div>

                    {/* ========================= */}
                    {/* STATUS */}
                    {/* ========================= */}

                    <div className="dashboardEmployee-status">
                      <div></div>

                      <span>{el.isOnline ? "Active" : "Inactive"}</span>
                    </div>

                    {/* ========================= */}
                    {/* ACTIONS */}
                    {/* ========================= */}

                    <div className="dashboardEmployee-actions">
                      {isEditing ? (
                        <>
                          {/* SAVE */}

                          <div
                            className="employee-save-action"
                            onClick={() => handleSaveEdit(el._id)}
                          >
                            <MdCheck
                              style={{
                                color: "#4caf50",
                                fontSize: "17px",
                              }}
                            />

                            <span
                              style={{
                                color: "#4caf50",
                              }}
                            >
                              Save
                            </span>
                          </div>

                          {/* CANCEL */}

                          <div
                            className="employee-cancel-action"
                            onClick={handleCancelEdit}
                          >
                            <MdClose
                              style={{
                                color: "#e05252",
                                fontSize: "17px",
                              }}
                            />

                            <span
                              style={{
                                color: "#e05252",
                              }}
                            >
                              Cancel
                            </span>
                          </div>
                        </>
                      ) : (
                        <>
                          {/* VIEW */}

                          <div className="dashboardEmployee-view">
                            <FaEyeSlash
                              style={{
                                color: "#479ef5",
                                fontSize: "14px",
                              }}
                            />

                            <span
                              style={{
                                color: "#50bbf5",
                              }}
                            >
                              View
                            </span>
                          </div>

                          {/* EDIT */}

                          <div
                            className="dashboardEmployee-edit"
                            onClick={() => handleEdit(el)}
                          >
                            <MdEdit
                              style={{
                                color: "#f8845d",
                                fontSize: "14px",
                              }}
                            />

                            <span
                              style={{
                                color: "#5bbaa7",
                              }}
                            >
                              Edit
                            </span>
                          </div>

                          {/* DELETE */}

                          <div>
                            <MdDelete
                              style={{
                                color: "#c44261",
                                fontSize: "14px",
                              }}
                            />
                          </div>

                          {/* KEY */}

                          <div>
                            <FaKey
                              style={{
                                color: "#fdcb4b",
                                fontSize: "12px",
                              }}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* ========================= */}
        {/* LOAD MORE / LESS */}
        {/* ========================= */}

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
