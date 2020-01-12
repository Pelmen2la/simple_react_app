import BaseStoreWithDataModification from './../base/base-store-with-data-modification';
import {observable, computed, action} from 'mobx';

class BaseDataStore extends BaseStoreWithDataModification {
    constructor(cfg={}) {
        super(cfg);
        this.cfg = cfg;
        this.url = cfg.url;
        this.getFiltersFn = cfg.getFiltersFn;
        this.listeners = cfg.listeners || {};
        this.fields = this.createFields(cfg.fields);
        this.isRemoteFilter = cfg.isRemoteFilter;
        this.filters = cfg.filters || {};
    }

    @observable isDataLoadingInProcess = false;
    @observable isSavingInProcess = false;
    @observable filters = {};

    @computed get getIsDataLoadingInProcess() {
        return this.isDataLoadingInProcess;
    }

    @computed get getIsSavingInProcess() {
        return this.isSavingInProcess;
    }

    setUrl(url) {
        this.url = url;
    }

    getUrl() {
        return this.url;
    }

    getLoadDataUrl() {
        let url = this.getUrl();

        const loadParams = this.getLoadDataUrlParams();
        const loadParamsKeys = Object.keys(loadParams);
        if(loadParamsKeys.length) {
            url += '?' + loadParamsKeys.map(k => `${k}=${loadParams[k]}`).join('&');
        }

        return url;
    }

    getLoadDataUrlParams() {
        let loadParams = {};
        if(this.isRemoteFilter) {
            const filters = this.getFilters();
            if(Object.keys(filters).length) {
                loadParams.filters = JSON.stringify(filters);
            }
        }

        return loadParams;
    }

    async doRequest() {
        if(!this.url) {
            return;
        }
        return await super.doRequest.apply(this, arguments);
    }

    createFields(fieldCfgs) {
        const fields = [];
        if(!fieldCfgs) {
            return fields;
        }

        fieldCfgs.forEach(fc => {
            if(typeof fc === 'string') {
                fields.push({name: fc, type: 'string'});
            } else if(typeof fc === 'object') {
                fc.type = fc.type || 'string';
                fields.push(fc);
            }
        });

        return fields;
    }

    getFieldDefaultValue(fieldCfg) {
        if(fieldCfg.defaultValue) {
            return fieldCfg.defaultValue;
        }

        const fieldType = fieldCfg.type || 'string';
        return {
            string: '',
            date: new Date(),
            array: [],
            object: {},
            number: 0
        }[fieldType];
    }

    getNewRecordData() {
        const recordData = {};

        (this.fields || []).map(f => {
            recordData[f.name] = this.getFieldDefaultValue(f);
        });

        return recordData;
    }

    tryExecuteListener(listenerName, args) {
        const listener = this.listeners[listenerName];
        if(listener) {
            listener(...([this].concat(args)));
        }
    }

    getFilters() {
        if(this.getFiltersFn) {
            return this.getFiltersFn();
        } else {
            return this.filters;
        }
    }

    getFilterValue(filterFieldName) {
        const filter = this.getFilters()[filterFieldName];
        return filter ? filter.value : null;
    }

    @action filterBy(filterName, filterFn) {
        this.addFilter({fieldName: filterName, filterFn});
    }

    @action filter(fieldName, value, comparisonType) {
        this.addFilter({fieldName, value, comparisonType});
    }

    @action
    addFilter(filterCfg) {
        const {fieldName, value, comparisonType, filterFn} = filterCfg;
        const filters = this.getFilters();
        const existingFilter = filters[fieldName];

        if(existingFilter && !value && !filterFn) {
            delete filters[fieldName];
        } else {
            filters[fieldName] = filterFn || {
                fieldName,
                value,
                comparisonType,
            };
        }
        if(this.isRemoteFilter) {
            this.reload();
        }
    }
}

export default BaseDataStore;