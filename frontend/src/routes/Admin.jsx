import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { useNavigate, useRouteLoaderData } from "react-router-dom";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const { userCtx, accessToken } = useRouteLoaderData("root");
  const navigate = useNavigate();

  const getUsers = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_SERVER + "/admin/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const makeAdmin = async (userId) => {
    try {
      const res = await fetch(import.meta.env.VITE_SERVER + "/admin/users", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          userId,
          role: "ADMIN",
        }),
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const deleteUser = async (userId) => {
    try {
      const res = await fetch(import.meta.env.VITE_SERVER + "/admin/users", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ userId }),
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (userCtx.role !== "ADMIN") {
      navigate("/");
    }
    getUsers();
  }, []);

  return (
    <>
      <div
        id="admin-content-wrapper"
        className="container mb-5 mt-10 max-w-5xl"
      >
        <div id="admin-content-header">
          <h1 className="mt-10 text-4xl font-bold">Admin dashboard</h1>
        </div>
        <div id="admin-content-body" className="mt-8">
          <div id="admin-dashboard" className="flex flex-col space-y-5">
            {users.map((user) => (
              <div
                key={user.uuid}
                id="admin-user-card"
                className="border-1 flex flex-col space-y-1 rounded-md border border-gray-300 p-3"
              >
                <div>
                  <strong>Email: </strong> {user.email}
                </div>
                {user.username && (
                  <div>
                    <strong>Username: </strong>
                    {user.username}
                  </div>
                )}
                <div>
                  <strong>Role: </strong>
                  {user.role}
                </div>
                <div>
                  <strong>Joined on: </strong>
                  {format(new Date(user.created_at), "d MMM yyyy")}
                </div>
                <Button
                  variant="outline"
                  disabled={user.role === "ADMIN"}
                  onClick={() => {
                    makeAdmin(user.uuid);
                    getUsers();
                  }}
                >
                  Make Admin
                </Button>
                <Button
                  onClick={() => {
                    deleteUser(user.uuid);
                    getUsers();
                  }}
                >
                  Delete User
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Admin;
