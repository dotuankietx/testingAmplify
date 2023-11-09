import React from "react";
import {
  IResourceComponentsProps,
  BaseRecord,
  useTranslate,
  CrudFilters,
} from "@refinedev/core";
import { useTable, List, ShowButton } from "@refinedev/antd";
import { Button, Form, Input, Table, Tooltip, message } from "antd";
import { uuidLastStr } from "../../utils/format";
import dayjs from "dayjs";
import { PhoneOutlined } from "@ant-design/icons";
import { axiosClient } from "../../dataProvider";

export const CrudList: React.FC<IResourceComponentsProps> = () => {
  const translate = useTranslate();
  const { tableProps, searchFormProps } = useTable({
    resource: "user",
    syncWithLocation: false,
    onSearch: (values: any) => {
      const filters: CrudFilters = [];
      filters.push({
        field: "phoneNumber",
        operator: "eq",
        value: values.phoneNumber,
      });
      return filters;
    },
  });

  const handleCopyOtpCode = async (record: BaseRecord) => {
    try {
      const res = await axiosClient.get(`/user/${record._id}/otp`);
      const { code } = res.data.data;
      if (!code) return message.error("No code found", 2);
      navigator.clipboard.writeText(code);
      message.success("Copied OTP code");
    } catch (error: any) {
      message.error(error?.response?.data?.message ?? "Error", 2);
    }
  };

  return (
    <>
      <List
        title={"User Data"}
        headerProps={{
          extra: <></>,
        }}
      >
        <div className="bg-[#f9fafb] rounded-lg !py-5 !px-5 min-h-[90vh]">
          <Form {...searchFormProps} layout="inline" className="!mb-3 !gap-y-3">
            <Form.Item
              name={["phoneNumber"]}
              labelAlign="left"
              labelCol={{ span: 8 }}
            >
              <Input placeholder={"Phone number"} className="min-w-[200px]" />
            </Form.Item>
            <Tooltip title={translate("buttons.filter")}>
              <Button
                type="primary"
                onClick={() => searchFormProps.form?.submit()}
                title="Filter"
              >
                Filter
              </Button>
            </Tooltip>
          </Form>
          <Table {...tableProps} rowKey="_id">
            <Table.Column
              dataIndex="_id"
              title="ID"
              render={(val) => uuidLastStr(val)}
            />
            <Table.Column
              dataIndex="name"
              title={translate("field.name")}
              filterSearch={true}
            />
            <Table.Column
              dataIndex="phoneNumber"
              title={"Phone number"}
              filterSearch={true}
            />
            <Table.Column
              dataIndex="role"
              title={"Role"}
              render={(val) => translate(`user.role.${val}`)}
            />
            <Table.Column
              dataIndex="createdAt"
              align="center"
              title={"Created At"}
              render={(value: any) =>
                value ? dayjs(value).format("DD/MM/YYYY") : ""
              }
            />
            <Table.Column
              title={translate("field.actions")}
              dataIndex={translate("field.actions")}
              align="center"
              render={(_, record: BaseRecord) => (
                <div className="flex items-center justify-center gap-x-2">
                  <ShowButton
                    resource="user"
                    hideText
                    size="small"
                    recordItemId={record._id}
                  />
                  <div
                    className="flex items-center justify-center w-6 h-6 rounded-[3px] cursor-pointer border border-[#d9d9d9] hover:border-[#3f96ff] hover:text-[#3f96ff]"
                    onClick={() => handleCopyOtpCode(record)}
                  >
                    <PhoneOutlined />
                  </div>
                </div>
              )}
            />
          </Table>
        </div>
      </List>
    </>
  );
};
