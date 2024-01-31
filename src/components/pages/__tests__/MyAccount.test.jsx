import { describe, expect, test, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MyAccount from "../MyAccount";
import { AuthProvider } from "../../../contexts/AuthContext";
import * as firebaseGateway from "../../../gateways/firebase";
import * as localStorageGateway from "../../../gateways/localStorage";

const mockGetAuthByUserName = () => {
  vi.spyOn(localStorageGateway, "localStorageGetItem").mockImplementation(
    (key) => {
      if (key === "login") {
        return "johndoe";
      }
    }
  );

  vi.spyOn(firebaseGateway, "fetchAuthByUserName").mockResolvedValue({
    email: "john.doe@gmail.com",
    id: "2d21cb42526b4c119ab4c2952de3334d",
    pass: "123123",
    userName: "johndoe",
  });
};

const renderMyAccount = () => {
  return render(
    <AuthProvider>
      <MyAccount />
    </AuthProvider>
  );
};

describe("MyAccount component", () => {
  test("should render", async () => {
    renderMyAccount();

    expect(screen.getByText("Username")).toBeInTheDocument();
    expect(screen.getByLabelText("username-input")).toBeInTheDocument();
    expect(screen.getByLabelText("username-input")).toHaveValue("");

    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("email-input")).toBeInTheDocument();
    expect(screen.getByLabelText("email-input")).toHaveValue("");

    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  test("should render with saved values", async () => {
    mockGetAuthByUserName();

    renderMyAccount();

    expect(await screen.findByLabelText("username-input")).toHaveValue(
      "johndoe"
    );
    expect(await screen.findByLabelText("email-input")).toHaveValue(
      "john.doe@gmail.com"
    );
  });

  test("should render error field for each invalid input only one at time", async () => {
    mockGetAuthByUserName();

    vi.spyOn(firebaseGateway, "deleteAuthByUserName").mockResolvedValue({});
    const mockUpdateAuthByUserName = vi
      .spyOn(firebaseGateway, "updateAuthByUserName")
      .mockResolvedValue({});

    renderMyAccount();

    userEvent.clear(screen.getByLabelText("username-input"));
    userEvent.type(screen.getByLabelText("username-input"), "as");

    userEvent.clear(screen.getByLabelText("email-input"));
    userEvent.type(screen.getByLabelText("email-input"), "mail@gmail");

    userEvent.click(screen.getByRole("button", { name: "Save" }));

    // show username fiel error
    expect(
      screen.getByText("Username should have at least 3 characters")
    ).toBeInTheDocument();
    expect(screen.queryByText("Email format invalid")).not.toBeInTheDocument();

    userEvent.type(screen.getByLabelText("username-input"), "asd");
    userEvent.click(screen.getByRole("button", { name: "Save" }));

    // show email fiel error
    expect(
      screen.queryByText("Username should have at least 3 characters")
    ).not.toBeInTheDocument();
    expect(screen.getByText("Email format invalid")).toBeInTheDocument();

    userEvent.type(screen.getByLabelText("email-input"), ".com");
    userEvent.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() =>
      expect(mockUpdateAuthByUserName).toHaveBeenCalledTimes(1)
    );

    // no error fields
    expect(
      screen.queryByText("Username should have at least 3 characters")
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Email format invalid")).not.toBeInTheDocument();
  });

  test("should update the inserted values", async () => {
    mockGetAuthByUserName();

    const mockUpdateAuthByUserName = vi
      .spyOn(firebaseGateway, "updateAuthByUserName")
      .mockResolvedValue({});

    renderMyAccount();

    expect(await screen.findByLabelText("username-input")).toHaveValue(
      "johndoe"
    );
    expect(await screen.findByLabelText("email-input")).toHaveValue(
      "john.doe@gmail.com"
    );

    userEvent.clear(screen.getByLabelText("username-input"));
    userEvent.type(screen.getByLabelText("username-input"), "new.user.test");

    userEvent.clear(screen.getByLabelText("email-input"));
    userEvent.type(screen.getByLabelText("email-input"), "new.user@mail.com");

    userEvent.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() =>
      expect(mockUpdateAuthByUserName).toHaveBeenCalledTimes(1)
    );

    expect(screen.getByLabelText("username-input")).toHaveValue(
      "new.user.test"
    );
    expect(screen.getByLabelText("email-input")).toHaveValue(
      "new.user@mail.com"
    );
  });
});
