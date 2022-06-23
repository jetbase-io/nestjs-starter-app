import React, { FC } from "react";
import { Datagrid, List, TextField } from "react-admin";

const UserList: FC = () => {
  return (
    <List>
      <Datagrid rowClick="edit">
        <TextField source="id" />
        <TextField source="username" />
      </Datagrid>
    </List>
  );
};

export default UserList;
