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
  const { UserItem, UserList } = useTenantRequest();

  return (
    <ModalForm<{
      name: string;
      company: string;
    }>
      title={modalState ? 'Edit User' : 'Create User'}
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
          updateValues._userName = values.username;
          await UserList.post(updateValues);
        } else {
          updateValues._userName = modalState.username;
          await UserItem.put(updateValues);
        }
        message.success('submit success');
        ok();
        return true;
      }}
    >
      <ProFormText width="md" name="username" label="username" />
      <ProFormText width="md" name="password" label="password" />
    </ModalForm>
  );
};
