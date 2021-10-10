import { useState } from "react";

function LoginForm(props) {
  const [formData, setFormData] = useState({
    email: "patelvirendra62@gmail.com",
    password: "1234567890",
  });

  const handleFormSubmit = (event) => {
    console.log(event);
    event.preventDefault();
  };

  const handleOnChange = ({ target: { name, value } }) => {
    // if(name == 'email'){
    //     return setFormData({
    //         ...formData ,
    //         email : value
    //     })
    // }

    // if (name == "password") {
    //   return setFormData({
    //     ...formData,
    //     password: value,
    //   });
    // }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div>
      <h4>Login Form.</h4>
      <hr />{" "}
      <form onSubmit={handleFormSubmit}>
        <div className="mb-3">
          <label>Email address</label>
          <input
            name="email"
            type="email"
            onChange={handleOnChange}
            value={formData.email}
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input
            name="password"
            type="password"
            onChange={handleOnChange}
            value={formData.password}
            className="form-control"
          />
        </div>

        <button type="submit" className="btn btn-success">
          Login
        </button>
      </form>
    </div>
  );
}

export { LoginForm };
