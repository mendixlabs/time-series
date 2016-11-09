import { Selection, select } from "d3";
import { LineChart, addGraph, models, utils } from "nvd3";
import { Component, DOM } from "react";

import { Series } from "./TimeSeries";
import "nvd3/build/nv.d3.css";

export interface Nvd3LineChartProps {
    height?: number;
    width?: number;
    chartProps?: any;
    datum: Series[];
}

function isPlainObject(object: any): boolean {
    if (typeof object === "object" && object !== null) {
        if (typeof Object.getPrototypeOf === "function") {
            const proto = Object.getPrototypeOf(object);
            return proto === Object.prototype || proto === null;
        }
        return Object.prototype.toString.call(object) === "[object Object]";
    }
    return false;
}

// Configure components recursively
function configureChart(chart: any, options: any) {
    for (let optionName in options) {
        if (options.hasOwnProperty(optionName)) {
            let optionValue = options[optionName];
            if (chart) {
                if (isPlainObject(optionValue)) {
                    configureChart(chart[optionName], optionValue);
                } else if (typeof chart[optionName] === "function") {
                    chart[optionName](optionValue);
                }
            }
        }
    }
}

export class NVD3LineChart extends Component<Nvd3LineChartProps, {}> {
    private resizeHandler: { clear: Function };
    private chart: LineChart;
    private selection: Selection<any>;
    private svg: Node;

    render() {
        const style = {
            height: this.props.height,
            width: this.props.width
        };
        return DOM.div({ className: "nv-chart", style },
            DOM.svg({ ref: n => this.svg = n } )
        );
    }

    componentDidMount() {
        addGraph(() => this.renderChart() );
    }

    componentDidUpdate() {
        this.renderChart();
    }

    componentWillUnmount() {
        if (this.resizeHandler) {
            this.resizeHandler.clear();
        }
    }

    private renderChart() {
        this.chart = (this.chart) ? this.chart : models.lineChart();
        configureChart(this.chart, this.props.chartProps);
        this.chart.showLegend(true)
            .showXAxis(true)
            .showYAxis(true)
            .useInteractiveGuideline(true)
            .duration(350);

        this.selection = select(this.svg)
            .datum(this.props.datum ? this.props.datum : [])
            .call(this.chart);

        if (!this.resizeHandler) {
            this.resizeHandler = utils.windowResize(() => {
                this.chart.update();
            });
        }

        return this.chart;
    }

}
