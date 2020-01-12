import BaseStoreWithDataModification from './base-store-with-data-modification';
import ArrayDataStore from './../data/array-data-store';
import TreeStore from './../data/tree-store';
import FormRecord from './../data/form-record';
import {computed, observable, action} from "mobx";

class BaseComponentStore extends BaseStoreWithDataModification {
    //for override
    init() {
    }

    @observable isInitialized = false;

    @computed get getIsInitialized() {
        return this.getProp('isInitialized');
    }

    @action setIsInitialized(val) {
        this.setProp('isInitialized', val);
    }

    createArrayDataStore(cfg) {
        return new ArrayDataStore(cfg);
    }

    createTreeStore(cfg) {
        return new TreeStore(cfg);
    }

    createFormRecord(cfg) {
        return new FormRecord(cfg);
    }
}

export default BaseComponentStore;