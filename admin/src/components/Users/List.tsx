import React, { FC } from "react";
import { Datagrid, EditButton, List, TextField } from "react-admin";

export const ListComponent: FC = () => {
  return (
    <List>
      <Datagrid rowClick="show">
        <TextField source="username" />
        <TextField source="email" />
        <TextField source="roles" />
        <TextField source="created_at" />
        <EditButton />
      </Datagrid>
    </List>
  );
};
