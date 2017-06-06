// import { shallow } from "enzyme";
// import { DOM, createElement } from "react";

// import { CustomWrapper } from "../CustomWrapper";

// describe("CustomWrapper", () => {
//     it("renders the structure", () => {
//         const style = "padding-top:100px; margin-top: 200px;";
//         const className = "mendix_class1";
//         const alert = shallow(createElement(CustomWrapper, { style, class: className }));

//         expect(alert).toBeElement(
//             DOM.div({ className: "mendix_class1", style: { width: "100%", paddingTop: "100px", marginTop: "200px" } })
//         );
//     });

//     it("renders with parent width when width style is not specified", () => {
//         const alert = shallow(createElement(CustomWrapper));

//         expect(alert).toBeElement(DOM.div({ style: { width: "100%" } }));
//     });
// });
