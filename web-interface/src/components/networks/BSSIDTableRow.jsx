import React from 'react';
import Reflux from 'reflux';

import moment from "moment";
import SSIDTable from "./SSIDTable";

class BSSIDTableRow extends Reflux.Component {

    constructor(props) {
        super(props);

        this.state = {
            displayDetails: false
        }

        this._bssidClick = this._bssidClick.bind(this);
    }

    _printSSIDs(ssids) {
        let x = "";

        let total = Object.keys(ssids).length;

        Object.keys(ssids).forEach(function (key, ix) {
            let ssid = ssids[key].name.trim();

            x += ssid;

            if(ix < total-1) {
                x += ", ";
            }
        });

        if (x.length > 50) {
            x = x.slice(0, 50) + " ...";
        }

        return x;
    }

    _signalQualityColor(quality) {
        if (quality >= 90) {
            return "text-success";
        }

        if (quality >= 50) {
            return "text-warning";
        }

        if (quality < 50) {
            return "text-danger";
        }
    }

    static _decideFingerprintingStatus(status) {
        if (status) {
            return (
                <i className="fas fa-check-square text-success" title="Fingerprinting reports no issues." />
            )
        } else {
            return (
                <i className="fas fa-exclamation-triangle text-danger" title="Multiple fingerprints recorded." />
            )
        }
    }

    static _decideWPSStatus(status) {
        if (status) {
            return (
                <i className="fas fa-check-square text-warning" title="WPS is enabled on this station." />
            )
        } else {
            return (
                <i className="fas fa-times-circle text-muted" title="WPS is not enabled on this station." />
            )
        }
    }

    _bssidClick(e) {
        e.preventDefault();

        const oldState = this.state.displayDetails;
        this.setState({displayDetails: !oldState})
    }

    render() {
        const self = this;

        return (
            <React.Fragment>
                <tr>
                    <td><a href="#" onClick={this._bssidClick}>{this.props.bssid.bssid}</a></td>
                    <td>
                        <span className={this._signalQualityColor(this.props.bssid.best_recent_signal_quality)}>
                            {this.props.bssid.best_recent_signal_quality}
                        </span>
                    </td>
                    <td>{this._printSSIDs(this.props.bssid.ssids)}</td>
                    <td>{this.props.bssid.oui}</td>
                    <td>{BSSIDTableRow._decideFingerprintingStatus(this.props.bssid.fingerprinting_ok)}</td>
                    <td>{BSSIDTableRow._decideWPSStatus(this.props.bssid.is_wps)}</td>
                    <td><span title={this.props.bssid.last_seen}>{moment(this.props.bssid.last_seen).fromNow()}</span></td>
                </tr>

                {Object.keys(this.props.bssid.ssids).map(function (key,i) {
                    return <SSIDTable key={i}  display={self.state.displayDetails} ssid={self.props.bssid.ssids[key]} />;
                })}
            </React.Fragment>
        )
    }

}

export default BSSIDTableRow;