import { Component, createElement } from "react";

import { NVD3LineChart, Nvd3LineChartProps } from "./NVD3LineChart";
import { time } from "d3";

import { ModelProps, SeriesConfig } from "../TimeSeries.d";
import "../ui/TimeSeries.css";

export interface DataPoint {
    x: number;
    y: number;
}

export interface DataStore {
    series: {[key: string]: DataPoint[]};
}

export interface Series {
    values?: DataPoint[];
    key?: string;
    color?: string;
    area?: boolean;
}

export interface WidgetProps extends ModelProps {
    dataStore?: DataStore;
}

export class TimeSeries extends Component<WidgetProps, {}> {
    render() {
        const props = this.props;
        const datum = this.processDatum(props.seriesConfig, props.dataStore);
        const xFormat = props.xAxisFormat || "dd-MM-yyyy";
        const chart: Nvd3LineChartProps = {
                chartProps: {
                    xAxis: {
                        axisLabel: props.xAxisLabel,
                        showMaxMin: true,
                        tickFormat: (value: number) => {
                            return window.mx.parser.formatValue(value, "datetime", { datePattern: xFormat });
                        }
                    },
                    xScale: time.scale(),
                    yAxis: {
                        axisLabel: props.yAxisLabel,
                        tickFormat: (value) => {
                                return new Intl.NumberFormat("en-US", {
                                    maximumFractionDigits: props.yAxisFormatDecimalPrecision,
                                    minimumFractionDigits: 0})
                                .format(value);
                        }
                    }
                },
                datum,
                height: props.heightUnit === "auto" ? undefined : props.height,
                width: props.widthUnit === "auto" ? undefined : props.width
            };

        return createElement (NVD3LineChart, chart);
    }

    private processDatum(seriesConfig: SeriesConfig[], dataStore: DataStore): Series[] {
        return seriesConfig.map(config => ({
            area: config.fill,
            color: config.color,
            key: config.name,
            values: dataStore.hasOwnProperty("series") && dataStore.series.hasOwnProperty(config.name)
                ? dataStore.series[config.name]
                : []
        }));
    }
}
