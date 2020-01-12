import BaseStore from './base-store';
import {action} from "mobx";

const RECORD_BEFORE_EDIT_DATA_PROP_NAME = '_beforeEditData';
const RECORD_IS_EDIT_PROP_NAME = '_isEdit';
const RECORD_IS_NEW_PROP_NAME = '_isNew';

class BaseStoreWithDataModification extends BaseStore {
    get getRecordBeforeEditDataPropName() {
        return RECORD_BEFORE_EDIT_DATA_PROP_NAME;
    }

    get getRecordIsEditPropName() {
        return RECORD_IS_EDIT_PROP_NAME;
    }

    get getRecordIsNewPropName() {
        return RECORD_IS_NEW_PROP_NAME;
    }

    async doRequestCore() {
        const result = await super.doRequestCore.apply(this, arguments);
        return result;
    }

    @action
    startRecordEditing(record) {
        record[this.getRecordBeforeEditDataPropName] = this.dataHelper.cloneObject(record, true);
        record[this.getRecordIsEditPropName] = true;
    }

    @action stopRecordEditing(record, revertData) {
        if(revertData) {
            Object.assign(record, record[this.getRecordBeforeEditDataPropName]);
        }
        this.removeRecordAllTechFields(record);
    }

    @action removeRecordAllTechFields(record) {
        Object.keys(record).forEach(key => {
            if(key.indexOf('_') === 0) {
                delete record[key];
            }
        })
    }

    @action
    updateRecord(recordOrRecordName, propNameOrObj, value) {
        const record = recordOrRecordName instanceof Object ? recordOrRecordName : this[recordOrRecordName];
        if(propNameOrObj instanceof Object) {
            Object.assign(record, propNameOrObj);
        } else if(typeof (propNameOrObj) === 'string') {
            record[propNameOrObj] = value;
        }
    }

    @action
    deleteRecordFromArray(array, record) {
        array.splice(array.indexOf(record), 1);
    }
}

export default BaseStoreWithDataModification;