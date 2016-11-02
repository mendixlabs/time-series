import { Component, createElement } from "react";

import { NVD3LineChart } from "./NVD3LineChart";
import { format, time } from "d3";

import { ModelProps, SeriesConfig } from "../TimeSeries.d";

export interface DataPoint {
    x: number;
    y: number;
}

export interface DataStore {
    series: any;
}

export interface Series {
    values?: DataPoint[];
    key?: any;
    color?: string;
    area?: boolean;
}

export interface WidgetProps extends ModelProps {
    widgetId: string;
    dataLoaded?: boolean;
    dataStore?: DataStore;
}

export class TimeSeries extends Component<WidgetProps, {}> {
    render() {
        const props = this.props;
        const datum = TimeSeries.processDatum(props.seriesConfig, props.dataStore);
        const xFormat = props.xAxisFormat ? props.xAxisFormat : "%d-%b-%y";
        const yFormat = props.yAxisFormat ? props.yAxisFormat : "";
        let chart: any = {
                chartProps: {
                    xAxis: {
                        axisLabel: props.xAxisLabel,
                        showMaxMin: true,
                        tickFormat: (dataPoint: any) => {
                            return time.format(xFormat)(new Date(dataPoint));
                        }
                    },
                    xScale: time.scale(),
                    yAxis: {
                        axisLabel: props.yAxisLabel,
                        tickFormat: (dataPoint: any) => {
                            if (yFormat) {
                                return format(yFormat)(dataPoint);
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
        return seriesConfig.map(config => ({
            area: config.fill,
            color: config.color ? config.color : undefined,
            key: config.name,
            values: Object.keys(dataStore.series).length ? dataStore.series[config.name] : []
        }));
    }
}
