import {useContext} from 'react';
import SettingsContext, {SettingsContextValue} from 'src/store/SettingsContext';

const useSettings = (): SettingsContextValue => useContext(SettingsContext);

export default useSettings;
