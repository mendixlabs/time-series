import * as d3 from "TimeSeriesChart/lib/d3";
import * as React from "TimeSeriesChart/lib/react";

import { ObjectAssign } from "./Polyfills";

import "TimeSeriesChart/lib/nv.d3";

import {
    bindFunctions,
    getValueFunction,
    isCallable,
    isPlainObject,
    pick,
    propsByPrefix,
    without,
} from "./utils";

let SETTINGS = [ "x", "y", "type", "datum", "configure" ];
let SIZE = [ "width", "height" ];
let MARGIN = "margin";
let CONTAINER_STYLE = "containerStyle";

const RENDER_START = "renderStart";
const ELEMENT_CLICK = "elementClick";
const RENDER_END = "renderEnd";
const READY = "ready";

// TODO Set interface types.
interface NVD3ChartProps {
    type: "lineChart";
    configure?: (chart: nv.LineChart) => void;
    containerStyle?: any;
    context?: any;
    datum: any[] | Function;
    chartOptions?: any;
    margin?: any;
    x?: string | Function;
    y?: string | Function;
    // events
    ready?: Function;
    renderStart?: Function;
    renderEnd?: Function;
    elementClick?: Function;
    // nv properties
    yAxis?: any;
    xAxis?: any;
    height?: number;
    width?: number;
    showLegend?: boolean;
    showXAxis: boolean;
    showYAxis: boolean;
    duration?: number;
    useInteractiveGuideline?: boolean;
    xDomain: [any, any];
    xScale: d3.time.Scale<number, number>;
    yDomain: any[];
}

interface AnyObject extends Object {
    [key: string]: any;
}

interface ChartBase extends nv.LineChart {
    [key: string]: any;
}

export class NVD3Chart extends React.Component<NVD3ChartProps, {}> {
    // TODO Set member types
    private resizeHandler: any;
    private chart: ChartBase; // | nv.PieChart | nv.MultiBarChart;
    private rendering: any;
    private parsedProps: any;
    private selection: any;
    private svg: Node;

    /**
     * Instantiate a new chart setting
     * a callback if exists
     */
    public componentDidMount() {
        nv.addGraph(this.renderChart.bind(this), (chart) => {
            if (isCallable(this.props.ready)) {
                this.props.ready(chart, READY);
            }
        });
    }

    /**
     * Update the chart after state is changed.
     */
    public componentDidUpdate() {
        this.renderChart();
    }

    /**
     * Remove listeners
     */
    public componentWillUnmount() {
        if (this.resizeHandler) {
            this.resizeHandler.clear();
        }
    }

    /**
     * Creates a chart model and render it
     */
    private renderChart() {
        let dispatcher: d3.Dispatch;

        // We try to reuse the current chart instance. If not possible then lets instantiate again

        // this.chart = (this.chart && !this.rendering) ? this.chart : nv.models[this.props.type](); 
        // only support one type for now
        this.chart = (this.chart && !this.rendering) ? this.chart : nv.models.lineChart();

        if (isCallable(this.props.renderStart)) {
            this.props.renderStart(this.chart, RENDER_START);
        }
        this.parsedProps = bindFunctions(this.props, this.props.context);

        if (this.chart.x) {
            this.chart.x(getValueFunction(this.parsedProps.x, "x"));
        }
        if (this.chart.y) {
            this.chart.y(getValueFunction(this.parsedProps.y, "y"));
        }
        if (this.props.margin) {
            this.chart.margin(this.options([ MARGIN ], pick).margin || propsByPrefix("margin", this.props) || {});
        }

        // Configure componentes recursively
        this.configureComponents(this.chart, this.options(SETTINGS.concat(CONTAINER_STYLE), without));

        // hook for configuring the chart
        if (this.props.configure) {
            this.props.configure(this.chart);
        }

        // Render chart using d3
        this.selection = d3.select(this.svg)
            .datum(this.props.datum)
            .call(this.chart);

        // Update the chart if the window size change.
        // Save resizeHandle to remove the resize listener later.
        if (!this.resizeHandler) {
            this.resizeHandler = nv.utils.windowResize(() => {
                this.chart.update();
            });
        }

        // PieCharts and lineCharts are an special case. Their dispacher is the pie component inside the chart.
        // There are some charts do not feature the renderEnd event
        // switch (this.props.type) {
        // case "multiBarChart":
        //     dispatcher = this.chart.multibar.dispatch;
        //     break;
        // case "pieChart":
        //     dispatcher = this.chart.pie.dispatch;
        //     break;
        // case "lineChart":
        //     dispatcher = this.chart.lines.dispatch;
        //     break;
        // default:
        //     dispatcher = this.chart.dispatch;
        // }

        dispatcher = this.chart.lines.dispatch;

        if (dispatcher[RENDER_END]) {
            dispatcher.on("renderEnd", this.renderEnd.bind(this));
        }
        if (dispatcher[ELEMENT_CLICK]) {
            dispatcher.on("elementClick", this.elementClick.bind(this));
        }
        this.rendering = true;

        return this.chart;
    }

    /**
     * Render end callback function
     * @param  {Event} e
     */
    public renderEnd(event: Event) {
        if (isCallable(this.props.renderEnd)) {
            this.props.renderEnd(this.chart, RENDER_END);
        }
        // Once renders end then we set rendering to false to allow to reuse the chart instance.
        this.rendering = false;
    }

    /**
     * element click callback function
     * @param  {Event} e
     */
    private elementClick(event: Event) {
        if (isCallable(this.props.elementClick)) {
            this.props.elementClick(event, "elementClick");
        }
    }

    /**
     * Configure components recursively
     * @param {nvd3 chart} chart  A nvd3 chart instance
     * @param {object} options    A key value object
     */
    private configureComponents(chart: ChartBase, options: AnyObject) {
        for (let optionName in options) {
            if (options.hasOwnProperty(optionName)) {
                let optionValue = options[optionName];
                if (chart) {
                    if (isPlainObject(optionValue)) {
                        this.configureComponents(chart[optionName], optionValue);
                    } else if (typeof chart[optionName] === "function") {
                        chart[optionName](optionValue);
                    }
                }
            }
        }
    }

    /**
     * Filter options base on predicates
     * @param {Array} keys          An array of keys to preserve or remove
     * @param {Function} predicate  The function used to filter keys
     */
    public options(keys: string[], predicate: Function) {
        // DEPRECATED: this.props.chartOptions
        let opt = this.parsedProps.options || this.parsedProps || this.props.chartOptions;
        predicate = predicate || pick;
        return predicate(opt, keys);
    }

    /**
     * Render function
     * svg element needs to have height and width.
     */
    public render() {
        let size = pick(this.props, SIZE);
        let style = ObjectAssign({}, size, this.props.containerStyle);
        return (
            <div className="nv-chart" style={style}>
                <svg ref={n => this.svg = n}></svg>
            </div>
        );
    }
}

export default NVD3Chart;
