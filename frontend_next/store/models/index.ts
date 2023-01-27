import { Models } from "@rematch/core";

import { plan } from "./plan";
import { user } from "./user";

export interface RootModel extends Models<RootModel> {
  user: typeof user;
  plan: typeof plan;
}

export const models: RootModel = { user, plan };
