import "./DashboardEmployee.css";

import { FaCheck, FaPlus } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";

import {
  MdEdit,
  MdDelete,
  MdCheck,
  MdClose,
  MdOutlineClose,
} from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { FaEye, FaEyeSlash, FaKey } from "react-icons/fa";

import { useDispatch, useSelector } from "react-redux";

import {
  deleteUser,
  fetchAllUser,
  loadLessUsers,
  updateUser,
  updateUserRole,
} from "../../../store/adminAuthSlice";

import { adminAuthService } from "../../../services/adminAuthService";

import { useEffect, useRef, useState } from "react";

import { DepartmentDropdown } from "../Dropdowns/DepartmentDropdown/DepartmentDropdown";
import { DesignationDropdown } from "../Dropdowns/DesignationDropdown/DesignationDropdown";
import { RoleDropdown } from "../Dropdowns/RoleDropdown/RoleDropdown";
import { Modal } from "../../Modal/Modal";
import { PulseDot } from "../../PulseDot/pulseDot";
import { Form } from "../../Form";
import { forms } from "../../../data/form";
import EmployeeProfile from "../../../pages/EmployeeProfile/EmployeeProfile";

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
    (state) => state.adminAuth,
  );

  //# Admin can create employee
  const [showAddEmployee, setShowAddEmployee] = useState(false);

  //# Show the Employee details modal
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

  //# Search Employee by Name
  const [searchInput, setSearchInput] = useState("");

  //# Filter Dropdown
  const [openDropdown, setOpenDropdown] = useState(null);

  const [selectedDepartment, setSelectedDepartment] = useState("All");

  const [selectedStatus, setSelectedStatus] = useState("All");

  const [selected, setSelected] = useState("");

  const dropdownRef = useRef(null);

  const statusOptions = ["All", "Active", "Inactive"];
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  //# ========================= EDIT STATE =========================

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

  //# ========================= SEARCH =========================

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

  //# ============= Admin: Create Employee ===============
  const handleEmployeeCreated = async () => {
    setShowAddEmployee(false);

    await dispatch(
      fetchAllUser({
        page: 1,
        department: selectedDepartment,
        status: selectedStatus,
        search: searchInput.trim(),
      }),
    );
  };

  //# ========================= LOAD MORE =========================

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

  //# ========================= LOAD LESS =========================

  const handleLoadLess = () => {
    dispatch(loadLessUsers());
  };

  //# ========================= FILTER DROPDOWN =========================

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
      await adminAuthService.updateUserDesignation(userId, designation);

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

  const handleDepartmentChange = async (userId, department) => {
    try {
      await adminAuthService.updateUserDepartment(userId, department);

      dispatch(
        fetchAllUser({
          page: 1,
          department: selectedDepartment,
          status: selectedStatus,
          search,
        }),
      );
    } catch (error) {
      console.error("Department update failed:", error);

      alert(error?.response?.data?.message || "Failed to update department.");
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

  //# ========================= FETCH USERS =========================

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

  //# ========================= OUTSIDE CLICK =========================

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

  //# ========================= EDIT EMPLOYEE =========================

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

  // ========================= OPEN NAME MODAL =========================
  const handleNameClick = () => {
    if (!editingUserId) return;

    setShowNameModal(true);
  };

  // ========================= CLOSE NAME MODAL =========================
  const handleCloseNameModal = () => {
    setShowNameModal(false);
  };

  // ========================= SAVE NAME =========================
  const handleSaveName = () => {
    if (!editData.firstName.trim()) {
      alert("First name is required.");
      return;
    }

    if (!editData.lastName.trim()) {
      alert("Last name is required.");
      return;
    }

    setShowNameModal(false);
  };

  //# ========================= EDIT INPUT CHANGE =========================
  // ========================= NAME EDIT MODAL =========================
  const [showNameModal, setShowNameModal] = useState(false);

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //# ========================= EDIT DEPARTMENT CHANGE =========================

  const handleEditDepartmentChange = (department) => {
    setEditData((prev) => ({
      ...prev,
      department,
    }));
  };

  //# ========================= EDIT DESIGNATION CHANGE =========================

  const handleEditDesignationChange = (designation) => {
    setEditData((prev) => ({
      ...prev,
      designation,
    }));
  };

  //# ========================= CANCEL EDIT =========================

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

  //# ========================= SAVE EDIT =========================

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

  //# =================== Delete Employee Account ======================
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const handleDeleteUser = async () => {
    if (!deleteUserId) return;

    try {
      setIsDeleting(true);

      await dispatch(deleteUser(deleteUserId)).unwrap();

      setShowDeleteModal(false);
      setDeleteUserId(null);

      dispatch(
        fetchAllUser({
          page: 1,
          department: selectedDepartment,
          status: selectedStatus,
          search,
        }),
      );

      showModalRef.current({
        variant: "success",
        title: "Employee Deleted",
        message: "Employee deleted successfully.",
        description: "The employee has been removed from the employee list.",
      });
    } catch (error) {
      console.error("Delete employee failed:", error);

      showModalRef.current({
        variant: "error",
        title: "Delete Failed",
        message: error?.message || "Failed to delete employee.",
        description: "Something went wrong while deleting the employee.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  //# Change Employee password by Admin
  const [passwordModal, setPasswordModal] = useState({
    open: false,
    userId: null,
    userName: "",
  });

  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [isChangingPassword, setIsChangingPassword] = useState(false);

  //# Change password Modal
  const openPasswordModal = (user) => {
    setPasswordModal({
      open: true,
      userId: user._id,
      userName: `${user.firstName} ${user.lastName}`,
    });

    setPasswordData({
      newPassword: "",
      confirmPassword: "",
    });

    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  //# Close Modal
  const closePasswordModal = () => {
    if (isChangingPassword) return;

    setPasswordModal({
      open: false,
      userId: null,
      userName: "",
    });

    setPasswordData({
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangePassword = async () => {
    const { newPassword, confirmPassword } = passwordData;

    if (!newPassword.trim()) {
      alert("Please enter a new password.");
      return;
    }

    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    if (!confirmPassword.trim()) {
      alert("Please confirm the new password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      setIsChangingPassword(true);

      await adminAuthService.changeUserPassword(
        passwordModal.userId,
        newPassword,
      );

      alert("Employee password changed successfully.");

      closePasswordModal();
    } catch (error) {
      console.error("Change password failed:", error);

      alert(
        error?.response?.data?.message || "Failed to change employee password.",
      );
    } finally {
      setIsChangingPassword(false);
    }
  };

  //# Modal scroll
  useEffect(() => {
    if (selectedEmployeeId) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedEmployeeId]);

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

          <div
            className="employee-management-right"
            onClick={() => setShowAddEmployee(true)}
          >
            <FaPlus style={{ color: "#fff" }} />

            <span>Add Employee</span>
          </div>
        </div>

        {/* ========================= */}
        {/* EMPLOYEE FILTER */}
        {/* ========================= */}

        <div ref={dropdownRef} className="employe-search-filter">
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

            <div onClick={handleSearch} className="employee-searchBtn">
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

        {/* EMPLOYEE DETAILS TABLE */}
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
                    {/* EMPLOYEE NAME */}

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
                      <div
                        className={`dashboardEmployee-name ${
                          isEditing ? "dashboardEmployee-name-editable" : ""
                        }`}
                        onClick={isEditing ? handleNameClick : undefined}
                      >
                        <p>
                          {isEditing
                            ? `${editData.firstName} ${editData.lastName}`
                            : `${el.firstName?.charAt(0).toUpperCase() + el.firstName?.slice(1)} ${
                                el.lastName?.charAt(0).toUpperCase() +
                                el.lastName?.slice(1)
                              }`}
                        </p>
                      </div>
                    </div>

                    {/* DEPARTMENT */}

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

                    {/* DESIGNATION */}

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

                    {/* ========================= STATUS =========================*/}

                    <div
                      className={`dashboardEmployee-status ${el.isOnline ? "active" : "inactive"}`}
                    >
                      <PulseDot
                        color={
                          el.isOnline === "Present"
                            ? "var(--attendance-present-dot)"
                            : "var(--attendance-absent-dot)"
                        }
                        size="5px"
                        speed="2.5s"
                        scale="2.5"
                      />

                      <span>{el.isOnline ? "Active" : "Inactive"}</span>
                    </div>

                    {/* ACTIONS */}

                    <div className="dashboardEmployee-actions">
                      {isEditing ? (
                        <>
                          {/* SAVE */}

                          <div
                            className="employee-save-action"
                            onClick={() => handleSaveEdit(el._id)}
                          >
                            <FaCheck />

                            <span>Save</span>
                          </div>

                          {/* CANCEL */}

                          <div
                            className="employee-cancel-action"
                            onClick={handleCancelEdit}
                          >
                            <MdOutlineClose />

                            <span>Cancel</span>
                          </div>
                        </>
                      ) : (
                        <>
                          {/* VIEW */}

                          <div
                            className="dashboardEmployee-view"
                            onClick={() => setSelectedEmployeeId(el._id)}
                          >
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

                          <div
                            className="dashboardEmployee-delete"
                            onClick={() => {
                              setDeleteUserId(el._id);
                              setShowDeleteModal(true);
                            }}
                            style={{ cursor: "pointer" }}
                          >
                            <MdDelete
                              style={{
                                color: "#c44261",
                                fontSize: "14px",
                              }}
                            />
                          </div>

                          <Modal
                            isOpen={showDeleteModal}
                            onClose={() => {
                              setShowDeleteModal(false);
                              setDeleteUserId(null);
                            }}
                            variant="warning"
                            title="Delete Employee?"
                            message="Are you sure you want to delete this employee?"
                            description="This action cannot be undone."
                            onConfirm={handleDeleteUser}
                            confirmText={isDeleting ? "Deleting..." : "Delete"}
                            cancelText="Cancel"
                            showActions={true}
                          />

                          {/* KEY */}

                          {passwordModal.open && (
                            <Modal
                              isOpen
                              overlayClassName="password-modal-overlay"
                              className="password-modal"
                            >
                              <div className="password-modal-icon">
                                <FaKey />
                              </div>

                              <h3>Change Employee Password</h3>

                              <p className="password-modal-user">
                                Change password for{" "}
                                <strong>{passwordModal.userName}</strong>
                              </p>

                              <div className="password-input-group">
                                <label htmlFor="newPassword">
                                  New Password
                                </label>

                                <div className="password-field">
                                  <input
                                    id="newPassword"
                                    type={showNewPassword ? "text" : "password"}
                                    name="newPassword"
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordChange}
                                    placeholder="Enter new password"
                                    disabled={isChangingPassword}
                                  />

                                  <button
                                    type="button"
                                    className="password-eye"
                                    onClick={() =>
                                      setShowNewPassword((prev) => !prev)
                                    }
                                    disabled={isChangingPassword}
                                  >
                                    {showNewPassword ? (
                                      <FaEye />
                                    ) : (
                                      <FaEyeSlash />
                                    )}
                                  </button>
                                </div>
                              </div>

                              <div className="password-input-group">
                                <label htmlFor="confirmPassword">
                                  Confirm Password
                                </label>

                                <div className="password-field">
                                  <input
                                    id="confirmPassword"
                                    type={
                                      showConfirmPassword ? "text" : "password"
                                    }
                                    name="confirmPassword"
                                    value={passwordData.confirmPassword}
                                    onChange={handlePasswordChange}
                                    placeholder="Confirm new password"
                                    disabled={isChangingPassword}
                                  />

                                  <button
                                    type="button"
                                    className="password-eye"
                                    onClick={() =>
                                      setShowConfirmPassword((prev) => !prev)
                                    }
                                    disabled={isChangingPassword}
                                  >
                                    {showConfirmPassword ? (
                                      <FaEye />
                                    ) : (
                                      <FaEyeSlash />
                                    )}
                                  </button>
                                </div>
                              </div>

                              <div className="password-modal-actions">
                                <button
                                  type="button"
                                  className="password-modal-cancel"
                                  onClick={closePasswordModal}
                                  disabled={isChangingPassword}
                                >
                                  Cancel
                                </button>

                                <button
                                  type="button"
                                  className="password-modal-confirm"
                                  onClick={handleChangePassword}
                                  disabled={isChangingPassword}
                                >
                                  {isChangingPassword
                                    ? "Changing..."
                                    : "Change Password"}
                                </button>
                              </div>
                            </Modal>
                          )}

                          <div
                            className="dashboardEmployee-key"
                            onClick={() => openPasswordModal(el)}
                            title="Change Password"
                            style={{ cursor: "pointer" }}
                          >
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

        {/* LOAD MORE / LESS */}

        <div className="employeeDashboard-loadmore-btn">
          <button
            onClick={handleLoadLess}
            disabled={isLoading || currentPage <= 1}
          >
            Load Less
          </button>

          {users.length < totalUsers && (
            <button onClick={handleLoadMore} disabled={isLoading}>
              {isLoading ? "Loading..." : "Load More"}
            </button>
          )}
        </div>
      </div>

      {showNameModal && (
        <Modal
          isOpen={showNameModal}
          onClose={handleCloseNameModal}
          className="edit-name-modal"
        >
          <div className="edit-name-modal-content">
            <div className="edit-name-modal-header">
              <div>
                <h3>Edit Employee Name</h3>
                <p>Update the employee's first and last name.</p>
              </div>

              <button
                type="button"
                className="edit-name-modal-close"
                onClick={handleCloseNameModal}
              >
                <IoClose />
              </button>
            </div>

            <div className="edit-name-form">
              <div className="edit-name-input-group">
                <label>First Name</label>

                <input
                  type="text"
                  name="firstName"
                  value={editData.firstName}
                  onChange={handleEditChange}
                  placeholder="Enter first name"
                  autoFocus
                />
              </div>

              <div className="edit-name-input-group">
                <label>Last Name</label>

                <input
                  type="text"
                  name="lastName"
                  value={editData.lastName}
                  onChange={handleEditChange}
                  placeholder="Enter last name"
                />
              </div>
            </div>

            <div className="edit-name-modal-actions">
              <button
                type="button"
                className="edit-name-cancel"
                onClick={handleCloseNameModal}
              >
                Cancel
              </button>

              <button
                type="button"
                className="edit-name-save"
                onClick={handleSaveName}
              >
                Save Name
              </button>
            </div>
          </div>
        </Modal>
      )}

      {showAddEmployee && (
        <Modal
          isOpen={showAddEmployee}
          onClose={() => setShowAddEmployee(false)}
          className="add-employee-modal"
        >
          <div className="add-employee-scroll">
            <Form
              fields={forms.adminEmployee.fields}
              button={forms.adminEmployee.button}
              endpoint={forms.adminEmployee.endpoint}
              onSuccess={handleEmployeeCreated}
            />
          </div>
        </Modal>
      )}

      {selectedEmployeeId && (
        <div
          className="employee-profile-overlay"
          onClick={() => setSelectedEmployeeId(null)}
        >
          <div
            className="employee-profile-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <EmployeeProfile
              userId={selectedEmployeeId}
              onClose={() => setSelectedEmployeeId(null)}
            />
          </div>
        </div>
      )}
    </>
  );
};
