class BaseRoutesStore {
    constructor() {
        this.routesData = this.createRoutes();
    }

    getRoutesData() {
        return this.routesData;
    }

    getSortedRoutesList() {
        const routesList = [];
        this.getRoutesData().forEach(r => {
            r.paths.forEach(path => routesList.push(Object.assign({path}, r)));
        }, []);
        routesList.sort((r0, r1) => r1.path.length - r0.path.length);
        return routesList;
    }

    getRouteData(name) {
        return this.getRoutesData().find(r => r.name === name);
    }

    getRouteProp(routeName, propName) {
        const route = this.getRouteData(routeName);
        return route ? route[propName] : route;
    }

    createRoutes() {
        return [];
    }

    getRoutesByPath(path, exact = false) {
        const routesList = this.getSortedRoutesList().filter(r => {
            if(r.path.indexOf(':') !== -1) {
                const regExp = new RegExp(this.prepareRoutePathForRegExp(r.path));
                return path.match(regExp);
            }
            return r.path.indexOf(path) === 0;
        });
        if(!exact) {
            return routesList;
        }

        for(let route, i = 0; route = routesList[i]; i++) {
            const routePath = this.prepareRoutePathForRegExp(route.path);
            const regExp = new RegExp(`${routePath}[\\S^\/]*`);
            if(path.match(regExp)) {
                return [route];
            }
        }
        return [];
    }

    prepareRoutePathForRegExp(path) {
        return path.replace(/:\w+/g, '\\S+');
    }

    getRouteByPath(path) {
        return this.getRoutesByPath(path, true)[0] || null;
    }

    getRouteRequiredPermissionsByPath(path) {
        const route = this.getRouteByPath(path);
        return route ? route.requiredPermissions || [] : [];
    }
};

export default BaseRoutesStore;