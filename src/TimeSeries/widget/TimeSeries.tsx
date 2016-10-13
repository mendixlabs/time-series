
import * as dojoDeclare from "dojo/_base/declare";
import * as mxLang from "mendix/lang";
import * as _WidgetBase from "mxui/widget/_WidgetBase";
//tslint:disable-next-line
import * as React from "TimeSeries/lib/react";
import ReactDOM = require ("TimeSeries/lib/react-dom");

import { Data, HeightUnits, SerieConfig, WidthUnits } from "../TimeSeries.d";
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
    private seriesConfig: SerieConfig[];
    private width: number;
    private height: number;
    private widthUnits: WidthUnits;
    private heightUnits: HeightUnits;

    // Internal variables. Non-primitives created in the prototype are shared between all widget instances.
    private contextObject: mendix.lib.MxObject;
    private dataLoaded: boolean;

    constructor(args?: Object, elem?: HTMLElement) {
        // Do not add any default value here... it wil not run in dojo!     
        super() ;
        return new dojoTimeSeries(args, elem);
    }
    public createProps(): WidgetProps {
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
            yAxisLabel: this.yAxisLabel,
        };
    }

    public postCreate() {
        this.updateRendering();
    }
    /**
     * called when context is changed or initialized
     */
    public update(object: mendix.lib.MxObject, callback?: Function) {
        this.contextObject = object;
        this.updateData(() => {
            this.dataLoaded = true;
            this.updateRendering(callback);
        });
        this.resetSubscriptions();
    }
    public uninitialize() {
        ReactDOM.unmountComponentAtNode(this.domNode);
    }

    private updateData(callback: Function) {
        const serie = this.seriesConfig[0];
        // TODO do this in a async parallel way for all series, in the future.
        if (serie.serieSource === "xpath" && serie.serieEntity) {
            this.fetchDataFromXpath(serie, (data: mendix.lib.MxObject[]) => {
                this.setDataFromObjects(data, serie);
                callback();
            });
        } else if (serie.serieSource === "microflow" && serie.dataSourceMicroflow) {
             this.fetchDataFromMicroflow(serie, (data: mendix.lib.MxObject[]) => {
                 this.setDataFromObjects(data, serie);
                 callback();
             });
        } else {
            // TODO improve error message, add config check in widget component.
            logger.error(this.id + ".updateData unknown source or error in widget configuration");
            callback();
        }
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
                guid: this.contextObject.getGuid(),
            });
        }
    }
    private fetchDataFromXpath(serieConfig: SerieConfig, callback: Function) {
        if (this.contextObject) {
            const guid = this.contextObject ? this.contextObject.getGuid() : "";
            const constraint = serieConfig.entityConstraint.replace("[%CurrentObject%]", guid);
            const xpathString = "//" + serieConfig.serieEntity + constraint;
            mx.data.get({
                callback: callback.bind(this),
                error: (error) => {
                    logger.error(this.id + ": An error occurred while retrieving items: " + error);
                },
                xpath : xpathString,
            });
        } else {
            callback([]);
        }
    }

    /**
     * transforms mendix object into item properties and set new state
     */
    private setDataFromObjects(objects: mendix.lib.MxObject[], serieConfig: SerieConfig): void {
        serieConfig.serieData = objects.map((itemObject): Data => ({
            xPoint: itemObject.get(serieConfig.serieXAttribute) as number,
            yPoint: parseFloat(itemObject.get (serieConfig.serieYAttribute)), // convert Big to float or number
        }));
    }


    private fetchDataFromMicroflow(serieConfig: SerieConfig, callback: Function) {
        if (serieConfig.dataSourceMicroflow) {
            mx.data.action({
                callback: callback.bind(this),
                error: (error) => {
                    logger.error(this.id + ": An error occurred while executing microflow: " + error);
                },
                params: {
                    actionname: serieConfig.dataSourceMicroflow,
                    applyto: "selection",
                    guids: [ this.contextObject.getGuid() ],
                },
            });
        } else {
            callback([]);
        }
    }
}
// Declare widget's prototype the Dojo way
// Thanks to https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/dojo/README.md
// tslint:disable : only-arrow-functions
let dojoTimeSeries = dojoDeclare("TimeSeries.widget.TimeSeries", [ _WidgetBase ], (function (Source: any) {
    let result: any = {};
    for (let i in Source.prototype) {
        if (i !== "constructor" && Source.prototype.hasOwnProperty(i) ) {
            result[i] = Source.prototype[i];
        }
    }
    return result;
} (TimeSeriesWrapper)));

export default TimeSeriesWrapper;
