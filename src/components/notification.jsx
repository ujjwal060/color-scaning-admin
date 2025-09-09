// src/utils/notification.js
import { message } from "antd";

let messageApi;

export const NotificationProvider = ({ children }) => {
  const [api, contextHolder] = message.useMessage();
  messageApi = api;

  return (
    <>
      {contextHolder}
      {children}
    </>
  );
};

// helper function to trigger notifications globally
export const notify = (type, content) => {
  if (messageApi) {
    messageApi.open({
      type,
      content,
    });
  } else {
    console.error("NotificationProvider not mounted!");
  }
};
