import "../../components/Dashboard/DashboardEmployee.css"

import { FaPlus } from "react-icons/fa6"
import { FaSearch } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { MdEdit, MdDelete } from "react-icons/md";

export const DashboardEmployee = () => {
    return (
        <>
            <div className="dashboardEmployee-container">

                {/* Employee management header */}
                <div className="employee-management-header">
                    <div className="employee-management-heading">
                        <h3>Employee Management</h3>
                        <span>7 of 7 employees shown</span>
                    </div>
                    <div className="employee-management-right">
                        <FaPlus style={{ color: "#6954b1" }} />
                        <span>Add Employee</span>
                    </div>
                </div>

                {/* Employee filter */}
                <div className="employe-search-filter">
                    <div className="dashboardEmployee-searchbar">
                        <FaSearch style={{color: "#579cbd"}} />
                        <input type="search" placeholder="Search employee..." />
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
                <div className="dashboard-employee-details">
                    <table>
                        <thead>
                            <tr>
                                <td>EMPLOYEE</td>
                                <td>DPARTMENT</td>
                                <td>DESIGNATION</td>
                                <td>ROLE</td>
                                <td>STATUS</td>
                                <td>ACTIONS</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <div className="dashboardEmployee-avatar">

                                    </div>
                                    <div>
                                        <p>Sarah Mitchell</p>
                                        <span>#ID001</span>
                                    </div>
                                </td>
                                <td>Design</td>
                                <td>Senior Designer</td>
                                <td>
                                    <div>Admin</div>
                                </td>
                                <td>
                                    <div>
                                        <div className="dashboardEmployee-dot"></div>
                                        <span>Active</span>
                                    </div>
                                </td>
                                <td>
                                    <div className="dashboardEmployee-actions">
                                        <div className="dashboardEmployee-view">
                                            <FaEyeSlash />
                                            <span>View</span>
                                        </div>
                                        <div className="dashboardEmployee-edit">
                                            <MdEdit />
                                            <span>Edit</span>
                                        </div>
                                        <div    className="dashboardEmployee-delete">
                                            <MdDelete />
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div className="dashboardEmployee-avatar">

                                    </div>
                                    <div>
                                        <p>Sarah Mitchell</p>
                                        <span>#ID001</span>
                                    </div>
                                </td>
                                <td>Design</td>
                                <td>Senior Designer</td>
                                <td>
                                    <div>Admin</div>
                                </td>
                                <td>
                                    <div>
                                        <div className="dashboardEmployee-dot"></div>
                                        <span>Active</span>
                                    </div>
                                </td>
                                <td>
                                    <div className="dashboardEmployee-view">
                                        <FaEyeSlash />
                                        <span>View</span>
                                    </div>
                                    <div>
                                        <MdEdit />
                                        <span>Edit</span>
                                    </div>
                                    <div>
                                        <MdDelete />
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div className="dashboardEmployee-avatar">

                                    </div>
                                    <div>
                                        <p>Sarah Mitchell</p>
                                        <span>#ID001</span>
                                    </div>
                                </td>
                                <td>Design</td>
                                <td>Senior Designer</td>
                                <td>
                                    <div>Admin</div>
                                </td>
                                <td>
                                    <div>
                                        <div className="dashboardEmployee-dot"></div>
                                        <span>Active</span>
                                    </div>
                                </td>
                                <td>
                                    <div className="dashboardEmployee-view">
                                        <FaEyeSlash />
                                        <span>View</span>
                                    </div>
                                    <div>
                                        <MdEdit />
                                        <span>Edit</span>
                                    </div>
                                    <div>
                                        <MdDelete />
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div className="dashboardEmployee-avatar">

                                    </div>
                                    <div>
                                        <p>Sarah Mitchell</p>
                                        <span>#ID001</span>
                                    </div>
                                </td>
                                <td>Design</td>
                                <td>Senior Designer</td>
                                <td>
                                    <div>Admin</div>
                                </td>
                                <td>
                                    <div>
                                        <div className="dashboardEmployee-dot"></div>
                                        <span>Active</span>
                                    </div>
                                </td>
                                <td>
                                    <div className="dashboardEmployee-view">
                                        <FaEyeSlash />
                                        <span>View</span>
                                    </div>
                                    <div>
                                        <MdEdit />
                                        <span>Edit</span>
                                    </div>
                                    <div>
                                        <MdDelete />
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div className="dashboardEmployee-avatar">

                                    </div>
                                    <div>
                                        <p>Sarah Mitchell</p>
                                        <span>#ID001</span>
                                    </div>
                                </td>
                                <td>Design</td>
                                <td>Senior Designer</td>
                                <td>
                                    <div>Admin</div>
                                </td>
                                <td>
                                    <div>
                                        <div className="dashboardEmployee-dot"></div>
                                        <span>Active</span>
                                    </div>
                                </td>
                                <td>
                                    <div className="dashboardEmployee-view">
                                        <FaEyeSlash />
                                        <span>View</span>
                                    </div>
                                    <div>
                                        <MdEdit />
                                        <span>Edit</span>
                                    </div>
                                    <div>
                                        <MdDelete />
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div className="dashboardEmployee-avatar">

                                    </div>
                                    <div>
                                        <p>Sarah Mitchell</p>
                                        <span>#ID001</span>
                                    </div>
                                </td>
                                <td>Design</td>
                                <td>Senior Designer</td>
                                <td>
                                    <div>Admin</div>
                                </td>
                                <td>
                                    <div>
                                        <div className="dashboardEmployee-dot"></div>
                                        <span>Active</span>
                                    </div>
                                </td>
                                <td>
                                    <div className="dashboardEmployee-view">
                                        <FaEyeSlash />
                                        <span>View</span>
                                    </div>
                                    <div>
                                        <MdEdit />
                                        <span>Edit</span>
                                    </div>
                                    <div>
                                        <MdDelete />
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div className="dashboardEmployee-avatar">

                                    </div>
                                    <div>
                                        <p>Sarah Mitchell</p>
                                        <span>#ID001</span>
                                    </div>
                                </td>
                                <td>Design</td>
                                <td>Senior Designer</td>
                                <td>
                                    <div>Admin</div>
                                </td>
                                <td>
                                    <div>
                                        <div className="dashboardEmployee-dot"></div>
                                        <span>Active</span>
                                    </div>
                                </td>
                                <td>
                                    <div className="dashboardEmployee-view">
                                        <FaEyeSlash />
                                        <span>View</span>
                                    </div>
                                    <div>
                                        <MdEdit />
                                        <span>Edit</span>
                                    </div>
                                    <div>
                                        <MdDelete />
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}