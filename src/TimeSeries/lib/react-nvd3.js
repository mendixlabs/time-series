var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "TimeSeries/lib/d3", "TimeSeries/lib/react", "./Polyfills", "./utils", "TimeSeries/lib/nv.d3"], function (require, exports, d3, React, Polyfills_1, utils_1) {
    "use strict";
    var SETTINGS = ["x", "y", "type", "datum", "configure"];
    var SIZE = ["width", "height"];
    var MARGIN = "margin";
    var CONTAINER_STYLE = "containerStyle";
    var RENDER_START = "renderStart";
    var ELEMENT_CLICK = "elementClick";
    var RENDER_END = "renderEnd";
    var READY = "ready";
    var NVD3Chart = (function (_super) {
        __extends(NVD3Chart, _super);
        function NVD3Chart() {
            _super.apply(this, arguments);
        }
        NVD3Chart.prototype.componentDidMount = function () {
            var _this = this;
            nv.addGraph(this.renderChart.bind(this), function (chart) {
                if (utils_1.isCallable(_this.props.ready)) {
                    _this.props.ready(chart, READY);
                }
            });
        };
        NVD3Chart.prototype.componentDidUpdate = function () {
            this.renderChart();
        };
        NVD3Chart.prototype.componentWillUnmount = function () {
            if (this.resizeHandler) {
                this.resizeHandler.clear();
            }
        };
        NVD3Chart.prototype.renderChart = function () {
            var _this = this;
            var dispatcher;
            this.chart = (this.chart && !this.rendering) ? this.chart : nv.models.lineChart();
            if (utils_1.isCallable(this.props.renderStart)) {
                this.props.renderStart(this.chart, RENDER_START);
            }
            this.parsedProps = utils_1.bindFunctions(this.props, this.props.context);
            if (this.chart.x) {
                this.chart.x(utils_1.getValueFunction(this.parsedProps.x, "x"));
            }
            if (this.chart.y) {
                this.chart.y(utils_1.getValueFunction(this.parsedProps.y, "y"));
            }
            if (this.props.margin) {
                this.chart.margin(this.options([MARGIN], utils_1.pick).margin || utils_1.propsByPrefix("margin", this.props) || {});
            }
            this.configureComponents(this.chart, this.options(SETTINGS.concat(CONTAINER_STYLE), utils_1.without));
            if (this.props.configure) {
                this.props.configure(this.chart);
            }
            this.selection = d3.select(this.svg)
                .datum(this.props.datum)
                .call(this.chart);
            if (!this.resizeHandler) {
                this.resizeHandler = nv.utils.windowResize(function () {
                    _this.chart.update();
                });
            }
            dispatcher = this.chart.lines.dispatch;
            if (dispatcher[RENDER_END]) {
                dispatcher.on("renderEnd", this.renderEnd.bind(this));
            }
            if (dispatcher[ELEMENT_CLICK]) {
                dispatcher.on("elementClick", this.elementClick.bind(this));
            }
            this.rendering = true;
            return this.chart;
        };
        NVD3Chart.prototype.renderEnd = function (event) {
            if (utils_1.isCallable(this.props.renderEnd)) {
                this.props.renderEnd(this.chart, RENDER_END);
            }
            this.rendering = false;
        };
        NVD3Chart.prototype.elementClick = function (event) {
            if (utils_1.isCallable(this.props.elementClick)) {
                this.props.elementClick(event, "elementClick");
            }
        };
        NVD3Chart.prototype.configureComponents = function (chart, options) {
            for (var optionName in options) {
                if (options.hasOwnProperty(optionName)) {
                    var optionValue = options[optionName];
                    if (chart) {
                        if (utils_1.isPlainObject(optionValue)) {
                            this.configureComponents(chart[optionName], optionValue);
                        }
                        else if (typeof chart[optionName] === "function") {
                            chart[optionName](optionValue);
                        }
                    }
                }
            }
        };
        NVD3Chart.prototype.options = function (keys, predicate) {
            var opt = this.parsedProps.options || this.parsedProps || this.props.chartOptions;
            predicate = predicate || utils_1.pick;
            return predicate(opt, keys);
        };
        NVD3Chart.prototype.render = function () {
            var _this = this;
            var size = utils_1.pick(this.props, SIZE);
            var style = Polyfills_1.ObjectAssign({}, size, this.props.containerStyle);
            return (React.createElement("div", {className: "nv-chart", style: style}, 
                React.createElement("svg", {ref: function (n) { return _this.svg = n; }})
            ));
        };
        return NVD3Chart;
    }(React.Component));
    exports.NVD3Chart = NVD3Chart;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = NVD3Chart;
});
//# sourceMappingURL=react-nvd3.js.map