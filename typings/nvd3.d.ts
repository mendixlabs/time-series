import { Utils } from "nvd3";

// tslint:disable no-namespace
declare module "nvd3" {
    interface Nvd3ResizeHandler {
        callback: () => void;
        clear: () => void;
    }

    interface Utils {
        windowResize(listener: (ev: Event) => any): Nvd3ResizeHandler;
    }
}
