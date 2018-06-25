import * as fluture from 'fluture';

declare module 'apply-spec-f' {
  interface ApplySpecF {
    applySpecF(o: any): (d: any) => fluture.Fluture;
    applySpecF(o: any, d: any): fluture.Fluture;

    applySpecFLimit(n: number): (o: any, d: any) =>  fluture.Future;
    applySpecFLimit(n: number, o: any): (d: any) =>  fluture.Future;
    applySpecFLimit(n: number, o: any, d: any): fluture.Future;
  }

  declare let ApplySpec: ApplySpecF;

  export = ApplySpec;
  export default ApplySpec.applySpecF;
}
