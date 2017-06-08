import { Component, DOM, createElement } from "react";

import { DataPoint, DataStore, ModelProps, SeriesConfig } from "../TimeSeries";
import { Alert } from "./Alert";
import { TimeSeries } from "./TimeSeries";

import * as async from "async";

export interface TimeSeriesContainerProps extends ModelProps {
    class: string;
    mxObject: mendix.lib.MxObject;
    style: string;
}

interface TimeSeriesContainerState {
    alertMessage?: string;
    dataStore: DataStore;
    isLoaded?: boolean;
}

type MxObjectsCallback = (mxObjects: mendix.lib.MxObject[]) => void;

class TimeSeriesContainer extends Component<TimeSeriesContainerProps, TimeSeriesContainerState> {
    private subscriptionHandle: number;
    private dataStore: DataStore;

    constructor(props: TimeSeriesContainerProps) {
        super(props);
        this.fetchData = this.fetchData.bind(this);
        this.state = {
            alertMessage: TimeSeriesContainer.validateProps(this.props),
            dataStore: { series: {} }
        };
    }

    render() {
        if (this.state.alertMessage) {
            return createElement(Alert, { message: this.state.alertMessage });
        } else if (this.state.isLoaded) {
            return DOM.div({
                    className: this.props.class,
                    style: TimeSeriesContainer.parseStyle(this.props.style)
                },
                createElement(TimeSeries, {
                    class: this.props.class,
                    dataStore: this.state.dataStore,
                    formatter: window.mx.parser.formatValue,
                    height: this.props.height,
                    heightUnit: this.props.heightUnit,
                    seriesConfig: this.props.seriesConfig,
                    style: TimeSeriesContainer.parseStyle(this.props.style),
                    width: this.props.width,
                    widthUnit: this.props.widthUnit,
                    xAxisFormat: this.props.xAxisFormat,
                    xAxisLabel: this.props.xAxisLabel,
                    yAxisDomainMaximum: this.props.yAxisDomainMaximum,
                    yAxisDomainMinimum: this.props.yAxisDomainMinimum,
                    yAxisFormatDecimalPrecision: this.props.yAxisFormatDecimalPrecision,
                    yAxisLabel: this.props.yAxisLabel
                })
            );
        }
        return DOM.div({ className: "widget-time-series nvd3 nv-noData" }, "Loading...");
    }

    componentWillReceiveProps(nextProps: TimeSeriesContainerProps) {
        this.resetDataStore();
        this.resetSubscription(nextProps.mxObject);
        this.fetchData(nextProps.mxObject);
    }

    componentWillUnmount() {
        this.unSubscribe();
    }

    public static validateProps(props: TimeSeriesContainerProps): string {
        let errorMessage = "";
        const incorrectSeriesNames = props.seriesConfig
            .filter(series => series.sourceType === "microflow" && !series.dataSourceMicroflow)
            .map(incorrect => incorrect.name)
            .join(", ");

        if (incorrectSeriesNames) {
            errorMessage += `series : ${incorrectSeriesNames}` +
                ` - data source type is set to 'Microflow' but 'Source - microflow' is missing \n`;
        }

        try {
            // Can not test the parses in the webmodeler as global mx is not available.
            if (window.mx) {
                window.mx.parser.formatValue(new Date(), "datetime", { datePattern: props.xAxisFormat || "" });
            }
        } catch (error) {
            errorMessage += `Formatting for the x-axis : (${props.xAxisFormat}) is invalid \n\n`;
        }

        if (props.yAxisDomainMinimum && isNaN(Number(props.yAxisDomainMinimum))) {
            errorMessage += `Y-axis Domain minimum value (${props.yAxisDomainMinimum}) is not a number`;
        }
        if (props.yAxisDomainMaximum && isNaN(Number(props.yAxisDomainMaximum))) {
            errorMessage += `Y-axis Domain maximum value (${props.yAxisDomainMaximum}) is not a number`;
        }

        return errorMessage && `Configuration error :\n\n ${errorMessage}`;

    }

    private fetchData(mxObject: mendix.lib.MxObject) {
        if (mxObject) {
            async.each(this.props.seriesConfig, (series1: SeriesConfig, callback: (error?: Error) => {}) => {
                const processResults1: MxObjectsCallback = mxObjects => {
                    this.dataStore.series[series1.name] = this.setDataFromObjects(mxObjects, series1);
                    callback();
                };
                if (series1.sourceType === "xpath") {
                    const constraint = series1.entityConstraint
                        ? series1.entityConstraint.replace("[%CurrentObject%]", mxObject.getGuid())
                        : "";
                    const XPath = "//" + series1.entity + constraint;
                    this.fetchByXPath(series1, XPath, processResults1);
                } else if (series1.sourceType === "microflow" && series1.dataSourceMicroflow) {
                    this.fetchByMicroflow(mxObject.getGuid(), series1.dataSourceMicroflow, processResults1);
                }
            }, (error?: Error) => {
                // tslint:disable-next-line no-console
                if (error) {
                    console.error(error.message);
                }
                this.setState({ dataStore: this.dataStore, isLoaded: true });
            });
        } else {
            this.setState({ dataStore: this.dataStore, isLoaded: true });
        }
    }

    private fetchByMicroflow(guid: string, actionname: string, callback: MxObjectsCallback) {
        mx.ui.action(actionname, {
            callback,
            error: error => this.setState({
                alertMessage: `Error while retrieving microflow data ${actionname}: ${error.message}`,
                dataStore: { series: {} }
            }),
            params: {
                applyto: "selection",
                guids: [ guid ]
            }
        });
    }

    private fetchByXPath(seriesConfig: SeriesConfig, xpath: string, callback: MxObjectsCallback) {
        window.mx.data.get({
            callback,
            error: error => this.setState({
                alertMessage: `An error occurred while retrieving data via XPath (${xpath}): ${error}`,
                dataStore: { series: {} }
            }),
            filter: {
                attributes: [ seriesConfig.xAttribute, seriesConfig.yAttribute ],
                sort: [ [ seriesConfig.xAttribute, "asc" ] ]
            },
            xpath
        });
    }

    private setDataFromObjects(mxObjects: mendix.lib.MxObject[], seriesConfig: SeriesConfig): DataPoint[] {
        return mxObjects.map((itemObject): DataPoint => ({
            x: itemObject.get(seriesConfig.xAttribute) as number,
            y: parseFloat(itemObject.get(seriesConfig.yAttribute) as string)
        }));
    }

    private resetDataStore() {
        this.dataStore = { series: { } };
    }

    private resetSubscription(mxObject: mendix.lib.MxObject) {
        this.unSubscribe();
        if (mxObject) {
            this.subscriptionHandle = window.mx.data.subscribe({
                callback: () => this.fetchData(mxObject),
                guid: mxObject.getGuid()
            });
        }
    }

    private unSubscribe() {
        if (this.subscriptionHandle) {
            window.mx.data.unsubscribe(this.subscriptionHandle);
        }
    }

    public static parseStyle(style = ""): { [key: string]: string } {
        try {
            return `width:100%; ${style}`.split(";").reduce<{ [key: string]: string }>((styleObject, line) => {
                const pair = line.split(":");
                if (pair.length === 2) {
                    const name = pair[0].trim().replace(/(-.)/g, match => match[1].toUpperCase());
                    styleObject[name] = pair[1].trim();
                }
                return styleObject;
            }, {});
        } catch (error) {
            // tslint:disable-next-line no-console
            console.error("Failed to parse style", style, error);
        }

        return {};
    }
}

export { TimeSeriesContainer as default };
