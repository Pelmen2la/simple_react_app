import React from 'react';
import BaseComponentWithStore from '../../components/BaseComponentWithStore';

import {observer} from 'mobx-react';

@observer
class ProductsPageFiltersPanel extends BaseComponentWithStore {
    render() {
        return <ul className="products-page-filters-panel">
            {this.getFilterItems()}
        </ul>;
    }

    getFilterItems() {
        const {activeFilterId} = this.props;

        return this.getFiltersConfig().map(filter => {
            let className = "products-page-filters-panel-card";
            const isFilterActive = activeFilterId === filter.id;

            if(isFilterActive) {
                className += ' active';
            }

            return <li key={filter.productType} className={className}
                       onClick={() => this.tryExecuteHandler('onValueChange', [isFilterActive ? null : filter.id])}>
                {this.getFilterCardInnerRender(filter)}
            </li>;
        });
    }

    getFilterCardInnerRender(filter) {
        return <React.Fragment>
            <img src={`/resources/icons/${filter.iconName}.svg`} alt={filter.name} className="products-page-filters-panel-card_image"/>
            <span>{filter.name}</span>
        </React.Fragment>;
    }

    getFiltersConfig() {
        return [
            {
                id: 'computers',
                name: 'Компьютеры',
                iconName: 'computer'
            },
            {
                id: 'watches',
                name: 'Часы',
                iconName: 'wristwatch'
            },
            {
                id: 'other',
                name: 'Другое',
                iconName: 'socket'
            }
        ];
    }
}

export default ProductsPageFiltersPanel;