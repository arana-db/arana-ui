import { useTenantRequest } from '@/services/ant-design-pro/arana';
import { PlusOutlined } from '@ant-design/icons';
import { ModalForm, ProFormText } from '@ant-design/pro-components';
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
  const { TenantItem, TenantList } = useTenantRequest();
  return (
    <ModalForm<{
      name: string;
      company: string;
    }>
      title="Create Tenant"
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
          ...values,
        };
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
    </ModalForm>
  );
};
