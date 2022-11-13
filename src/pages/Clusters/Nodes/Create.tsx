import { useTenantRequest } from '@/services/ant-design-pro/arana';
import { PlusOutlined } from '@ant-design/icons';
import { ModalForm, ProForm, ProFormText } from '@ant-design/pro-components';
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
  const { NodeItem, NodeList } = useTenantRequest();
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
        values.port = Number(values.port)
        if (!modalState) {
          await NodeList.post(values);
        } else {
          await NodeItem.put(values);
        }
        message.success('submit success');
        ok();
        return true;
      }}
    >
      <ProForm.Group>
        <ProFormText width="md" name="name" label="name" />
        <ProFormText width="md" name="database" label="database" />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText width="md" name="host" label="host" />
        <ProFormText width="md" name="port" label="port"
         rules={[{ required: true, message: 'Please input your port!', type: 'string' }]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText width="md" name="username" label="username" />
        <ProFormText.Password width="md" name="password" label="password" />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText width="md" name="weight" label="weight" />
      </ProForm.Group>
    </ModalForm>
  );
};
