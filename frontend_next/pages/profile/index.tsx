import { Button } from "@mui/material";
import Link from "next/link";
import React from "react";

import { PROFILE_ROUTE_UPDATE_USER_AVATAR, PROFILE_ROUTE_UPDATE_USERNAME } from "../../store/constants/route-constants";

export default function ProfilePage() {
  return (
    <>
      <div>ProfilePage</div>
      <div>
        <Link href={PROFILE_ROUTE_UPDATE_USERNAME}>Change Username</Link>
      </div>
      <div>
        <Link href={PROFILE_ROUTE_UPDATE_USER_AVATAR}>Change Avatar</Link>
      </div>
    </>
  );
}
