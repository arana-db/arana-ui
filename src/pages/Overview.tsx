import { PageContainer } from '@ant-design/pro-components';
import { Card, Tree } from 'antd';
import type { DataNode } from 'antd/es/tree';
import React from 'react';

const treeData: DataNode[] = [
  {
    title: 'parent 1',
    key: '0-0',
    children: [
      {
        title: 'parent 1-0',
        key: '0-0-0',
        children: [
          { title: 'leaf', key: '0-0-0-0' },
          {
            title: (
              <>
                <div>multiple line title</div>
                <div>multiple line title</div>
              </>
            ),
            key: '0-0-0-1',
          },
          { title: 'leaf', key: '0-0-0-2' },
        ],
      },
      {
        title: 'parent 1-1',
        key: '0-0-1',
        children: [{ title: 'leaf', key: '0-0-1-0' }],
      },
      {
        title: 'parent 1-2',
        key: '0-0-2',
        children: [
          { title: 'leaf', key: '0-0-2-0' },
          {
            title: 'leaf',
            key: '0-0-2-1',
          },
        ],
      },
    ],
  },
];

const Welcome: React.FC = () => {
  return (
    <PageContainer>
      <Card>
        <Tree showLine={true} defaultExpandedKeys={['0-0-0']} treeData={treeData} />
      </Card>
    </PageContainer>
  );
};

export default Welcome;
