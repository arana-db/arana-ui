import { useTenantRequest } from '@/services/ant-design-pro/arana';
import { PlusOutlined } from '@ant-design/icons';
import { ModalForm, ProForm, ProFormText } from '@ant-design/pro-components';
import { Button, message } from 'antd';
import { useModel } from '@umijs/max';

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
  const { initialState } = useModel('@@initialState');
  return (
    <ModalForm<{
      name: string;
      company: string;
    }>
      title="Create User"
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
          await TenantList.post(values);
        } else {
          await TenantItem.put({
            ...values,
            _tenantName: initialState?.currentUser?.tenantName,
          });
        }
        message.success('submit success');
        ok();
        return true;
      }}
    >
      <ProFormText width="md" name="tenant" label="tenant" />
      <ProForm.Group>
        <ProFormText width="md" name="username" label="username" />
        <ProFormText.Password width="md" name="password" label="password" />
      </ProForm.Group>
    </ModalForm>
  );
};
