import * as lang from "mendix/lang";
import { Component, DOM, createElement } from "react";

import { DataPoint, DataStore, ModelProps, SeriesConfig } from "../TimeSeries";
import { Alert } from "./Alert";
import { TimeSeries } from "./TimeSeries";

interface TimeSeriesContainerProps extends ModelProps {
    mxObject: mendix.lib.MxObject;
}

interface TimeSeriesContainerState {
    alertMessage?: string;
    dataStore: DataStore;
    isLoaded?: boolean;
}

class TimeSeriesContainer extends Component<TimeSeriesContainerProps, TimeSeriesContainerState> {
    private subscriptionHandle: number;
    private dataStore: DataStore;

    constructor(props: TimeSeriesContainerProps) {
        super(props);
        this.fetchData = this.fetchData.bind(this);
        this.state = {
            alertMessage: this.validateProps(),
            dataStore: { series: {} }
        };
    }

    render() {
        return this.state.alertMessage
            ? createElement(Alert, { message: this.state.alertMessage })
            : this.state.isLoaded
                ? createElement(TimeSeries, {
                    dataStore: this.state.dataStore,
                    height: this.props.height,
                    heightUnit: this.props.heightUnit,
                    seriesConfig: this.props.seriesConfig,
                    width: this.props.width,
                    widthUnit: this.props.widthUnit,
                    xAxisFormat: this.props.xAxisFormat,
                    xAxisLabel: this.props.xAxisLabel,
                    yAxisDomainMaximum: this.props.yAxisDomainMaximum,
                    yAxisDomainMinimum: this.props.yAxisDomainMinimum,
                    yAxisFormatDecimalPrecision: this.props.yAxisFormatDecimalPrecision,
                    yAxisLabel: this.props.yAxisLabel
                })
                : DOM.div({ className: "widget-time-series nvd3 nv-noData" }, "Loading...");
    }

    componentWillReceiveProps(nextProps: TimeSeriesContainerProps) {
        this.resetDataStore();
        this.resetSubscription(nextProps.mxObject);
        this.fetchData(nextProps.mxObject);
    }

    componentWillUnmount() {
        this.unSubscribe();
    }

    private validateProps(): string {
        let errorMessage = "";
        const incorrectSeriesNames = this.props.seriesConfig
            .filter(series => series.sourceType === "microflow" && !series.dataSourceMicroflow)
            .map(incorrect => incorrect.name)
            .join(", ");

        if (incorrectSeriesNames) {
            errorMessage += `series : ${incorrectSeriesNames}` +
                ` - data source type is set to 'Microflow' but 'Source - microflow' is missing \n`;
        }

        try {
            window.mx.parser.formatValue(new Date(), "datetime", { datePattern: this.props.xAxisFormat || "" });
        } catch (error) {
            errorMessage += `Formatting for the x-axis : (${this.props.xAxisFormat}) is invalid \n\n`;
        }

        if (this.props.yAxisDomainMinimum && isNaN(Number(this.props.yAxisDomainMinimum))) {
            errorMessage += `Y-axis Domain minimum value (${this.props.yAxisDomainMinimum}) is not a number`;
        }
        if (this.props.yAxisDomainMaximum && isNaN(Number(this.props.yAxisDomainMaximum))) {
            errorMessage += `Y-axis Domain maximum value (${this.props.yAxisDomainMaximum}) is not a number`;
        }

        return errorMessage && `Configuration error :\n\n ${errorMessage}`;

    }

    private fetchData(contextObject: mendix.lib.MxObject) {
        if (contextObject) {
            const chain = this.props.seriesConfig.map(series => (chainCallback: () => void) => {
                const processResults = (data: mendix.lib.MxObject[]) => {
                    this.dataStore.series[series.name] = this.setDataFromObjects(data, series);
                    chainCallback();
                };

                if (series.sourceType === "xpath") {
                    const constraint = series.entityConstraint
                        ? series.entityConstraint.replace("[%CurrentObject%]", contextObject.getGuid())
                        : "";
                    const XPath = "//" + series.entity + constraint;
                    this.fetchByXPath(series, XPath, processResults);
                } else if (series.sourceType === "microflow" && series.dataSourceMicroflow) {
                    this.fetchByMicroflow(contextObject.getGuid(), series.dataSourceMicroflow, processResults);
                }
            });
            lang.collect(chain, () => {
                this.setState({ dataStore: this.dataStore, isLoaded: true });
            });
        } else {
            this.setState({ dataStore: this.dataStore, isLoaded: true });
        }
    }

    private fetchByMicroflow(guid: string, actionname: string, callback: (object: mendix.lib.MxObject[]) => void) {
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

    private fetchByXPath(seriesConfig: SeriesConfig, xpath: string, callback: (object: mendix.lib.MxObject[]) => void) {
        window.mx.data.get({
            callback,
            error: error => this.setState({
                alertMessage: `An error occurred while retrieving data via XPath (${xpath}): ${error}`,
                dataStore: { series: {} }
            }),
            filter: {
                sort: [ [ seriesConfig.xAttribute, "asc" ] ]
            },
            xpath
        });
    }

    private setDataFromObjects(objects: mendix.lib.MxObject[], seriesConfig: SeriesConfig): DataPoint[] {
        return objects.map((itemObject): DataPoint => ({
            x: itemObject.get(seriesConfig.xAttribute) as number,
            y: parseFloat(itemObject.get(seriesConfig.yAttribute) as string)
        }));
    }

    private resetDataStore() {
        this.dataStore = { series: { } };
    }

    private resetSubscription(contextObject: mendix.lib.MxObject) {
        this.unSubscribe();

        if (contextObject) {
            this.subscriptionHandle = window.mx.data.subscribe({
                callback: () => this.fetchData(contextObject),
                guid: contextObject.getGuid()
            });
        }

    }

    private unSubscribe() {
        if (this.subscriptionHandle) {
            window.mx.data.unsubscribe(this.subscriptionHandle);
        }
    }
}

export { TimeSeriesContainer as default };
