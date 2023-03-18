import { useTenantRequest } from '@/services/ant-design-pro/arana';
import { PlusOutlined } from '@ant-design/icons';
import { ModalForm, ProFormText } from '@ant-design/pro-components';
import { Button, message } from 'antd';
import type { EditableFormInstance, ProColumns } from '@ant-design/pro-components';
import { EditableProTable } from '@ant-design/pro-components';
import React, { useRef, useState } from 'react';

type DataSourceType = {
  id: React.Key;
  title?: string;
  decs?: string;
  state?: string;
  created_at?: string;
  update_at?: string;
  children?: DataSourceType[];
};

let i = 0;

const ModalEditForm = ({ formRef, fieldName, title }) => {
  const editorFormRef = useRef<EditableFormInstance<DataSourceType>>();
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() => []);
  const columns: ProColumns<DataSourceType>[] = [
    {
      title: 'type',
      dataIndex: 'type',
    },
    {
      title: 'column',
      dataIndex: 'column',
    },
    {
      title: 'expr',
      dataIndex: 'expr',
    },
    {
      title: 'step',
      dataIndex: 'step',
    },
    {
      title: '操作',
      valueType: 'option',
      width: 200,
      render: (text, record, index, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.id);
          }}
        >
          编辑
        </a>,
        <a
          key="delete"
          onClick={() => {
            console.log('text, record, index, action', text, record, index, action);
            const tableDataSource = formRef.current?.getFieldValue(fieldName) as DataSourceType[];
            formRef.current?.setFieldsValue({
              [fieldName]: tableDataSource.filter((item) => item.id !== record.id),
            });
          }}
        >
          删除
        </a>,
      ],
    },
  ];

  return (
    <EditableProTable<DataSourceType>
      rowKey={(record) => {
        if (record.id) return record.id;
        const key = Object.keys(record)
          .map((k) => record[k])
          .join('.');
        record.id = key;
        return key;
      }}
      scroll={{
        x: 1200,
      }}
      editableFormRef={editorFormRef}
      headerTitle={title}
      maxLength={5}
      name={fieldName}
      recordCreatorProps={{
        position: 'bottom',
        record: () => ({ id: (Math.random() * 1000000).toFixed(0) }),
      }}
      columns={columns}
      editable={{
        type: 'multiple',
        editableKeys,
        onChange: setEditableRowKeys,
        actionRender: (row, config, defaultDom) => {
          return [
            defaultDom.save,
            defaultDom.delete || defaultDom.cancel,
            <a
              key="set"
              onClick={() => {
                i++;
                editorFormRef.current?.setRowData?.(config.index!, {
                  title: '动态设置的title' + i,
                });
              }}
            >
              动态设置此行
            </a>,
          ];
        },
      }}
    />
  );
};

export default ({
  formRef,
  modalState,
  modalVisible,
  setModalVisible,
  disabled,
  setDisabled,
  ok,
}) => {
  const { DbTableList, DbTableItem } = useTenantRequest();

  return (
    <ModalForm<{
      name: string;
      company: string;
    }>
      title="Create DB Table"
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
        values.db_rules.forEach((item) => {
          item.step = Number(item.step);
        });
        values.tbl_rules.forEach((item) => {
          item.step = Number(item.step);
        });
        if (!modalState) {
          await DbTableList.post(values);
        } else {
          values.clusterName = 'employees';
          values.tableName = values.name;
          await DbTableItem.put(values);
        }
        message.success('submit success');
        ok();
        return true;
      }}
    >
      <ProFormText
        width="md"
        name="name"
        label="name"
        rules={[
          { required: true, message: 'Please input your cluster group name!', type: 'string' },
        ]}
      />
      <ProFormText
        width="md"
        name={['attributes', 'sqlMaxLimit']}
        label="sqlMaxLimit"
        rules={[
          { required: true, message: 'Please input your cluster group name!', type: 'string' },
        ]}
      />
      <ProFormText
        width="md"
        name={['sequence', 'type']}
        label="sequence"
        rules={[
          { required: true, message: 'Please input your cluster group name!', type: 'string' },
        ]}
      />{' '}
      <ProFormText
        width="md"
        name={['topology', 'db_pattern']}
        label="db_pattern"
        rules={[
          { required: true, message: 'Please input your cluster group name!', type: 'string' },
        ]}
      />
      <ProFormText
        width="md"
        name={['topology', 'tbl_pattern']}
        label="tbl_pattern"
        rules={[
          { required: true, message: 'Please input your cluster group name!', type: 'string' },
        ]}
      />
      <ModalEditForm formRef={formRef} fieldName={'db_rules'} title="DB Rules" />
      <ModalEditForm formRef={formRef} fieldName={'tbl_rules'} title="TBL Rules" />
    </ModalForm>
  );
};
