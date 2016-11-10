import { mount, shallow } from "enzyme";
import { DOM, createElement } from "react";

import { NVD3LineChart, Nvd3LineChartProps } from "../NVD3LineChart";

describe("NVD3LineChart", () => {

    const renderChart = (props?: Nvd3LineChartProps) => shallow(createElement(NVD3LineChart, props));
    const renderFull = (props?: Nvd3LineChartProps) => mount(createElement(NVD3LineChart, props));

    const chartProps = {
        chartProps: {},
        datum: [ {
            area: true,
            color: "F00",
            key: "Series 1",
            values: [ { x: 1, y: 5 } ]
        } ],
        height: 20,
        width: 50
    };

    it("should add a graph", () => {
        spyOn(nv, "addGraph");

        const chart = renderChart(chartProps).instance() as NVD3LineChart;
        chart.componentDidMount();

        expect(nv.addGraph).toHaveBeenCalled();
    });

    describe("default chart properties", () => {
        let chart2: nv.LineChart;
        beforeAll((done) => {
            spyOn(nv.models, "lineChart").and.callFake(() => chart2 = nv.models.lineChart());
            renderFull(chartProps);
            done();
        });

        it("should have an interactive guideline", () => {
            setTimeout(() => {
                expect(chart2.useInteractiveGuideline()).toBe(true);
            }, 100);
        });

        it("should have a legend", () => {
            setTimeout(() => {
                expect(chart2.showLegend()).toBe(true);
            }, 100);
        });

        it("should show the x-axis", () => {
            setTimeout(() => {
                expect(chart2.showXAxis()).toBe(true);
            }, 100);
        });

        it("should show the y-axis", () => {
            setTimeout(() => {
                expect(chart2.showYAxis()).toBe(true);
            }, 100);
        });

        it("should have an animation duration", () => {
            setTimeout(() => {
                expect(chart2.showLegend()).toBe(350);
            }, 100);
        });

    });

    it("should render a structure correctly", () => {
        const chart = renderChart(chartProps);

        expect(chart).toBeElement(
            DOM.div({ className: "nv-chart", style: { height: 20, width: 50 } },
                DOM.svg()
            )
        );
    });

    it("should render a div with a style height", () => {
        const output = renderChart(chartProps);

        expect(output.first().prop("style").height).toBe(20);
    });

    it("should render a div with a style width", () => {
        const output = renderChart(chartProps);

        expect(output.first().prop("style").width).toBe(50);
    });

    xdescribe("", () => {
        it("should add resize listener", () => {
            //
        });

        it("should update chart on resize", () => {
            // spy on the update function if its been called.
        });

        it("should remove resize listener", () => {
            // mock the nv.util.windowsresize function with {clear: function}
            // execute unmount and confirm if clear has been fired.
        });
    });

});
