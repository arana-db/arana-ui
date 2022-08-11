import { GroupItem, GroupList } from '@/services/ant-design-pro/arana';
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

const expandedRowRender = (item) => {
  return (
    <ProTable
      columns={[
        { title: 'node', dataIndex: 'node', key: 'node' },
        {
          title: 'Action',
          dataIndex: 'operation',
          key: 'operation',
          valueType: 'option',
          render: () => [<a key="Edit">Edit</a>, <a key="Delete">Delete</a>],
        },
      ]}
      headerTitle={false}
      search={false}
      options={false}
      dataSource={item.nodes.map((v) => ({
        node: v,
      }))}
      pagination={false}
    />
  );
};

const Welcome: React.FC = () => {
  const actionRef = useRef<ActionType>();
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
                await GroupItem.delete(record.tenant);
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
          request={async () => {
            const data = await GroupList.get({});
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
            pageSize: 5,
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
              }}
            />,
          ]}
        />
      </Card>
    </PageContainer>
  );
};

export default Welcome;
