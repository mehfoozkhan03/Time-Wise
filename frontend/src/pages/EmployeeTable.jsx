import "./EmployeeTable.css";
import { useNavigate } from "react-router-dom";

function EmployeeTable() {

    const navigate = useNavigate();

    const employees = [

        {
            id: "EMP001",
            name: "Khushi Yadav",
            email: "khushiyadav22@gmail.com",
            role: "Employee",
            department: "Development"
        },

        {
            id: "EMP002",
            name: "Rahul Sharma",
            email: "rahul@gmail.com",
            role: "Employee",
            department: "HR"
        },

        {
            id: "EMP003",
            name: "Deepak Yadav",
            email: "deepak@gmail.com",
            role: "Employee",
            department: "Frontend"
        }

    ];

    return (

        <div className="employee-page">

            <div className="employee-header">

                <h2>Employees</h2>

                <input
                    type="text"
                    placeholder="Search Employee..."
                />

            </div>

            <table>

                <thead>

                    <tr>

                        <th>Employee ID</th>

                        <th>Name</th>

                        <th>Email</th>

                        <th>Role</th>

                        <th>Department</th>

                        <th>View</th>

                    </tr>

                </thead>

                <tbody>

                    {

                        employees.map((emp)=>{

                            return(

                                <tr key={emp.id}>

                                    <td>{emp.id}</td>

                                    <td>{emp.name}</td>

                                    <td>{emp.email}</td>

                                    <td>{emp.role}</td>

                                    <td>{emp.department}</td>

                                    <td>

                                        <button
                                            className="view-btn"
                                            onClick={()=>navigate("/employee-details")}
                                        >

                                            View

                                        </button>

                                    </td>

                                </tr>

                            )

                        })

                    }

                </tbody>

            </table>

        </div>

    );

}

export default EmployeeTable;