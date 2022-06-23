import "./App.css";

import jsonServerProvider from "ra-data-json-server";
import React from "react";
import { Admin, Resource } from "react-admin";

import UserList from "./components/UserList";

const dataProvider = jsonServerProvider(process.env.REACT_APP_API_URL);

function App() {
  return (
    <Admin dataProvider={dataProvider}>
      <Resource name="users" list={UserList} options={{}} />
    </Admin>
  );
}

export default App;
