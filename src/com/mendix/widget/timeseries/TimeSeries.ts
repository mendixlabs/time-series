import * as dojoDeclare from "dojo/_base/declare";
import * as WidgetBase from "mxui/widget/_WidgetBase";

import { createElement } from "react";
import { render, unmountComponentAtNode } from "react-dom";

import { DataPoint, TimeSeries as TimeSeriesComponent, WidgetProps } from "./components/TimeSeries";
import { HeightUnit, SeriesConfig, WidthUnit } from "./TimeSeries.d";

class TimeSeries extends WidgetBase {
    private xAxisLabel: string;
    private xAxisFormat: string;
    private yAxisLabel: string;
    private yAxisFormat: string;
    private seriesConfig: SeriesConfig[];
    private width: number;
    private height: number;
    private widthUnit: WidthUnit;
    private heightUnit: HeightUnit;

    private contextObject: mendix.lib.MxObject;
    private dataStore: any;
    private handle: number;

    private createProps(): WidgetProps {
        return {
            dataStore: this.dataStore,
            height: this.height,
            heightUnit: this.heightUnit,
            seriesConfig: this.seriesConfig,
            width: this.width,
            widthUnit: this.widthUnit,
            xAxisFormat: this.xAxisFormat,
            xAxisLabel: this.xAxisLabel,
            yAxisFormat: this.yAxisFormat,
            yAxisLabel: this.yAxisLabel
        };
    }

    postCreate() {
        this.dataStore = {};
        this.dataStore.series = this.seriesConfig.reduce((previousValue: any, currentValue: SeriesConfig) => {
            return previousValue[currentValue.name] = [];
        }, {});
        this.updateRendering();
    }

    update(object: mendix.lib.MxObject, callback?: Function) {
        this.contextObject = object;
        if (this.contextObject && this.isValidConfig()) {
            this.updateData(() => {
                this.updateRendering(callback);
        });
        } else {
            this.updateRendering(callback);
        }
        this.resetSubscriptions();
    }

    uninitialize() {
        unmountComponentAtNode(this.domNode);
        return true;
    }

    private updateData(callback: Function) {
        const series = this.seriesConfig[0];
        // TODO: do this in a async parallel way for all series, in the future.
        if (series.sourceType === "xpath" && series.entity) {
            const constraint = series.entityConstraint.replace("[%CurrentObject%]", this.contextObject.getGuid());
            const xpath = "//" + series.entity + constraint;
            this.fetchByXPath(series, xpath, (data: mendix.lib.MxObject[]) => {
                this.setDataFromObjects(data, series);
                callback();
            });
        } else if (series.sourceType === "microflow" && series.dataSourceMicroflow) {
             this.fetchByMicroflow(series.dataSourceMicroflow, (data: mendix.lib.MxObject[]) => {
                 this.setDataFromObjects(data, series);
                 callback();
             });
        }
    }

    /**
     * Validate the widget configurations from the modeler
     */
    private isValidConfig(): boolean {
        const incorrectSeries = this.seriesConfig.filter(series =>
            (series.sourceType === "microflow" && !series.dataSourceMicroflow));
        const incorrectSeriesNames = incorrectSeries.map((incorrect) => (incorrect.name)).join(", ");

        if (incorrectSeries.length) {
            window.mx.ui.error(`Configuration error for series : ${ incorrectSeriesNames }. 
            data source type is set to 'Microflow' but 'Source - microflow' is missing`, true);
        }

        return incorrectSeries.length === 0;
    }

    private updateRendering (callback?: Function) {
        render(createElement(TimeSeriesComponent, this.createProps()), this.domNode);
        if (callback) { callback(); }
    }

    private resetSubscriptions () {
        window.mx.data.unsubscribe(this.handle);
        this.handle = 0;

        if (this.contextObject) {
            this.handle = this.subscribe({
                callback: (guid: string) => {
                    this.updateRendering();
                },
                guid: this.contextObject.getGuid()
            });
        }
    }

    private fetchByXPath(seriesConfig: SeriesConfig, xpath: string, callback: (object: mendix.lib.MxObject[]) => void) {

        window.mx.data.get({
            callback,
            error: (error) => {
                window.logger.error(`${this.id}.fetchByXPath ${xpath}: 
                    An error occurred while retrieving data:`, error);
                window.mx.ui.error("An error occurred while retrieving data");
                callback([]);
            },
            filter: {
                sort: [ [ seriesConfig.xAttribute, "asc" ] ]
            },
            xpath
        });
    }

    private setDataFromObjects(objects: mendix.lib.MxObject[], seriesConfig: SeriesConfig): void {
        this.dataStore.series[seriesConfig.name] = objects.map((itemObject): DataPoint => ({
            x: itemObject.get(seriesConfig.xAttribute) as number,
            y: parseFloat(itemObject.get(seriesConfig.yAttribute) as string)
        }));

    }

    private fetchByMicroflow(dataSourceMicroflow: string, callback: (object: mendix.lib.MxObject[]) => void) {
        window.mx.data.action({
            callback,
            error: (error) => {
                window.mx.ui.error("An error occurred while retrieving microflow data");
                window.logger.error(`${this.id}.fetchByMicroflow ${dataSourceMicroflow}:
                An error occurred while fetching data by microflow : ${error}`);
            },
            params: {
                actionname: dataSourceMicroflow,
                applyto: "selection",
                guids: [ this.contextObject.getGuid() ]
            }
        });
    }
}

// Declare widget's prototype the Dojo way
// Thanks to https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/dojo/README.md
// tslint:disable : only-arrow-functions
dojoDeclare("com.mendix.widget.timeseries.TimeSeries", [ WidgetBase ], (function (Source: any) {
    let result: any = {};
    for (let i in Source.prototype) {
        if (i !== "constructor" && Source.prototype.hasOwnProperty(i) ) {
            result[i] = Source.prototype[i];
        }
    }
    return result;
} (TimeSeries)));

export default TimeSeries;
