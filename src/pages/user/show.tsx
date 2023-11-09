import React from "react";
import { IResourceComponentsProps, useShow } from "@refinedev/core";
import { Show, TextField, DateField } from "@refinedev/antd";
import { Typography } from "antd";

const { Title } = Typography;

export const CrudShow: React.FC<IResourceComponentsProps> = () => {
	const { queryResult } = useShow();
	const { data, isLoading } = queryResult;
	const record = data?.data;

	return (
		<div className="bg-[#f9fafb] rounded-lg py-5 px-5 min-h-[90vh]">
			<Show isLoading={isLoading} title={"User Detail"}>
				<Title level={5}>ID</Title>
				<TextField value={record?._id ?? ""} />
				<Title level={5}>Name</Title>
				<TextField value={record?.name} />
				<DateField value={record?.createdAt} />
			</Show>
		</div>
	);
};
