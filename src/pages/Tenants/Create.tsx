import { useTenantRequest } from '@/services/ant-design-pro/arana';
import { PlusOutlined } from '@ant-design/icons';
import { ModalForm, ProFormText, EditableProTable } from '@ant-design/pro-components';
import type { ProColumns, EditableFormInstance } from '@ant-design/pro-components';
import { Button, message } from 'antd';
import { useState, useRef } from 'react';

type DataSourceType = {
  id: React.Key;
  title?: string;
  readonly?: string;
  decs?: string;
  state?: string;
  created_at?: string;
  update_at?: string;
  children?: DataSourceType[];
};

export default ({
  formRef,
  modalState ,
  modalVisible,
  setModalVisible,
  disabled,
  setDisabled,
  ok,
}) => {
  const {TenantItem, TenantList} = useTenantRequest();
  const [dataSource] = useState<readonly DataSourceType[]>([]);
  const editorFormRef = useRef<EditableFormInstance<DataSourceType>>();
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() =>
    dataSource.map((item) => item.id)
  );

  const columns: ProColumns<DataSourceType>[] = [
    {
      title: 'username',
      dataIndex: 'username',
      formItemProps: () => {
        return [{ required: true, message: 'username is required' }];
      },
    },
    {
      title: 'password',
      dataIndex: 'password',
      valueType: 'password',
      formItemProps: () => {
        return [{ required: true, message: 'password is required' }]
      },
    },
    {
      title: 'Operate',
      valueType: 'option',
      width: 200,
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.id);
          }}
        >
          Edit
        </a>,
        <a
          key="delete"
          onClick={() => {
            const tableDataSource = formRef.current?.getFieldValue('users') as DataSourceType[];
            console.log(tableDataSource,record.id)

            formRef.current?.setFieldsValue({
              users: tableDataSource.filter((item) => item.id !== record.id),
            });
          }}
        >
          Delete
        </a>,
      ],
    },
  ];
  return (
    <ModalForm<{
      name: string;
      company: string;
    }>
      title="Create tenant"
      visible={modalVisible}
      onVisibleChange={(visible) => {
        setModalVisible(visible);
        if (!visible) {
          setDisabled(false);
        }
      }}
      trigger={
        <Button
          type="primary"
          onClick={() => {
            setModalVisible(true);
          }}
        >
          <PlusOutlined />
          Create
        </Button>
      }
      disabled={disabled}
      autoFocusFirstInput
      modalProps={{
        onCancel: () => console.log('run'),
        destroyOnClose: true,
      }}
      initialValues={modalState}
      formRef={formRef}
      submitTimeout={2000}
      onFinish={async (values) => {
        const updateValues = {
          ...(modalState || {}),
          ...values
        }
        if (!modalState) {
          updateValues.tenantName = values.name;
          await TenantList.post(updateValues);
        } else {
          updateValues.tenantName = modalState.name;
          await TenantItem.put(updateValues);
        }
        message.success('submit success');
        ok();
        return true;
      }}
    >
      <ProFormText width="md" name="name" label="name" />
      <EditableProTable<DataSourceType>
        rowKey="id"
        editableFormRef={editorFormRef}
        headerTitle="users"
        name="users"
        recordCreatorProps={{
          position: 'bottom',
           record: () => ({ id: (Math.random() * 1000000).toFixed(0) }),
        }}
        columns={columns}
        editable={{
          type: 'multiple',
          editableKeys,
          onChange: setEditableRowKeys,
        }}
      />
    </ModalForm>
  );
};
