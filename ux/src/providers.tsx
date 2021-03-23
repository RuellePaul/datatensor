import React, {FC} from 'react';
import {Provider} from 'react-redux';
import store from 'src/store';
import {SettingsProvider} from 'src/contexts/SettingsContext';

const Providers: FC = ({children}) => {
    return (
        <Provider store={store}>
            <SettingsProvider>
                {children}
            </SettingsProvider>
        </Provider>
    )
};

export default Providers;