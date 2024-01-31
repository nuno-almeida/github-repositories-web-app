import { useContext } from "react";
import { Outlet } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import NavBarContext, { NavBarProvider } from "../../contexts/NavBarContext";
import NavBar from "../ui/NavBar";
import "./Home.scss";

const HomeContainer = () => {
  const { height } = useContext(NavBarContext);

  return (
    <div
      className="home-container"
      style={{
        ...(!!height && { paddingTop: height }),
      }}
    >
      <div className="p-4">
        <Outlet />
      </div>
    </div>
  );
};

const Home = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <NavBarProvider>
        <NavBar />
        <HomeContainer />
      </NavBarProvider>
    </QueryClientProvider>
  );
};

export default Home;
