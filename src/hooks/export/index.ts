import { useState } from "react";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import {
  BaseRecord,
  CrudFilters,
  CrudSorting,
  MapDataFn,
  MetaQuery,
  pickDataProvider,
  pickNotDeprecated,
  useDataProvider,
  useMeta,
  useResource,
  useUserFriendlyName,
} from "@refinedev/core";

type UseExportOptionsType<
  TData extends BaseRecord = BaseRecord,
  TVariables = any
> = {
  /**
   * Resource name for API data interactions
   * @default Resource name that it reads from route
   * @deprecated `resourceName` is deprecated. Use `resource` instead.
   */
  resourceName?: string;
  /**
   * Resource name for API data interactions
   * @default Resource name that it reads from route
   */
  resource?: string;
  /**
   * A mapping function that runs for every record. Mapped data will be included in the file contents
   */
  mapData?: MapDataFn<TData, TVariables>;
  /**
   *  Sorts records
   *  @deprecated `sorter` is deprecated. Use `sorters` instead.
   */
  sorter?: CrudSorting;
  /**
   *  Sorts records
   */
  sorters?: CrudSorting;
  /**
   *  Filters records
   */
  filters?: CrudFilters;
  maxItemCount?: number;
  /**
   *  Requests to fetch data are made as batches by page size. By default, it is 20. Used for `getList` method of `DataProvider`
   */
  pageSize?: number;
  filename?: string;
  /**
   *  Metadata query for `dataProvider`
   */
  meta?: MetaQuery;
  /**
   *  Metadata query for `dataProvider`
   * @deprecated `metaData` is deprecated with refine@4, refine will pass `meta` instead, however, we still support `metaData` for backward compatibility.
   */
  metaData?: MetaQuery;
  /**
   * If there is more than one `dataProvider`, you should use the `dataProviderName` that you will use.
   */
  dataProviderName?: string;
  /**
   *  Callback to handle error events of this hook
   */
  onError?: (error: any) => void;
};

type UseExportReturnType = {
  isLoading: boolean;
  triggerExport: () => Promise<void>;
};

/**
 * `useExport` hook allows you to make your resources exportable.
 *
 * @see {@link https://refine.dev/docs/api-reference/core/hooks/import-export/useExport} for more details.
 *
 * @typeParam TData - Result data of the query extends {@link https://refine.dev/docs/api-reference/core/interfaceReferences#baserecord `BaseRecord`}
 * @typeParam TVariables - Values for params.
 *
 */
export const useExport = <
  TData extends BaseRecord = BaseRecord,
  TVariables = any
>({
  resourceName,
  resource: resourceFromProps,
  sorter,
  sorters,
  filters,
  maxItemCount,
  pageSize = 20,
  mapData = (item) => item as any,
  meta,
  metaData,
  dataProviderName,
  onError,
  filename,
}: UseExportOptionsType<TData, TVariables> = {}): UseExportReturnType => {
  const [isLoading, setIsLoading] = useState(false);

  const dataProvider = useDataProvider();
  const getMeta = useMeta();
  const { resource, resources, identifier } = useResource(
    pickNotDeprecated(resourceFromProps, resourceName)
  );
  const getFriendlyName = useUserFriendlyName();

  const excelFileName = `${
    filename || getFriendlyName(identifier, "plural")
  }-${new Date().toLocaleString()}`;

  const { getList } = dataProvider(
    pickDataProvider(identifier, dataProviderName, resources)
  );

  const combinedMeta = getMeta({
    resource,
    meta: pickNotDeprecated(meta, metaData),
  });

  const triggerExport = async () => {
    setIsLoading(true);

    let rawData: BaseRecord[] = [];

    let current = 1;
    let preparingData = true;
    while (preparingData) {
      try {
        const { data, total } = await getList<TData>({
          resource: resource?.name ?? "",
          filters,
          sort: pickNotDeprecated(sorters, sorter),
          sorters: pickNotDeprecated(sorters, sorter),
          pagination: {
            current,
            pageSize,
            mode: "server",
          },
          meta: combinedMeta,
          metaData: combinedMeta,
        });

        current++;

        rawData.push(...data);

        if (maxItemCount && rawData.length >= maxItemCount) {
          rawData = rawData.slice(0, maxItemCount);
          preparingData = false;
        }

        if (total === rawData.length) {
          preparingData = false;
        }
      } catch (error) {
        setIsLoading(false);
        preparingData = false;

        onError?.(error);

        return;
      }
    }
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    const ws = XLSX.utils.json_to_sheet(rawData.map(mapData as any));
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, excelFileName + fileExtension);
    setIsLoading(false);
  };

  return {
    isLoading,
    triggerExport,
  };
};
