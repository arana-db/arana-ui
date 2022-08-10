// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取当前的MySql链接 GET /arana/listeners */
export async function getListeners(options?: { [key: string]: any }) {
  return request<{}>('/arana/listeners', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取当前的租户列表 GET /arana/tenants */
export async function getTenants(options?: { [key: string]: any }) {
  const res = await request<
    {
      name: string;
      users: {
        username: string;
        password: string;
      }[];
    }[]
  >('/arana/tenants', {
    method: 'GET',
    ...(options || {}),
  });
  return res.reduce(
    (arr, tenant) =>
      arr.concat(
        tenant.users.map((user) => ({
          tenant: tenant.name,
          ...user,
        })),
      ),
    [],
  );
}

/** 创建租户 POST /arana/tenants */
export async function createTenant(options?: { [key: string]: any }) {
  return request<{}>('/arana/tenants', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 删除租户 DELETE /arana/tenants */
export async function deleteTenant(tenantName: string) {
  return request<{}>(`/arana/tenants/${tenantName}`, {
    method: 'DELETE',
  });
}
