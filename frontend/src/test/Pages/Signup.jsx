import React from "react";
import { Form } from "../Components/Form";
import { signup as data } from "../Data/form";

export const Signup = () => {
    return (
        <Form
            props={data}
            button="Signup"
            endpoint="/user/signup"
        />
    );
};