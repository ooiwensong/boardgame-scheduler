import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import Root from "./routes/Root.jsx";
import Login from "./routes/Login.jsx";
import Register from "./routes/Register.jsx";
import { action as loginAction } from "./routes/Login.jsx";
import { action as registerAction } from "./routes/Register.jsx";
import { loader as rootLoader } from "./routes/Root.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    loader: rootLoader,
    children: [
      {
        index: true,
        element: <h1>Home</h1>,
      },
      {
        path: "find-session",
        element: <h1>Find a Session</h1>,
      },
      {
        path: "profile/:userId",
        element: <h1>User Profile</h1>,
      },
      {
        path: "profile/:userId/session/:sessionId",
        element: <h1>User Session</h1>,
      },
      {
        path: "create",
        element: <h1>Create a Session</h1>,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
    action: loginAction,
  },
  {
    path: "/register",
    element: <Register />,
    action: registerAction,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
