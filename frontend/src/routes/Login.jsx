import { loginUser } from "@/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import React, { useState } from "react";
import { Form, Link, redirect, useActionData } from "react-router-dom";

export const action = async ({ request }) => {
  const loginData = Object.fromEntries(await request.formData());
  const errors = {};

  if (loginData.email === "") {
    errors.email = "Email field cannot be empty!";
  }

  if (loginData.password === "") {
    errors.password = "Password field cannot be empty!";
  }

  if (Object.keys(errors).length) {
    return errors;
  }

  try {
    const res = await loginUser(loginData);
    if (res.status === "ok") {
      return redirect("/");
    } else {
      errors.failed = "Login unsuccessful. " + res.msg;
      return errors;
    }
  } catch (error) {
    console.log(error.message);
  }
};

const Login = () => {
  const errors = useActionData();
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  const { toast } = useToast();

  return (
    <div className="container flex h-screen">
      <div id="login-card" className="mx-auto my-11 w-[350px]">
        <Form method="put">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="mb-5 text-center text-4xl">Bord</CardTitle>
            </CardHeader>
            <CardContent>
              {errors?.failed && (
                <small className="text-red-500">{errors.failed}</small>
              )}
              <div>
                <Input
                  type="text"
                  name="email"
                  placeholder="Email"
                  onChange={(e) => setEmailInput(e.target.value)}
                />
              </div>
              {errors?.email && !emailInput && (
                <small className="text-red-500">{errors.email}</small>
              )}
              <div className="mt-2">
                <Input
                  type="password"
                  name="password"
                  placeholder="Password"
                  onChange={(e) => setPasswordInput(e.target.value)}
                />
              </div>
              {errors?.password && !passwordInput && (
                <small className="text-red-500">{errors.password}</small>
              )}
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full bg-blue-400 text-white hover:bg-blue-500"
              >
                Log in
              </Button>
            </CardFooter>
          </Card>
        </Form>

        <Card className="mt-5 w-full py-1">
          <CardContent>
            <div className="flex p-0 text-center">
              <p className="justify-center text-center">
                Don't have an account?{" "}
                <Link to="/register">
                  <span className="font-semibold text-blue-400">Sign up</span>
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
