import "./CosmosDashboard.scss";
import React from "react";
import { NotificationItem } from "@pushprotocol/uiweb";
import { pushRestApi } from "../../middleware/pushApi";
import { CosmosLoading } from "../../shared/CosmosLoading";
import { useAuth, useDashboardInfo } from "../../hooks/context";
import { Navigate } from "react-router-dom";

export function CosmosDashboard() {
  const auth = useAuth();
  const dashboardInfo = useDashboardInfo();
  const [loading, setLoading] = React.useState(true);
  const [notifications, setNotifications] = React.useState();
  const { getNotifications } = pushRestApi();

  const info = async () => {
    console.log("getUserInfo: ", await dashboardInfo.getUserInfo);
    console.log("getChainId: ", await dashboardInfo.getChainId);
    console.log("account: ", await dashboardInfo.getAccounts);
    console.log("getBalance: ", await dashboardInfo.getBalance);
    console.log("getPrivateKey: ", await dashboardInfo.getPrivateKey);
  };

  React.useEffect(() => {
    getNotifications(auth.user.walletAddress).then((response) => {
      setNotifications(response);
      setLoading(false);
    });
    info();
  }, []);

  if (auth.user.walletAddress === "Connect wallet") {
    return <Navigate to="/" />;
  }

  return (
    <React.Fragment>
      {loading ? (
        <div className="main__loading">
          <CosmosLoading />
        </div>
      ) : (
        <div className="dashboard">
          <div className="dashboard-notifications">
            {notifications.map((oneNotification, index) => {
              const {
                cta,
                title,
                message,
                app,
                icon,
                image,
                url,
                blockchain,
                notification,
              } = oneNotification;

              return (
                <NotificationItem
                  key={index}
                  notificationTitle={title}
                  notificationBody={message}
                  cta={cta}
                  app={app}
                  icon={icon}
                  image={image}
                  url={url}
                  theme="dark"
                  chainName={blockchain}
                  notification={notification}
                />
              );
            })}
          </div>
        </div>
      )}
    </React.Fragment>
  );
}
