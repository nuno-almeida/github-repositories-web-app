import { describe, expect, test, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "../../../contexts/AuthContext";
import Login from "../Login";
import userEvent from "@testing-library/user-event";
import * as firebaseGateway from "../../../gateways/firebase";

const mockUseNavigate = vi.fn();
let mockImplementationUseLocation = {};

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useLocation: () => mockImplementationUseLocation,
    useNavigate: () => mockUseNavigate,
  };
});

const renderLogin = () => {
  return render(
    <AuthProvider>
      <Router>
        <Login />
      </Router>
    </AuthProvider>
  );
};

describe("Login component", () => {
  test("should render", () => {
    renderLogin();

    expect(screen.getByText("Username")).toBeInTheDocument();
    expect(screen.getByLabelText("username-input")).toBeInTheDocument();
    expect(screen.getByText("Password")).toBeInTheDocument();
    expect(screen.getByLabelText("password-input")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
    expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
    expect(screen.getByText("Click here to sign up.")).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "Login" })).toBeDisabled();
  });

  test("should render loading when sending the login request", async () => {
    vi.spyOn(firebaseGateway, "fetchAuthByUserName").mockResolvedValueOnce(
      null
    );

    renderLogin();

    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();

    userEvent.type(screen.getByLabelText("username-input"), "user.test");
    userEvent.type(screen.getByLabelText("password-input"), "123123");
    userEvent.click(screen.getByRole("button", { name: "Login" }));

    expect(screen.getByRole("status")).toBeInTheDocument(); // loading
    expect(
      screen.queryByRole("button", { name: "Login" })
    ).not.toBeInTheDocument();

    expect(
      await screen.findByText("Authentication failed")
    ).toBeInTheDocument();
  });

  test("should render the error message when login request failed due to invalid username", async () => {
    vi.spyOn(firebaseGateway, "fetchAuthByUserName").mockResolvedValueOnce(
      null
    );

    renderLogin();

    userEvent.type(screen.getByLabelText("username-input"), "john.doe");
    userEvent.type(screen.getByLabelText("password-input"), "123123");
    userEvent.click(screen.getByRole("button", { name: "Login" }));

    expect(
      await screen.findByText("Authentication failed")
    ).toBeInTheDocument();
  });

  test("should render the error message when login request failed due to invalid password", async () => {
    vi.spyOn(firebaseGateway, "fetchAuthByUserName").mockResolvedValueOnce({
      email: "john.doe@gmail.com",
      id: "2d21cb42526b4c119ab4c2952de3334d",
      pass: "123123",
      userName: "johndoe",
    });

    renderLogin();

    userEvent.type(screen.getByLabelText("username-input"), "johndoe");
    userEvent.type(screen.getByLabelText("password-input"), "123124");
    userEvent.click(screen.getByRole("button", { name: "Login" }));

    expect(
      await screen.findByText("Authentication failed")
    ).toBeInTheDocument();
  });

  describe("when the login request succeeded", () => {
    beforeEach(() =>
      vi.spyOn(firebaseGateway, "fetchAuthByUserName").mockResolvedValue({
        email: "john.doe@gmail.com",
        id: "2d21cb42526b4c119ab4c2952de3334d",
        pass: "MTIzMTIz",
        userName: "johndoe",
      })
    );

    test("should redirect to default route", async () => {
      renderLogin();

      userEvent.type(screen.getByLabelText("username-input"), "johndoe");
      userEvent.type(screen.getByLabelText("password-input"), "123123");
      userEvent.click(screen.getByRole("button", { name: "Login" }));

      await waitFor(() => expect(mockUseNavigate).toHaveBeenCalledTimes(1));
      expect(mockUseNavigate).toHaveBeenCalledWith("/");
    });

    test("should redirect to the route defined in replaceUrl parameter", async () => {
      mockImplementationUseLocation = {
        state: {
          replaceUrl: "/my-account",
        },
      };

      renderLogin();

      userEvent.type(screen.getByLabelText("username-input"), "user.test");
      userEvent.type(screen.getByLabelText("password-input"), "123123");
      userEvent.click(screen.getByRole("button", { name: "Login" }));

      await waitFor(() => expect(mockUseNavigate).toHaveBeenCalledTimes(1));
      expect(mockUseNavigate).toHaveBeenCalledWith("/my-account");
    });
  });
});
