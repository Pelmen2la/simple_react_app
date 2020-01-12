import React from 'react';
import BaseComponentWithStore from '../../components/BaseComponentWithStore';
import {Link} from 'react-router-dom';

import {observer} from 'mobx-react';

@observer
class ProductsDataView extends BaseComponentWithStore {
    render() {
        return <ul className="products-data-view">
            {this.getProductCards()}
        </ul>
    }

    getProductCards() {
        return this.getData().map(product => {
            return <li key={product.id} className="products-data-view-card">
                <Link className="products-data-view-card-content-wrapper" to={`/products/${product.id}`}>
                    {this.getProductCardInnerRender(product)}
                </Link>
            </li>
        });
    }

    getProductCardInnerRender(product) {
        return <React.Fragment>
            <img src={`/resources/images/products/${product.type}/${product.imageName}`} alt={product.name} className="products-data-view-card_image"/>
            <span className="products-data-view-card_rating">
                <img src="/resources/icons/product_rating_star.svg" alt="рейтинг продукта" className="products-data-view-card_rating-icon"/>
                {`${cobuAppModule.utils.formatNumber(product.rating)}(${product.ratingVoteCount})`}
            </span>
            <span className="products-data-view-card_name">
                {product.name}
            </span>
            <span className="products-data-view-card_price">
                {cobuAppModule.utils.formatMoney(product.price) + ' / шт.'}
            </span>
            <span className="products-data-view-card_prepayment">
                Предоплата
                <span className="products-data-view-card_prepayment-value">{product.prepayment + '%'}</span>
            </span>
        </React.Fragment>;
    }
}

export default ProductsDataView;