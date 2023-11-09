import React from "react";
import {
	IResourceComponentsProps,
	BaseRecord,
	useTranslate,
} from "@refinedev/core";
import {
	useTable,
	List,
	EditButton,
	DeleteButton,
	useModalForm,
} from "@refinedev/antd";
import { Table, Space, Modal, Button, Tooltip, Typography } from "antd";
import { CrudForm } from "./form";
import { uuidLastStr } from "../../utils/format";
import { errorProcessor } from "../../utils/error";
import { onModalCancel } from "../../utils/modal";

export const CrudList: React.FC<IResourceComponentsProps> = () => {
	const translate = useTranslate();
	const { tableProps } = useTable({
		resource: "training",
		syncWithLocation: false,
	});
	const {
		modalProps: createModalProps,
		formProps: createFormProps,
		show: createModalShow,
		open: createModalOpen,
	} = useModalForm({
		action: "create",
		redirect: false,
		resource: "training",
		errorNotification: (data) => {
			return {
				message: translate("notifications.createError", {
					statusCode: data?.response?.status || -1,
				}),
				description: errorProcessor(data, translate),
				type: "error",
			};
		},
	});

	const {
		modalProps: editModalProps,
		formProps: editFormProps,
		show: editModalShow,
		open: editModalOpen,
	} = useModalForm({
		resource: "training",
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
				title={"Training Data"}
				headerProps={{
					extra: <></>,
				}}
			>
				<div className="bg-[#f9fafb] rounded-lg !py-5 !px-5 min-h-[90vh]">
					<div className="!mb-3 flex justify-end w-full">
						<Tooltip title={translate("buttons.create")}>
							<Button
								onClick={() => createModalShow()}
								type="primary"
								icon={<i className="fa fa-plus" />}
							/>
						</Tooltip>
					</div>
					<Table {...tableProps} rowKey="_id">
						<Table.Column
							dataIndex="_id"
							title="ID"
							width={80}
							render={(val) => uuidLastStr(val)}
						/>
						<Table.Column
							dataIndex="botType"
							title={"Bot"}
							width={100}
							render={(val) => translate(`bot.type.${val}`)}
						/>
						<Table.Column dataIndex="role" title={"Role"} width={100} />
						<Table.Column
							dataIndex="prompt"
							title={"Prompt"}
							render={(val) => (
								<Typography.Paragraph className="!mb-0" ellipsis={{ rows: 2 }}>
									{val}
								</Typography.Paragraph>
							)}
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
									<DeleteButton
										hideText
										size="small"
										recordItemId={record._id}
										icon={<i className="fa fa-remove text-[#0c6cb6]" />}
										resource="trainings"
									/>
								</Space>
							)}
						/>
					</Table>
				</div>
			</List>
			{createModalOpen && (
				<Modal
					{...createModalProps}
					centered
					maskClosable={false}
					title={"Create Training Data"}
					onCancel={() => onModalCancel(createModalProps, createFormProps)}
					className="crud-form-modal"
					wrapClassName="crud-form-wrap-modal"
				>
					<CrudForm formProps={createFormProps} />
				</Modal>
			)}
			{editModalOpen && (
				<Modal
					{...editModalProps}
					centered
					maskClosable={false}
					title={"Edit Training Data"}
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
