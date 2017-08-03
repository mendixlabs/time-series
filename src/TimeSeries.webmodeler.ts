import { Component, createElement } from "react";

import { Alert } from "./components/Alert";
import { TimeSeries, TimeSeriesProps } from "./components/TimeSeries";
import { DataStore } from "./TimeSeries";
import TimeSeriesContainer, { TimeSeriesContainerProps } from "./components/TimeSeriesContainer";

declare function require(name: string): string;

// tslint:disable class-name
export class preview extends Component<TimeSeriesContainerProps, {}> {

    render() {
        const message = this.validateProps(this.props);

        return createElement("div", {},
            createElement(TimeSeries, this.getProps(message)),
            createElement(Alert, { message })
        );
    }

    componentDidMount() {
        this.setUpEvents();
    }

    componentWillUnmount() {
        const modelerIFrame = this.getIframe();
        if (modelerIFrame) {
            modelerIFrame.contentWindow.removeEventListener("resize", this.onResizeIframe);
        }
    }

    private getProps(alertMessage: string): TimeSeriesProps {
        if (!alertMessage) {
            return {
                class: this.props.class,
                dataStore: this.getData(this.props),
                formatter: this.formatDate,
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
            };
        } else {
            return {
                class: "",
                dataStore: this.getData(this.props),
                formatter: this.formatDate,
                height: 75,
                heightUnit: "percentageOfWidth",
                seriesConfig: !this.props.seriesConfig.length
                // tslint:disable-next-line max-line-length
                    ? [ { entity: "dummyEntity", fill: false, name: "Serie", sourceType: "xpath", xAttribute: "xAtt", yAttribute: "yAtt" } ]
                    : this.props.seriesConfig,
                style: TimeSeriesContainer.parseStyle(this.props.style),
                width: 75,
                widthUnit: "percentage",
                xAxisFormat: "2",
                xAxisLabel: "x-axis",
                yAxisDomainMaximum: undefined,
                yAxisDomainMinimum: undefined,
                yAxisFormatDecimalPrecision: undefined,
                yAxisLabel: "y-axis"
            };
        }
    }

    private formatDate(datetime: Date | number | string) {
        const date = new Date(datetime);
        let month = "" + (date.getMonth() + 1);
        let day = "" + date.getDate();
        const year = date.getFullYear();

        if (month.length < 2) month = "0" + month;
        if (day.length < 2) day = "0" + day;

        return [ day, month, year ].join("-");
    }

    private getData(props: TimeSeriesContainerProps): DataStore {
        const dataStore: DataStore = { series: { } };
        if (props.seriesConfig.length) {
            props.seriesConfig.map((series, index) => {
                dataStore.series[series.name] = [
                    { x: new Date(2017, 2, 15).getTime(), y: 100 + (20 * index) },
                    { x: new Date(2017, 3, 15).getTime(), y: 400 + (20 * index) },
                    { x: new Date(2017, 4, 15).getTime(), y: 200 + (20 * index) },
                    { x: new Date(2017, 5, 15).getTime(), y: 350 + (20 * index) }
                ];
            });
        } else {
            dataStore.series.Serie = [
                { x: new Date(2017, 2, 15).getTime(), y: 100 },
                { x: new Date(2017, 3, 15).getTime(), y: 400 },
                { x: new Date(2017, 4, 15).getTime(), y: 200 },
                { x: new Date(2017, 5, 15).getTime(), y: 350 }
            ];
        }
        return dataStore;
    }

    private validateProps(props: TimeSeriesContainerProps) {
        let errorMessage = TimeSeriesContainer.validateProps(props);
        // web modeler validations
        const yAxisPrecision = !! (props.yAxisFormatDecimalPrecision && props.yAxisFormatDecimalPrecision < 0);
        if ( isNaN(Number(props.yAxisFormatDecimalPrecision)) || yAxisPrecision ) {
            errorMessage += `Y-axis decimal precision is invalid`;
        }
        if (!props.seriesConfig || !props.seriesConfig.length) {
            errorMessage += `One or more data series should be added`;
        } else {
            props.seriesConfig.forEach((config, index) => {
                const errorMsg: string[] = [];
                if (!config.name) errorMsg.push(`serie name`);
                if (!config.entity) errorMsg.push(`data entity`);
                if (!config.xAttribute) errorMsg.push(`X-axis date attribute`);
                if (!config.yAttribute) errorMsg.push(`Y-axis data attribute`);
                errorMessage += errorMsg.length ? `serie '${index}' is missing ${errorMsg.join(",")}\n` : "";
            });
        }
        return errorMessage;
    }

    private setUpEvents() {
        const modelerIFrame = this.getIframe();
        if (modelerIFrame) {
            modelerIFrame.contentWindow.addEventListener("resize", this.onResizeIframe);
        }
    }

    private getIframe(): HTMLIFrameElement {
        return document.getElementsByClassName("t-page-editor-iframe")[0] as HTMLIFrameElement;
    }

    private onResizeIframe() {
        window.dispatchEvent(new Event("resize"));
    }
}

export function getPreviewCss() {
    return require("./ui/TimeSeries.css") + require("nvd3/build/nv.d3.css");
}

export function getVisibleProperties(valueMap: any, visibilityMap: any) {
    valueMap.seriesConfig.forEach((config: any, index: number) => {
        if (config.sourceType === "xpath") {
            visibilityMap.seriesConfig[index].dataSourceMicroflow = false;
            visibilityMap.seriesConfig[index].entityConstraint = true;
        }
        if (config.sourceType === "microflow") {
            visibilityMap.seriesConfig[index].dataSourceMicroflow = true;
            visibilityMap.seriesConfig[index].entityConstraint = false;
        }
    });

    return visibilityMap;
}
