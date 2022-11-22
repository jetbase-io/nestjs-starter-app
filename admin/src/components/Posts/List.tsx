import React, { FC } from "react";
import { CreateButton, Datagrid, EditButton, List, ListActions, TextField } from "react-admin";

export const ListComponent: FC = () => {
  return (
    <List actions={<ListActions />}>
      <Datagrid rowClick="show">
        <TextField source="title" />
        <TextField source="description" />
        <TextField source="published_at" />
        <EditButton />
      </Datagrid>
    </List>
  );
};
