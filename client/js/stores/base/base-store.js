import dataHelper from '../../helpers/data';
import {action} from "mobx";

class BaseStore {
    constructor() {
        this.baseUrlPart = '';
    }

    get dataHelper() {
        return dataHelper;
    }

    @action setProp(propName, value) {
        this[propName] = value;
    }

    getProp(propName) {
        return this[propName];
    }

    doRequest(url, params = {}, isLoadingInProcessPropName) {
        return new Promise(async resolve => {
            const result = await this.doRequestCore(url, params, isLoadingInProcessPropName);
            resolve(result);
        });
    }

    doDataRequest(url, method, body, isLoadingInProcessPropName) {
        return new Promise(async resolve => {
            const result = await this.doRequestCore(url, {method, body}, isLoadingInProcessPropName);
            resolve(result);
        });
    }

    doRequestCore(url, params = {}, isLoadingInProcessPropName) {
        return new Promise(async resolve => {
            this.trySetIsLoadingInProcessPropValue(isLoadingInProcessPropName, true);
            url = this.getRequestUrl(url);
            const requestResult = params.body ? await window.cobuAppModule.utils.doDataRequest(url, params.method, params.body) :
                await window.cobuAppModule.utils.doRequest(url, params);
            resolve(requestResult);
            this.trySetIsLoadingInProcessPropValue(isLoadingInProcessPropName, false);
        });
    }

    getRequestUrl(relativeUrl) {
        return this.getDataRequestBaseUrlPart() + relativeUrl;
    }

    trySetIsLoadingInProcessPropValue(propName, value) {
        if(propName) {
            this[propName] = value;
            return true;
        }
        return false;
    }

    getDataRequestBaseUrlPart() {
        return '/api' + this.baseUrlPart;
    }
}

export default BaseStore;