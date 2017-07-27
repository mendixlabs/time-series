declare namespace jasmine {
    interface Any {
        asymmetricMatch(other: any): boolean;
    }

    interface MatchersUtil {}
    export const matchersUtil: MatchersUtil;
}

declare module "*.css";
