import React from "react";
import { Form } from "../Components/Form";
import { login as data } from "../Data/form";

export const AdminLogin = () => {
    return (
        <Form
            props={data}
            button="Admin Login"
            endpoint="/admin/login"
        />
    );
};