import React from "react";
import LogoutButton from "../components/ui/LogoutButton";
import LoggedInNavbar from "../components/LoggedInNavbar";

function Dashboard() {
  return (
    <>
      <div>Dashboard</div>
      <LogoutButton />
      <LoggedInNavbar />
    </>
  );
}

export default Dashboard;
