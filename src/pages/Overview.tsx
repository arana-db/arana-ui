import { getOverviewTree } from '@/services/ant-design-pro/api';
import { PageContainer } from '@ant-design/pro-components';
import { Card, message, Popover, Tabs, Tree } from 'antd';

import React, { useEffect, useState } from 'react';
// import MonacoEditor from 'react-monaco-editor';
const { TabPane } = Tabs;

const Welcome: React.FC = () => {
  // const [overview, setOverview] = useState<Record<string, any> | null>(null);
  const [overviewTree, setOverviewTree] = useState<any[] | undefined>(undefined);
  useEffect(() => {
    (async () => {
      const hide = message.loading('loading');
      // const res = await getOverview();
      hide();
      // setOverview(res);
    })();
    (async () => {
      const hide = message.loading('loading');
      const res = await getOverviewTree();
      hide();
      setOverviewTree(res);
    })();
  }, []);
  return (
    <PageContainer>
      <Card>
        <Tabs defaultActiveKey="1">
          <TabPane tab="Tree" key="1">
            {overviewTree && overviewTree.length > 0 && (
              <Tree
                showLine={true}
                defaultExpandAll={true}
                treeData={overviewTree}
                titleRender={({ title }) => (
                  <Popover content={title} title="Title">
                    <span>{title}</span>
                  </Popover>
                )}
              />
            )}
          </TabPane>
          <TabPane tab="JSON" key="3" style={{ width: '100%' }}>
            {/* <MonacoEditor
              width={'100%'}
              height={400}
              language="json"
              theme="vs"
              value={JSON.stringify(overview, null, 4)}
              options={EDITOR_OPTIONS}
            /> */}
          </TabPane>
        </Tabs>
      </Card>
    </PageContainer>
  );
};

export default Welcome;
