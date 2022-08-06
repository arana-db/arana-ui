import { getTenants } from '@/services/ant-design-pro/arana';
import { EllipsisOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable, TableDropdown } from '@ant-design/pro-components';
import { Button, Card, Dropdown, Menu } from 'antd';
import React, { useRef } from 'react';

const menu = (
  <Menu>
    <Menu.Item key="1">1st item</Menu.Item>
    <Menu.Item key="2">2nd item</Menu.Item>
    <Menu.Item key="3">3rd item</Menu.Item>
  </Menu>
);

type GithubIssueItem = {
  tenant: string;
  username: string;
  password: string;
};

const Welcome: React.FC = () => {
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<GithubIssueItem>[] = [
    {
      title: '租户',
      dataIndex: 'tenant',
      copyable: true,
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
      title: 'username',
      dataIndex: 'username',
      copyable: true,
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
      title: 'password',
      dataIndex: 'password',
      copyable: true,
      ellipsis: true,
      tip: '标题过长会自动收缩',
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
            const data = await getTenants();
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
            <Dropdown key="menu" overlay={menu}>
              <Button>
                <EllipsisOutlined />
              </Button>
            </Dropdown>,
          ]}
        />
      </Card>
    </PageContainer>
  );
};

export default Welcome;
