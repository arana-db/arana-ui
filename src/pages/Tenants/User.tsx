import { TenantItem, TenantList } from '@/services/ant-design-pro/arana';
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
        console.log(values);

        const existed = tenant.users.find(({ username: u }) => {
          return u === values.username;
        });

        if (existed) {
          message.error('current user existed');
          return;
        }
        if (!modalState) {
          await TenantList.post(values);
        } else {
          await TenantItem.put(values);
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
