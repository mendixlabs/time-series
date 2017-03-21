import { ShallowWrapper, shallow } from "enzyme";
import { DOM, createElement } from "react";
import { time } from "d3";

import { NVD3LineChart, Nvd3LineChartProps } from "../NVD3LineChart";

describe("NVD3LineChart", () => {

    let chartProps: Nvd3LineChartProps = {
            chartProps: {
                xAxis: {
                    axisLabel: "Time",
                    showMaxMin: true,
                    tickFormat: (v) => v
                },
                xScale: time.scale(),
                yAxis: {
                    axisLabel: "Label",
                    tickFormat: (v) => v
                }
            },
            datum: [ {
                area: true,
                color: "F00",
                key: "Series 1",
                values: [ { x: 1, y: 5 } ]
            } ],
            height: 20,
            width: 50
    };

    let renderChart: ShallowWrapper<any, any>;

    beforeEach(() => {
        renderChart = shallow(createElement(NVD3LineChart, chartProps));
    });

    it("should render a structure correctly", () => {
        expect(renderChart).toBeElement(
            DOM.div({ className: "nv-chart", style: { height: 20, width: 50 } },
                DOM.svg()
            )
        );
    });

    it("should render with the nv-chart class", () => {
        expect(renderChart.hasClass("nv-chart")).toBe(true);
    });

    it("should add a graph", (done) => {
        spyOn(nv, "addGraph").and.callThrough();
        spyOn(nv.models, "lineChart").and.callThrough();

        const chart = renderChart.instance() as NVD3LineChart;
        chart.componentDidMount();

        expect(nv.addGraph).toHaveBeenCalled();

        setTimeout(() => {
            expect(nv.models.lineChart).toHaveBeenCalled();

            done();
        }, 100);
    });

    it("should update the chart on window resize", (done) => {
        spyOn(nv.utils, "windowResize").and.callThrough();

        const chart = renderChart.instance() as NVD3LineChart;
        chart.componentDidMount();

        setTimeout(() => {
            expect(nv.utils.windowResize).toHaveBeenCalled();

            renderChart.unmount();
            done();
        }, 100);
    });

    it("should update the chart when the component is updated", (done) => {
        spyOn(nv.models, "lineChart").and.callThrough();

        expect(nv.models.lineChart).not.toHaveBeenCalled();
        const chart = renderChart.instance() as NVD3LineChart;
        chart.componentDidMount();

        setTimeout(() => {
            expect(nv.models.lineChart).toHaveBeenCalled();
            chart.componentDidUpdate();
            expect(nv.models.lineChart).toHaveBeenCalledTimes(1);

            done();
        }, 100);
    });

    describe("with no datum", () => {
        beforeEach(() => {
            chartProps = {
                chartProps: {
                    xAxis: {
                        axisLabel: "Time",
                        showMaxMin: true,
                        tickFormat: (v) => v
                    },
                    xScale: time.scale(),
                    yAxis: { axisLabel: "Label", tickFormat: (v) => v }
                },
                datum: undefined,
                height: 20,
                width: 50
            };
            renderChart = shallow(createElement(NVD3LineChart, chartProps));
        });

        it("renders a chart with no datum", (done) => {
            spyOn(nv.models, "lineChart").and.callThrough();

            const chart = renderChart.instance() as NVD3LineChart;
            chart.componentDidMount();

            setTimeout(() => {
                expect(nv.models.lineChart).toHaveBeenCalled();

                done();
            }, 100);
        });
    });
});
