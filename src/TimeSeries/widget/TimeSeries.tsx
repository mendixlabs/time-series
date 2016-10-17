
import * as dojoDeclare from "dojo/_base/declare";
import * as mxLang from "mendix/lang";
import * as _WidgetBase from "mxui/widget/_WidgetBase";
//tslint:disable-next-line
import * as React from "TimeSeries/lib/react";
import ReactDOM = require ("TimeSeries/lib/react-dom");

import { Data, HeightUnits, SeriesConfig, WidthUnits } from "../TimeSeries.d";
import { TimeSeries, WidgetProps } from "./components/TimeSeries";

export class TimeSeriesWrapper extends _WidgetBase {
    // Parameters configured in the Modeler    
    private showXAxis: boolean;
    private showYAxis: boolean;
    private useInteractiveGuidelines: boolean;
    private showLegend: boolean;
    private xAxisLabel: string;
    private xAxisFormat: string;
    private staggerLabels: boolean;
    private yAxisLabel: string;
    private yAxisFormat: string;
    private seriesConfig: SeriesConfig[];
    private width: number;
    private height: number;
    private widthUnits: WidthUnits;
    private heightUnits: HeightUnits;

    // Internal variables. Non-primitives created in the prototype are shared between all widget instances.
    private contextObject: mendix.lib.MxObject;
    private dataLoaded: boolean;

    private createProps(): WidgetProps {
        return {
            dataLoaded: this.dataLoaded,
            height: this.height,
            heightUnits: this.heightUnits,
            seriesConfig: this.seriesConfig,
            showLegend: this.showLegend,
            showXAxis: this.showXAxis,
            showYAxis: this.showYAxis,
            staggerLabels: this.staggerLabels,
            useInteractiveGuidelines: this.useInteractiveGuidelines,
            widgetId: this.id + "_Wrapper",
            width: this.width,
            widthUnits: this.widthUnits,
            xAxisFormat: this.xAxisFormat,
            xAxisLabel: this.xAxisLabel,
            yAxisFormat: this.yAxisFormat,
            yAxisLabel: this.yAxisLabel
        };
    }

    public postCreate() {
        this.updateRendering();
    }

    public update(object: mendix.lib.MxObject, callback?: Function) {
        this.contextObject = object;
        if (this.contextObject && this.checkConfig()) {
        this.updateData(() => {
            this.dataLoaded = true;
            this.updateRendering(callback);
        });
        } else {
            this.updateRendering(callback);
        }
        this.resetSubscriptions();
    }

    public uninitialize() {
        ReactDOM.unmountComponentAtNode(this.domNode);
        return true;
    }

    private updateData(callback: Function) {
        logger.debug(this.id + ".updateData");
        const series = this.seriesConfig[0];
        // TODO: do this in a async parallel way for all series, in the future.
        if (series.seriesSource === "xpath" && series.seriesEntity) {
            this.fetchDataFromXpath(series, (data: mendix.lib.MxObject[]) => {
                this.setDataFromObjects(data, series);
                callback();
            });
        } else if (series.seriesSource === "microflow" && series.dataSourceMicroflow) {
             this.fetchDataFromMicroflow(series, (data: mendix.lib.MxObject[]) => {
                 this.setDataFromObjects(data, series);
                 callback();
             });
        } else {
            // TODO: improve error message, add config check in widget component.
            logger.error(this.id + ".updateData unknown source or error in widget configuration");
            callback();
        }
    }

    /**
     * Validate the widget configurations from the modeler
     */
    private checkConfig() {
        let valid = true;
        const incorrectSeries = this.seriesConfig.filter(series =>
        (series.seriesSource === "microflow" && !series.dataSourceMicroflow));

        if (incorrectSeries.length) {
            valid = false;
            mx.ui.error("Configuration error for series : '" + incorrectSeries[0].seriesKey +
                        "'. Source is set to 'Microflow' but 'Source - microflow' is missing ", true);
        }

        return valid;

    }

    private updateRendering (callback?: Function) {
        ReactDOM.render(<TimeSeries {...this.createProps() } />, this.domNode);
        mxLang.nullExec(callback);
    }

    private resetSubscriptions () {
        if (this.contextObject) {
            this.subscribe({
                callback: (guid: string) => {
                    this.updateRendering();
                },
                guid: this.contextObject.getGuid()
            });
        }
    }

    private fetchDataFromXpath(seriesConfig: SeriesConfig, callback: Function) {
        if (this.contextObject) {
            const guid = this.contextObject ? this.contextObject.getGuid() : "";
            const constraint = seriesConfig.entityConstraint.replace("[%CurrentObject%]", guid);
            const xpathString = "//" + seriesConfig.seriesEntity + constraint;
            mx.data.get({
                callback: callback.bind(this),
                error: (error) => {
                    logger.error(this.id + ": An error occurred while retrieving items: " + error);
                },
                filter: {
                    sort: [ [ seriesConfig.seriesXAttribute, "asc" ] ]
                },
                xpath : xpathString
            });
        } else {
            callback([]);
        }
    }

    private setDataFromObjects(objects: mendix.lib.MxObject[], seriesConfig: SeriesConfig): void {
        logger.debug(objects);
        seriesConfig.seriesData = objects.map((itemObject): Data => ({
            xPoint: itemObject.get(seriesConfig.seriesXAttribute) as number,
            yPoint: parseFloat(itemObject.get (seriesConfig.seriesYAttribute)) // convert Big to float or number
        }));
    }

    private fetchDataFromMicroflow(seriesConfig: SeriesConfig, callback: Function) {
        if (seriesConfig.dataSourceMicroflow) {
            mx.data.action({
                callback: callback.bind(this),
                error: (error) => {
                    logger.error(this.id + ": An error occurred while executing microflow: " + error);
                },
                params: {
                    actionname: seriesConfig.dataSourceMicroflow,
                    applyto: "selection",
                    guids: [ this.contextObject.getGuid() ]
                }
            });
        } else {
            callback([]);
        }
    }
}
// Declare widget's prototype the Dojo way
// Thanks to https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/dojo/README.md
// tslint:disable : only-arrow-functions
dojoDeclare("TimeSeries.widget.TimeSeries", [ _WidgetBase ], (function (Source: any) {
    let result: any = {};
    for (let i in Source.prototype) {
        if (i !== "constructor" && Source.prototype.hasOwnProperty(i) ) {
            result[i] = Source.prototype[i];
        }
    }
    return result;
} (TimeSeriesWrapper)));

export default TimeSeriesWrapper;
