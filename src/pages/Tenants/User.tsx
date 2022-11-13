import { useTenantRequest } from '@/services/ant-design-pro/arana';
import { ModalForm, ProFormText } from '@ant-design/pro-components';
import { message } from 'antd';

export default ({
  formRef,
  tenant,
  modalState,
  modalVisible,
  setModalVisible,
  disabled,
  setDisabled,
  ok,
}) => {
  const { TenantItem } = useTenantRequest()
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
        console.log(tenant);
        console.log(modalState)
        console.log(values);




        if (!modalState) {
          const existed = tenant.users.find(({ username: u }) => {
            return u === values.username;
          });
          if (existed) {
            message.error('current user existed');
            return;
          }
          tenant.tenantName = tenant.name;
          tenant.users.push(values);
          await TenantItem.put(tenant);
        } else {
          const existed = tenant.users.find(({ username: u }) => {
            return u === modalState.username;
          });
          Object.assign(existed, values);
          tenant.tenantName = tenant.name;
          await TenantItem.put(tenant);
        }
        message.success('submit success');
        ok();
        return true;
      }}
    >
      <ProFormText width="md" name="username" label="username" />
      <ProFormText.Password width="md" name="password" label="password" />
    </ModalForm>
  );
};
