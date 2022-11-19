import { useTenantRequest } from '@/services/ant-design-pro/arana';
import type { ActionType, ProColumns, ProFormInstance } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { message } from 'antd';
import { Card } from 'antd';
import React, { useRef, useState } from 'react';
import Create from './Create';
import User from './User';

type GithubIssueItem = {
  tenant: string;
  username: string;
  password: string;
};

const expandedRowRender = () => (item) => {
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

const useModel = () => {
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
    setModalState: (state) =>  {
      setModalState( {
        ...state,
        users: (state.users || []).map((item) => ({
          id: item.username,
          ...item
        }))
      })
    },
    disabled,
    setDisabled,
  };
};

const Welcome: React.FC = () => {
  const { TenantList, TenantItem } = useTenantRequest()
  const actionRef = useRef<ActionType>();

  const CreateModalHook = useModel();
  const [tenant, setTenant] = useState(null);
  const UserModalHook = useModel();

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
            const data = await TenantList.get({});
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
          expandable={{ expandedRowRender: expandedRowRender(UserModalHook, setTenant, actionRef, TenantItem) }}
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
      <User {...UserModalHook} tenant={tenant} ok={() => {
        actionRef.current?.reload();
      }} />,
    </PageContainer>
  );
};

export default Welcome;
