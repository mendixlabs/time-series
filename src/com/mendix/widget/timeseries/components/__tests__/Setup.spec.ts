describe("NVD3LineChart", () => {
    it("should render structure", () => {
        //
    });

    it("renders with classes", () => {
        //
    });

    describe("without datum values", () => {
        xit("should render chart with no data", () => {
            // same behavior incase of empty value.
            // TODO set logical defaults eg: empty array
            // datum values is undefined.
        });
    });

    describe("with datum values", () => {
        // setup beforeTest
        it("should render chart", () => {
        // test using renderChart function
        });

        it("should set chart properties", () => {
            // test using configureComponents function
            // test using isPlainObject
        });
    });

    describe("", () => {
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

    describe("Util function isPlainObject", () => {
         /** initial setup */

        it("should confirm a literal object is a plain object", () => {
            // TODO
        });

        it("should deny a function is a plain object", () => {
            // TODO
        });

        it("should deny that an instantiated object is a plain object", () => {
            // TODO
        });
    });

    describe("Util function configureComponents", () => {
        it("should set an attribute", () => {
            // TODO
        });

        it("should set an attribute on a child object", () => {
            // TODO
        });

        it("should not change an empty object", () => {
            // TODO
        });

    });

     // TODO: setup initial default props.

});

describe("TimeSeries", () => {
    /** initial setup */
    it("should render an NVD3LineChart", () => {
        // check that the type is NVD3LineChart, and the correct props are passed in.
    });

    it("should combine data and seriesConfig into datum", () => {
        // TODO: testing getDatum function
    });

    it("should use default axis formatting when not specified", () => {
        //
    });
});
