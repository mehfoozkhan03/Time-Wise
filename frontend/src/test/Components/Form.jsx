import React from "react";
import { ApiCall } from "../Api/ApiCall";
import "../Style/Form.css";

export const Form = ({ props, button, endpoint }) => {
  const [form, setForm] = React.useState(() => {
    return props.reduce((acc, curr) => {
      acc[curr.name] = "";
      return acc;
    }, {});
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await ApiCall.post(endpoint, form);

      console.log("data", data);
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      {props.map((el) => (
        <div key={el.id}>
          {el.name !== "gender" ? (
            <>
              <label htmlFor={el.name}>{el.name}</label>

              <input
                type={el.type}
                name={el.name}
                placeholder={el.placeholder}
                value={form[el.name]}
                onChange={handleChange}
              />
            </>
          ) : (
            <>
              <label>{el.name}</label>

              <div className="gender">
                {Object.entries(el.typeOfGender).map(([key, value]) => (
                  <div key={key}>
                    <label htmlFor={`${el.name}-${key}`}>
                      {key}
                    </label>

                    <input
                      id={`${el.name}-${key}`}
                      name={el.name}
                      type={value.type}
                      value={key}
                      checked={form[el.name] === key}
                      onChange={handleChange}
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      ))}

      <button type="submit">
        {button}
      </button>
    </form>
  );
};