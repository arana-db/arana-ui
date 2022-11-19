import { useTenantRequest } from '@/services/ant-design-pro/arana';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { SelectLang, useModel } from '@umijs/max';
import { Space, Menu } from 'antd';
import React from 'react';
import { useCallback } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import HeaderDropdown from '../HeaderDropdown';
import HeaderSearch from '../HeaderSearch';
import Avatar from './AvatarDropdown';
import styles from './index.less';

export type SiderTheme = 'light' | 'dark';


export const TenantMenu = () => {
  const { TenantList } = useTenantRequest();
  const { initialState, setInitialState } = useModel('@@initialState');
  const [ tenantMenus, setTenantMenus] = useState<any>([]);

  const getTenantMenus = useCallback(async () => {
    const res = await TenantList.get({});
    const tenantList = res.map(({name}) => name);
    setTenantMenus(tenantList);
  }, [])
  useEffect(() => {
    getTenantMenus()
  }, [])
  return <Menu selectedKeys={[initialState.currentUser?.tenantName]} onClick={(v) => {
    setInitialState((s) => ({
        ...s,
        currentUser: {
          ...s?.currentUser,
          tenantName: v.key
        },
      }))
  }}>
    {
      tenantMenus.map((name) => {
        return <Menu.Item key={name}>
          {name}
        </Menu.Item>
      })
    }
  </Menu>
}

const GlobalHeaderRight: React.FC = () => {
  const { initialState } = useModel('@@initialState');

  if (!initialState || !initialState.settings) {
    return null;
  }

  const { navTheme, layout } = initialState.settings;
  let className = styles.right;

  if ((navTheme === 'dark' && layout === 'top') || layout === 'mix') {
    className = `${styles.right}  ${styles.dark}`;
  }
  return (
    <Space className={className}>
      <HeaderSearch
        className={`${styles.action} ${styles.search}`}
        placeholder="站内搜索"
        defaultValue="umi ui"
        options={[
          { label: <a href="https://umijs.org/zh/guide/umi-ui.html">umi ui</a>, value: 'umi ui' },
          {
            label: <a href="next.ant.design">Ant Design</a>,
            value: 'Ant Design',
          },
          {
            label: <a href="https://protable.ant.design/">Pro Table</a>,
            value: 'Pro Table',
          },
          {
            label: <a href="https://prolayout.ant.design/">Pro Layout</a>,
            value: 'Pro Layout',
          },
        ]}
        // onSearch={value => {
        //   console.log('input', value);
        // }}
      />
      <span
        className={styles.action}
        onClick={() => {
          window.open('https://pro.ant.design/docs/getting-started');
        }}
      >
        <QuestionCircleOutlined />
      </span>

      <HeaderDropdown overlay={
        <TenantMenu />
      }>
        <div>
          {initialState.currentUser?.tenantName}
        </div>
      </HeaderDropdown>
      <Avatar />
      <SelectLang className={styles.action} />
    </Space>
  );
};
export default GlobalHeaderRight;
