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

const expandedRowRender = (item: any) => {
  return (
    <ProTable
      columns={[{ title: 'group', dataIndex: 'name', key: 'name' }]}
      headerTitle={false}
      search={false}
      options={false}
      dataSource={(item.groups || []).map((i) => ({ name: i }))}
      pagination={false}
    />
  );
};

const Welcome: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const { ClusterItem, ClusterList } = useTenantRequest();
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
      title: 'type',
      dataIndex: 'type',
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
      title: 'operate',
      valueType: 'option',
      key: 'option',
      render: (text, record) => [
        <a
          key="editable"
          onClick={() => {
            setModalState({
              ...record,
            });
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
                await ClusterItem.delete(record);
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
          expandable={{ expandedRowRender }}
          request={async (params) => {
            let data = await ClusterList.get({});
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
              setModalVisible={setModalVisible}
              ok={() => {
                actionRef.current?.reload();
                setModalState(null);
              }}
              onCancel={() => {
                setModalState(null);
              }}
            />,
          ]}
        />
      </Card>
    </PageContainer>
  );
};

export default Welcome;
