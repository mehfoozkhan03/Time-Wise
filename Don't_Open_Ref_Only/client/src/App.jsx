import React, { useState } from "react";
import EmployeeTable from "./components/EmployeeTable";
import EmployeeDetails from "./components/EmployeeDetails";
import "./App.css";

function App() {
  const employees = [
    {
      id: "EMP001",
      name: "Rehmat Ali",
      email: "Rehmat@gmail.com",
      role: "Developer",
      department: "IT "
    },
    {
      id: "EMP002",
      name: "Arnab Kharade",
      email: "arnav@gmail.com",
      role: "Developer",
      department: "Engineering"
    },
    {
      id: "EMP003",
      name: "Deepak Yadav",
      email: "deepak@gmail.com",
      role: "Frontend Developer",
      department: "IT"
    },
    {
      id: "EMP004",
      name: "Afan Khan",
      email: "afan@gmail.com",
      role: "PHP Developer",
      department: "IT"
    }
  ];

  const [selectedEmployee, setSelectedEmployee] = useState(null);

  return (
    <div>
      {!selectedEmployee ? (
        <EmployeeTable
          employees={employees}
          onView={setSelectedEmployee}
        />
      ) : (
        <EmployeeDetails
          employee={selectedEmployee}
          goBack={() => setSelectedEmployee(null)}
        />
      )}
    </div>
  );
}

export default App;