import { message } from "antd";
import React from "react";
//信息题示
const info = (type, text) => {
  if (type == "success") {
    message.success(text);
  }
  if (type === "error") {
    message.error(text);
  }
};

export default info;
