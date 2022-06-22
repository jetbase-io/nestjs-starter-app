import { fetchUtils } from "react-admin";

import { getAccessToken } from "./helpers/auth";

const httpClient = (url: string, options: any) => {
  const token = getAccessToken();
  options.headers.set("Authorization", `Bearer ${token}`);
  return fetchUtils.fetchJson(url, options);
};

export default httpClient;
