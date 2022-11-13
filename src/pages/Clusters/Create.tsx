import { useTenantRequest } from '@/services/ant-design-pro/arana';
import { PlusOutlined } from '@ant-design/icons';
import { ModalForm, ProForm, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { Button, message } from 'antd';

export default ({
  formRef,
  modalState,
  modalVisible,
  setModalVisible,
  disabled,
  setDisabled,
  ok,
  onCancel
}) => {
  const { ClusterItem, ClusterList, GroupList } = useTenantRequest();
  return (
    <ModalForm<{
      name: string;
      company: string;
    }>
      title="Create Cluster"
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
        onCancel,
        destroyOnClose: true,
      }}
      initialValues={modalState}
      formRef={formRef}
      submitTimeout={2000}
      onFinish={async (values) => {
        const updateValues = {
          ...(modalState || {}),
          clustersName: values.name,
          ...values
        }
        if (!modalState) {
          await ClusterList.post(updateValues);
        } else {
          await ClusterItem.put(updateValues);
        }
        message.success('submit success');
        ok();
        return true;
      }}
    >
      <ProForm.Group>
        <ProFormText width="md" name="name" label="name"
          rules={[{ required: true, message: 'Please input your cluster name!', type: 'string' }]}
        />
        <ProFormText width="md" name="type" label="type" rules={[{ required: true, message: 'Please input your database connection type!', type: 'string' }]}/>
      </ProForm.Group>
      <ProFormSelect
        name="groups"
        label="Node Group[multiple]"
        request={async ({ keyWords = '' }) => {
          const res = await GroupList.get({});
          return res.map(({ name }) => ({
            label: name,
            value: name,
          }));
        }}
        fieldProps={{
          mode: 'multiple',
        }}
        placeholder="Please select favorite colors"
        rules={[{ required: true, message: 'Please select your favorite colors!', type: 'array' }]}
      />
    </ModalForm>
  );
};
