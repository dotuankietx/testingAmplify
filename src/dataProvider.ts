/* eslint-disable no-param-reassign */
import QueryString from "query-string";
import { CrudFilters, DataProvider } from "@refinedev/core";
import { REFRESH_TOKEN_KEY, TOKEN_KEY, fetchJson, getRefreshToken, getToken, removeToken } from "./authProvider";
import axios from "axios";

type MethodTypes = "get" | "delete" | "head" | "options";
type MethodTypesWithBody = "post" | "put" | "patch";

export const API_URL = import.meta.env.VITE_API_URL;
export const STATIC_URL = API_URL + "/static/";
export const FULL_API_URL = API_URL + "/api/cms";

const { stringify } = QueryString;

export const staticUrl = (url: string) => {
  return STATIC_URL + url;
};

export const cancelTokenSource = axios.CancelToken.source();
const handleCancelRequest = () => {
  cancelTokenSource.cancel("Request was canceled");
};

const axiosInstance = axios.create({
  baseURL: FULL_API_URL,
  timeout: 30000,
  cancelToken: cancelTokenSource.token,
});

// const mapOperator = (operator: CrudOperators): string => {
//   switch (operator) {
//     case "ne":
//       return "not";
//     case "gte":
//     case "lte":
//     case "contains":
//     case "eq":
//       return "=";
//     case "in":
//     case "nin":
//       return "notIn";
//     default:
//       return "";
//   }
// };

const generateFilter = (filters?: CrudFilters) => {
  const queryFilters: { [key: string]: string } = {};

  if (filters) {
    // eslint-disable-next-line array-callback-return
    filters.map((filter) => {
      if (filter.operator === "or" || filter.operator === "and") {
        throw new Error(
          `operator: ${filter.operator}\` is not supported. You can create custom data provider.`
        );
      }

      if ("field" in filter) {
        const { field, value } = filter;

        // if (operator === "eq") {
        //   queryFilters[field] = value;
        //   return;
        // }

        // const mappedOperator = mapOperator(operator);
        // queryFilters[`[${field}][${mappedOperator}]`] = value;
        queryFilters[field] = value;
        return;
      }
    });
  }
  return queryFilters;
};

axiosInstance.interceptors.request.use((config) => {
  if (!config.headers) {
    config.headers = {} as any;
  }
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Check axios response status 401 and redirect to login page
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error?.response?.status === 401) {
      try {
        // handleCancelRequest();
        const user: any = await fetchJson("/api/auth/refresh", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${getRefreshToken()}`,
          }
        });
        if (user?.data?.accessToken) {
          localStorage.setItem(TOKEN_KEY, user.data.accessToken.token);
          localStorage.setItem(REFRESH_TOKEN_KEY, user.data.refreshToken.token);
        } else {
          removeToken();
          window.location.reload();
        }
      } catch (e) {
        removeToken();
        window.location.reload();
        throw new Error("Unauthorized");
      }
    }
    return Promise.reject(error);
  }
);

// const generateSort = (sorters?: CrudSorting) => {
//   const sort: { [key: string]: string } = {};
//   if (sorters && sorters.length > 0) {
//     sorters.forEach((item) => {
//       sort[item.field] = item.order;
//     });
//     return sort;
//   }

//   return sort;
// };

export const axiosClient = axiosInstance;

export const dataProvider = (
  apiUrl: string,
  httpClient: typeof axiosInstance = axiosInstance
): Omit<
  Required<DataProvider>,
  "createMany" | "updateMany" | "deleteMany"
> => ({
  getList: async ({ resource, pagination, filters, sorters, meta }) => {
    const url = `${apiUrl}/${resource}`;

    const { current = 1, pageSize = 10, mode = "server" } = pagination ?? {};

    const { headers: headersFromMeta, method } = meta ?? {};
    const requestMethod = (method as MethodTypes) ?? "get";
    const queryFilters = generateFilter(filters);

    const query: {
      page?: number;
      perPage?: number;
    } = {};

    if (mode === "server") {
      query.page = current;
      query.perPage = pageSize;
    }
    let tempUrl = `${url}?`;
    if (Object.keys(query).length > 0) {
      tempUrl += `${stringify(query)}`;
    }
    if (Object.keys(queryFilters).length > 0) {
      if (tempUrl.includes("&") || tempUrl.includes("?")) tempUrl += "&";
      tempUrl += Object.keys(queryFilters)
        .map((i) => `${i}=${queryFilters[i]}`)
        .join("&");
    }
    if (sorters && sorters.length > 0) {
      if (tempUrl.includes("&") || tempUrl.includes("?")) tempUrl += "&";
      const sort = sorters[0];
      tempUrl += `orderBy=${sort.field}&orderDirection=${sort.order}`;
    }
    const { data } = await httpClient[requestMethod](tempUrl, {
      headers: headersFromMeta,
    });
    const total = data?.metadata?.pagination?.total || data?.length;
    return {
      data: data?.data || [],
      total: total || data?.data.length,
    };
  },

  getMany: async ({ resource, ids, meta }) => {
    const { headers, method } = meta ?? {};
    const requestMethod = (method as MethodTypes) ?? "get";

    const { data } = await httpClient[requestMethod](
      `${apiUrl}/${resource}?where${ids
        .map((id) => `[id][in]=${id}`)
        .join("&where")}`,
      { headers }
    );

    return {
      data,
    };
  },

  create: async ({ resource, variables, meta }) => {
    if (resource === "mock") {
      return variables as any;
    }
    const url = `${apiUrl}/${resource}`;

    const { headers, method } = meta ?? {};
    const requestMethod = (method as MethodTypesWithBody) ?? "post";

    const { data } = await httpClient[requestMethod](url, variables, {
      headers,
    });

    return {
      data,
    };
  },

  update: async ({ resource, id, variables, meta }) => {
    if (resource === "mock") {
      return variables as any;
    }
    const url = `${apiUrl}/${resource}/${id}`;

    const { headers, method } = meta ?? {};
    const requestMethod = (method as MethodTypesWithBody) ?? "put";

    const { data } = await httpClient[requestMethod](url, variables, {
      headers,
    });

    return {
      data,
    };
  },

  getOne: async ({ resource, id, meta }) => {
    const url = `${apiUrl}/${resource}/${id}`;

    const { headers, method } = meta ?? {};
    const requestMethod = (method as MethodTypes) ?? "get";

    const { data } = await httpClient[requestMethod](url, { headers });

    return {
      data: data?.data || false,
    };
  },

  deleteOne: async ({ resource, id, variables, meta }) => {
    const url = `${apiUrl}/${resource}/${id}`;

    const { headers, method } = meta ?? {};
    const requestMethod = (method as MethodTypesWithBody) ?? "delete";

    const { data } = await httpClient[requestMethod](url, {
      data: variables,
      headers,
    });

    return {
      data,
    };
  },

  getApiUrl: () => apiUrl,

  custom: async ({
    url,
    method,
    filters,
    sorters,
    payload,
    query,
    headers,
  }) => {
    let requestUrl = `${url}?`;
    const queryFilters = generateFilter(filters);
    if (query) {
      requestUrl = `${requestUrl}&${stringify(query)}`;
    }
    if (Object.keys(queryFilters).length > 0) {
      if (requestUrl.includes("&") || requestUrl.includes("?"))
        requestUrl += "&";
      requestUrl += Object.keys(queryFilters)
        .map((i) => `${i}=${queryFilters[i]}`)
        .join("&");
    }
    if (sorters && sorters.length > 0) {
      if (requestUrl.includes("&") || requestUrl.includes("?"))
        requestUrl += "&";
      const sort = sorters[0];
      requestUrl += `orderBy=${sort.field}&orderDirection=${sort.order}`;
    }
    if (headers) {
      httpClient.defaults.headers = {
        ...httpClient.defaults.headers,
        ...headers,
      } as any;
    }

    let axiosResponse;
    switch (method) {
      case "put":
      case "post":
      case "patch":
        axiosResponse = await httpClient[method](url, payload);
        break;
      case "delete":
        axiosResponse = await httpClient.delete(url, {
          data: payload,
        });
        break;
      default:
        axiosResponse = await httpClient.get(requestUrl);
        break;
    }

    const { data } = axiosResponse;

    return Promise.resolve({ data });
  },
});
