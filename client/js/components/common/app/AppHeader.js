import React from 'react';
import BaseComponent from '../../BaseComponent';
import {observer} from 'mobx-react';

@observer
class AppHeader extends BaseComponent {
    render() {
        return (
            <header className="cobu-app-header">
                <img src="/resources/images/common/cobu-logo.png"/>
            </header>
        );
    }
};

export default AppHeader;