import { time } from "d3";
import { Component, createElement } from "react";

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
    class: string;
    style: object;
    formatter: (value: any, type: string, props?: any) => string;
}

class TimeSeries extends Component<TimeSeriesProps, {}> {
    static defaultProps = {
        dataStore: { series: { } }
    };

    render() {
        const datum = this.processDatum(this.props.seriesConfig, this.props.dataStore);
        const forceY = [];
        if (this.props.yAxisDomainMaximum) {
            forceY.push(Number(this.props.yAxisDomainMaximum));
        }
        if (this.props.yAxisDomainMinimum) {
            forceY.push(Number(this.props.yAxisDomainMinimum));
        }
        const xFormat = this.props.xAxisFormat || "dd-MM-yyyy";
        const chart: Nvd3LineChartProps = {
            chartProps: {
                xAxis: {
                    axisLabel: this.props.xAxisLabel,
                    showMaxMin: true,
                    tickFormat: value =>
                         this.props.formatter(value, "datetime", { datePattern: xFormat })
                },
                xScale: time.scale(),
                yAxis: {
                    axisLabel: this.props.yAxisLabel,
                    tickFormat: value =>
                        new Intl.NumberFormat("en-US", {
                            maximumFractionDigits: this.props.yAxisFormatDecimalPrecision,
                            minimumFractionDigits: 0
                        }).format(value)
                }
            },
            datum,
            forceY,
            height: this.props.height,
            heightUnit: this.props.heightUnit,
            width: this.props.width,
            widthUnit: this.props.widthUnit

        };
        if (!datum.length) {
            return createElement("div", { className: "widget-time-series nvd3 nv-noData" }, "No Data");
        }
        return createElement("div", {
            className: this.props.class,
            // Width 100% for sizing the container.
            style: { width: "100%", ... this.props.style }
        }, createElement(NVD3LineChart, chart));
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

}

export { TimeSeries, TimeSeriesProps, Series };
