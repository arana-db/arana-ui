// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
import { notification } from 'antd';

const arana_api_prefix = '/api';

/** 获取当前的MySql链接 GET /api/listeners */
export async function getListeners(options?: { [key: string]: any }) {
  return request<{}>(`${arana_api_prefix}/listeners`, {
    method: 'GET',
    ...(options || {}),
  });
}

const createRestfulApi = <T>(
  url: string,
): {
  get: (options: T) => Promise<Array<T>>;
  post: (options: T) => Promise<any>;
  delete: (options: T) => Promise<any>;
  put: (options: T) => Promise<any>;
} => {
  const restfulApi = {};
  const method = ['GET', 'POST', 'DELETE', 'PUT'];
  method.forEach((m) => {
    restfulApi[m.toLocaleLowerCase()] = async function (options: { [key: string]: any }) {
      const reg = /\{(\w+)\}/g;
      let e;
      let realUrl = url;
      while ((e = reg.exec(url))) {
        console.log(e[0], options[e[1]]);
        realUrl = realUrl.replace(e[0], options[e[1]]);
      }
      if (m === 'POST') {
        return await request(arana_api_prefix + realUrl, {
          method: m,
          data: options,
        }).catch((e) => {
          const { code, message } = e.response.data;
          notification.open({
            message: `Code: ${code}`,
            description: `Message: ${message}`,
          });
          return Promise.resolve(e);
        });
      }
      return await request(arana_api_prefix + realUrl, {
        method: m,
        ...(options || {}),
      }).catch((e) => {
        const { code, message } = e.response.data;
        notification.open({
          message: `Code: ${code}`,
          description: `Message: ${message}`,
        });
        return Promise.resolve(e);
      });
    };
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

export const TenantList = createRestfulApi<Tenant | any>(`/tenants`);

export const TenantItem = createRestfulApi<Tenant | any>(`/tenants/{tenantName}`);

type Node = {
  name: string;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  weight: string;
};

export const NodeList = createRestfulApi<Node | any>(`/tenants/{tenantName}/nodes`);

export const NodeItem = createRestfulApi<Node | any>(`/api/tenants/{tenantName}/nodes/{nodeName}`);

type Group = {
  name: string;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  weight: string;
};

export const GroupList = createRestfulApi<Node | any>(`/tenants/{tenantName}/groups`);

export const GroupItem = createRestfulApi<Node | any>(`/tenants/{tenantName}/groups/{groupName}`);

type Cluster = {
  name: string;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  weight: string;
};

export const ClusterList = createRestfulApi<Cluster | any>(`/tenants/{tenantName}/clusters`);

export const ClusterItem = createRestfulApi<Cluster | any>(
  `/tenants/{tenantName}/clusters/{clustersName}`,
);
