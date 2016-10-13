var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "TimeSeries/lib/react", "../../lib/react-nvd3", "TimeSeries/lib/d3"], function (require, exports, React, react_nvd3_1, d3) {
    "use strict";
    var Wrapper = (function (_super) {
        __extends(Wrapper, _super);
        function Wrapper(props) {
            _super.call(this, props);
            logger.debug(this.props.widgetId + ".constructor");
            this.getDatum = this.getDatum.bind(this);
        }
        Wrapper.prototype.componentWillMount = function () {
            logger.debug(this.props.widgetId + " .componentWillMount");
            this.checkConfig();
        };
        Wrapper.prototype.checkConfig = function () {
        };
        Wrapper.prototype.render = function () {
            logger.debug(this.props.widgetId + ".render");
            var chart = React.createElement("div", null, "Loading ...");
            var props = this.props;
            var datum = this.getDatum();
            var xFormat = props.xAxisFormat ? props.xAxisFormat : "%d-%b-%y";
            var yFormat = props.yAxisFormat ? props.yAxisFormat : "";
            var xEncoding = d3.time.scale().range([0, this.props.width]);
            var yEncoding = d3.scale.linear().range([this.props.height, 0]);
            if (props.dataLoaded) {
                logger.debug(props.widgetId + ".render dataLoaded");
                chart = React.createElement(react_nvd3_1.default, {
                    datum: datum,
                    duration: 1,
                    height: this.props.height,
                    showLegend: props.showLegend,
                    showXAxis: props.showXAxis,
                    showYAxis: props.showYAxis,
                    type: "lineChart",
                    useInteractiveGuideline: props.useInteractiveGuidelines,
                    width: this.props.width,
                    x: "xPoint",
                    xAxis: {
                        axisLabel: this.props.xAxisLabel,
                        scale: xEncoding,
                        showMaxMin: true,
                        tickFormat: function (dataPoint) {
                            return d3.time.format(xFormat)(new Date(dataPoint));
                        },
                    },
                    xDomain: d3.extent(datum[0].values, function (d) {
                        return d.xPoint;
                    }),
                    xScale: d3.time.scale(),
                    y: "yPoint",
                    yAxis: {
                        axisLabel: this.props.yAxisLabel,
                        scale: yEncoding,
                        tickFormat: function (dataPoint) {
                            if (yFormat) {
                                return d3.format(yFormat)(dataPoint);
                            }
                            else {
                                return dataPoint;
                            }
                        },
                    },
                    yDomain: [0, d3.max(datum[0].values, function (d) {
                            return d.yPoint;
                        })],
                });
            }
            return (React.createElement("div", null, chart));
        };
        Wrapper.prototype.getDatum = function () {
            logger.debug(this.props.widgetId + ".getDatum");
            var seriesConfig = this.props.seriesConfig;
            var returnDatum = [];
            for (var count = 0; count < seriesConfig.length; count++) {
                var serieConfig = seriesConfig[count];
                var serie = {
                    key: serieConfig.serieKey,
                    values: serieConfig.serieData,
                };
                if (serieConfig.serieColor) {
                    serie.color = serieConfig.serieColor;
                }
                if (serieConfig.area) {
                    serie.area = serieConfig.area;
                }
                returnDatum.push(serie);
            }
            logger.debug(this.props.widgetId + ".getDatum Data: ");
            logger.debug(returnDatum);
            return returnDatum;
        };
        Wrapper.defaultProps = {
            widgetId: "",
        };
        return Wrapper;
    }(React.Component));
    exports.Wrapper = Wrapper;
});
//# sourceMappingURL=TimeSeries.js.map