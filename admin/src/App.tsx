import "./App.css";

import simpleRestProvider from "ra-data-simple-rest";
import React from "react";
import { Admin, Resource } from "react-admin";

import authProvider from "./auth/auth-provider";
import httpClient from "./auth/http-client";
import UserList from "./components/UserList";

const dataProvider = simpleRestProvider(process.env.REACT_APP_API_URL || "", httpClient);

function App() {
  return (
    <Admin dataProvider={dataProvider} authProvider={authProvider}>
      <Resource name="users" list={UserList} options={{}} />
    </Admin>
  );
}

export default App;
