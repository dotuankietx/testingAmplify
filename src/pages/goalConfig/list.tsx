import { EditButton, List, useModalForm, useTable } from "@refinedev/antd";
import {
  BaseRecord,
  IResourceComponentsProps,
  useTranslate,
} from "@refinedev/core";
import { Modal, Space, Table } from "antd";
import React from "react";
import { errorProcessor } from "../../utils/error";
import { formatNumber, uuidLastStr } from "../../utils/format";
import { onModalCancel } from "../../utils/modal";
import { CrudForm } from "./form";

export const CrudList: React.FC<IResourceComponentsProps> = () => {
  const translate = useTranslate();
  const { tableProps } = useTable({
    resource: "goal-config",
    syncWithLocation: false,
  });

  const {
    modalProps: editModalProps,
    formProps: editFormProps,
    show: editModalShow,
    open: editModalOpen,
  } = useModalForm({
    resource: "goal-config",
    action: "edit",
    warnWhenUnsavedChanges: true,
    redirect: false,
    queryOptions: {
      refetchOnWindowFocus: false,
    },
    errorNotification: (data) => {
      return {
        message: translate("notifications.editError", {
          statusCode: data?.response?.status || -1,
        }),
        description: errorProcessor(data, translate),
        type: "error",
      };
    },
  });

  return (
    <>
      <List
        title={"Goal Config"}
        headerProps={{
          extra: <></>,
        }}
      >
        <div className="bg-[#f9fafb] rounded-lg !py-5 !px-5 min-h-[90vh]">
          <Table {...tableProps} rowKey="_id">
            <Table.Column
              dataIndex="_id"
              title="ID"
              width={80}
              render={(val) => uuidLastStr(val)}
            />
            <Table.Column dataIndex="type" title={"Type"} width={100} />
            <Table.Column dataIndex="key" title={"Key"} width={100} />
            <Table.Column
              dataIndex="value"
              title={"Value"}
              width={100}
              render={(val) => formatNumber(val)}
            />
            <Table.Column
              title={translate("field.actions")}
              dataIndex={translate("field.actions")}
              align="center"
              width={100}
              render={(_, record: BaseRecord) => (
                <Space>
                  <EditButton
                    hideText
                    size="small"
                    recordItemId={record._id}
                    icon={<i className="fa fa-edit text-[#0c6cb6]" />}
                    onClick={() => editModalShow(record._id)}
                  />
                </Space>
              )}
            />
          </Table>
        </div>
      </List>

      {editModalOpen && (
        <Modal
          {...editModalProps}
          centered
          maskClosable={false}
          title={"Edit Goal Config"}
          onCancel={() => onModalCancel(editModalProps, editFormProps)}
          className="crud-form-modal"
          wrapClassName="crud-form-wrap-modal"
        >
          <CrudForm formProps={editFormProps} />
        </Modal>
      )}
    </>
  );
};
