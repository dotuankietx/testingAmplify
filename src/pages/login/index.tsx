import { useLogin } from "@refinedev/core";
import { Button, Form, Input } from "antd";

export const Login = () => {
	const { mutate: login, isLoading } = useLogin();

	const handleSubmit = (values: any) => {
		login(values);
	};

	return (
		<div className="min-h-screen bg-gray-100 flex flex-col justify-center sm:py-12">
			<div className="p-10 xs:p-0 mx-auto md:w-full md:max-w-md">
				<div className="bg-white shadow w-full rounded-lg divide-y divide-gray-200">
					<Form
						className="px-5 py-7"
						initialValues={{
							email: "",
							password: "",
						}}
						onFinish={handleSubmit}
					>
						<label className="font-semibold text-sm text-gray-600 pb-1 block">
							Email
						</label>
						<Form.Item name="email" rules={[{ required: true }]}>
							<Input type="text" />
						</Form.Item>
						<label className="font-semibold text-sm text-gray-600 pb-1 block">
							Password
						</label>
						<Form.Item name="password" rules={[{ required: true }]}>
							<Input type="password" />
						</Form.Item>
						<Button
							htmlType="submit"
							loading={isLoading}
							type="primary"
							className="w-full"
						>
							<span className="inline-block mr-2">Login</span>
						</Button>
					</Form>
				</div>
			</div>
		</div>
	);
};
