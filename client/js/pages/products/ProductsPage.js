import React from 'react';
import BasePage from '../base/BasePage';
import productsPageStore from '../../stores/pages/products-page-store';
import ProductsDataView from './ProductsDataView';
import ProductsPageFiltersPanel from './ProductsPageFiltersPanel';

import {observer} from 'mobx-react';

@observer
class ProductsPage extends BasePage {
    getPageStore() {
        return productsPageStore;
    }

    initStore() {
        this.pageStore.init();
    }

    render() {
        return this.getProductsDataView();
    }

    getProductsDataView() {
        return <React.Fragment>
            <ProductsPageFiltersPanel
                activeFilterId={this.pageStore.productsStore.getFilterValue('type')}
                onValueChange={(productType) => this.pageStore.productsStore.filter('type', productType)}
            />
            <ProductsDataView store={this.pageStore.productsStore}/>;
        </React.Fragment>;
    }
}

export default ProductsPage;