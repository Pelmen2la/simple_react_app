import {lazy} from 'react';
import BaseRoutesStore from './base-routes-store';

class RoutesStore extends BaseRoutesStore {
    createRoutes() {
        return [
            {
                name: 'products',
                paths: ['/', '/products'],
                pageComponent: lazy(() => import('../../pages/products/ProductsPage'))
            }
        ]
    }
};

export default new RoutesStore();