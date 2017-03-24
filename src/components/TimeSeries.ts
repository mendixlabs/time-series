import { max, min, time } from "d3";
import { Component, createElement } from "react";

import { DataPoint, DataStore, ModelProps, SeriesConfig } from "../TimeSeries";
import { NVD3LineChart, Nvd3LineChartProps } from "./NVD3LineChart";

import "../ui/TimeSeries.css";

interface Series {
    values?: DataPoint[];
    key?: string;
    color?: string;
    area?: boolean;
}

interface TimeSeriesProps extends ModelProps {
    dataStore?: DataStore;
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
                        tickFormat: (value: number) =>
                            window.mx.parser.formatValue(value, "datetime", { datePattern: xFormat })
                    },
                    xScale: time.scale(),
                    yAxis: {
                        axisLabel: props.yAxisLabel,
                        tickFormat: (value) =>
                            new Intl.NumberFormat("en-US", {
                                maximumFractionDigits: props.yAxisFormatDecimalPrecision,
                                minimumFractionDigits: 0
                            }).format(value)
                    }
                },
                forceY: this.forceY(datum, customForceY),
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

    private forceY(datum: Series[], customForceY: number[] ) {
        const returnForceY = [ 0, 0 ];
        const customMinimumY = customForceY[0];
        const customMaximumY = customForceY[1];
        const dataMinimumY = min(datum, (seriesData) => min(seriesData.values, (dataPoint) => dataPoint.y));
        const dataMaximumY = max(datum, (seriesData) => max(seriesData.values, (dataPoint) => dataPoint.y));
        returnForceY[0] = customMinimumY < dataMinimumY ? customMinimumY : dataMinimumY;
        returnForceY[1] = customMaximumY > dataMaximumY ? customMaximumY : dataMaximumY;
        const paddingY = (returnForceY[1] - returnForceY[0]) * 0.05;
        returnForceY[0] = returnForceY[0] === customMinimumY ? customMinimumY : returnForceY[0] - paddingY;
        returnForceY[1] = returnForceY[1] === customMaximumY ? customMaximumY : returnForceY[1] + paddingY;
        return returnForceY;

    }
}

export { TimeSeries, TimeSeriesProps, Series };
