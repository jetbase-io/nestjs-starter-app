import React, { FC } from "react";
import { Create, SimpleForm, TextInput, DateTimeInput, required } from "react-admin";

export const CreateComponent: FC = () => (
  <Create>
    <SimpleForm>
      <TextInput label="Title" source="title" validate={[required()]} />
      <TextInput multiline label="Description" source="description" validate={[required()]} />
      <DateTimeInput label="Publication Date" source="published_at" />
    </SimpleForm>
  </Create>
);
