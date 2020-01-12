import React from 'react';
import BaseComponent from './BaseComponent';
import ArrayDataStore from '../stores/data/array-data-store';

import {observer} from 'mobx-react';

@observer
export default class BaseComponentWithStore extends BaseComponent {
    getDisplayField() {
        return this.props.displayField || 'name'
    }

    getValueField() {
        return this.props.valueField || 'id';
    }

    getData() {
        let {store, isSimpleListStoreMode} = this.props;

        if(!store) {
            return [];
        }
        let data = [];

        if(store instanceof Array) {
            data = store;
        } else {
            data = store.getData;
        }
        if(isSimpleListStoreMode) {
            data = data.map(rec => ({[this.getDisplayField()]: rec, [this.getValueField()]: rec}));
        }
        return data;
    }

    getStore() {
        return this.props.store;
    }

    isArrayStoreMode() {
        return this.getStore() instanceof ArrayDataStore;
    }

    getValue(defaultValue) {
        return this.props.value || defaultValue;
    }

    toggleSelfArrayValuePart(valuePart) {
        const value = (this.getValue() || []).slice(0);
        const valuePartIndex = value.indexOf(valuePart);

        if(valuePartIndex === -1) {
            value.push(valuePart);
            this.tryExecuteHandler('onChangeHandler', [this, value]);
        } else if(valuePartIndex > -1) {
            value.splice(valuePartIndex, 1);
            this.tryExecuteHandler('onChangeHandler', [this, value]);
        }
    }
}