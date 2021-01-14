import React, {FC} from 'react';
import {Layout, Menu} from 'antd';
import {AppstoreTwoTone, CloudOutlined, CodeFilled, UserOutlined} from '@ant-design/icons';

const {SubMenu} = Menu;
const {Header, Content, Sider} = Layout;

interface LayoutProps {
    children: React.ReactNode
}

const Main: FC<LayoutProps> = ({children}: LayoutProps) => {

    return (
        <main>
            <Header>

            </Header>
            <Layout style={{height: 'calc(100% - 64px)'}}>
                <Sider width={220}>
                    <Menu
                        mode='inline'
                        defaultSelectedKeys={['sub1']}
                        style={{height: '100%', borderRight: 0}}
                    >
                        <Menu.Item key='sub1' icon={<AppstoreTwoTone/>}>Dashboard</Menu.Item>
                        <SubMenu key='sub2' icon={<UserOutlined/>} title='Datasets'>
                            <Menu.Item key='1'>Dogs & cat</Menu.Item>
                            <Menu.Item key='2'>COCOA</Menu.Item>
                        </SubMenu>
                        <Menu.Item key='sub3' icon={<CloudOutlined/>}>Tasks</Menu.Item>
                        <Menu.Item key='sub3' icon={<CodeFilled/>}>API</Menu.Item>
                    </Menu>
                </Sider>
                <Layout style={{padding: '0 24px 24px'}}>
                    <Content
                        className='site-layout-background'
                        style={{
                            padding: 24,
                            margin: 0,
                            minHeight: 280,
                        }}
                    >
                        {children}
                    </Content>
                </Layout>
            </Layout>
        </main>
    );
};

export default Main;
