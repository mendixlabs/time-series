import { select, time } from "d3";
import { addGraph, models, utils } from "nvd3";
import { Component, DOM } from "react";

import { Series } from "./TimeSeries";
import "nvd3/build/nv.d3.css";

export interface Nvd3LineChartProps {
    height?: number;
    width?: number;
    chartProps?: ChartProps;
    datum: Series[];
}

interface ChartProps {
    xAxis: Axis;
    xScale: time.Scale<number, number>;
    yAxis: Axis;
}

interface Axis {
    axisLabel: string;
    showMaxMin?: boolean;
    tickFormat: (d: any) => string;
}

export class NVD3LineChart extends Component<Nvd3LineChartProps, {}> {
    static defaultProps: Nvd3LineChartProps = { datum: [] };
    private chart: nv.LineChart;
    private resizeHandler: { clear: Function };
    private svg: Node;

    render() {
        const style = {
            height: this.props.height,
            width: this.props.width
        };
        return DOM.div({ className: "nv-chart", style },
            DOM.svg({ ref: node => this.svg = node })
        );
    }

    componentDidMount() {
        addGraph(() => this.renderChart());
    }

    componentDidUpdate() {
        this.renderChart();
    }

    componentWillUnmount() {
        this.resizeHandler.clear();
    }

    private renderChart() {
        this.chart = this.chart || models.lineChart();
        this.configureChart(this.chart, this.props.chartProps);
        this.chart.showLegend(true)
            .showXAxis(true)
            .showYAxis(true)
            .useInteractiveGuideline(true)
            .duration(350);

        select(this.svg).datum(this.props.datum).call(this.chart);

        if (!this.resizeHandler) {
            this.resizeHandler = utils.windowResize(() => {
                if (this.chart.update) {
                    this.chart.update();
                }
            });
        }

        return this.chart;
    }

    private isPlainObject(object: any): boolean {
        if (typeof object === "object" && object !== null) {
            const proto = Object.getPrototypeOf(object);
            return proto === Object.prototype || proto === null;
        }
        return false;
    }

    private configureChart(chart: any, options: any) {
        for (let optionName in options) {
            if (options.hasOwnProperty(optionName)) {
                let optionValue = options[optionName];
                if (this.isPlainObject(optionValue)) {
                    this.configureChart(chart[optionName], optionValue);
                } else if (typeof chart[optionName] === "function") {
                    chart[optionName](optionValue);
                }
            }
        }
    }
}
