import { GroupItem, GroupList, NodeList } from '@/services/ant-design-pro/arana';
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
        if (!modalState) {
          await GroupList.post(values);
        } else {
          await GroupItem.put(values);
        }
        message.success('submit success');
        ok();
        return true;
      }}
    >
      <ProFormText width="md" name="name" label="name" />
      <ProFormSelect
        name="select-multiple"
        label="Select[multiple]"
        request={async ({ keyWords = '' }) => {
          console.log(keyWords);
          const res = await NodeList.get({});
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
