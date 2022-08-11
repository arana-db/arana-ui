import { Request, Response } from 'express';

const json = {
  kind: 'ConfigMap',
  apiVersion: '1.0',
  metadata: {
    name: 'arana-config',
  },
  data: {
    listeners: [
      {
        protocol_type: 'mysql',
        server_version: '5.7.0',
        socket_address: {
          address: '0.0.0.0',
          port: 13306,
        },
      },
    ],
    tenants: [
      {
        name: 'arana',
        users: [
          {
            username: 'arana',
            password: '123456',
          },
          {
            username: 'dksl',
            password: '123456',
          },
        ],
      },
    ],
    clusters: [
      {
        name: 'employees',
        type: 'mysql',
        sql_max_limit: -1,
        tenant: 'arana',
        groups: [
          {
            name: 'employees_0000',
            nodes: [
              {
                name: 'node0',
                host: 'arana-mysql',
                port: 3306,
                username: 'root',
                password: '123456',
                database: 'employees_0000',
                weight: 'r10w10',
                parameters: {
                  maxAllowedPacket: '256M',
                },
              },
            ],
          },
          {
            name: 'employees_0001',
            nodes: [
              {
                name: 'node1',
                host: 'arana-mysql',
                port: 3306,
                username: 'root',
                password: '123456',
                database: 'employees_0001',
                weight: 'r10w10',
                parameters: {
                  maxAllowedPacket: '256M',
                },
              },
            ],
          },
          {
            name: 'employees_0002',
            nodes: [
              {
                name: 'node2',
                host: 'arana-mysql',
                port: 3306,
                username: 'root',
                password: '123456',
                database: 'employees_0002',
                weight: 'r10w10',
                parameters: {
                  maxAllowedPacket: '256M',
                },
              },
            ],
          },
          {
            name: 'employees_0003',
            nodes: [
              {
                name: 'node3',
                host: 'arana-mysql',
                port: 3306,
                username: 'root',
                password: '123456',
                database: 'employees_0003',
                weight: 'r10w10',
                parameters: {
                  maxAllowedPacket: '256M',
                },
              },
            ],
          },
        ],
      },
    ],
    sharding_rule: {
      tables: [
        {
          name: 'employees.student',
          allow_full_scan: true,
          db_rules: [
            {
              column: 'uid',
              type: 'scriptExpr',
              expr: 'parseInt($value % 32 / 8)',
            },
          ],
          tbl_rules: [
            {
              column: 'uid',
              type: 'scriptExpr',
              expr: '$value % 32',
              step: 32,
            },
          ],
          topology: {
            db_pattern: 'employees_${0000..0003}',
            tbl_pattern: 'student_${0000..0031}',
          },
          attributes: {
            sqlMaxLimit: -1,
          },
        },
      ],
    },
  },
};

const getOverview = (req: Request, res: Response, u: string) => {
  res.json(json);
};

const getOverviewTree = (req: Request, res: Response, u: string) => {
  const root = {
    key: 'root',
    title: json.metadata.name,
    children: [
      {
        key: 'listeners',
        title: 'listeners',
        children: json.data.listeners.map(({ protocol_type, server_version, socket_address }) => {
          const key = `「${protocol_type} ${server_version}」${socket_address.address}:${socket_address.port}`;
          return {
            key,
            title: key,
          };
        }),
      },
      {
        key: 'tenants',
        title: 'tenants',
        children: json.data.tenants.map(({ name, users }) => ({
          key: name,
          title: name,
          children: [
            {
              key: 'users',
              title: 'users',
              children: users.map(({ username }) => ({
                key: `tenants-users-${name}-${username}`,
                title: username,
              })),
            },
            {
              key: 'clusters',
              title: 'clusters',
              children: json.data.clusters
                .filter(({ tenant }) => tenant === name)
                .map(({ type, name: clusters, groups }) => ({
                  key: `${name}-${type}-${clusters}`,
                  title: `「${type}」${clusters}`,
                  children: groups.map(({ name: groupName, nodes }) => ({
                    key: `${name}-${type}-${clusters}-${groupName}`,
                    title: groupName,
                    children: nodes.map(({ name: nodeName, host: nodeHost, port: nodePort }) => ({
                      key: `${name}-${type}-${clusters}-${groupName}-${nodeName}`,
                      title: `「${nodeName}」${nodeHost}:${nodePort}`,
                    })),
                  })),
                })),
            },
          ],
        })),
      },
      {
        key: 'sharding_rule',
        title: 'sharding_rule',
        children: [
          {
            key: 'tables',
            title: 'tables',
          },
        ],
      },
    ],
  };

  res.json([root]);
};

export default {
  'GET /api/overview': getOverview,
  'GET /api/overview/tree': getOverviewTree,
};
