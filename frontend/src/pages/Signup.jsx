import React from "react";
import { Form } from "../components/Form";
import { forms } from "../data/form"

export const Signup = () => {
    return (
        <Form
            {...forms?.signup}
        />
    );
};