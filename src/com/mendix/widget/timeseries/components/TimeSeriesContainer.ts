import * as lang from "mendix/lang";
import { Component, createElement } from "react";

import { DataPoint, DataStore, ModelProps, SeriesConfig } from "../TimeSeries.d";
import { Alert } from "./Alert";
import { TimeSeries as TimeSeriesComponent } from "./TimeSeries";


export interface ContainerProps extends ModelProps {
    callback?: Function;
    contextObject: mendix.lib.MxObject;
}

interface ContainerState {
    configurationError?: string;
    dataStore: DataStore;
}

export class TimeSeriesContainer extends Component<ContainerProps, ContainerState> {
    private subscriptionHandle: number;
    constructor(props: ContainerProps) {
        super(props);
        this.fetchData = this.fetchData.bind(this);
        const configurationError = this.hasValidConfig();
        this.state = {
            configurationError,
            dataStore: { series: {} }
        };
        this.resetSubscription(props.contextObject);
    }

    render() {
        if (this.state.configurationError) {
            this.props.callback();
            return createElement(Alert, { message: this.state.configurationError });
        } else {
            return createElement(TimeSeriesComponent, {
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
            });
        }
    }

    componentWillReceiveProps(nextProps: ContainerProps) {
        this.resetSubscription(nextProps.contextObject);
        this.fetchData(nextProps.contextObject);
    }

    componentWillUnmount() {
        this.unSubscribe();
    }

    componentDidMount() {
        if (!this.state.configurationError) {
            this.fetchData(this.props.contextObject);
        }
    }


    private fetchData(contextObject: mendix.lib.MxObject) {
        const dataStore: DataStore = { series: {} };
        if (contextObject) {
            const chain = this.props.seriesConfig.map(series => (chainCallback: Function) => {
                const processResults = ( data: mendix.lib.MxObject[]) => {
                    dataStore.series[series.name] = this.setDataFromObjects(data, series);
                    if (this.props.seriesConfig[this.props.seriesConfig.length - 1].name === series.name) {
                        this.setState( { dataStore });
                        if (this.props.callback) this.props.callback();
                    }
                    chainCallback();
                };

                if (series.sourceType === "xpath") {
                    const constraint = series.entityConstraint.replace("[%CurrentObject%]", contextObject.getGuid());
                    const XPath = "//" + series.entity + constraint;
                    this.fetchByXPath(series, XPath, processResults);
                } else if (series.sourceType === "microflow") {
                    this.fetchByMicroflow(series.dataSourceMicroflow, processResults);
                }
            });

            lang.collect(chain);
        } else {
            this.setState({ dataStore });
            this.props.callback();
        }
    }

    private fetchByMicroflow(microflow: string, callback: (object: mendix.lib.MxObject[]) => void) {
        window.mx.ui.action(microflow, {
            callback,
            error: error => {
                this.setState({
                    configurationError: `Error while retrieving microflow data ${microflow}: ${error.message}`,
                    dataStore: { series: {} }
                });
                this.props.callback();
            },
            params: {
                guids: [ this.props.contextObject.getGuid() ]
            }
        });
    }

    private fetchByXPath(seriesConfig: SeriesConfig, xpath: string, callback: (object: mendix.lib.MxObject[]) => void) {
        window.mx.data.get({
            callback,
            error: error => {
                this.setState({
                    configurationError: `An error occurred while retrieving data via XPath (${xpath}): ${error}`,
                    dataStore: { series: {} }
                });
                this.props.callback();
            },
            filter: {
                sort: [ [ seriesConfig.xAttribute, "asc" ] ]
            },
            xpath
        });
    }

    private hasValidConfig(): string {
        let errorMessage = "";
        const incorrectSeriesNames = this.props.seriesConfig
            .filter(series => (series.sourceType === "microflow" && !series.dataSourceMicroflow))
            .map(incorrect => incorrect.name)
            .join(", ");

        if (incorrectSeriesNames) {
            errorMessage += `series : ${incorrectSeriesNames}` +
                ` - data source type is set to 'Microflow' but 'Source - microflow' is missing \n`;
        }

        try {
            window.mx.parser.formatValue(new Date(), "datetime", { datePattern: this.props.xAxisFormat || "" });
        } catch (error) {
            errorMessage += `Formatting for the x-axis : ${this.props.xAxisFormat} is invalid \n\n`;
        }

        if (this.props.yAxisDomainMinimum && isNaN(parseFloat(this.props.yAxisDomainMinimum))) {
            errorMessage += `Y-axis Domain minimum value ${this.props.yAxisDomainMinimum} is not a number`
        }
        if (this.props.yAxisDomainMaximum && isNaN(parseFloat(this.props.yAxisDomainMaximum))) {
            errorMessage += `Y-axis Domain maximum value ${this.props.yAxisDomainMaximum} is not a number`
        }

        return errorMessage ? `Configuration error :\n\n ${errorMessage}` : ``;

    }

    private setDataFromObjects(objects: mendix.lib.MxObject[], seriesConfig: SeriesConfig) {
        return objects.map((itemObject): DataPoint => ({
            x: itemObject.get(seriesConfig.xAttribute) as number,
            y: parseFloat(itemObject.get(seriesConfig.yAttribute) as string)
        }));
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
