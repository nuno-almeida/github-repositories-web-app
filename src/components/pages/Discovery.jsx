import { useContext } from "react";
import { MyBookmarksProvider } from "../../contexts/MyBookmarksContext";
import { UserSettingsProvider } from "../../contexts/UserSettingsContext";
import MyBookmarksSection from "../ui/discovery/MyBookmarksSection";
import ToggleTopicsSection from "../ui/discovery/ToggleTopicsSection";
import SelectedTopicsSection from "../ui/discovery/SelectedTopicsSection";
import AuthContext from "../../contexts/AuthContext";

export const Discovery = () => {
  const { user } = useContext(AuthContext);

  return (
    <MyBookmarksProvider userId={user.id}>
      <MyBookmarksSection />

      <UserSettingsProvider userId={user.id}>
        <ToggleTopicsSection />
        <SelectedTopicsSection />
      </UserSettingsProvider>
    </MyBookmarksProvider>
  );
};

export default Discovery;
