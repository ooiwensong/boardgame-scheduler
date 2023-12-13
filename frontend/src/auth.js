const loginUser = async (loginData) => {
  try {
    const res = await fetch(import.meta.env.VITE_SERVER + "/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      return { status: "ok", msg: "login successful" };
    } else {
      console.log(data.msg);
      return data;
    }
  } catch (error) {
    console.log(error.message);
  }
};

const registerUser = async (signUpData) => {
  try {
    const res = await fetch(import.meta.env.VITE_SERVER + "/auth/register", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(signUpData),
    });
    const data = await res.json();
    if (res.ok) {
      return { status: "ok", msg: "user created successfully" };
    } else {
      return data;
    }
  } catch (error) {
    console.log(error.message);
  }
};

export { loginUser, registerUser };
