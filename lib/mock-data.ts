import { PermitApplication } from "./types";

export const MOCK_APPLICATIONS: PermitApplication[] = [
  {
    surveyNo: "SY-0421/2026",
    applicant: "K. Ravindra Rao",
    ward: "Ward 14 — Kukatpally",
    submittedOn: "2026-09-18",
    status: "VIOLATION",
    statusReason: "HYDRAA Lake Buffer Violation",
    ocr: [
      { label: "Survey Number", value: "0421/2026", confidence: 0.98 },
      { label: "Plot Area", value: "412.6 sq.m", confidence: 0.95 },
      { label: "Proposed Use", value: "Residential — G+3", confidence: 0.91 },
      { label: "Distance to Nearest FTL", value: "18.2 m", confidence: 0.88 },
      { label: "Owner Name (OCR)", value: "K RAVINDRA RAO", confidence: 0.99 },
    ],
    citations: [
      {
        clause: "HYDRAA Buffer Order, Cl. 4(a)",
        authority: "Hyderabad Disaster Response Agency",
        excerpt:
          "No construction is permitted within 30 metres of the Full Tank Level (FTL) of a notified lake or water body.",
        relevance: "flags",
      },
      {
        clause: "GHMC Building Bye-law 2012, Reg. 19",
        authority: "GHMC",
        excerpt:
          "Setback requirements for plots adjoining natural drainage channels must be certified prior to sanction.",
        relevance: "flags",
      },
    ],
  },
  {
    surveyNo: "SY-0388/2026",
    applicant: "S. Lakshmi Priya",
    ward: "Ward 07 — Begumpet",
    submittedOn: "2026-09-16",
    status: "ANOMALY",
    statusReason: "Statistical Anomaly in Plot Area",
    ocr: [
      { label: "Survey Number", value: "0388/2026", confidence: 0.97 },
      { label: "Plot Area", value: "1,204.0 sq.m", confidence: 0.62 },
      { label: "Proposed Use", value: "Commercial — G+5", confidence: 0.9 },
      { label: "FAR Declared", value: "3.4", confidence: 0.7 },
      { label: "Owner Name (OCR)", value: "S LAKSHMI PRIYA", confidence: 0.96 },
    ],
    citations: [
      {
        clause: "Model Comparison, Registered Deed 2019",
        authority: "BSYNC Anomaly Model v2",
        excerpt:
          "Declared plot area deviates 3.1 standard deviations from the registered deed on file for this survey number.",
        relevance: "flags",
      },
    ],
  },
  {
    surveyNo: "SY-0402/2026",
    applicant: "M. Farhan Ahmed",
    ward: "Ward 22 — Malakpet",
    submittedOn: "2026-09-19",
    status: "APPROVED",
    statusReason: "All Checks Cleared",
    ocr: [
      { label: "Survey Number", value: "0402/2026", confidence: 0.99 },
      { label: "Plot Area", value: "268.4 sq.m", confidence: 0.97 },
      { label: "Proposed Use", value: "Residential — G+2", confidence: 0.96 },
      { label: "Distance to Nearest FTL", value: "412 m", confidence: 0.94 },
      { label: "Owner Name (OCR)", value: "M FARHAN AHMED", confidence: 0.98 },
    ],
    citations: [
      {
        clause: "GHMC Building Bye-law 2012, Reg. 8",
        authority: "GHMC",
        excerpt:
          "Plot dimensions and FAR fall within permissible limits for the declared residential use.",
        relevance: "supports",
      },
    ],
  },
  {
    surveyNo: "SY-0355/2026",
    applicant: "A. Venkatesh Naidu",
    ward: "Ward 31 — Uppal",
    submittedOn: "2026-09-14",
    status: "APPROVED",
    statusReason: "All Checks Cleared",
    ocr: [
      { label: "Survey Number", value: "0355/2026", confidence: 0.98 },
      { label: "Plot Area", value: "334.9 sq.m", confidence: 0.96 },
      { label: "Proposed Use", value: "Residential — G+1", confidence: 0.95 },
      { label: "Distance to Nearest FTL", value: "780 m", confidence: 0.93 },
      { label: "Owner Name (OCR)", value: "A VENKATESH NAIDU", confidence: 0.97 },
    ],
    citations: [
      {
        clause: "GHMC Building Bye-law 2012, Reg. 8",
        authority: "GHMC",
        excerpt:
          "Setbacks and FAR verified against ward-level master plan without deviation.",
        relevance: "supports",
      },
    ],
  },
  {
    surveyNo: "SY-0447/2026",
    applicant: "P. Divya Sree",
    ward: "Ward 14 — Kukatpally",
    submittedOn: "2026-09-20",
    status: "VIOLATION",
    statusReason: "HYDRAA Lake Buffer Violation",
    ocr: [
      { label: "Survey Number", value: "0447/2026", confidence: 0.96 },
      { label: "Plot Area", value: "601.2 sq.m", confidence: 0.94 },
      { label: "Proposed Use", value: "Residential — G+4", confidence: 0.9 },
      { label: "Distance to Nearest FTL", value: "9.7 m", confidence: 0.92 },
      { label: "Owner Name (OCR)", value: "P DIVYA SREE", confidence: 0.98 },
    ],
    citations: [
      {
        clause: "HYDRAA Buffer Order, Cl. 4(a)",
        authority: "Hyderabad Disaster Response Agency",
        excerpt:
          "No construction is permitted within 30 metres of the Full Tank Level (FTL) of a notified lake or water body.",
        relevance: "flags",
      },
    ],
  },
];
