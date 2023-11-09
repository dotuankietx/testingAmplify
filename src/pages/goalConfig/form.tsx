import { useTranslate } from "@refinedev/core";
import { Form, Input, Select } from "antd";
import { memo, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { GoalType } from "../../constants/goalConfig";
import { showToast } from "../../utils/toast";

interface Props {
  formProps: any;
}
const CrudFormComponent = ({ formProps }: Props) => {
  const translate = useTranslate();
  const [initialValues, setInitialValues] = useState<any>({});

  const processValues = (values: any) => {
    return values;
  };

  const onFinish = async (values: any) => {
    try {
      formProps?.onFinish(values);
    } catch (error) {
      console.log(error);
      toast.dismiss();
      showToast(translate("upload_image.error"), "error");
    }
  };

  useEffect(() => {
    if (formProps?.initialValues?._id && !initialValues?._id) {
      formProps.form.setFieldsValue(processValues(formProps?.initialValues));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formProps.initialValues]);

  useEffect(() => {
    return () => {
      setInitialValues({});
      formProps?.form?.resetFields();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {formProps?.form && (
        <Form
          {...formProps}
          initialValues={processValues(formProps?.initialValues)}
          onFinish={onFinish}
          layout="horizontal"
        >
          <Form.Item
            label={"Goal Type"}
            name={["type"]}
            rules={[
              {
                required: true,
              },
            ]}
            labelAlign="left"
            labelCol={{ span: 8 }}
            shouldUpdate={(prevValues: any, curValues: any) =>
              prevValues.botType !== curValues.botType
            }
          >
            <Select>
              {Object.values(GoalType).map((type) => (
                <Select.Option key={type} value={type}>
                  {type}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label={"Key"}
            name={["key"]}
            rules={[
              {
                required: true,
              },
            ]}
            labelAlign="left"
            labelCol={{ span: 8 }}
            shouldUpdate={(prevValues: any, curValues: any) =>
              prevValues.key !== curValues.key
            }
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={"Value"}
            name={["value"]}
            rules={[
              {
                required: true,
              },
            ]}
            labelAlign="left"
            labelCol={{ span: 8 }}
            shouldUpdate={(prevValues: any, curValues: any) =>
              prevValues.value !== curValues.value
            }
          >
            <Input />
          </Form.Item>
        </Form>
      )}
    </>
  );
};

export const CrudForm = memo(CrudFormComponent);
