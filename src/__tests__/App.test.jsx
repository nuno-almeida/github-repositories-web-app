import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi, beforeEach } from "vitest";
import App from "../App";
import { AuthProvider } from "../contexts/AuthContext";
import * as firebaseGateway from "../gateways/firebase";
import userEvent from "@testing-library/user-event";
import 'intersection-observer';

// mock used to simulate the user authentication data in context
const mockLocalStorageGetAuth = () => {
  vi.spyOn(firebaseGateway, "fetchAuthByUserName").mockResolvedValue({
    email: "john.doe@gmail.com",
    id: "2d21cb42526b4c119ab4c2952de3334d",
    pass: "MTIzMTIz",
    userName: "johndoe",
  });
};

const renderApp = () => {
  return render(
    <AuthProvider>
      <App />
    </AuthProvider>
  );
};

describe("App when user is not authenticated", () => {
  test("should render login", async () => {
    renderApp();

    expect(
      await screen.findByText("Don't have an account?")
    ).toBeInTheDocument();
  });

  test("should redirect to sign up page and back again to login", async () => {
    renderApp();

    // login
    expect(
      await screen.findByText("Don't have an account?")
    ).toBeInTheDocument();
    expect(window.location.pathname).toEqual("/login");

    userEvent.click(await screen.findByText("Click here to sign up."));

    // sign up
    expect(
      await screen.findByText("Already have an account?")
    ).toBeInTheDocument();
    expect(window.location.pathname).toEqual("/register");

    userEvent.click(screen.getByText("Login here."));

    // login
    expect(
      await screen.findByText("Don't have an account?")
    ).toBeInTheDocument();
    expect(window.location.pathname).toEqual("/login");
  });

  test("should go to discovery page after successful login", async () => {
    // user not authenticated
    mockLocalStorageGetAuth();

    renderApp();

    expect(
      await screen.findByText("Don't have an account?")
    ).toBeInTheDocument();
    expect(screen.queryByText("Discovery")).not.toBeInTheDocument();
    expect(window.location.pathname).toEqual("/login");

    userEvent.type(screen.getByLabelText("username-input"), "johndoe");
    userEvent.type(screen.getByLabelText("password-input"), "123123");
    userEvent.click(screen.getByRole("button", { name: "Login" }));

    expect(
      await screen.findByText("Discovery")
    ).toBeInTheDocument();
    expect(
      screen.queryByText("Don't have an account?")
    ).not.toBeInTheDocument();
    expect(window.location.pathname).toEqual("/");
  });
});

describe("App when user is authenticated", () => {
  const discoveryPageToBeRendered = async () => {
    const dicoveryHeader = await screen.findByText("Discovery");
    const myAccountHeader = await screen.findByText("My account");

    expect(dicoveryHeader).toBeInTheDocument();
    expect(dicoveryHeader).toHaveClass("text-decoration-underline");
    expect(screen.getByText("My Bookmarks")).toBeInTheDocument();
    expect(screen.getByText("Toggle topics to show")).toBeInTheDocument();
    expect(myAccountHeader).toBeInTheDocument();
    expect(myAccountHeader).not.toHaveClass("text-decoration-underline");
    expect(
      screen.queryByRole("button", { name: "Save" })
    ).not.toBeInTheDocument();
  };

  const myAccountPageToBeRendered = async () => {
    const dicoveryHeader = await screen.findByText("Discovery");
    const myAccountHeader = await screen.findByText("My account");

    expect(myAccountHeader).toHaveClass("text-decoration-underline");
    expect(myAccountHeader).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();

    expect(dicoveryHeader).toBeInTheDocument();
    expect(dicoveryHeader).not.toHaveClass("text-decoration-underline");
    expect(screen.queryByText("My Bookmarks")).not.toBeInTheDocument();
  };

  beforeEach(() => mockLocalStorageGetAuth({}));

  test("should render nav bar", async () => {
    renderApp();

    expect(await screen.findByText("Discovery")).toBeInTheDocument();
    expect(screen.getByText("My account")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  test("should render discovery page", async () => {
    renderApp();
    await discoveryPageToBeRendered();
    expect(window.location.pathname).toEqual("/");
  });

  test("should redirect to my-account page and back to discovery", async () => {
    renderApp();

    await discoveryPageToBeRendered();
    expect(window.location.pathname).toEqual("/");

    userEvent.click(screen.getByText("My account"));

    await myAccountPageToBeRendered();
    expect(window.location.pathname).toEqual("/my-account");

    userEvent.click(screen.getByText("Discovery"));

    await discoveryPageToBeRendered();
    expect(window.location.pathname).toEqual("/");
  });

  test("should redirect to login when logging out", async () => {
    renderApp();

    const logoutLink = await screen.findByText("Logout");
    expect(logoutLink).toBeInTheDocument();
    expect(window.location.pathname).toEqual("/");

    userEvent.click(logoutLink);

    expect(
      await screen.findByText("Don't have an account?")
    ).toBeInTheDocument();
    expect(screen.queryByText("Logout")).not.toBeInTheDocument();
    expect(window.location.pathname).toEqual("/login");
  });
});
