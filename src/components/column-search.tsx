import { SearchOutlined } from "@ant-design/icons";
import { Button, DatePicker, Input } from "antd";
import type { ColumnType } from "antd/es/table";
import locale from "antd/es/date-picker/locale/vi_VN";
import 'dayjs/locale/vi';
import dayjs from "dayjs";

export const getColumnSearchProps = (
  dataIndex: any,
  searchInput: any,
  translate: any
): ColumnType<any> => ({
  filterDropdown: ({
    setSelectedKeys,
    selectedKeys,
    confirm,
    close,
    clearFilters,
  }) => (
    <div className="p-2 min-w-[260px]" onKeyDown={(e) => e.stopPropagation()}>
      <Input
        ref={searchInput}
        placeholder={translate("input_search")}
        value={selectedKeys[0]}
        onChange={(e) =>
          setSelectedKeys(e.target.value ? [e.target.value] : [])
        }
        onPressEnter={() => confirm()}
        style={{ marginBottom: 8, display: "block" }}
      />
      <div className="flex justify-between">
        <Button
          type="primary"
          onClick={() => confirm()}
          icon={<SearchOutlined />}
          size="small"
        >
          {translate("buttons.search")}
        </Button>
        <Button
          onClick={() => clearFilters && clearFilters()}
          size="small"
          style={{ width: 90 }}
        >
          {translate("buttons.reset")}
        </Button>
        <Button
          type="default"
          size="small"
          onClick={() => {
            close();
          }}
        >
          {translate("buttons.close")}
        </Button>
      </div>
    </div>
  ),
  filterIcon: (filtered: boolean) => (
    <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
  ),
  onFilter: (value, record) =>
    record[dataIndex]
      .toString()
      .toLowerCase()
      .includes((value as string).toLowerCase()),
  onFilterDropdownOpenChange: (visible) => {
    if (visible) {
      setTimeout(() => searchInput.current?.select(), 100);
    }
  },
});

export const getDateSearchProps = (
  dataIndex: any,
  searchInput: any,
  translate: any,
  picker:
    | "time"
    | "date"
    | "week"
    | "month"
    | "quarter"
    | "year"
    | undefined = "date"
): ColumnType<any> => ({
  filterDropdown: ({
    setSelectedKeys,
    selectedKeys,
    confirm,
    close,
    clearFilters,
  }) => (
    <div className="p-2 min-w-[260px]" onKeyDown={(e) => e.stopPropagation()}>
      <DatePicker
        locale={locale}
        ref={searchInput}
        value={selectedKeys[0] ? dayjs(selectedKeys[0] as string) : undefined}
        onChange={(e) =>
          setSelectedKeys(e?.toISOString() ? [e?.toISOString()] : [])
        }
        style={{ marginBottom: 8, display: "block" }}
        picker={picker}
      />
      <div className="flex justify-between">
        <Button
          type="primary"
          onClick={() => confirm()}
          icon={<SearchOutlined />}
          size="small"
        >
          {translate("buttons.search")}
        </Button>
        <Button
          onClick={() => clearFilters && clearFilters()}
          size="small"
          style={{ width: 90 }}
        >
          {translate("buttons.reset")}
        </Button>
        <Button
          type="default"
          size="small"
          onClick={() => {
            close();
          }}
        >
          {translate("buttons.close")}
        </Button>
      </div>
    </div>
  ),
  filterIcon: (filtered: boolean) => (
    <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
  ),
  onFilter: (value, record) =>
    record[dataIndex]
      .toString()
      .toLowerCase()
      .includes((value as string).toLowerCase()),
});
