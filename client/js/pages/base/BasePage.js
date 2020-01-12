import React from 'react';
import BaseComponent from '../../components/BaseComponent';

import {observer} from 'mobx-react';

@observer
class BasePage extends BaseComponent {
    constructor(props) {
        super(props);
        this.fullHeight = true;
        this.initParamsFromRoute(props.match ?  props.match.params : props);
        this.pageStore = this.getPageStore();
        if(this.pageStore) {
            this.pageStore.routesHistory = props.history;
            this.initStore(props);
        }
    }

    //for override
    initParamsFromRoute(matchParams) {
    }

    //for override
    initStore(props) {
    }

    render() {
        return <div style={this.getBasePageWrapperStyles()} ref={(el) => this.mainPageWrapperEl = el}>
            {this.getPageContent()}
        </div>;
    }

    getPageContent() {
        return '';
    }

    getLineSeparator(styles = {}) {
        const lineSeparatorStyles = Object.assign({
            width: '100%',
            height: 1,
            margin: `${this.cssConstants.spacing.fieldsVerticalSpacing}px 0`,
            background: this.cssConstants.colors.borderGray
        }, styles);

        return <div style={lineSeparatorStyles}></div>;
    }

    getBasePageWrapperStyles() {
        const styles = {
            background: this.cssConstants.colors.backgroundGray,
            overflow: 'hidden',
            position: 'relative',
            borderTop: this.withoutBorder ? '' : `1px solid ${this.cssConstants.colors.borderGray}`
        };
        if(this.fullHeight) {
            styles.height = '100%';
        }
        return styles;
    }
}

export default BasePage;