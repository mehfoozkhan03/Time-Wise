// import React from "react";
// import { Form } from "../components/Form";
// import { forms } from "../data/form";

// export const AdminLogin = () => {
//     return (
//         <Form
//           {...forms?.admin} 
//         />
//     );
// }; 

import React from "react";
import { Form } from "../components/Form";
import { forms } from "../data/form";

export const AdminLogin = () => {
  return (
    <div className="sing_login">
      <div className="login-page">

        <h2>Admin Login</h2>

        <Form {...forms.admin} />

      </div>
    </div>
  );
};