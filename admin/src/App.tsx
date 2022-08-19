import "./App.css";

import React from "react";
import { Admin, Resource } from "react-admin";

import authProvider from "./auth/auth-provider";
import users from "./components/Users";
import { dataProvider } from "./dataProvider";

function App() {
  return (
    <Admin dataProvider={dataProvider} authProvider={authProvider}>
      <Resource name="users" {...users} />
    </Admin>
  );
}

export default App;
