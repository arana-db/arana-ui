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

const expandedRowRender = (item) => {
  return (
    <ProTable
      columns={[
        { title: 'username', dataIndex: 'username', key: 'username' },
        {
          title: 'password',
          dataIndex: 'password',
          hideInSearch: true,
          valueType: 'password',
        },
      ]}
      headerTitle={false}
      search={false}
      options={false}
      dataSource={item.users}
      pagination={false}
    />
  );
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
        users: (state.users || []).map((item) => ({
          id: item.username,
          ...item,
        })),
      });
    },
    disabled,
    setDisabled,
  };
};

const Welcome: React.FC = () => {
  const { TenantList, TenantItem } = useTenantRequest();
  const actionRef = useRef<ActionType>();

  const CreateModalHook = useModal();

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
                await TenantItem.delete({
                  _tenantName: record.name,
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
            let data = await TenantList.get({});
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
          expandable={{
            expandedRowRender,
          }}
          pagination={{
            pageSize: 10,
            onChange: (page) => console.log(page),
          }}
          toolBarRender={() => [
            <Create
              {...CreateModalHook}
              ok={() => {
                window.location.reload();
              }}
            />,
          ]}
        />
      </Card>
    </PageContainer>
  );
};

export default Welcome;
