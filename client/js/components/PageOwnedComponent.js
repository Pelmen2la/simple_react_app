import React from 'react';
import BaseComponent from './BaseComponent';

import {observer} from 'mobx-react';

@observer
class PageOwnedComponent extends BaseComponent {
    render() {
        return '';
    }

    get getOwnerPageStore() {
        return this.props.ownerPageStore;
    }

    get getComponentName() {
        return this.props.name || this.name || '';
    }

    get getCapComponentName() {
        return window.cobuAppModule.utils.capitalizeString(this.getComponentName);
    }

    get getState() {
        return this.getOwnerPageStore[`${this.getComponentName}State`];
    }

    updateState(newState) {
        Object.assign(this.getState, newState);
    }

    get getData() {
        return this.getState.data;
    }

    updateData(data) {
        Object.assign(this.getData, data);
    }

    resetState() {
        this.getOwnerPageStore[`reset${this.getCapComponentName}State`]();
    }
}

export default PageOwnedComponent;