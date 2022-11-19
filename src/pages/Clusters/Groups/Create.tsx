import { useTenantRequest } from '@/services/ant-design-pro/arana';
import { PlusOutlined } from '@ant-design/icons';
import { ModalForm, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { Button, message } from 'antd';

export default ({
  formRef,
  modalState,
  modalVisible,
  setModalVisible,
  disabled,
  setDisabled,
  ok,
}) => {
  const { ClusterGroupItem, ClusterGroupList, NodeList, ClusterList } = useTenantRequest();
  return (
    <ModalForm<{
      name: string;
      company: string;
    }>
      title="Create Cluster Group"
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
        if (!modalState) {
          await ClusterGroupList.post(values);
        } else {
          await ClusterGroupItem.put(values);
        }
        message.success('submit success');
        ok();
        return true;
      }}
    >
      <ProFormSelect
        name="clusterName"
        label="cluster"
        request={async ({ keyWords = '' }) => {
          const res = await ClusterList.get({});
          return res.map(({ name }) => ({
            label: name,
            value: name,
          }));
        }}
        placeholder="Please select cluster"
        rules={[{ required: true, message: 'Please select your cluster!', type: 'string' }]}
      />
      <ProFormText width="md" name="name" label="name"
        rules={[{ required: true, message: 'Please input your cluster group name!', type: 'string' }]}
      />
      <ProFormSelect
        name="nodes"
        label="Cluster Group Node[multiple]"
        request={async ({ keyWords = '' }) => {
          const res = await NodeList.get({});
          return res.map(({ name }) => ({
            label: name,
            value: name,
          }));
        }}
        fieldProps={{
          mode: 'multiple',
        }}
        placeholder="Please select cluster group node"
        rules={[{ required: true, message: 'Please select your cluster group node!', type: 'array' }]}
      />
    </ModalForm>
  );
};
