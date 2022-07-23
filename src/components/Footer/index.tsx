import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';

const Footer: React.FC = () => {
  const intl = useIntl();
  const defaultMessage = intl.formatMessage({
    id: 'app.copyright.produced',
    defaultMessage: 'Arana团队出品',
  });

  const currentYear = new Date().getFullYear();

  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      copyright={`${currentYear} ${defaultMessage}`}
      links={[
        {
          key: 'Arana DB',
          title: (
            <span>
              {' '}
              <GithubOutlined />
              &nbsp;&nbsp;Arana DB
            </span>
          ),
          href: 'https://github.com/arana-db/arana',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
