import "./DashboardEmployee.css";

import { FaPlus } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { MdEdit, MdDelete } from "react-icons/md";
import { FaKey } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUser } from "../../../store/authSlice";
import { useEffect, useState } from "react";

export const DashboardEmployee = () => {
  const dispatch = useDispatch();
  const { users, totalUsers, isLoading } = useSelector((state) => state.auth);
  console.log("🚀 ~ totalUsers:", totalUsers);
  const [page, setPage] = useState(1);

  const handleLoadMore = () => {
    const nextPage = page + 1;

    setPage(nextPage);

    dispatch(
      fetchAllUser({
        page: nextPage,
        limit: 10,
      }),
    );
  };

  useEffect(() => {
    dispatch(
      fetchAllUser({
        page: 1,
        limit: 10,
      }),
    );
  }, [dispatch]);
  console.log("🚀 ~ users:", users);

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
        <div className="employe-search-filter">
          <div className="dashboardEmployee-searchbar">
            <FaSearch style={{ color: "#579cbd" }} />
            <input
              type="search"
              placeholder="Search employee..."
            />
          </div>
          <div className="dashboardEmployee-department">
            <select>
              <option value="All">All</option>
              <option value="Engineering">Engineering</option>
              <option value="Design">Design</option>
              <option value="HR">HR</option>
              <option value="Analytics">Analytics</option>
              <option value="Marketing">Marketing</option>
            </select>
          </div>
          <div className="dashboardEmployee-filter">
            <select>
              <option value="All">All</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
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
                    <div className="dashboardEmploye-avatar">{el.avatar}</div>
                    <div className="dashboardEmployee-name">
                      <p>
                        {el.firstName} {el.lastName}
                      </p>
                      <span>{el._id}</span>
                    </div>
                  </div>
                  <div className="dashboardEmployee-department">
                    {el.department ? el.department : "--"}
                  </div>
                  <div className="dashboardEmployee-designation">
                    {el.designation ? el.designation : "--"}
                  </div>
                  <div className="dashboardEmployee-role">{el.role}</div>
                  <div className="dashboardEmployee-status">
                    <div></div>
                    <span>{el.isOnline ? "Active" : "Deactive"}</span>
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
