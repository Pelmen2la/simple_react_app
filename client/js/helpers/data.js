export default {
    findNodeInTree,
    findNodeInTreeByFn,
    findTreeNodeParent,
    forEachNodeInTree,
    getListFieldSum,
    cloneObject,
    cloneArray,
    getListUniqValues
}

function findNodeInTree(rootNode, propName, value) {
    if(!value) {
        return null;
    }

    return findNodeInTreeByFn(rootNode, (n) => n[propName] == value);
};

function findTreeNodeParent(rootNode, node, childNodeNames=[]) {
    if(!node) {
        return null;
    }

    return findNodeInTreeByFn(rootNode, (treeNode, parentNodes) => {
        const childrenPropName = childNodeNames[parentNodes.length] || 'children';
        return (treeNode[childrenPropName] || []).indexOf(node) > -1;
    }, childNodeNames);
}

function findNodeInTreeByFn(rootNode, fn, childNodeNames=[]) {
    if(!rootNode || !fn) {
        return null;
    }

    function search(node, parentNodes) {
        if(fn(node, parentNodes)) {
            return node;
        }
        const childrenPropName = childNodeNames[parentNodes.length] || 'children';
        const children = (node[childrenPropName] || []);
        for(let i = 0; i < children.length; i++) {
            const child = children[i];
            const res = search(child, parentNodes.concat([node]));
            if(res) {
                return res;
            }
        }
        return null;
    }

    return search(rootNode, []);
};

function forEachNodeInTree(rootNode, fn) {
    if(!rootNode || !fn) {
        return null;
    }

    function execFn(node, parentNodes) {
        fn(node, parentNodes);
        (node.children || []).forEach((c) => execFn(c, parentNodes.concat([node])));
    }

    return execFn(rootNode, []);
};

function getListFieldSum(list, fieldName) {
    return list.reduce((res, next) => {
        let val = parseFloat(next[fieldName]);
        val = isNaN(val) ? 0 : val;
        return res + val || 0;
    }, 0);
};

function getListUniqValues(list, fieldName) {
    const resObj = {};
    list.forEach(rec => {
        const val = rec[fieldName];
        if(val instanceof Array) {
            val.forEach(childVal => resObj[childVal] = true)
        } else {
            resObj[val] = true;
        }
    });
    return Object.keys(resObj);
};

function cloneArray(arr, isDeep=false) {
    if(isDeep) {
        const res = [];

        arr.forEach(r => {
            if(r instanceof Array) {
                res.push(cloneArray(r, true));
            } else if(r instanceof Date) {
                res.push(new Date(r));
            } else if(r instanceof Object) {
                res.push(cloneObject(r, true));
            } else {
                res.push(r);
            }
        });

        return res;
    } else {
        return arr.map(r => r);
    }
};

function cloneObject(obj, isDeep=false) {
    return isDeep ? JSON.parse(JSON.stringify(obj)) : Object.assign({}, obj);
};