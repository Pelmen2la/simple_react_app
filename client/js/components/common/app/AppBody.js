import React, {Suspense} from 'react';
import {Route, Switch, withRouter} from 'react-router-dom';
import BaseComponent from '../../BaseComponent';

import {observer} from 'mobx-react';


@observer
class AppBody extends BaseComponent {
    render() {
        return <main className="cobu-app-body">
            <Suspense fallback={<span>Loading</span>}>
                <Switch>
                    {this.getRoutesRender()}
                </Switch>
            </Suspense>
        </main>;
    }

    getRoutesRender() {
        return this.getRoutesStore().getSortedRoutesList().map((r, i) => {
            const component = r.pageComponent instanceof Function ? r.pageComponent : (routerProps) => React.createElement(r.pageComponent, routerProps);
            return <Route path={r.path} component={component} key={`route-${i}`}/>
        });
    }

    getRoutesStore() {
        return this.props.routesStore;
    }
};

export default withRouter(AppBody);