import { max, min, time } from "d3";
import { Component, DOM, createElement } from "react";

import { DataPoint, DataStore, ModelProps, SeriesConfig } from "../TimeSeries";
import { NVD3LineChart, Nvd3LineChartProps } from "./NVD3LineChart";

import "../ui/TimeSeries.css";

interface Series {
    values: DataPoint[];
    key?: string;
    color?: string;
    area?: boolean;
}

interface TimeSeriesProps extends ModelProps {
    dataStore: DataStore;
}

class TimeSeries extends Component<TimeSeriesProps, {}> {
    static defaultProps = {
        dataStore: { series: { } }
    };

    render() {
        const props = this.props;
        const datum = this.processDatum(props.seriesConfig, props.dataStore);
        const customForceY = [ Number(props.yAxisDomainMinimum), Number(props.yAxisDomainMaximum) ];
        const xFormat = props.xAxisFormat || "dd-MM-yyyy";
        const chart: Nvd3LineChartProps = {
                chartProps: {
                    xAxis: {
                        axisLabel: props.xAxisLabel,
                        showMaxMin: true,
                        tickFormat: value =>
                            window.mx.parser.formatValue(value, "datetime", { datePattern: xFormat })
                    },
                    xScale: time.scale(),
                    yAxis: {
                        axisLabel: props.yAxisLabel,
                        tickFormat: value =>
                            new Intl.NumberFormat("en-US", {
                                maximumFractionDigits: props.yAxisFormatDecimalPrecision,
                                minimumFractionDigits: 0
                            }).format(value)
                    }
                },
                forceY: this.getYAxisBoundaries(datum, customForceY),
                datum,
                height: props.height,
                heightUnit: props.heightUnit,
                width: props.width,
                widthUnit: props.widthUnit

            };
        if (!datum.length) {
            return DOM.div({ className: "widget-time-series nvd3 nv-noData" }, "No Data");
        }
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
        })).filter(config => config.values.length);
    }

    // This function returns the minimum and maximum y-axis values
    private getYAxisBoundaries(datum: Series[], customForceY: number[]): number[] {
        const yLimit = { minimum: 0, maximum: 0 };
        const customYLimit = { min: customForceY[0], max: customForceY[1] };
        const dataMinimumY = min(datum, (seriesData) => min(seriesData.values, (dataPoint: DataPoint) => dataPoint.y));
        const dataMaximumY = max(datum, (seriesData) => max(seriesData.values, (dataPoint: DataPoint) => dataPoint.y));
        yLimit.minimum = customYLimit.min < dataMinimumY ? customYLimit.min : dataMinimumY;
        yLimit.maximum = customYLimit.max > dataMaximumY ? customYLimit.max : dataMaximumY;
        const paddingY = (yLimit.maximum - yLimit.minimum) * 0.05;
        yLimit.minimum = yLimit.minimum === customYLimit.min ? customYLimit.min : yLimit.minimum - paddingY;
        yLimit.maximum = yLimit.maximum === customYLimit.max ? customYLimit.max : yLimit.maximum + paddingY;

        return [ yLimit.minimum, yLimit.maximum ];
    }
}

export { TimeSeries, TimeSeriesProps, Series };
