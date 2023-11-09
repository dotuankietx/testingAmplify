export const errorProcessor = (error: any, translate: any) => {
  // Check error?.message is array
  const data = error?.response?.data;
  if (Array.isArray(data?.message)) {
    const errors = data?.message.map((item: any) => {
      const property = item?.property;
      const constraints = Object.keys(item?.constraints).map((constraint: any) =>
      translate(`error.${constraint}`)
      );
      return `${translate("error.field")} ${property}: ${constraints.join(
        ", "
      )}`;
    });
    return errors.join("\n");
  }
  return translate(`error.${data?.message}`);
};
