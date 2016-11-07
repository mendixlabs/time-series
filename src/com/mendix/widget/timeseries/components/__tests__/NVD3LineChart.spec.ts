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

    it("should add a line graph", () => {
        spyOn(nv.models, "lineChart");

        renderFull(chartProps);
        setTimeout((done) => {
            expect(nv.models.lineChart).toHaveBeenCalled();
            done();
        }, 0);
    });


    it("should add a chart with smart default properties", () => {
        let chart: nv.LineChart;
        spyOn(nv.models, "lineChart").and.callFake(() => chart = nv.models.lineChart());

        renderFull(chartProps);
        setTimeout((done) => {
            expect(chart.useInteractiveGuideline()).toBe(true);
            expect(chart.showLegend).toBe(true);
            expect(chart.showXAxis).toBe(true);
            expect(chart.showYAxis).toBe(true);
            expect(chart.duration).toEqual(350);

            done();
        }, 0);
    });

    it("should render expected structure", () => {
        const chart = renderChart(chartProps);
        expect(chart).toMatchStructure(
            DOM.div({ className: "nv-chart" },
                DOM.svg()
            )
        );
    });

    it("should render div with style height", () => {
        const output = renderChart(chartProps);

        expect(output.first().prop("style").height).toBe(20);
    });

    it("should render div with style width", () => {
        const output = renderChart(chartProps);

        expect(output.first().prop("style").width).toBe(50);
    });

    describe("without datum values", () => {
        it("should render chart with no data", () => {
            const noDatum = {
                chartProps: {},
                datum: [ {} ],
                height: 50,
                width: 20
            };
            const chart = renderChart(noDatum);
            expect(chart).toMatchStructure(
                DOM.div({ className: "nv-chart" },
                    DOM.svg()
                )
            );
        });
    });

//     describe("", () => {
//         it("should add resize listener", () => {
//             //
//         });

//         it("should update chart on resize", () => {
//             // spy on the update function if its been called.
//         });

//         it("should remove resize listener", () => {
//             // mock the nv.util.windowsresize function with {clear: function}
//             // execute unmount and confirm if clear has been fired.
//         });
//     });

});
