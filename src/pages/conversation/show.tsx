import React from "react";
import { IResourceComponentsProps, useShow, useTranslate } from "@refinedev/core";
import { Show, TextField, DateField } from "@refinedev/antd";
import { Typography } from "antd";
import VestFocusingIcon from "../../components/icons/VestFocusingIcon";
import classNames from "classnames";

const { Title } = Typography;

export const CrudShow: React.FC<IResourceComponentsProps> = () => {
	const translate = useTranslate();
  const { queryResult } = useShow();
  const { data, isLoading } = queryResult;
  const record = data?.data;

  return (
    <div className="bg-[#f9fafb] rounded-lg py-5 px-5 min-h-[90vh]">
      <Show isLoading={isLoading} title={"Conversation"}>
        <Title level={5}>ID</Title>
        <TextField value={record?._id ?? ""} />
				<Title level={5}>Type</Title>
				<TextField value={translate(`bot.type.${record?.type}`)} />
        <Title level={5}>User Phone Number</Title>
        <TextField value={record?.userId?.phoneNumber} />
        <Title level={5}>Created At</Title>
        <DateField value={record?.createdAt} />
      </Show>
      <div className="justify-between flex flex-col h-[60vh] mt-3 p-5 bg-white shadow">
        <div className="overflow-y-scroll mobile:px-4 tablet:px-[120px] tab:px-[120px] py-4 px-2">
          {record?.messages && record?.messages.map((message: any) => (
            <div
              key={message.index}
              className={classNames(
                "flex items-start gap-[19.5px] mb-[20px]",
                "transition-all duration-300",
                {
                  "justify-start is-bot": message.role !== "assistant",
                  "justify-end": message.role === "assistant",
                }
              )}
            >
              <div
                className={classNames(
                  "px-[18px] py-[10px] max-w-[630px] whitespace-pre-line",
                  "transition-all duration-300 message-style",
                  "text-[15px] leading-5 text-[#0F0D15]",
                  message.role !== "assistant" &&
                    "bg-[#E6EFFF] rounded-tl-[10px] rounded-tr-none",
                  message.role === "assistant" && "bg-white rounded-tl-none"
                )}
              >
                {message.content}
              </div>
              {message.role === "assistant" && (
                <>
                  <div className="w-[55px] h-[55px]">
                    <VestFocusingIcon />
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
