import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import 'react-perfect-scrollbar/dist/css/styles.css';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import 'react-quill/dist/quill.snow.css';
import 'prismjs/prism';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'nprogress/nprogress.css';
import 'src/assets/css/prism.css';
import {enableES5} from 'immer';

import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from 'src/serviceWorker';

import App from './App';
import Providers from './providers';

enableES5();

ReactDOM.render(
    <Providers>
        <App/>
    </Providers>,
    document.getElementById('root')
);

serviceWorker.unregister();
