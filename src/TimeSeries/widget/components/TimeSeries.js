var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "TimeSeries/lib/react", "../../lib/react-nvd3", "TimeSeries/lib/d3"], function (require, exports, React, react_nvd3_1, d3) {
    "use strict";
    var TimeSeries = (function (_super) {
        __extends(TimeSeries, _super);
        function TimeSeries(props) {
            _super.call(this, props);
            logger.debug(this.props.widgetId + ".constructor");
            this.getDatum = this.getDatum.bind(this);
        }
        TimeSeries.prototype.componentWillMount = function () {
            logger.debug(this.props.widgetId + " .componentWillMount");
            this.checkConfig();
        };
        TimeSeries.prototype.checkConfig = function () {
        };
        TimeSeries.prototype.render = function () {
            logger.debug(this.props.widgetId + ".render");
            var chart = React.createElement("div", null, "Loading ...");
            var props = this.props;
            var datum = this.getDatum();
            var xFormat = props.xAxisFormat ? props.xAxisFormat : "%d-%b-%y";
            var yFormat = props.yAxisFormat ? props.yAxisFormat : "";
            if (props.dataLoaded) {
                logger.debug(props.widgetId + ".render dataLoaded");
                chart = React.createElement(react_nvd3_1.default, {
                    datum: datum,
                    duration: 1,
                    height: this.props.heightUnits === "auto" ? undefined : this.props.height,
                    showLegend: props.showLegend,
                    showXAxis: props.showXAxis,
                    showYAxis: props.showYAxis,
                    type: "lineChart",
                    useInteractiveGuideline: props.useInteractiveGuidelines,
                    width: this.props.widthUnits === "auto" ? undefined : this.props.width,
                    x: "xPoint",
                    xAxis: {
                        axisLabel: this.props.xAxisLabel,
                        showMaxMin: true,
                        tickFormat: function (dataPoint) {
                            return d3.time.format(xFormat)(new Date(dataPoint));
                        },
                    },
                    xScale: d3.time.scale(),
                    y: "yPoint",
                    yAxis: {
                        axisLabel: this.props.yAxisLabel,
                        tickFormat: function (dataPoint) {
                            if (yFormat) {
                                return d3.format(yFormat)(dataPoint);
                            }
                            else {
                                return dataPoint;
                            }
                        },
                    }
                });
            }
            return (React.createElement("div", null, chart));
        };
        TimeSeries.prototype.getDatum = function () {
            return this.props.seriesConfig.map(function (serieConfig) { return ({
                area: serieConfig.isArea,
                color: serieConfig.serieColor ? serieConfig.serieColor : undefined,
                key: serieConfig.serieKey,
                values: serieConfig.serieData,
            }); });
        };
        TimeSeries.defaultProps = {
            widgetId: "",
        };
        return TimeSeries;
    }(React.Component));
    exports.TimeSeries = TimeSeries;
});
//# sourceMappingURL=TimeSeries.js.map