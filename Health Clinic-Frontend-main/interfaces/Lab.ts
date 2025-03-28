export interface ITestDetails {
      id: string;
      name: string;
}

export interface ITest {
      id: string;
      lab: string;
      preparations: string[];
      test: ITestDetails;
      cost: string;
    }
    