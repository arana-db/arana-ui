// @ts-ignore
/* eslint-disable */
import { request, useModel } from '@umijs/max';
import { notification } from 'antd';
import { useCallback } from 'react';

const arana_api_prefix = '/api/v1';
const arana_open_api_prefix = '/openapi/v1';

/** 获取当前的MySql链接 GET /api/listeners */
export async function getListeners(options?: { [key: string]: any }) {
  return request<{}>(`${arana_api_prefix}/listeners`, {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取当前的存在的租户列表 */
export async function getTenants(options?: { [key: string]: any }) {
  return request<{}>(`${arana_open_api_prefix}/tenants`, {
    method: 'GET',
    ...(options || {}),
  });
}

const handleErrotCatch = (promise: Promise<any>) => {
  return promise.catch((e) => {
    const { code, message } = e.response.data;
    if (code === 401) {
      notification.open({
        message: `Code: 401`,
        description: `Message: Login has expired. Please login again`,
      });
      setTimeout(() => {
        window.location.href = '/user/login';
      }, 2000);
      return;
    }
    notification.open({
      message: `Code: ${code}`,
      description: `Message: ${message}`,
    });
    return Promise.reject(e);
  });
};

const useRestfulApi = <T>(
  url: string,
): {
  get: (options: T) => Promise<Array<T>>;
  post: (options: T) => Promise<any>;
  delete: (options: T) => Promise<any>;
  put: (options: T) => Promise<any>;
} => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const { tenantName } = currentUser;
  const restfulApi = {};
  const method = ['GET', 'POST', 'DELETE', 'PUT'];
  const jwtCache = window.localStorage.getItem('jwt') || '{}';
  const jwt = JSON.parse(jwtCache);
  method.forEach((m) => {
    restfulApi[m.toLocaleLowerCase()] = useCallback(
      async function (options: { [key: string]: any }) {
        const reg = /\{(\w+)\}/g;
        let e;
        let realUrl = url;

        // add global tanantName
        if (realUrl.indexOf('{tenantName}') !== -1) {
          Object.assign(options, {
            tenantName,
          });
        }

        while ((e = reg.exec(url))) {
          realUrl = realUrl.replace(e[0], options[e[1]]);
          delete options[e[1]];
        }

        Object.keys(options).forEach((key) => {
          if (key.startsWith('_')) {
            delete options[key];
          }
        });

        let params =
          m !== 'GET'
            ? {
                method: m,
                data: options,
                headers: {
                  Authorization: `Bearer ${jwt.token}`,
                },
              }
            : {
                method: m,
                headers: {
                  Authorization: `Bearer ${jwt.token}`,
                },
                ...(options || {}),
              };
        return handleErrotCatch(request(arana_api_prefix + realUrl, params));
      },
      [tenantName],
    );
  });
  return restfulApi as {
    get: (options: T) => Promise<Array<T>>;
    post: (options: T) => Promise<any>;
    delete: (options: T) => Promise<any>;
    put: (options: T) => Promise<any>;
  };
};

type Tenant = {
  name: string;
  users: {
    username: string;
    password: string;
  }[];
};

export const useTenantRequest = () => {
  return {
    TenantList: useRestfulApi<Tenant | any>(`/tenants`),
    TenantItem: useRestfulApi<Tenant | any>(`/tenants/{_tenantName}`),
    NodeList: useRestfulApi<Node | any>(`/tenants/{tenantName}/nodes`),
    NodeItem: useRestfulApi<Node | any>(`/tenants/{tenantName}/nodes/{_name}`),
    GroupList: useRestfulApi<Node | any>(`/tenants/{tenantName}/groups`),
    ClusterGroupList: useRestfulApi<Node | any>(
      `/tenants/{tenantName}/clusters/{clusterName}/groups`,
    ),
    ClusterGroupItem: useRestfulApi<Node | any>(
      `/tenants/{tenantName}/clusters/{clusterName}/groups/{_name}`,
    ),
    DbTableList: useRestfulApi<Cluster | any>(
      `/tenants/{tenantName}/clusters/{clusterName}/tables`,
    ),
    DbTableItem: useRestfulApi<Cluster | any>(
      `/tenants/{tenantName}/clusters/{clusterName}/tables/{tableName}`,
    ),
    ClusterList: useRestfulApi<Cluster | any>(`/tenants/{tenantName}/clusters`),
    ClusterItem: useRestfulApi<Cluster | any>(`/tenants/{tenantName}/clusters/{_name}`),
    UserList: useRestfulApi<Cluster | any>(`/tenants/{tenantName}/users`),
    UserItem: useRestfulApi<Cluster | any>(`/tenants/{tenantName}/users/{_userName}`),
  };
};

type Node = {
  name: string;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  weight: string;
};

type Group = {
  name: string;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  weight: string;
};

type Cluster = {
  name: string;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  weight: string;
};

export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  const res = await request('/login', {
    method: 'POST',
    data: body,
  });

  window.localStorage.setItem('jwt', JSON.stringify(res));

  return {
    status: res.code === 200 ? 'ok' : 'error',
    type: 'account',
    currentAuthority: 'admin',
  };
  // return request<API.LoginResult>('/api/login/account', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   data: body,
  //   ...(options || {}),
  // });
}
