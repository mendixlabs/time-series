import * as dojoDeclare from "dojo/_base/declare";
import * as lang from "mendix/lang";
import * as WidgetBase from "mxui/widget/_WidgetBase";

import { createElement } from "react";
import { render, unmountComponentAtNode } from "react-dom";

import { DataPoint, DataStore, TimeSeries as TimeSeriesComponent, WidgetProps } from "./components/TimeSeries";
import { HeightUnit, SeriesConfig, WidthUnit } from "./TimeSeries.d";

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
    private dataStore: DataStore;

    postCreate() {
        this.dataStore = { series: {} };
        this.updateRendering();
    }

    update(object: mendix.lib.MxObject, callback: Function) {
        this.contextObject = object;
        if (this.contextObject && this.hasValidConfig()) {
            this.updateData(() => {
                this.updateRendering();
                callback();
            });
        } else {
            this.updateRendering();
            callback();
        }
        this.resetSubscriptions();
    }

    uninitialize(): boolean {
        unmountComponentAtNode(this.domNode);
        return true;
    }

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
            yAxisFormatDecimalPrecision: this.yAxisFormatDecimalPrecision,
            yAxisLabel: this.yAxisLabel,
            yAxisDomainMaximum: this.yAxisDomainMaximum,
            yAxisDomainMinimum: this.yAxisDomainMinimum
        };
    }

    private updateData(callback: Function) {
        const chain = this.seriesConfig.map(series => (chainCallback: Function) => {
            const processResults = (data: mendix.lib.MxObject[]) => {
                this.setDataFromObjects(data, series);
                chainCallback();
            };

            if (series.sourceType === "xpath") {
                const constraint = series.entityConstraint.replace("[%CurrentObject%]", this.contextObject.getGuid());
                const xpath = "//" + series.entity + constraint;
                this.fetchByXPath(series, xpath, processResults);
            } else if (series.sourceType === "microflow") {
                this.fetchByMicroflow(series.dataSourceMicroflow, processResults);
            }
        });

        lang.collect(chain, callback);
    }

    private hasValidConfig(): boolean {
        let errorMessage = "";
        const incorrectSeriesNames = this.seriesConfig
            .filter(series => (series.sourceType === "microflow" && !series.dataSourceMicroflow))
            .map(incorrect => incorrect.name)
            .join(", ");

        if (incorrectSeriesNames) {
            errorMessage += `series : ${incorrectSeriesNames}` +
                ` - data source type is set to 'Microflow' but 'Source - microflow' is missing \n`;
        }

        try {
            window.mx.parser.formatValue(new Date(), "datetime", { datePattern: this.xAxisFormat || "" });
        } catch (error) {
            errorMessage += `Formatting for the x-axis : ${this.xAxisFormat} is invalid \n\n`;
        }

        if(this.yAxisDomainMinimum && isNaN(parseFloat(this.yAxisDomainMinimum))) {
            errorMessage += `Y-axis Domain minimum value ${this.yAxisDomainMinimum} is not a number`
        }
        if(this.yAxisDomainMaximum && isNaN(parseFloat(this.yAxisDomainMaximum))) {
            errorMessage += `Y-axis Domain maximum value ${this.yAxisDomainMaximum} is not a number`
        }

        if (errorMessage) {
            window.mx.ui.error(`Configuration error :\n\n ${errorMessage}`, true);
        }
        return !errorMessage;
    }

    private updateRendering() {
        render(createElement(TimeSeriesComponent, this.createProps()), this.domNode);
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

    private fetchByXPath(seriesConfig: SeriesConfig, xpath: string, callback: (object: mendix.lib.MxObject[]) => void) {
        window.mx.data.get({
            callback,
            error: (error) => {
                window.logger.error(`${this.id} .fetchByXPath ${xpath}`
                    + `: An error occurred while retrieving data:`, error);
                window.mx.ui.error(`An error occurred while retrieving data`);
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

    private fetchByMicroflow(microflowName: string, callback: (object: mendix.lib.MxObject[]) => void) {
        window.mx.data.action({
            callback,
            error: (error) => {
                window.mx.ui.error("An error occurred while retrieving microflow data");
                window.logger.error(`${this.id} .fetchByMicroflow  ${microflowName}` +
                    `An error occurred while fetching data by microflow :`, error);
            },
            params: {
                actionname: microflowName,
                applyto: "selection",
                guids: [ this.contextObject.getGuid() ]
            }
        });
    }
}

// Declare widget's prototype the Dojo way
// Thanks to https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/dojo/README.md
// tslint:disable : only-arrow-functions
dojoDeclare("com.mendix.widget.timeseries.TimeSeries", [ WidgetBase ], function (Source: any) {
    let result: any = {};
    for (let i in Source.prototype) {
        if (i !== "constructor" && Source.prototype.hasOwnProperty(i)) {
            result[i] = Source.prototype[i];
        }
    }
    return result;
} (TimeSeries));

export default TimeSeries;
