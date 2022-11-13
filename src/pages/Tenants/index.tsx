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

const expandedRowRender = (hook, setTenant, actionRef) => (item) => {
  const { TenantItem } = useTenantRequest()
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
        {
          title: 'Action',
          dataIndex: 'operation',
          key: 'operation',
          valueType: 'option',
          render: (_, record) => [
            <a
              key="Edit"
              onClick={() => {
                if (setTenant) {
                  setTenant(item);
                }
                hook.setModalState(record);
                hook.setModalVisible(true);
              }}
            >
              Edit
            </a>,
            <a key="Delete" onClick={async () => {
              await TenantItem.put({
                tenantName: item.name,
                users: item.users.filter(({ username }) => {
                  return username !== record.username
                })
              })
              message.success('deleted success');
              actionRef.current?.reload();
            }}>Delete</a>,
          ],
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
    setModalState,
    disabled,
    setDisabled,
  };
};

const Welcome: React.FC = () => {
  const { TenantList } = useTenantRequest()
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
        // <a
        //   target="_blank"
        //   rel="noopener noreferrer"
        //   key="view"
        //   onClick={() => {
        //     CreateModalHook.setModalState(record);
        //     CreateModalHook.setDisabled(true);
        //     CreateModalHook.setModalVisible(true);
        //   }}
        // >
        //   View
        // </a>,
        // <a
        //   target="_blank"
        //   rel="noopener noreferrer"
        //   key="view"
        //   onClick={() => {
        //     Modal.confirm({
        //       title: 'Do you Want to delete these items?',
        //       icon: <ExclamationCircleOutlined />,
        //       async onOk() {
        //         await TenantItem.delete({
        //           tenantName: record.name
        //         });
        //         message.success('Delete success!');
        //         actionRef.current?.reload();
        //       },
        //       onCancel() {
        //         console.log('Cancel');
        //       },
        //     });
        //   }}
        // >
        //   Delete
        // </a>,
        <a
          key="editable"
          onClick={() => {
            setTenant(record);
            UserModalHook.setModalVisible(true);
          }}
        >
          Create User
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
          expandable={{ expandedRowRender: expandedRowRender(UserModalHook, setTenant, actionRef) }}
          pagination={{
            pageSize: 5,
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
