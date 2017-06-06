// import { shallow } from "enzyme";  // enzyme's api doesn't provide innerHTML for svg. use "React.addons.TestUtils"
// import { DOM, createElement } from "react";

// import { DataStore, SeriesConfig } from "../../TimeSeries";
// import { TimeSeries, TimeSeriesProps } from "../TimeSeries";

// import { NVD3LineChart } from "../NVD3LineChart";

// describe("TimeSeries", () => {

//     const getDate = (date: string) => new Date(date).getDate();
//     const seriesConfig = [ { color: "blue", fill: true, name: "data1" } ] as SeriesConfig[];
//     const dataStore: DataStore = {
//         series: {
//             data1: [
//                 { x: getDate("24-Apr-2007"), y: 93.24 },
//                 { x: getDate("2-Jan-2008"), y: 194.84 },
//                 { x: getDate("1-Jan-2009"), y: 85.35 },
//                 { x: getDate("1-Jan-2010"), y: 210.73 }
//             ]
//         }
//     };

//     const createProps: TimeSeriesProps = {
//         dataStore,
//         height: 500,
//         heightUnit: "pixels",
//         seriesConfig,
//         width: 900,
//         widthUnit: "pixels",
//         xAxisFormat: "yyyy",
//         xAxisLabel: "",
//         yAxisFormatDecimalPrecision: 2,
//         yAxisLabel: "y-axis"
//     };

//     const chart = shallow(createElement(TimeSeries, createProps));

//     it("should render NVD3LineChart component", () => {
//         expect(chart.find(NVD3LineChart).length).toEqual(1) ;
//     });

//     it("should render NVD3LineChart component with correct props", () => {
//         const componentProps = chart.find(NVD3LineChart).props();
//         expect(componentProps.height).toBe(500);
//         expect(componentProps.width).toBe(900);
//         expect(componentProps.datum[0].area).toEqual(true);
//         expect(componentProps.datum[0].color).toBe("blue");
//         expect(componentProps.datum[0].key).toBe("data1");
//     });

//     it("should render chart component without data", () => {
//         const nonDataProps: TimeSeriesProps = {
//             dataStore : { series: {} },
//             height: 500,
//             heightUnit: "pixels",
//             seriesConfig,
//             width: 900,
//             widthUnit: "pixels",
//             xAxisFormat: "yyyy",
//             xAxisLabel: "",
//             yAxisFormatDecimalPrecision: 2,
//             yAxisLabel: "y-axis"
//         };
//         const emptyChart = shallow(createElement(TimeSeries, nonDataProps));
//         expect(emptyChart).toBeElement(DOM.div({ className: "widget-time-series nvd3 nv-noData" }, "No Data"));
//     });

//     describe("with multi-series", () => {
//         const data: DataStore = { series: {
//             data1: [
//                     { x: getDate("24-Apr-2007"), y: 93.24 },
//                     { x: getDate("2-Jan-2008"), y: 194.84 },
//                     { x: getDate("1-Jan-2009"), y: 85.35 },
//                     { x: getDate("1-Jan-2010"), y: 210.73 }
//                 ],
//             data2: [
//                     { x: getDate("23-Apr-2007"), y: 103.24 },
//                     { x: getDate("2-Jan-2008"), y: 204.84 },
//                     { x: getDate("2-Jan-2009"), y: 95.35 },
//                     { x: getDate("2-Jan-2010"), y: 220.73 }
//                 ]
//         }};

//         const config = [
//             { color: "blue", fill: true, name: "data1" },
//             { color: "red", fill: true, name: "data2" }
//         ] as SeriesConfig[];

//         it("should render correctly", () => {
//             const chartProps: TimeSeriesProps = {
//                 dataStore: data,
//                 height: 75,
//                 heightUnit: "percentageOfWidth",
//                 seriesConfig: config,
//                 width: 100,
//                 widthUnit: "percentage",
//                 yAxisDomainMaximum: "1000",
//                 yAxisDomainMinimum: "0"
//             };

//             const lineChartProps = shallow(createElement(TimeSeries, chartProps)).find(NVD3LineChart).props();

//             expect(lineChartProps.datum.length).toBe(2);

//         });
//     });
// });
