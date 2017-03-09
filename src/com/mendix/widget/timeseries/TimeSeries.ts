import * as dojoDeclare from "dojo/_base/declare";
import * as WidgetBase from "mxui/widget/_WidgetBase";
import { createElement } from "react";
import { render, unmountComponentAtNode } from "react-dom";

import { HeightUnit, SeriesConfig, WidthUnit } from "./TimeSeries.d";
import { TimeSeriesContainer } from "./components/TimeSeriesContainer";

class TimeSeries extends WidgetBase {
    // Model props
    private xAxisLabel: string;
    private xAxisFormat: string;
    private yAxisLabel: string;
    private yAxisFormatDecimalPrecision: number;
    private seriesConfig: SeriesConfig[];
    private width: number;
    private height: number;
    private widthUnit: WidthUnit;
    private heightUnit: HeightUnit;
    private yAxisDomainMinimum: string;
    private yAxisDomainMaximum: string;
    // Internal props
    private contextObject: mendix.lib.MxObject;

    update(object: mendix.lib.MxObject, callback: Function) {
        this.contextObject = object;
        this.updateRendering(callback);
        this.resetSubscriptions();
    }

    uninitialize() {
        unmountComponentAtNode(this.domNode);
        return true;
    }

    private updateRendering(callback?: Function) {
        render(createElement(TimeSeriesContainer, {
            callback,
            contextObject: this.contextObject,
            height: this.height,
            heightUnit: this.heightUnit,
            seriesConfig: this.seriesConfig,
            width: this.width,
            widthUnit: this.widthUnit,
            xAxisFormat: this.xAxisFormat,
            xAxisLabel: this.xAxisLabel,
            yAxisDomainMaximum: this.yAxisDomainMaximum,
            yAxisDomainMinimum: this.yAxisDomainMinimum,
            yAxisFormatDecimalPrecision: this.yAxisFormatDecimalPrecision,
            yAxisLabel: this.yAxisLabel
        }), this.domNode);
    }

    private resetSubscriptions() {
        this.unsubscribeAll();
        if (this.contextObject) {
            this.subscribe({
                callback: () => this.updateRendering(),
                guid: this.contextObject.getGuid()
            });
        }
    }

}

// Declare widget's prototype the Dojo way
// Thanks to https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/dojo/README.md
// tslint:disable : only-arrow-functions
dojoDeclare("com.mendix.widget.timeseries.TimeSeries", [ WidgetBase ], function(Source: any) {
    const result: any = {};
    for (const property in Source.prototype) {
        if (property !== "constructor" && Source.prototype.hasOwnProperty(property)) {
            result[property] = Source.prototype[property];
        }
    }
    return result;
} (TimeSeries));
