// @ts-ignore
/* eslint-disable */
import { request, useModel } from '@umijs/max';
import { notification } from 'antd';
import { useCallback } from 'react';

const arana_api_prefix = '/api/v1';

/** 获取当前的MySql链接 GET /api/listeners */
export async function getListeners(options?: { [key: string]: any }) {
  return request<{}>(`${arana_api_prefix}/listeners`, {
    method: 'GET',
    ...(options || {}),
  });
}

const handleErrotCatch = (promise: Promise<any>) => {
  return promise.catch((e) => {
    const { code, message } = e.response.data;
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
  method.forEach((m) => {
    restfulApi[m.toLocaleLowerCase()] = useCallback(async function (options: {
      [key: string]: any;
    }) {
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
      }
      let params =
        m !== 'GET'
          ? {
              method: m,
              data: options,
            }
          : {
              method: m,
              ...(options || {}),
            };
      return handleErrotCatch(request(arana_api_prefix + realUrl, params));
    },
    [tenantName]);
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
    TenantItem: useRestfulApi<Tenant | any>(`/tenants/{tenantName}`),
    NodeList: useRestfulApi<Node | any>(`/tenants/{tenantName}/nodes`),
    NodeItem: useRestfulApi<Node | any>(`/tenants/{tenantName}/nodes/{name}`),
    GroupList: useRestfulApi<Node | any>(`/tenants/{tenantName}/groups`),
    ClusterGroupList: useRestfulApi<Node | any>(`/tenants/{tenantName}/clusters/{clusterName}/groups`),
    ClusterGroupItem: useRestfulApi<Node | any>(`/tenants/{tenantName}/clusters/{clusterName}/groups/{name}`),
    ClusterList: useRestfulApi<Cluster | any>(`/tenants/{tenantName}/clusters`),
    ClusterItem: useRestfulApi<Cluster | any>(`/tenants/{tenantName}/clusters/{name}`),
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
