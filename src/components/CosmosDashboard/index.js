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
  const initialState = {
    name: "",
    email: "",
    chainId: "",
    wallet: "",
    balance: "",
    privateKey: "",
  };
  const [userInformation, setUserInformation] = React.useState(initialState);
  const { getNotifications } = pushRestApi();

  React.useEffect(() => {
    getNotifications(auth.user.walletAddress)
      .then(async (response) => {
        const userInfo = await dashboardInfo.getUserInfo;
        let balance = await dashboardInfo.getBalance;
        balance = parseFloat(balance);
        let user = {
          name: userInfo.name || null,
          email: userInfo.email || null,
          chainId: await dashboardInfo.getChainId,
          wallet: await dashboardInfo.getAccounts,
          balance: balance.toFixed(4),
          privateKey: (await dashboardInfo.getPrivateKey) || null,
        };
        Object.keys(user).map((attribute) => {
          if (user[attribute] === null) {
            delete user[attribute];
          }
        });

        setUserInformation(user);
        setNotifications(response);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
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
          <div className="dashboard-personal">
            {Object.values(userInformation)?.map((data, index) => (
              <p key={index}>{data}</p>
            ))}
          </div>
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
