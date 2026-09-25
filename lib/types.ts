export type PermitStatus = "APPROVED" | "ANOMALY" | "VIOLATION";

export interface OcrField {
  label: string;
  value: string;
  confidence: number; // 0-1
}

export interface LegalCitation {
  clause: string;
  authority: string;
  excerpt: string;
  relevance: "supports" | "flags";
}

export interface PermitApplication {
  surveyNo: string;
  applicant: string;
  ward: string;
  submittedOn: string;
  status: PermitStatus;
  statusReason: string;
  ocr: OcrField[];
  citations: LegalCitation[];
}
