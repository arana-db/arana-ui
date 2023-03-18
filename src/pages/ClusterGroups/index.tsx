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
      columns={[{ title: 'node', dataIndex: 'node', key: 'node' }]}
      headerTitle={false}
      search={false}
      options={false}
      dataSource={item.nodes.map((v: string) => ({
        node: v,
      }))}
      pagination={false}
    />
  );
};

const Welcome: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const { ClusterGroupItem, GroupList } = useTenantRequest();
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
                await ClusterGroupItem.delete({
                  ...record,
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
            let data = await GroupList.get({});
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
          }}
          expandable={{ expandedRowRender }}
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
              setModalVisible={(visible: boolean) => {
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
