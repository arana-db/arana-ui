import { useTenantRequest } from '@/services/ant-design-pro/arana';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProFormInstance } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Card, message, Modal, Select } from 'antd';
import React, { useRef, useState, useEffect } from 'react';
import Create from './Create';

type GithubIssueItem = {
  tenant: string;
  username: string;
  password: string;
};

const MySelect: React.FC<{
  state: {
    type: number;
  };
  /** Value 和 onChange 会被自动注入 */
  value?: string;
  onChange?: (value: string) => void;
}> = (props) => {
  const { ClusterList } = useTenantRequest();

  const { state } = props;

  const [innerOptions, setOptions] = useState<
    {
      label: React.ReactNode;
      value: number;
    }[]
  >([]);

  useEffect(() => {
    ClusterList.get({}).then((res) => {
      setOptions(
        res.map(({ name }) => ({
          label: name,
          value: name,
        })),
      );
    });
  }, [JSON.stringify(state)]);

  return <Select options={innerOptions} value={props.value} onChange={props.onChange} />;
};

const Welcome: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const { DbTableList, DbTableItem } = useTenantRequest();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalState, setModalState] = useState<Object | null>(null);
  const [disabled, setDisabled] = useState<boolean>(false);
  const formRef = useRef<ProFormInstance>();

  const columns: ProColumns<GithubIssueItem>[] = [
    {
      title: 'cluster',
      key: 'cluster',
      hideInTable: true,
      dataIndex: 'cluster',
      renderFormItem: (_item, { type, defaultRender, ...rest }) => {
        return (
          <MySelect
            {...rest}
            state={{
              type: 0,
            }}
          />
        );
      },
    },
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
                await DbTableItem.delete({
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
            if (!params.cluster) {
              return { success: true, data: [] };
            }
            let data = await DbTableList.get({
              clusterName: params.cluster,
            });
            const { current, pageSize, cluster, ...options } = params;
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
