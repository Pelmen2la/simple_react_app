import BaseDataStore from './base-data-store';
import {observable, computed, action} from 'mobx';

const IS_NODE_EXPANDED_PROP_NAME = '_expanded';
const IS_CHILD_LOADING_IN_PROCESS_PROP_NAME = '_isChildLoadingInProcess';

class TreeStore extends BaseDataStore {
    constructor(cfg={}) {
        super(cfg);
        this.isVirtualLoadingMode = cfg.isVirtualLoadingMode;
        this.isNodeCanHaveChildrenFn = cfg.isNodeCanHaveChildrenFn || null;
        this.root = cfg.root || {};
        this.childNodeNames = cfg.childNodeNames || [];

        if(cfg.loadOnCreate) {
            this.load();
        }
    }

    @observable cleanData = [];
    @observable root = {};

    @computed get getCleanData() {
        return this.cleanData;
    }

    @computed get getRoot() {
        return this.root;
    }

    @computed get getRootNodes() {
        return this.root.children;
    }

    @action async load() {
        const getDataResult = await this.doRequest(this.getLoadDataUrl(), {}, 'isDataLoadingInProcess');
        this.root.children = getDataResult.success ? getDataResult.data : [];
        this.forEachNodeInTree((node, parentNodes) => node._depth = [parentNodes.length]);
        this.tryExecuteListener('onLoad', [this.root]);
    }

    @action async reload() {
        await this.load();
    }

    @action setRootNode(root) {
        this.root = root;
    }

    @action setNodeExpanded(node, val) {
        node[IS_NODE_EXPANDED_PROP_NAME] = val;
    }

    @action toggleNodeExpanded(node) {
        node[IS_NODE_EXPANDED_PROP_NAME] = !node[IS_NODE_EXPANDED_PROP_NAME];
        if(this.isVirtualLoadingMode && this.isNodeCanHaveChildren(node) && !node.children) {
            this.loadNodeChildren(node);
        }
    }

    isNodeCanHaveChildren(node) {
        return this.isNodeCanHaveChildrenFn ? this.isNodeCanHaveChildrenFn(node) : true;
    }

    getNodeChildren(node) {
        return node[this.childNodeNames[node._depth || 0]] || [];
    }

    findNode(propName, value) {
        return this.dataHelper.findNodeInTree(this.root, propName, value);
    }

    findNodeParent(node) {
        return this.dataHelper.findTreeNodeParent(this.root, node, this.childNodeNames);
    }

    findNodeByFn(fn) {
        return this.dataHelper.findNodeInTreeByFn(this.root, fn, this.childNodeNames);
    }

    forEachNodeInTree(fn) {
        this.dataHelper.forEachNodeInTree(this.root, fn);
    }

    deleteNode(node) {
        const nodeParent = this.findNodeParent(node);
        const parentChildren = this.getNodeChildren(nodeParent);
        this.deleteRecordFromArray(parentChildren, node);
    }

    getNodesAsArray() {
        const nodes = [];
        this.forEachNodeInTree(node => {
            if(node !== this.getRoot) {
                nodes.push(node)
            }
        });
        return nodes;
    }

    async loadNodeChildren(node) {
        node[IS_CHILD_LOADING_IN_PROCESS_PROP_NAME] = true;
        let url = this.getLoadDataUrl();
        url += `${url.indexOf('?') === -1 ? '?' : '&'}parentId=${node.id}`;
        const loadChildrenResult = await this.doRequest(url, {});
        node.children = loadChildrenResult.success ? loadChildrenResult.data : [];
        node[IS_CHILD_LOADING_IN_PROCESS_PROP_NAME] = false;
    }
}

export default TreeStore;