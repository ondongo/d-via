export type AnalysisGrade = "A" | "B" | "C" | "D";

export type AnalysisHistoryItem = {
  id: string;
  fileName: string;
  date: string;
  reliability: number;
  grade: AnalysisGrade;
};

export type EntitlementResponse =
  | {
      mode: "user";
      credits: number;
      history: AnalysisHistoryItem[];
    }
  | {
      mode: "guest";
      guestFreeAvailable: boolean;
      history: readonly [];
    };
