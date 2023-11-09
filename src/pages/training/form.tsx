import { Form, Input, Select } from "antd";
import { useTranslate } from "@refinedev/core";
import toast from "react-hot-toast";
import { showToast } from "../../utils/toast";
import { memo, useEffect, useState } from "react";
import { BotType } from "../../constants/bot";

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
						label={"Bot Type"}
						name={["botType"]}
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
							{Object.values(BotType).map((type) => (
								<Select.Option key={type} value={type}>
									{translate(`bot.type.${type}`)}
								</Select.Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item
						label={"Role"}
						name={["role"]}
						rules={[
							{
								required: true,
							},
						]}
						labelAlign="left"
						labelCol={{ span: 8 }}
						shouldUpdate={(prevValues: any, curValues: any) =>
							prevValues.role !== curValues.role
						}
					>
						<Input />
					</Form.Item>
					<Form.Item
						label={"Prompt"}
						name={["prompt"]}
						rules={[
							{
								required: true,
							},
						]}
						labelAlign="left"
						labelCol={{ span: 8 }}
						shouldUpdate={(prevValues: any, curValues: any) =>
							prevValues.prompt !== curValues.prompt
						}
					>
						<Input.TextArea rows={5} />
					</Form.Item>
				</Form>
			)}
		</>
	);
};

export const CrudForm = memo(CrudFormComponent);
