import { useTenantRequest } from '@/services/ant-design-pro/arana';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProFormInstance } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Card, message, Modal } from 'antd';
import React, { useRef, useState } from 'react';
import Create from './Create';

type GithubIssueItem = {
  tenant: string;
  username: string;
  password: string;
};

const Welcome: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const { NodeItem, NodeList } = useTenantRequest();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalState, setModalState] = useState<Object | null>(null);
  const [disabled, setDisabled] = useState<boolean>(false);
  const formRef = useRef<ProFormInstance>();

  const columns: ProColumns<GithubIssueItem>[] = [
    {
      title: 'name',
      dataIndex: 'name',
      formItemProps: {
        rules: [
          {
            required: true,
            message: 'name is required',
          },
        ],
      },
    },
    {
      title: 'database',
      dataIndex: 'database',
      formItemProps: {
        rules: [
          {
            required: true,
            message: 'database is required',
          },
        ],
      },
    },
    {
      title: 'host',
      dataIndex: 'host',
      formItemProps: {
        rules: [
          {
            required: true,
            message: 'host is required',
          },
        ],
      },
    },
    {
      title: 'port',
      dataIndex: 'port',
      formItemProps: {
        rules: [
          {
            required: true,
            message: 'port is required',
          },
        ],
      },
    },
    {
      title: 'username',
      dataIndex: 'username',
      formItemProps: {
        rules: [
          {
            required: true,
            message: 'username is required',
          },
        ],
      },
    },
    {
      title: 'password',
      dataIndex: 'password',
      hideInSearch: true,
      valueType: 'password',
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
      title: 'weight',
      dataIndex: 'weight',
      formItemProps: {
        rules: [
          {
            required: true,
            message: 'weight is required',
          },
        ],
      },
    },

    {
      title: 'operate',
      valueType: 'option',
      key: 'option',
      render: (text, record) => [
        <a
          key="editable"
          onClick={() => {
            setModalState(record);
            setModalVisible(true);
          }}
        >
          Edit
        </a>,
        <a
          target="_blank"
          rel="noopener noreferrer"
          key="view"
          onClick={() => {
            setModalState(record);
            setDisabled(true);
            setModalVisible(true);
          }}
        >
          View
        </a>,
        <a
          target="_blank"
          rel="noopener noreferrer"
          key="view"
          onClick={() => {
            Modal.confirm({
              title: 'Do you Want to delete these items?',
              icon: <ExclamationCircleOutlined />,
              async onOk() {
                await NodeItem.delete({
                  _name: record.name,
                });
                message.success('Delete success!');
                actionRef.current?.reload();
              },
              onCancel() {
                console.log('Cancel');
              },
            });
          }}
        >
          Delete
        </a>,
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
          request={async (params) => {
            let data = await NodeList.get({});
            const { current, pageSize, ...options } = params;

            Object.keys(options).forEach((key) => {
              if (typeof options[key] === 'string') {
                data = data.filter((item) => {
                  return item[key].includes(options[key]);
                });
              }
            });

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
          pagination={{
            pageSize: 10,
            onChange: (page) => console.log(page),
          }}
          toolBarRender={() => [
            <Create
              formRef={formRef}
              modalState={modalState}
              disabled={disabled}
              setDisabled={setDisabled}
              modalVisible={modalVisible}
              setModalVisible={(visible) => {
                if (!visible) {
                  setModalState(null);
                }
                setModalVisible(visible);
              }}
              ok={() => {
                actionRef.current?.reload();
              }}
            />,
          ]}
        />
      </Card>
    </PageContainer>
  );
};

export default Welcome;
