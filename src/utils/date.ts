import dayjs from "dayjs";

export const disabledPastDate = (current: any) => {
  // Can not select days before today
  return current < dayjs().subtract(1, "day").endOf("day");
};

export const disabledDateBefore = (current: any, date: any) => {
  console.log(date);
  // Can not select days before today
  return current < date.endOf("day");
};