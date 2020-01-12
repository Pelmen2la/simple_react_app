import BaseDataStore from './base-data-store';
import {observable, computed, action} from 'mobx';

class ArrayDataStore extends BaseDataStore {
    constructor(cfg={}) {
        cfg.fields = cfg.isSimpleStoreMode || !cfg.fields ? ['id', 'name'] : cfg.fields;
        super(cfg);

        if(cfg.pagingCfg || cfg.hasPaging) {
            this.pagingProps = {
                pagingType: (cfg.pagingCfg || {}).pagingType || 'normal',
                pageSize: (cfg.pagingCfg || {}).pageSize || 25,
                pageIndex: 0,
                total: 0
            }
        }

        this.cleanData = this.prepareData(cfg.data || []);
        ['extraItems', 'sorters'].forEach(propName => this[propName] = cfg[propName] || []);

        if(cfg.loadOnCreate) {
            this.load();
        }
    }

    @observable cleanData = [];
    @observable sorters = [];

    @computed get getCleanData() {
        return this.cleanData;
    }

    @computed get getData() {
        let data = this.extraItems.concat(this.cleanData);

        if(!this.isRemoteFilter) {
            data = this.filterData(data, this.getFilters());
        }
        data = this.sortData(data, this.sorters);

        return data;
    }

    @computed get getNotNewRecords() {
        return this.getData.filter(c => !c[this.getRecordIsNewPropName]);
    }

    @computed get getStableData() {
        return this.getNotNewRecords.map(this.getRecordStableData.bind(this));
    }

    forEach(fn) {
        (this.getCleanData || []).forEach(fn);
    }

    count(filtered=false) {
        let data = this.getCleanData;
        if(filtered) {
            data = this.filterData(data, this.getFilters());
        }
        return data.length;
    }

    isEmpty(filtered=false) {
        return this.count(filtered) === 0;
    }

    isAllDataLoaded() {
        return !this.pagingProps || this.count() >= this.pagingProps.total;
    }

    collect(fieldName) {
        const res = [];
        const tryAddValToRes = (val) => {
            if(val !== undefined && val !== null && res.indexOf(val) === -1) {
                res.push(val);
            }
        };

        this.forEach(rec => {
            const val = rec[fieldName];
            if(val instanceof Array) {
                val.forEach(tryAddValToRes);
            } else {
                tryAddValToRes(val);
            }
        });
        return res;
    }

    sum(fieldName) {
        return this.getData.reduce((sum, next) => {
            let val = next[fieldName];
            if(isNaN(parseFloat(val))) {
                val = 0
            }
            return sum + val;
        }, 0);
    }

    getFilteredData(fieldNameOrFn, value, includeExistingFilters) {
        const data = this[includeExistingFilters ? 'getData' : 'getCleanData'];
        return this.processDataFilter(data, typeof fieldNameOrFn === 'function' ? fieldNameOrFn : {
            fieldName: fieldNameOrFn,
            value
        });
    }

    getRecordStableData(rec) {
        return rec[this.getRecordBeforeEditDataPropName] || rec;
    }

    getById(id) {
        return this.findRecord('id', id);
    }

    getAt(index) {
        return this.getData[index];
    }

    findRecord(propName, value) {
        return this.getData.find(r => r[propName] == value);
    }

    findRecordById(recId) {
        return this.findRecord('id', recId);
    }

    findRecordByFn(fn) {
        return this.getData.find(r => fn(r));
    }

    findRecordsByFn(fn) {
        return this.getData.filter(r => fn(r));
    }

    indexOf(rec, params = {}) {
        return this[params.withoutFilter ? 'getCleanData' : 'getData'].indexOf(rec);
    }

    prepareData(data) {
        if(!data) {
            return '';
        }
        if(this.cfg.isSimpleStoreMode) {
            data = data.map(r => ({id: r, name: r}));
        }
        if(this.cfg.prepareDataFn) {
            data = this.cfg.prepareDataFn(data);
        }
        return data;
    }

    filterData(data, filters) {
        for(let key in filters) {
            const filter = filters[key];
            data = this.processDataFilter(data, filter);

            if(!data.length) {
                return data;
            }
        }
        return data;
    }

    processDataFilter(data, filter) {
        if(filter.filterFn || typeof filter === 'function') {
            return data.filter(filter.filterFn || filter);
        }

        return data.filter(rec => {
            let val1 = filter.value;
            let val2 = rec[filter.fieldName];

            if(typeof val1 === 'string' && typeof val2 === 'string') {
                val1 = val1.toLowerCase();
                val2 = val2.toLowerCase();
            }

            return window.cobuAppModule.utils.compareValues(val1, val2, filter.comparisonType || 'eq');
        });
    }

    sortData(data, sorters) {
        if(!sorters || !sorters.length) {
            return data;
        }
        return data.slice().sort((a, b) => {
            for(let i = 0; i < sorters.length; i++) {
                const sorter = sorters[i];

                if(sorter.sortFn) {
                    return sorter.sortFn(a, b);
                } else {
                    const isAsc = sorter.direction == 'asc';
                    a = a[sorter.orderBy];
                    b = b[sorter.orderBy];

                    if(window.cobuAppModule.utils.compareValues(a, b, 'lt')) {
                        return isAsc ? 1 : -1;
                    }
                    if(window.cobuAppModule.utils.compareValues(a, b, 'gt')) {
                        return isAsc ? -1 : 1;
                    }
                }
            }
            return 0;
        });
    }

    @computed get getSorters() {
        const sorters = this.sorters || [];
        if(this.allowMultiSort) {
            return sorters;
        }
        return sorters.length ? sorters[0] : null;
    }

    @action
    async load() {
        const getDataResult = await this.doRequest(this.getLoadDataUrl(), {}, 'isDataLoadingInProcess');
        let data;
        if(getDataResult.success) {
            if(this.pagingProps) {
                data = getDataResult.data.results;
                this.pagingProps.total = getDataResult.data.count;
            } else {
                data = getDataResult.data
            }
        } else {
            data = [];
        }
        data = this.prepareData(data);
        this.tryExecuteListener('onLoad', [data]);

        if(this.pagingProps && this.pagingProps.pagingType === 'endless-paging') {
            this.cleanData = this.cleanData.concat(data);
        } else {
            this.cleanData = data;
        }

        this.tryExecuteListener('onDataChanged', [data]);
    }

    async setPageSize(pageSize) {
        const pagingProps = this.pagingProps;
        const rowsBeforeCurrentPage = (pagingProps.pageIndex) * pagingProps.pageSize;
        const pageIndex = parseInt(Math.min(rowsBeforeCurrentPage, pagingProps.total) / pageSize);
        this.pagingProps.pageSize = pageSize;
        await this.loadPage(pageIndex);
    }

    async loadNextPage() {
        if(this.isDataLoadingInProcess || this.isAllDataLoaded()) {
            return;
        }

        await this.loadPage(this.pagingProps.pageIndex + 1);
    }

    async loadPage(pageIndex) {
        this.pagingProps.pageIndex = pageIndex;
        await this.load();
    }

    @action
    async reload() {
        await this.load();
    }

    getLoadDataUrlParams() {
        const params = super.getLoadDataUrlParams();

        if(this.pagingProps) {
            params.limit = this.pagingProps.pageSize;
            params.offset = this.pagingProps.pageIndex * this.pagingProps.pageSize;
        }

        return params;
    }

    @action
    setData(data) {
        this.cleanData = this.prepareData(data);
    }

    @action setPageIndex(pageIndex) {
        if(this.pagingProps) {
            this.pagingProps.pageIndex = pageIndex;
        }
    }

    @action resetEndlessPaging() {
        this.setPageIndex(0);
        this.setData([]);
    }

    @action
    deleteRecord(record, onlyLocaly=false) {
        if(!record) {
            return;
        }

        this.cleanData.splice(this.cleanData.indexOf(record), 1);
        if(!onlyLocaly) {
            this.doRequest(this.getRecordActionUrl(record), {method: 'DELETE'});
        }
    }

    @action
    async addNewRecord(recordData, onlyLocaly=false, toEnd=false) {
        return await this.addRecord(recordData, onlyLocaly, toEnd, true);
    }

    async addRecord(recordData, onlyLocaly=false, toEnd=false, isNew=false) {
        if(isNew) {
            recordData = Object.assign(this.getNewRecordData(), recordData);
            recordData[this.getRecordIsEditPropName] = true;
        }
        if(this.url && !onlyLocaly) {
            const saveRecordResponse = await this.doDataRequest(this.getUrl(), 'POST', recordData, 'isSavingInProcess');
            if(saveRecordResponse.success) {
                recordData = Object.assign(recordData, saveRecordResponse.data);
            }
        } else if(!recordData.id) {
            recordData[this.getRecordIsNewPropName] = true;
        }
        this.cleanData[toEnd ? 'push' : 'unshift'](recordData);
        return recordData;
    }

    @action
    async saveRecord(recordData) {
        const targetRec = this.getCleanData.find(r => r.id === recordData.id);
        if(!targetRec) {
            return;
        }

        const isNew = this.getIsRecordNew(targetRec);
        const url = isNew ? this.url : this.getRecordActionUrl(targetRec);
        targetRec._isSaveInProcess = true;
        const saveRecordResponse = await this.doDataRequest(url, isNew ? 'POST' : 'PUT', recordData);

        if(saveRecordResponse.success) {
            Object.assign(targetRec, saveRecordResponse.data);
        }
        this.stopRecordEditing(targetRec);
    }

    @action async saveStableData() {
        const saveDataResult = await this.doDataRequest(this.url, 'PUT', this.getStableData, 'isSavingInProcess');
    }

    @action async saveFullData() {
        const saveDataResult = await this.doDataRequest(this.url, 'PUT', this.getData, 'isSavingInProcess');
    }

    getRecordActionUrl(record) {
        return `${this.url}${record.id}/`;
    }

    getIsRecordInEdit(record) {
        return record[this.getRecordIsEditPropName];
    }

    getIsRecordNew(record) {
        return record[this.getRecordIsNewPropName];
    }

    @action
    async sort(sortPropsOrPropName, sortDirectionOrFunction) {
        const isFunctionSort = sortDirectionOrFunction instanceof Function;
        let sortProps = sortPropsOrPropName instanceof Object ? sortPropsOrPropName : {
            orderBy: sortPropsOrPropName,
            direction: isFunctionSort ? null : sortDirectionOrFunction,
            sortFn: isFunctionSort ? sortDirectionOrFunction : null
        };
        const {orderBy, direction, sortFn} = sortProps;

        if(!orderBy || (!direction && !sortFn)) {
            return;
        }

        if(this.allowMultiSort) {
            const existingSort = this.sorters.find(s => s.orderBy === orderBy);
            if(existingSort || sortFn) {
                existingSort.direction = direction;
                existingSort.sortFn = sortFn;
            }
        }
        this.sorters = [sortProps];
    }
}

export default ArrayDataStore;