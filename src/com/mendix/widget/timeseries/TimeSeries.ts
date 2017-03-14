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
    private mxObject: mendix.lib.MxObject;

    update(mxObject: mendix.lib.MxObject, callback: () => void) {
        this.mxObject = mxObject;
        this.updateRendering(callback);
    }

    uninitialize() {
        unmountComponentAtNode(this.domNode);
        return true;
    }

    private updateRendering(callback?: () => void) {
        render(createElement(TimeSeriesContainer, {
            callback,
            height: this.height,
            heightUnit: this.heightUnit,
            mxObject: this.mxObject,
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
