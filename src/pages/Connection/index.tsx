import { getListeners } from '@/services/ant-design-pro/arana';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable, TableDropdown } from '@ant-design/pro-components';
import { Button, Card } from 'antd';
import React, { useRef } from 'react';

// const menu = (
//   <Menu>
//     <Menu.Item key="1">1st item</Menu.Item>
//     <Menu.Item key="2">2nd item</Menu.Item>
//     <Menu.Item key="3">3rd item</Menu.Item>
//   </Menu>
// );

type GithubIssueItem = {
  protocol_type: string;
  server_version: string;
  socket_address: {
    address: string;
    port: string;
  };
};

const Welcome: React.FC = () => {
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<GithubIssueItem>[] = [
    {
      title: '协议类型',
      dataIndex: 'protocol_type',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
      valueType: 'select',
      valueEnum: {
        all: { text: '全部', status: 'Default' },
        mysql: {
          text: 'mysql',
          status: 'mysql',
        },
      },
    },
    {
      title: '数据库版本',
      dataIndex: 'server_version',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
    },
    {
      title: 'IP地址',
      dataIndex: 'socket_address',
      copyable: true,
      ellipsis: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
      render(_, { socket_address: { address, port } }) {
        return (
          <span>
            {address}:{port}
          </span>
        );
      },
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (text, record, _, action) => [
        <a key="editable" onClick={() => {}}>
          编辑
        </a>,
        <a target="_blank" rel="noopener noreferrer" key="view">
          查看
        </a>,
        <TableDropdown
          key="actionGroup"
          onSelect={() => action?.reload()}
          menus={[
            { key: 'copy', name: '复制' },
            { key: 'delete', name: '删除' },
          ]}
        />,
      ],
    },
  ];

  return (
    <PageContainer>
      <Card>
        <ProTable<GithubIssueItem>
          columns={columns}
          actionRef={actionRef}
          cardBordered
          request={async () => {
            const data = await getListeners();
            console.log('data', data);
            return { success: true, data };
          }}
          editable={{
            type: 'multiple',
          }}
          columnsState={{
            persistenceKey: 'pro-table-singe-demos',
            persistenceType: 'localStorage',
            onChange(value) {
              console.log('value: ', value);
            },
          }}
          rowKey="name"
          search={{
            labelWidth: 'auto',
          }}
          options={{
            setting: {
              // listsHeight: 400,
            },
          }}
          form={{
            // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
            syncToUrl: (values, type) => {
              if (type === 'get') {
                return {
                  ...values,
                  created_at: [values.startTime, values.endTime],
                };
              }
              return values;
            },
          }}
          pagination={{
            pageSize: 5,
            onChange: (page) => console.log(page),
          }}
          dateFormatter="string"
          headerTitle="高级表格"
          toolBarRender={() => [
            <Button key="button" icon={<PlusOutlined />} type="primary">
              新建
            </Button>,
          ]}
        />
      </Card>
    </PageContainer>
  );
};

export default Welcome;
