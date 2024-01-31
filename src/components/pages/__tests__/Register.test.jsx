import { describe, expect, test, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import Register from "../Register";
import userEvent from "@testing-library/user-event";
import { AuthProvider } from "../../../contexts/AuthContext";
import * as firebaseGateway from "../../../gateways/firebase";
import * as helpers from "../../../utils/helpers";

const renderRegister = () => {
  return render(
    <AuthProvider>
      <Router>
        <Register />
      </Router>
    </AuthProvider>
  );
};

describe("Register component", () => {
  beforeEach(() => vi.spyOn(helpers, "generateUUID").mockReturnValue("ZXC"));

  test("should render", () => {
    renderRegister();

    expect(screen.getByText("Username")).toBeInTheDocument();
    expect(screen.getByLabelText("username-input")).toBeInTheDocument();
    expect(
      screen.queryByText("Username should have at least 3 characters")
    ).not.toBeInTheDocument();

    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("email-input")).toBeInTheDocument();
    expect(screen.queryByText("Email format invalid")).not.toBeInTheDocument();

    expect(screen.getByText("Password")).toBeInTheDocument();
    expect(screen.getByLabelText("password-input")).toBeInTheDocument();
    expect(
      screen.queryByText("Password should have at least 6 characters")
    ).not.toBeInTheDocument();

    expect(screen.getByText("Confirm Password")).toBeInTheDocument();
    expect(screen.getByLabelText("confirm-password-input")).toBeInTheDocument();
    expect(screen.queryByText("Passwords not match")).not.toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Register" })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Register" })).toBeDisabled();

    expect(screen.getByText("Already have an account?")).toBeInTheDocument();
    expect(screen.getByText("Login here.")).toBeInTheDocument();
  });

  test("should render error field for each invalid input only one at time", () => {
    renderRegister();

    userEvent.type(screen.getByLabelText("username-input"), "as");
    userEvent.type(screen.getByLabelText("email-input"), "mail@pt");
    userEvent.type(screen.getByLabelText("password-input"), "12312");
    userEvent.type(screen.getByLabelText("confirm-password-input"), "12312");
    userEvent.click(screen.getByRole("button", { name: "Register" }));

    // show username fiel error
    expect(
      screen.getByText("Username should have at least 3 characters")
    ).toBeInTheDocument();
    expect(screen.queryByText("Email format invalid")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Password should have at least 6 characters")
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Passwords not match")).not.toBeInTheDocument();

    // fix username
    userEvent.clear(screen.getByLabelText("username-input"));
    userEvent.type(screen.getByLabelText("username-input"), "asd");
    userEvent.click(screen.getByRole("button", { name: "Register" }));

    // show email field error
    expect(
      screen.queryByText("Username should have at least 3 characters")
    ).not.toBeInTheDocument();
    expect(screen.getByText("Email format invalid")).toBeInTheDocument();
    expect(
      screen.queryByText("Password should have at least 6 characters")
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Passwords not match")).not.toBeInTheDocument();

    // fix email
    userEvent.clear(screen.getByLabelText("email-input"));
    userEvent.type(screen.getByLabelText("email-input"), "user@gmail.com");
    userEvent.click(screen.getByRole("button", { name: "Register" }));

    // show password field error
    expect(
      screen.queryByText("Username should have at least 3 characters")
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Email format invalid")).not.toBeInTheDocument();
    expect(
      screen.getByText("Password should have at least 6 characters")
    ).toBeInTheDocument();
    expect(screen.queryByText("Passwords not match")).not.toBeInTheDocument();

    // fix password
    userEvent.clear(screen.getByLabelText("password-input"));
    userEvent.type(screen.getByLabelText("password-input"), "123123");
    userEvent.click(screen.getByRole("button", { name: "Register" }));

    // show confirm password field error
    expect(
      screen.queryByText("Username should have at least 3 characters")
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Email format invalid")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Password should have at least 6 characters")
    ).not.toBeInTheDocument();
    expect(screen.getByText("Passwords not match")).toBeInTheDocument();

    // fix confirm password
    userEvent.clear(screen.getByLabelText("confirm-password-input"));
    userEvent.type(screen.getByLabelText("confirm-password-input"), "123123");
    userEvent.click(screen.getByRole("button", { name: "Register" }));

    // show confirm password field error
    expect(
      screen.queryByText("Username should have at least 3 characters")
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Email format invalid")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Password should have at least 6 characters")
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Passwords not match")).not.toBeInTheDocument();
  });

  test("should render loading when sending the register request", () => {
    renderRegister();

    expect(
      screen.getByRole("button", { name: "Register" })
    ).toBeInTheDocument();

    userEvent.type(screen.getByLabelText("username-input"), "asd");
    userEvent.type(screen.getByLabelText("email-input"), "mail@gmail.com");
    userEvent.type(screen.getByLabelText("password-input"), "123123");
    userEvent.type(screen.getByLabelText("confirm-password-input"), "123123");

    userEvent.click(screen.getByRole("button", { name: "Register" }));

    expect(screen.getByRole("status")).toBeInTheDocument(); // loading
    expect(
      screen.queryByRole("button", { name: "Register" })
    ).not.toBeInTheDocument();
  });

  test("should render the success message when register request succeeds", async () => {
    const updateAuthByUserNameSpy = vi.spyOn(
      firebaseGateway,
      "updateAuthByUserName"
    );

    renderRegister();

    expect(
      screen.getByRole("button", { name: "Register" })
    ).toBeInTheDocument();

    userEvent.type(screen.getByLabelText("username-input"), "user123");
    userEvent.type(screen.getByLabelText("email-input"), "mail@gmail.com");
    userEvent.type(screen.getByLabelText("password-input"), "123123");
    userEvent.type(screen.getByLabelText("confirm-password-input"), "123123");

    userEvent.click(screen.getByRole("button", { name: "Register" }));

    expect(
      await screen.findByText("User registration succeeded")
    ).toBeInTheDocument();

    expect(updateAuthByUserNameSpy).toHaveBeenCalledTimes(1);
    expect(updateAuthByUserNameSpy).toHaveBeenCalledWith({
      data: {
        email: "mail@gmail.com",
        id: "ZXC",
        pass: "MTIzMTIz",
        userName: "user123",
      },
      userName: "user123",
    });
  });
});
