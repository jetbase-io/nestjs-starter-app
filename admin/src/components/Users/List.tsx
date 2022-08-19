import React, { FC } from "react";
import { Datagrid, List, TextField } from "react-admin";

export const ListComponent: FC = () => {
  return (
    <List>
      <Datagrid rowClick="edit">
        <TextField source="username" />
        <TextField source="email" />
        <TextField source="roles" />
      </Datagrid>
    </List>
  );
};
