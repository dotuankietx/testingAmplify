import React from "react";
import {
	IResourceComponentsProps,
	BaseRecord,
	useTranslate,
} from "@refinedev/core";
import { useTable, List, ShowButton, DeleteButton } from "@refinedev/antd";
import { Table, Space } from "antd";
import { uuidLastStr } from "../../utils/format";
import dayjs from "dayjs";

export const CrudList: React.FC<IResourceComponentsProps> = () => {
	const translate = useTranslate();
	const { tableProps } = useTable({
		resource: "conversation",
		syncWithLocation: false,
	});

	return (
		<>
			<List
				title={"Conversation Data"}
				headerProps={{
					extra: <></>,
				}}
			>
				<div className="bg-[#f9fafb] rounded-lg !py-5 !px-5 min-h-[90vh]">
					<Table {...tableProps} rowKey="_id">
						<Table.Column
							dataIndex="_id"
							title="ID"
							render={(val) => uuidLastStr(val)}
						/>
						<Table.Column
							dataIndex="userId"
							title={"User"}
							render={(val) => val.phoneNumber}
						/>
						<Table.Column
							dataIndex="botType"
							title={"Bot"}
							render={(val) => translate(`bot.type.${val}`)}
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
								<Space>
									<ShowButton
										resource="conversation"
										hideText
										size="small"
										recordItemId={record._id}
									/>
									<DeleteButton
										resource="conversation"
										hideText
										size="small"
										recordItemId={record._id}
									/>
								</Space>
							)}
						/>
					</Table>
				</div>
			</List>
		</>
	);
};
