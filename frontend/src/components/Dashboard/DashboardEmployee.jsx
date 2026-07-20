import "../../components/Dashboard/DashboardEmployee.css"

import { FaPlus } from "react-icons/fa6"
import { FaSearch } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { MdEdit, MdDelete } from "react-icons/md";
import { FaKey } from "react-icons/fa";

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
                        <div className="employee-users-container">
                            <div className="dashboardEmployee-information">
                                <div className="dashboardEmploye-avatar">SM</div>
                                <div className="dashboardEmployee-name">
                                    <p>Sarah Mitchell</p>
                                    <span>ID #0001</span>
                                </div>
                            </div>
                            <div className="dashboardEmployee-department">Design</div>
                            <div className="dashboardEmployee-designation">Senior Designer</div>
                            <div className="dashboardEmployee-role">Admin</div>
                            <div className="dashboardEmployee-status">
                                <div></div>
                                <span>Active</span>
                            </div>
                            <div className="dashboardEmployee-actions">
                                <div className="dashboardEmployee-view">
                                    <FaEyeSlash style={{color: "#479ef5", fontSize: "14px"}} />
                                    <span style={{color: "#50bbf5"}}>View</span>
                                </div>
                                <div>
                                    <MdEdit style={{color: "#f8845d", fontSize: "14px"}} />
                                    <span style={{color: "#5bbaa7"}}>Edit</span>
                                </div>
                                <div>
                                    <MdDelete style={{color: "#c44261", fontSize: "14px"}} />
                                </div>
                                <div>
                                    <FaKey style={{color: "#fdcb4b", fontSize: "12px"}} />
                                </div>
                            </div>
                        </div>
                        <div className="employee-users-container">
                            <div className="dashboardEmployee-information">
                                <div className="dashboardEmploye-avatar">SM</div>
                                <div className="dashboardEmployee-name">
                                    <p>Sarah Mitchell</p>
                                    <span>ID #0001</span>
                                </div>
                            </div>
                            <div className="dashboardEmployee-department">Design</div>
                            <div className="dashboardEmployee-designation">Senior Designer</div>
                            <div className="dashboardEmployee-role">Admin</div>
                            <div className="dashboardEmployee-status">
                                <div></div>
                                <span>Active</span>
                            </div>
                            <div className="dashboardEmployee-actions">
                                <div className="dashboardEmployee-view">
                                    <FaEyeSlash style={{color: "#479ef5", fontSize: "14px"}} />
                                    <span style={{color: "#50bbf5"}}>View</span>
                                </div>
                                <div>
                                    <MdEdit style={{color: "#f8845d", fontSize: "14px"}} />
                                    <span style={{color: "#5bbaa7"}}>Edit</span>
                                </div>
                                <div>
                                    <MdDelete style={{color: "#c44261", fontSize: "14px"}} />
                                </div>
                                <div>
                                    <FaKey style={{color: "#fdcb4b", fontSize: "12px"}} />
                                </div>
                            </div>
                        </div>
                        <div className="employee-users-container">
                            <div className="dashboardEmployee-information">
                                <div className="dashboardEmploye-avatar">SM</div>
                                <div className="dashboardEmployee-name">
                                    <p>Sarah Mitchell</p>
                                    <span>ID #0001</span>
                                </div>
                            </div>
                            <div className="dashboardEmployee-department">Design</div>
                            <div className="dashboardEmployee-designation">Senior Designer</div>
                            <div className="dashboardEmployee-role">Admin</div>
                            <div className="dashboardEmployee-status">
                                <div></div>
                                <span>Inactive</span>
                            </div>
                            <div className="dashboardEmployee-actions">
                                <div className="dashboardEmployee-view">
                                    <FaEyeSlash style={{color: "#479ef5", fontSize: "14px"}} />
                                    <span style={{color: "#50bbf5"}}>View</span>
                                </div>
                                <div>
                                    <MdEdit style={{color: "#f8845d", fontSize: "14px"}} />
                                    <span style={{color: "#5bbaa7"}}>Edit</span>
                                </div>
                                <div>
                                    <MdDelete style={{color: "#c44261", fontSize: "14px"}} />
                                </div>
                                <div>
                                    <FaKey style={{color: "#fdcb4b", fontSize: "12px"}} />
                                </div>
                            </div>
                        </div>
                        <div style={{border: "none"}} className="employee-users-container">
                            <div className="dashboardEmployee-information">
                                <div className="dashboardEmploye-avatar">SM</div>
                                <div className="dashboardEmployee-name">
                                    <p>Sarah Mitchell</p>
                                    <span>ID #0001</span>
                                </div>
                            </div>
                            <div className="dashboardEmployee-department">Design</div>
                            <div className="dashboardEmployee-designation">Senior Designer</div>
                            <div className="dashboardEmployee-role">Admin</div>
                            <div className="dashboardEmployee-status">
                                <div></div>
                                <span>Active</span>
                            </div>
                            <div className="dashboardEmployee-actions">
                                <div className="dashboardEmployee-view">
                                    <FaEyeSlash style={{color: "#479ef5", fontSize: "14px"}} />
                                    <span style={{color: "#50bbf5"}}>View</span>
                                </div>
                                <div>
                                    <MdEdit style={{color: "#f8845d", fontSize: "14px"}} />
                                    <span style={{color: "#5bbaa7"}}>Edit</span>
                                </div>
                                <div>
                                    <MdDelete style={{color: "#c44261", fontSize: "14px"}} />
                                </div>
                                <div>
                                    <FaKey style={{color: "#fdcb4b", fontSize: "12px"}} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}