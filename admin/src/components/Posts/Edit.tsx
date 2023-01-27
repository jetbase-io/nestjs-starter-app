import React, { FC } from "react";
import { Edit, SimpleForm, TextInput, DateTimeInput, required } from "react-admin";

export const EditComponent: FC = () => (
  <Edit>
    <SimpleForm>
      <TextInput disabled label="Id" source="id" />
      <TextInput source="title" validate={required()} />
      <TextInput multiline source="description" validate={required()} />
      <DateTimeInput label="Publication date" source="published_at" />
    </SimpleForm>
  </Edit>
);
