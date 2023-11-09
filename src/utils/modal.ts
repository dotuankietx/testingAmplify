import { ModalProps } from "antd";
import { FormProps } from "antd/lib";

export const onModalCancel = (props: ModalProps, formProps: FormProps) => {
  const event = new Event("cancel");
  props?.onCancel && props.onCancel(event as any);
  formProps.form?.resetFields();
  formProps.initialValues = undefined;
};
