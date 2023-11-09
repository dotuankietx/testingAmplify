import { CrudFilter } from "@refinedev/core";
import { Select } from "antd";
import { memo, useEffect, useRef, useState } from "react";
import { axiosClient } from "../../dataProvider";
import useSelectStore from "../../stores/select";

interface Props {
  name: string;
  resource: string;
  optionLabel?: string;
  optionValue?: string;
  filters?: CrudFilter[];
  mapData?: (data: any) => any;
  classText?: string;
  value?: any;
  onChange?: (value: any) => void;
  placeholder?: string;
}
const SelectCustomComponent = ({
  name,
  resource,
  filters,
  mapData,
  optionLabel,
  optionValue,
  classText = "w-full",
  onChange,
  value,
  placeholder,
}: Props) => {
  const cacheKey = `${resource}-${JSON.stringify(filters)}`;
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState<any[]>([]);
  const isInitRef = useRef<any>(null);
  const { data, setData, appendData } = useSelectStore();

  const getData = async (page = 1, options: any[] = []) => {
    setFetching(true);
    const params: any = {
      page,
      perPage: 1000,
    };
    if (params.page === 1) {
      setOptions([]);
    }
    if (filters) {
      filters.forEach((filter: any) => {
        params[filter.field] = filter.value;
      });
    }
    const { data } = await axiosClient.get(`/${resource}`, {
      params,
    });
    const total = data?.metadata?.pagination?.total || 0;
    setFetching(false);
    const newOptions = data.data.map((item: any) => {
      if (mapData) {
        return mapData(item);
      }
      if (!optionLabel || !optionValue) {
        return {
          label: item._id,
          value: item._id,
        };
      }
      return {
        label: item[optionLabel] || item.name,
        value: item[optionValue] || item._id,
      };
    });
    if (params.page === 1) {
      setOptions(newOptions);
      setData(cacheKey, newOptions);
      options = newOptions;
    } else {
      const temp = [...options];
      newOptions.forEach((item: any) => {
        if (!temp.find((i) => i.value === item.value)) {
          temp.push(item);
        }
      });
      setOptions(temp);
      appendData(cacheKey, newOptions);
      options = temp;
    }
    if (options.length < total) {
      // Sleep 100ms
      await new Promise((resolve) => setTimeout(resolve, 100));
      getData(page + 1, options);
    }
  };

  useEffect(() => {
    if (!isInitRef.current) {
      if (data[cacheKey]) {
        setOptions(data[cacheKey]);
      } else {
        getData(1);
      }
      isInitRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Select
      value={value}
      onChange={onChange}
      options={options}
      showSearch={true}
      filterOption={true}
      optionFilterProp="label"
      onSearch={undefined}
      className={classText}
      placeholder={placeholder}
      allowClear={true}
    />
  );
};

const SelectCustom = memo(SelectCustomComponent);
export default SelectCustom;
