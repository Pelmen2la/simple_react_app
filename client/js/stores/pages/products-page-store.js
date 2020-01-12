import BaseComponentStore from '../base/base-component-store';
import ArrayDataStore from '../data/array-data-store';

import {observable} from 'mobx';

class ProductsPageStore extends BaseComponentStore {
    init() {
        this.productsStore.load();
    }

    @observable productsStore = new ArrayDataStore({
        url: '/products/'
    });
    @observable activeFilterId = null;
}

export default new ProductsPageStore;