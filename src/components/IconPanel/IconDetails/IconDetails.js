import React, { Component } from 'react';
import ClipboardJS from 'clipboard';
import MaterializeCss from 'materialize-css';

import 'material-design-icons';
import './IconDetails.css';

class IconPanel extends Component {

    componentDidMount() {
        const clipboard = new ClipboardJS('.html-code-copy-btn');
        const toolTipper = document.querySelectorAll('.tooltipped');
        const toolTipInstance = MaterializeCss.Tooltip.init(toolTipper, {
            position: 'top',
            html: 'Copy to clipboard',
            exitDelay: 1000,
        });

        clipboard.on('success', function(e) {
            toolTipInstance[0].close();
            toolTipInstance[0].options.html = 'Copied to clipboard!';
            toolTipInstance[0].open();
            toolTipInstance[0].options.html = 'Copy to clipboard';
        });
    }

    render() {
        return (
            <div className="icon-details">
                <div className="icon-details__icon-bubble valign-wrapper" title={this.props.selectedIcon.name}>
                    <i className="material-icons">{this.props.selectedIcon.name}</i>
                </div>
                <p className="icon-details__name white-text">{this.props.selectedIcon.name}</p>
                <p className="icon-details__html-code white-text">htmlcode:&nbsp;<span className="html-code-string">{this.props.selectedIcon.htmlCode}</span>
                    <i className="material-icons html-code-copy-btn tooltipped"
                    data-clipboard-text={this.props.selectedIcon.htmlCode}>content_copy</i>
                </p>
            </div>
        );
    }
}

export default IconPanel;
