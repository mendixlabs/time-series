import { Component, createElement } from "react";

import { Alert } from "./components/Alert";
import { TimeSeries } from "./components/TimeSeries";
import { DataStore } from "./TimeSeries";
import TimeSeriesContainer, { TimeSeriesContainerProps } from "./components/TimeSeriesContainer";

declare function require(name: string): string;

// tslint:disable class-name
export class preview extends Component<TimeSeriesContainerProps, {}> {

    render() {
        const alertMessage = TimeSeriesContainer.validateProps(this.props);
        if (alertMessage) {
            return createElement(Alert, { message: alertMessage });
        } else {
            return createElement(TimeSeries, {
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
            });
        }
    }

    private formatDate(datetime: Date | number | string) {
        const date = new Date(datetime);
        let month = "" + (date.getMonth() + 1);
        let day = "" + date.getDate();
        const year = date.getFullYear();

        if (month.length < 2) month = "0" + month;
        if (day.length < 2) day = "0" + day;

        return [ year, month, day ].join("-");
    }

    private getData(props: TimeSeriesContainerProps): DataStore {
        const dataStore: DataStore = { series: { } };
        props.seriesConfig.map((series, index) => {
            dataStore.series[series.name] = [
                { x: new Date(2017, 2, 15).getTime(), y: 100 + (20 * index) },
                { x: new Date(2017, 3, 15).getTime(), y: 400 + (20 * index) },
                { x: new Date(2017, 4, 15).getTime(), y: 200 + (20 * index) },
                { x: new Date(2017, 5, 15).getTime(), y: 350 + (20 * index) }
            ];
        });
        return dataStore;
    }
}

export function getPreviewCss() {
    let css = require("./ui/TimeSeries.css");
    css += require("nvd3/build/nv.d3.css");
    return css;
}
