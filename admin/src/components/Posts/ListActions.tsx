import React, { FC } from "react";
import { TopToolbar, FilterButton, CreateButton, ExportButton, Button, List } from "react-admin";
import IconEvent from "@mui/icons-material/Event";

export const ListActions: FC = () => (
  <TopToolbar>
    <FilterButton />
    <CreateButton />
    <ExportButton />
  </TopToolbar>
);
