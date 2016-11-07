import { Component, createElement } from "react";

import { NVD3LineChart } from "./NVD3LineChart";
import { format, time } from "d3";

import { ModelProps, SeriesConfig } from "../TimeSeries.d";
import "../ui/TimeSeries.css";

export interface DataPoint {
    x: number;
    y: number;
}

export interface DataStore {
    series: any; //TODO: remove any
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
        const datum = TimeSeries.processDatum(props.seriesConfig, props.dataStore);
        const xFormat = props.xAxisFormat || "dd-MM-yyyy";
        const chart: any = {
                chartProps: {
                    xAxis: {
                        axisLabel: props.xAxisLabel,
                        showMaxMin: true,
                        tickFormat: (dataPoint: any) => {
                            console.log(dataPoint);
                            return window.mx.parser.formatValue(dataPoint, "datetime", { datePattern: xFormat } );
                            // return time.format(xFormat)(new Date(dataPoint));
                        }
                    },
                    xScale: time.scale(),
                    yAxis: {
                        axisLabel: props.yAxisLabel,
                        tickFormat: (dataPoint: any) => {
                            if (props.yAxisFormat) {
                                return format(props.yAxisFormat)(dataPoint);
                            } else {
                                return dataPoint;
                            }
                        }
                    }
                },
                datum,
                height: props.heightUnit === "auto" ? undefined : props.height,
                width: props.widthUnit === "auto" ? undefined : props.width
            };

        return createElement (NVD3LineChart, chart);
    }

    public static processDatum(seriesConfig: SeriesConfig[], dataStore: DataStore): Series[] {
        // const hasData = Object.keys(dataStore).filter(element => (element === "series")).length &&
        //         Object.keys(dataStore.series).filter(element => (element === config.name)).length;

        return seriesConfig.map(config => ({
            area: config.fill,
            color: config.color,
            key: config.name,
            values: dataStore.hasOwnProperty("series") ? dataStore.series[config.name] : []
        }));
    }
}
