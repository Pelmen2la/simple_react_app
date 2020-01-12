import BaseDataStore from './base-data-store';
import {observable, computed, action} from 'mobx';

class FormRecord extends BaseDataStore {
    constructor(cfg={}) {
        super(cfg);

        if(cfg.data) {
            this.data = cfg.data;
        }
    }

    @observable data = {};

    @computed get getData() {
        return this.data;
    }

    get(propName) {
        return this.getData[propName];
    }

    getId() {
        return this.get('id');
    }

    @action set(propName, value) {
        return this.data[propName] = value;
    }

    @action setData(data) {
        this.data = this.prepareData(data);
    }

    @action update(propNameOrObj, value) {
        this.updateRecord(this.data, propNameOrObj, value);
    }

    @action updateNestedRecord(record, propNameOrObj, value) {
        this.updateRecord(record, propNameOrObj, value);
    }

    updateRecord(record, propNameOrObj, value) {
        if(!propNameOrObj) {
            return;
        }

        if(propNameOrObj instanceof Object) {
            Object.assign(record, propNameOrObj);
        } else if(typeof (propNameOrObj) === 'string') {
            record[propNameOrObj] = value;
        }
    }

    @action async loadRecordData(recordId) {
        this.data.id = recordId;
        return await this.load();
    }

    @action async load() {
        const loadResult = await this.doRequest(this.getUrl(true), {}, 'isDataLoadingInProcess');
        const data = loadResult.success ? loadResult.data : {};
        this.tryExecuteListener('onLoad', [data]);
        this.setData(data);
        return loadResult;
    }

    @action async save() {
        const data = this.getData;
        const hasId = !!data.id;
        const saveResult = await this.doDataRequest(this.getUrl(hasId), hasId ? 'PUT' : 'POST', data, 'isSavingInProcess');
        return saveResult;
    }

    getUrl(withRecId) {
        return this.url + (withRecId ? `/${this.getData.id}` : '')
    }

    prepareData(data) {
        this.fields.forEach(f => {
            if(data[f.name] === undefined) {
                data[f.name] = this.getFieldDefaultValue(f);
            }
        });
        return data;
    }
}

export default FormRecord;