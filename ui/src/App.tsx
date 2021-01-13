import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';

import React, {FC} from 'react';
import './assets/scss/index.scss';

import {Button} from 'antd';

const App: FC = () => (
    <div>
        <Button type='primary'>Button</Button>
    </div>
);

export default App;