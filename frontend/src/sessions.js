const getMySessions = async (userId, accessToken) => {
  try {
    const res = await fetch(
      import.meta.env.VITE_SERVER + "/api/sessions/my-sessions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ userId }),
      },
    );
    const data = await res.json();

    if (res.ok) {
      return data;
    } else {
      console.log(data.msg);
      return data;
    }
  } catch (error) {
    console.log(error.message);
  }
};

export { getMySessions };
