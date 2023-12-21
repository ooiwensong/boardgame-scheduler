import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./index.css";
import Root from "./routes/Root.jsx";
import Login from "./routes/Login.jsx";
import Register from "./routes/Register.jsx";
import Index from "./routes/Index.jsx";
import { action as loginAction } from "./routes/Login.jsx";
import { action as registerAction } from "./routes/Register.jsx";
import { loader as rootLoader } from "./routes/Root.jsx";
import FindSessions from "./routes/FindSessions.jsx"; // loader as findSessionsLoader,
import Profile from "./routes/Profile.jsx";
import Session from "./routes/Session.jsx";
import Create from "./routes/Create.jsx";
import Edit from "./routes/Edit.jsx";
import Admin from "./routes/Admin.jsx";
import ErrorPage from "./components/ErrorPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    id: "root",
    errorElement: <ErrorPage />,
    loader: rootLoader,
    children: [
      {
        index: true,
        element: <Index />,
      },
      {
        path: "find-session",
        element: <FindSessions />,
      },
      {
        path: "profile/:userId",
        element: <Profile />,
      },
      {
        path: "profile/:userId/session/:sessionId",
        element: <Session />,
      },
      {
        path: "profile/:userId/session/:sessionId/edit",
        element: <Edit />,
      },
      {
        path: "create",
        element: <Create />,
      },
      {
        path: "admin",
        element: <Admin />,
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
