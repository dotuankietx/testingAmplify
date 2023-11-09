import { notification } from "antd";

export const showToast = (
  message: string,
  type: "success" | "error" | "warning" | "info" = "success",
  description = "",
  option: any = false
) => {
  if (!option) {
    option = {
      position: "topRight",
    };
  }
  switch (type) {
    case "success":
      notification.success({
        message,
        description,
        ...option,
      });
      break;
    case "error":
      notification.error({
        message,
        description,
        ...option,
      });
      break;
    case "warning":
      notification.warning({
        message,
        description,
        ...option,
      });
      break;
    case "info":
      notification.info({
        message,
        description,
        ...option,
      });
      break;
    default:
      notification.info({
        message,
        description,
        ...option,
      });
      break;
  }
};
