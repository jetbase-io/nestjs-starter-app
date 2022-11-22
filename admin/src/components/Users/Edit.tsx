import React, { FC } from "react";
import { Edit, SimpleForm, TextInput, DateTimeInput, required } from "react-admin";

export const EditComponent: FC = () => (
  <Edit>
    <SimpleForm>
      <TextInput disabled label="Id" source="id" />
      <TextInput source="username" validate={required()} />
    </SimpleForm>
  </Edit>
);
