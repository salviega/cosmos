import React from "react";
import * as PushAPI from "@pushprotocol/restapi";

export function pushRestApi() {
  const getNotifications = async (userAddress) => {
    return await PushAPI.user.getFeeds({
      user: `eip155:5:${userAddress}`,
      env: "staging",
    });
  };

  return { getNotifications };
}
