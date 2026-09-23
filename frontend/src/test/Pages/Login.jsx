import React from "react";
import { Form } from "../Components/Form";
import { login as data } from "../Data/form";

export const Login = () => {
    return (
        <Form
            props={data}
            button="Login"
            endpoint="/user/login"
        />
    );
};