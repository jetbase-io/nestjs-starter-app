import React, { FC } from "react";
import { Show, SimpleShowLayout, TextField, DateField, RichTextField } from "react-admin";

export const ShowComponent: FC = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="title" />
      <RichTextField source="description" />
      <DateField label="Publication date" source="published_at" />
      <DateField label="Created at" source="created_at" />
      <DateField label="Updated at" source="updated_at" />
      <TextField source="internalComment" />
    </SimpleShowLayout>
  </Show>
);
