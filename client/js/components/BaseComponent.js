import React from 'react';

class BaseComponent  extends React.Component {
    constructor(props) {
        super(props);
    }

    tryExecuteHandler(handlerName, args=[this]) {
        const handler = this.props[handlerName];
        if(handler) {
            handler.apply(null, args);
        }
    }
};

export default BaseComponent;