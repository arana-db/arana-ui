import { useTenantRequest } from '@/services/ant-design-pro/arana';
import type { ActionType, ProColumns, ProFormInstance } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { message, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Card } from 'antd';
import React, { useRef, useState } from 'react';
import Create from './Create';

type GithubIssueItem = {
  tenant: string;
  username: string;
  password: string;
};

const useModal = () => {
  const actionRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalState, setModalState] = useState<Object | null>(null);
  const [disabled, setDisabled] = useState<boolean>(false);
  return {
    actionRef,
    formRef,
    modalVisible,
    setModalVisible: (visible) => {
      if (!visible) {
        setModalState(null);
      }
      setModalVisible(visible);
    },
    modalState,
    setModalState: (state) => {
      setModalState({
        ...state,
      });
    },
    disabled,
    setDisabled,
  };
};

const Welcome: React.FC = () => {
  const { UserList, UserItem } = useTenantRequest();
  const actionRef = useRef<ActionType>();

  const CreateModalHook = useModal();

  const columns: ProColumns<GithubIssueItem>[] = [
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
    },
    {
      title: 'operate',
      valueType: 'option',
      key: 'option',
      render: (text, record) => [
        <a
          key="editable"
          onClick={() => {
            CreateModalHook.setModalState(record);
            CreateModalHook.setModalVisible(true);
          }}
        >
          Edit
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
                await UserItem.delete({
                  _userName: record.username,
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
            let data = await UserList.get({});
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
              {...CreateModalHook}
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
