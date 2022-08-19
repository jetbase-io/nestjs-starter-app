import React, { FC } from "react";
import { Datagrid, List, TextField } from "react-admin";

export const ListComponent: FC = () => {
  return (
    <List>
      <Datagrid rowClick="edit">
        <TextField source="id" />
        <TextField source="username" />
      </Datagrid>
    </List>
  );
};
