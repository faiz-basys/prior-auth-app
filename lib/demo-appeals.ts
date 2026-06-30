import type {
    AppealCycle,
    AppealCycleAiSummary,
    WorkflowEvent,
    WorkflowEventType,
} from "@/lib/appeal-workflow";
import type { AppealLetter } from "@/lib/appeal-letters";
import type { AppealRequest, DecisionTree, EvidenceDoc } from "@/lib/data";
import { demoCriteriaByAppealId } from "@/lib/demo-appeal-criteria";

const demoPatient = {
    name: "Jordan Rivera",
    dob: "03/14/1985",
    age: 39,
    sex: "M",
    email: "jordan.rivera@email.com",
    address: "1200  Lane, Austin, TX",
};

const demoProvider = {
    name: "Dr. Sam Chen, MD",
    email: "s.chen@demohealth.com",
    address: "500 Clinical Blvd, Austin, TX",
    npi: "1234567890",
};

const demoReviewer = {
    name: "Taylor Brooks",
    org: " Review Organization",
    email: "t.brooks@demoreview.com",
};

const sharedPolicy = {
    policyCodes: ["DEMO-001"],
    policyFile: "DEMO-2024_Timeline_Examples.pdf",
    policyRef: "Policy #DEMO-2024",
    policyGuideline:
        "Demonstration policy for simplified appeal timeline examples.",
    policyVersion: "v1.0 Last Update: Jan 15, 2024",
};

const defaultChecks = [
    {
        label: "Medical Necessity",
        sublabel: "Under review",
        passed: null as boolean | null,
    },
    { label: "Plan Eligibility", sublabel: "Verified", passed: true },
    { label: "Provider Network", sublabel: "In-Network", passed: true },
];

const defaultCriteria: DecisionTree = {
    inclusion: [
        {
            id: "A.1",
            label: "Clinical indication documented",
            description: "Appeal includes diagnosis and requested service.",
            state: "met",
            evidence: "Referral and chart notes on file.",
        },
    ],
    exclusion: [],
};

const defaultEvidence: EvidenceDoc[] = [
    {
        name: "Appeal_Submission.pdf",
        added: "Jan 10",
        size: "0.8 MB",
        type: "pdf",
        change: "new",
    },
];

function raisedEvent(
    id: string,
    description: string,
    timestamp: string,
): WorkflowEvent {
    return {
        id,
        cycleNumber: 1,
        type: "appeal_raised",
        title: "Appeal Raised",
        description,
        timestamp,
    };
}

function outcomeEvent(
    id: string,
    type: Extract<
        WorkflowEventType,
        "approved" | "denied" | "missing_info" | "partially_approved"
    >,
    description: string,
    timestamp: string,
): WorkflowEvent {
    const meta: Record<
        typeof type,
        { title: string; outcome: WorkflowEvent["outcome"] }
    > = {
        approved: { title: "Appeal Approved", outcome: "approve" },
        denied: { title: "Appeal Denied", outcome: "deny" },
        missing_info: {
            title: "Missing Information Requested",
            outcome: "missing_info",
        },
        partially_approved: {
            title: "Appeal Partially Approved",
            outcome: "partial_approve",
        },
    };
    return {
        id,
        cycleNumber: 1,
        type,
        title: meta[type].title,
        description,
        timestamp,
        outcome: meta[type].outcome,
    };
}

function createSeed(
    appealId: string,
    config: {
        raisedAt: string;
        raisedDescription: string;
        raisedTimestamp: string;
        label: string;
        aiSummary: AppealCycleAiSummary;
        criteria: DecisionTree;
        determinationIssue?: { requirement: string; detail: string };
        evidence?: EvidenceDoc[];
        outcome?: {
            type: Extract<
                WorkflowEventType,
                "approved" | "denied" | "missing_info" | "partially_approved"
            >;
            description: string;
            timestamp: string;
            letter: AppealLetter;
        };
    },
): { cycles: AppealCycle[]; events: WorkflowEvent[] } {
    const events: WorkflowEvent[] = [
        raisedEvent(
            `evt-${appealId}-raised`,
            config.raisedDescription,
            config.raisedTimestamp,
        ),
    ];

    if (config.outcome) {
        events.push(
            outcomeEvent(
                `evt-${appealId}-outcome`,
                config.outcome.type,
                config.outcome.description,
                config.outcome.timestamp,
            ),
        );
    }

    const cycle: AppealCycle = {
        id: `${appealId}-cycle-1`,
        cycleNumber: 1,
        raisedAt: config.raisedAt,
        label: config.label,
        status: "active",
        evidence: config.evidence ?? defaultEvidence,
        criteria: config.criteria,
        aiSummary: config.aiSummary,
        determinationIssue: config.determinationIssue,
        letter: config.outcome?.letter,
    };

    return { cycles: [cycle], events };
}

function demoAppeal(
    config: Partial<
        Omit<
            AppealRequest,
            | "cycles"
            | "events"
            | "patient"
            | "provider"
            | "reviewer"
            | "requestingMd"
        >
    > &
        Pick<
            AppealRequest,
            | "id"
            | "caseId"
            | "procedure"
            | "procedureCode"
            | "policyName"
            | "payerName"
            | "status"
            | "lastUpdated"
            | "submitted"
            | "confidence"
            | "recommendationVerdict"
            | "recommendation"
        >,
): Omit<AppealRequest, "cycles" | "events"> {
    return {
        ...config,
        patient: demoPatient,
        provider: demoProvider,
        reviewer: demoReviewer,
        requestingMd: demoProvider.name,
        checks: config.checks ?? defaultChecks,
        rationale: config.rationale ?? [
            {
                title: " case",
                detail: "Simplified timeline example for demonstration purposes.",
            },
        ],
        evidence: config.evidence ?? defaultEvidence,
        criteria:
            config.criteria ??
            demoCriteriaByAppealId[config.id]?.inclusion ??
            defaultCriteria.inclusion,
        determinationIssue:
            config.determinationIssue ??
            demoCriteriaByAppealId[config.id]?.determinationIssue,
        ...sharedPolicy,
        policyName: config.policyName,
    };
}

export const demoAppealsData: Omit<AppealRequest, "cycles" | "events">[] = [
    demoAppeal({
        id: "ag-demo-001",
        caseId: "AG-DEMO-001",
        procedure: "Lumbar Spinal Fusion",
        procedureCode: "CPT 22612",
        policyName: "DEMO — Raised Only (In Review)",
        payerName: " Health Plan",
        status: "In Review",
        lastUpdated: "Jan 10, 2024 · 09:12 AM",
        submitted: "Jan 10, 2024 · 09:12 AM",
        confidence: 72,
        recommendationVerdict: "NOT APPROVE",
        recommendation:
            "Do not approve lumbar spinal fusion. Criterion A.3 (conservative management) is not met with only six weeks of documented PT.",
        checks: [
            {
                label: "Medical Necessity",
                sublabel: "Under review",
                passed: null,
            },
            { label: "Plan Eligibility", sublabel: "Verified", passed: true },
            { label: "Provider Network", sublabel: "In-Network", passed: true },
        ],
    }),
    demoAppeal({
        id: "ag-demo-002",
        caseId: "AG-DEMO-002",
        procedure: "Dupixent (Dupilumab)",
        procedureCode: "J-Code J3590",
        drug: "Dupixent",
        policyName: "DEMO — Approved",
        payerName: " BlueCross",
        status: "Approved",
        lastUpdated: "Jan 12, 2024 · 02:45 PM",
        submitted: "Jan 10, 2024 · 08:30 AM",
        denialDate: "Dec 28",
        originalReviewDate: "Dec 28, 2023",
        appealOutcomeLabel: "Appeal · Overturned",
        confidence: 91,
        recommendationVerdict: "APPROVE",
        recommendation:
            "Approve Dupilumab. All ten inclusion criteria met (EASI 22, BSA 18%, failed topical therapy); no exclusions apply.",
        checks: [
            { label: "Medical Necessity", sublabel: "Passed", passed: true },
            { label: "Plan Eligibility", sublabel: "Verified", passed: true },
            { label: "Provider Network", sublabel: "In-Network", passed: true },
        ],
    }),
    demoAppeal({
        id: "ag-demo-003",
        caseId: "AG-DEMO-003",
        procedure: "Spinal Cord Stimulator Trial",
        procedureCode: "CPT 63650",
        policyName: "DEMO — Denied",
        payerName: " United",
        status: "Denied",
        lastUpdated: "Jan 14, 2024 · 04:10 PM",
        submitted: "Jan 10, 2024 · 01:15 PM",
        denialDate: "Jan 14",
        originalReviewDate: "Jan 14, 2024",
        appealOutcomeLabel: "Appeal · Upheld",
        confidence: 88,
        recommendationVerdict: "NOT APPROVE",
        recommendation:
            "Deny SCS trial. Criterion A.4 (failed conservative management) not met — only four weeks documented.",
        checks: [
            { label: "Medical Necessity", sublabel: "Failed", passed: false },
            { label: "Plan Eligibility", sublabel: "Verified", passed: true },
            { label: "Provider Network", sublabel: "In-Network", passed: true },
        ],
    }),
    demoAppeal({
        id: "ag-demo-004",
        caseId: "AG-DEMO-004",
        procedure: "Knee MRI",
        procedureCode: "CPT 73721",
        policyName: "DEMO — Missing Info",
        payerName: " Aetna",
        status: "Missing Info",
        lastUpdated: "Jan 13, 2024 · 11:20 AM",
        submitted: "Jan 10, 2024 · 10:00 AM",
        confidence: 65,
        recommendationVerdict: "PENDING",
        recommendation:
            "Cannot finalize. Criteria A.3 (weight-bearing X-ray) and A.5 (conservative therapy duration) not found in appeal file.",
        checks: [
            {
                label: "Medical Necessity",
                sublabel: "Incomplete",
                passed: null,
            },
            { label: "Plan Eligibility", sublabel: "Verified", passed: true },
            { label: "Provider Network", sublabel: "In-Network", passed: true },
        ],
    }),
    demoAppeal({
        id: "ag-demo-005",
        caseId: "AG-DEMO-005",
        procedure: "Rituximab Infusion",
        procedureCode: "J-Code J9312",
        drug: "Rituximab",
        policyName: "DEMO — Partially Approved",
        payerName: " Cigna",
        status: "Approved",
        lastUpdated: "Jan 15, 2024 · 03:00 PM",
        submitted: "Jan 10, 2024 · 07:45 AM",
        denialDate: "Dec 20",
        originalReviewDate: "Dec 20, 2023",
        appealOutcomeLabel: "Appeal · Partial Overturn",
        confidence: 78,
        recommendationVerdict: "APPROVE",
        recommendation:
            "Partially approve Rituximab — induction (A.6) supported; maintenance beyond cycle 4 (A.9) not documented.",
        checks: [
            { label: "Medical Necessity", sublabel: "Partial", passed: true },
            { label: "Plan Eligibility", sublabel: "Verified", passed: true },
            { label: "Provider Network", sublabel: "In-Network", passed: true },
        ],
    }),
    demoAppeal({
        id: "ag-demo-006",
        caseId: "AG-DEMO-006",
        procedure: "Mavacamten (Camzyos)",
        procedureCode: "J-Code J2840",
        drug: "Mavacamten",
        policyName: "DEMO — Raised Only (In Review)",
        payerName: "Demo Humana",
        status: "In Review",
        lastUpdated: "Jan 11, 2024 · 10:30 AM",
        submitted: "Jan 10, 2024 · 08:00 AM",
        confidence: 68,
        recommendationVerdict: "NOT APPROVE",
        recommendation:
            "Do not approve mavacamten. Criteria A.4-A.6 (LVOT gradient, recent echo, LVEF) not found in submitted records.",
        checks: [
            {
                label: "Medical Necessity",
                sublabel: "Under review",
                passed: null,
            },
            { label: "Plan Eligibility", sublabel: "Verified", passed: true },
            { label: "Provider Network", sublabel: "In-Network", passed: true },
        ],
    }),
];

const lumbarFusionEvidence: EvidenceDoc[] = [
    {
        name: "MRI_Lumbar_Spine_0108.png",
        added: "Jan 10",
        size: "11.2 MB",
        type: "image",
        change: "new",
    },
    {
        name: "PT_Records_Jan2024.pdf",
        added: "Jan 10",
        size: "2.4 MB",
        type: "pdf",
        change: "insufficient",
        changeNote: "Only 6 weeks of PT documented.",
    },
    {
        name: "Ortho_Consult_0108.pdf",
        added: "Jan 10",
        size: "1.1 MB",
        type: "pdf",
        change: "new",
    },
    {
        name: "Clinical_Notes_PCP.pdf",
        added: "Jan 10",
        size: "0.9 MB",
        type: "pdf",
        change: "new",
    },
];

const inReviewAiSummary: AppealCycleAiSummary = {
    recommendation:
        "Do not approve lumbar spinal fusion at this time. Diagnosis and imaging criteria are satisfied, but failure of conservative management (A.3) is not met with only six weeks of documented physical therapy.",
    recommendationVerdict: "NOT APPROVED",
    confidence: 72,
    rationale:
        "Basys evaluated the Level 1 lumbar fusion appeal against CMS-L33747-style inclusion and exclusion criteria. Inclusion criteria A.1 (grade II spondylolisthesis at L4-L5), A.2 (progressive instability), A.4 (recent MRI), A.5 (ODI 46), A.7–A.10 (BMI counseling, no prior fusion, qualified surgeon, and documented PA denial) are met based on MRI_Lumbar_Spine_0108.png and Ortho_Consult_0108.pdf. The critical pathway criterion A.3 (failure of conservative management) is not met: PT_Records_Jan2024.pdf confirms only six weeks of supervised therapy, falling short of the twelve-week policy minimum; sub-criterion A.3.c (ESI trial) is not found. A.6 (tobacco cessation) is not found — active smoking is noted without a documented quit plan. All ten exclusion criteria (E.1–E.10) screen negative — no active infection, isolated axial pain, untreated osteoporosis, or other contraindications were identified. Because medical necessity for elective fusion depends on documented failure of conservative care, Basys recommends withholding approval pending supplemental PT, ESI, and tobacco-cessation documentation.",
    checks: [
        { label: "Medical Necessity", sublabel: "Under review", passed: null },
        { label: "Plan Eligibility", sublabel: "Verified", passed: true },
        { label: "Provider Network", sublabel: "In-Network", passed: true },
    ],
};

export const demoWorkflowSeeds: Record<
    string,
    { cycles: AppealCycle[]; events: WorkflowEvent[] }
> = {
    "ag-demo-001": createSeed("ag-demo-001", {
        raisedAt: "Jan 10, 2024",
        raisedDescription:
            "Level 1 appeal filed for lumbar spinal fusion with clinical notes and imaging.",
        raisedTimestamp: "2024-01-10T09:12:00",
        label: "Level 1 — Raised (In Review)",
        criteria: demoCriteriaByAppealId["ag-demo-001"].tree,
        determinationIssue: demoCriteriaByAppealId["ag-demo-001"].determinationIssue,
        evidence: lumbarFusionEvidence,
        aiSummary: inReviewAiSummary,
    }),
    "ag-demo-002": createSeed("ag-demo-002", {
        raisedAt: "Jan 10, 2024",
        raisedDescription:
            "Appeal filed for Dupixent with severity assessment and topical therapy history.",
        raisedTimestamp: "2024-01-10T08:30:00",
        label: "Level 1 — Approved",
        criteria: demoCriteriaByAppealId["ag-demo-002"].tree,
        evidence: [
            {
                name: "Derm_Assessment_Jan10.pdf",
                added: "Jan 10",
                size: "1.2 MB",
                type: "pdf",
                change: "new",
            },
            {
                name: "Topical_Therapy_History.pdf",
                added: "Jan 10",
                size: "0.5 MB",
                type: "pdf",
                change: "new",
            },
            {
                name: "Ophth_Clearance.pdf",
                added: "Jan 10",
                size: "0.3 MB",
                type: "pdf",
                change: "new",
            },
        ],
        aiSummary: {
            recommendation:
                "Approve Dupilumab. All ten inclusion criteria for moderate-to-severe atopic dermatitis are met; no exclusion criteria apply.",
            recommendationVerdict: "APPROVED",
            confidence: 91,
            rationale:
                "Basys reviewed the Dupixent appeal under DERM-2023-08 criteria. Inclusion A.1–A.10 are satisfied: Derm_Assessment_Jan10.pdf documents EASI 22, BSA 18%, IGA 4, and pruritus NRS 7; Topical_Therapy_History.pdf confirms eight-week clobetasol and four-week crisaborole trials with inadequate control; immunization and ophthalmology clearance support safe biologic initiation. All ten exclusion criteria (E.1–E.10) are not present — no parasitic infection, prior dupilumab reaction, mild disease, inadequate topical trial, ocular contraindication, alternate primary diagnosis, pregnancy, active malignancy, concurrent immunosuppression, or cosmetic-only indication. The initial denial appeared to rely on incomplete severity documentation; appeal materials now provide objective scores exceeding biologic thresholds. Basys recommends overturning the denial with high confidence.",
            checks: [
                {
                    label: "Medical Necessity",
                    sublabel: "Passed",
                    passed: true,
                },
                {
                    label: "Plan Eligibility",
                    sublabel: "Verified",
                    passed: true,
                },
                {
                    label: "Provider Network",
                    sublabel: "In-Network",
                    passed: true,
                },
            ],
        },
        outcome: {
            type: "approved",
            description: "Coverage approved — appeal overturns initial denial.",
            timestamp: "2024-01-12T14:45:00",
            letter: {
                type: "approval",
                title: "Approval Letter",
                generatedAt: "Jan 12, 2024",
                aiSummary:
                    "Basys supports overturning the prior Dupixent denial. Appeal documentation confirms EASI 22 and failure of topical corticosteroids. The approval letter confirms medical necessity and authorization effective dates.",
                body: `Dear Dr. Sam Chen, MD,

Re: Appeal AG-DEMO-002 — Dupixent (Dupilumab) (J-Code J3590)
Member: Jordan Rivera
Plan:  BlueCross

We have completed our review of the appeal submitted for the above-referenced service. Based on the clinical documentation provided and Policy #DEMO-2024, coverage is approved.

Appeal documentation satisfies severity and prior therapy criteria. Dupilumab initiation is medically necessary.

Authorization is granted subject to plan benefits and any applicable prior authorization requirements. Please retain this notice with the member's medical record.

Sincerely,
Clinical Review Unit
 BlueCross`,
            },
        },
    }),
    "ag-demo-003": createSeed("ag-demo-003", {
        raisedAt: "Jan 10, 2024",
        raisedDescription:
            "Appeal filed for spinal cord stimulator trial after utilization denial.",
        raisedTimestamp: "2024-01-10T13:15:00",
        label: "Level 1 — Denied",
        criteria: demoCriteriaByAppealId["ag-demo-003"].tree,
        determinationIssue: demoCriteriaByAppealId["ag-demo-003"].determinationIssue,
        evidence: [
            {
                name: "Pain_Management_Referral.pdf",
                added: "Jan 10",
                size: "0.9 MB",
                type: "pdf",
                change: "new",
            },
            {
                name: "Conservative_Care_Summary.pdf",
                added: "Jan 10",
                size: "1.1 MB",
                type: "pdf",
                change: "insufficient",
                changeNote: "Only 4 weeks of conservative care documented.",
            },
            {
                name: "Psych_Eval_Dec2023.pdf",
                added: "Jan 10",
                size: "0.4 MB",
                type: "pdf",
                change: "new",
            },
        ],
        aiSummary: {
            recommendation:
                "Deny SCS trial. Inclusion criterion A.4 (failed conservative management) is not met — only four weeks of structured therapy documented.",
            recommendationVerdict: "NOT APPROVED",
            confidence: 88,
            rationale:
                "Basys applied interventional pain policy criteria to the spinal cord stimulator trial appeal. Inclusion criteria A.1–A.3 and A.5–A.10 are met: Pain_Management_Referral.pdf documents 14 months of neuropathic pain, NRS 7/10, appropriate anatomic target, cleared psych eval, acceptable PDMP, MRI compatibility, trial candidacy, credentialed implanter, and documented initial denial. Criterion A.4 (failed conservative management) is not met — Conservative_Care_Summary.pdf and PT_Summary.pdf show only four weeks of multidisciplinary conservative therapy, below the twelve-week minimum; sub-criterion A.4.b (pharmacologic trial) is met with gabapentin. All ten exclusion criteria (E.1–E.10) screen negative. Because SCS trial eligibility requires demonstrated failure of adequate conservative care, Basys recommends upholding the denial.",
            checks: [
                {
                    label: "Medical Necessity",
                    sublabel: "Failed",
                    passed: false,
                },
                {
                    label: "Plan Eligibility",
                    sublabel: "Verified",
                    passed: true,
                },
                {
                    label: "Provider Network",
                    sublabel: "In-Network",
                    passed: true,
                },
            ],
        },
        outcome: {
            type: "denied",
            description:
                "Denial upheld — conservative therapy requirements not met.",
            timestamp: "2024-01-14T16:10:00",
            letter: {
                type: "denial",
                title: "Denial Letter",
                generatedAt: "Jan 14, 2024",
                aiSummary:
                    "Basys recommends upholding the denial for spinal cord stimulator trial. Submitted records document only four weeks of conservative therapy. The drafted letter cites the policy gap and notifies the provider of appeal rights.",
                body: `Dear Dr. Sam Chen, MD,

Re: Appeal AG-DEMO-003 — Spinal Cord Stimulator Trial (CPT 63650)
Member: Jordan Rivera
Plan:  United

After review of the appeal submission and applicable medical policy (Policy #DEMO-2024), we are unable to approve the requested spinal cord stimulator trial at this time.

Failed conservative management criteria are not met. Submitted documentation confirms only four weeks of structured conservative therapy — policy requires twelve weeks minimum.

This determination is based on the documentation submitted with the appeal. You may submit supplemental records for reconsideration or request a peer-to-peer review within the timeframe specified in your plan materials.

Sincerely,
Clinical Review Unit
 United`,
            },
        },
    }),
    "ag-demo-004": createSeed("ag-demo-004", {
        raisedAt: "Jan 10, 2024",
        raisedDescription:
            "Appeal submitted for right knee MRI after utilization denial.",
        raisedTimestamp: "2024-01-10T10:00:00",
        label: "Level 1 — Missing Info",
        criteria: demoCriteriaByAppealId["ag-demo-004"].tree,
        determinationIssue: demoCriteriaByAppealId["ag-demo-004"].determinationIssue,
        evidence: [
            {
                name: "Ortho_Clinic_Note.pdf",
                added: "Jan 10",
                size: "1.0 MB",
                type: "pdf",
                change: "new",
            },
            {
                name: "Appeal_Letter_AG-DEMO-004.pdf",
                added: "Jan 10",
                size: "0.3 MB",
                type: "pdf",
                change: "new",
            },
        ],
        aiSummary: {
            recommendation:
                "Cannot finalize determination. Inclusion criteria A.3 (weight-bearing radiographs) and A.5 (conservative therapy duration) are not found in the appeal file.",
            recommendationVerdict: "PENDING",
            confidence: 65,
            rationale:
                "Basys reviewed the knee MRI appeal against advanced musculoskeletal imaging criteria. Met criteria include A.1 (internal derangement suspicion), A.2 (focal exam findings), A.4 (red-flag screening), A.6 (NSAID trial), A.7 (symptom duration ≥ 4 weeks), A.9 (appropriate ordering specialty), and A.10 (correct laterality/CPT). Criteria A.3 (prior weight-bearing knee X-ray within six months) and A.5 (structured conservative management duration) are not found — Ortho_Clinic_Note.pdf references outside imaging without attaching reports, and home exercise is mentioned without quantified duration. A.8 (prior inconclusive imaging) is also not found. All ten exclusion criteria (E.1–E.10) screen negative based on available records. Basys cannot issue a final medical-necessity determination until weight-bearing radiographs and conservative therapy documentation are submitted.",
            checks: [
                {
                    label: "Medical Necessity",
                    sublabel: "Incomplete",
                    passed: null,
                },
                {
                    label: "Plan Eligibility",
                    sublabel: "Verified",
                    passed: true,
                },
                {
                    label: "Provider Network",
                    sublabel: "In-Network",
                    passed: true,
                },
            ],
        },
        outcome: {
            type: "missing_info",
            description:
                "Additional documentation requested — prior X-ray and conservative therapy records.",
            timestamp: "2024-01-13T11:20:00",
            letter: {
                type: "missing_info",
                title: "Missing Information Letter",
                generatedAt: "Jan 13, 2024",
                aiSummary:
                    "Basys cannot finalize the knee MRI determination without additional records. The missing-information letter lists required documentation and provides a response deadline for the provider.",
                body: `Dear Dr. Sam Chen, MD,

Re: Appeal AG-DEMO-004 — Knee MRI (CPT 73721)
Member: Jordan Rivera
Plan:  Aetna

We have reviewed the appeal submitted for the above-referenced service. Additional information is required before a final determination can be issued under Policy #DEMO-2024.

Please submit: (1) weight-bearing knee X-ray within the past six months, and (2) documentation of at least four weeks of structured conservative therapy.

Please submit the requested documentation within 30 calendar days of this notice. If the information is not received, the appeal may be decided based on the records currently on file.

Sincerely,
Clinical Review Unit
 Aetna`,
            },
        },
    }),
    "ag-demo-005": createSeed("ag-demo-005", {
        raisedAt: "Jan 10, 2024",
        raisedDescription:
            "Appeal filed for Rituximab with pathology and treatment summary.",
        raisedTimestamp: "2024-01-10T07:45:00",
        label: "Level 1 — Partially Approved",
        criteria: demoCriteriaByAppealId["ag-demo-005"].tree,
        determinationIssue: demoCriteriaByAppealId["ag-demo-005"].determinationIssue,
        evidence: [
            {
                name: "Rheum_Clinic_Note.pdf",
                added: "Jan 10",
                size: "1.3 MB",
                type: "pdf",
                change: "new",
            },
            {
                name: "Treatment_Plan.pdf",
                added: "Jan 10",
                size: "0.6 MB",
                type: "pdf",
                change: "new",
            },
            {
                name: "Prior_Biologic_Summary.pdf",
                added: "Jan 10",
                size: "0.4 MB",
                type: "pdf",
                change: "new",
            },
        ],
        aiSummary: {
            recommendation:
                "Partially approve Rituximab — induction dosing (A.6) supported; maintenance beyond cycle 4 (A.9) not documented.",
            recommendationVerdict: "APPROVED",
            confidence: 78,
            rationale:
                "Basys evaluated the rituximab appeal for seropositive rheumatoid arthritis. Inclusion criteria A.1–A.8 and A.10 are met: Rheum_Clinic_Note.pdf documents DAS28-CRP 4.6, Medication_History.pdf confirms methotrexate 20 mg × 18 months, Prior_Biologic_Summary.pdf shows adalimumab failure, Lab_Screening.pdf clears infection/TB/HBV screening, and Treatment_Plan.pdf includes appropriate induction dosing and premedication. Criterion A.9 (maintenance rituximab beyond cycle 4) is not met — the treatment plan requests q6mo maintenance for twelve months without CD19 monitoring or post-induction disease activity response. All ten exclusion criteria (E.1–E.10) are not present. Basys recommends approving induction cycles 1–4 only; maintenance dosing remains non-covered pending supplemental response documentation.",
            checks: [
                {
                    label: "Medical Necessity",
                    sublabel: "Partial",
                    passed: true,
                },
                {
                    label: "Plan Eligibility",
                    sublabel: "Verified",
                    passed: true,
                },
                {
                    label: "Provider Network",
                    sublabel: "In-Network",
                    passed: true,
                },
            ],
        },
        outcome: {
            type: "partially_approved",
            description:
                "Partial overturn — induction dosing approved; maintenance dosing limited pending supplemental review.",
            timestamp: "2024-01-15T15:00:00",
            letter: {
                type: "partial_approval",
                title: "Partial Approval Letter",
                generatedAt: "Jan 15, 2024",
                aiSummary:
                    "Basys recommends a partial overturn for Rituximab. Induction cycles 1–4 are supported under policy; maintenance dosing beyond cycle 4 remains non-covered pending additional documentation.",
                body: `Dear Dr. Sam Chen, MD,

Re: Appeal AG-DEMO-005 — Rituximab Infusion (J-Code J9312)
Member: Jordan Rivera
Plan:  Cigna

Our review under Policy #DEMO-2024 supports partial approval of the appealed request.

Initial induction dosing (cycles 1–4) is approved based on pathology and prior therapy documentation. Maintenance dosing beyond cycle 4 is not authorized with the records currently on file.

Approved services are limited to the scope documented in the appeal file. Any services outside the approved parameters remain non-covered. Contact Utilization Management if you need clarification on authorized units or dates of service.

Sincerely,
Clinical Review Unit
 Cigna`,
            },
        },
    }),
    "ag-demo-006": createSeed("ag-demo-006", {
        raisedAt: "Jan 10, 2024",
        raisedDescription:
            "Pharmacy appeal filed for Mavacamten (Camzyos) with cardiology notes and prior therapy history.",
        raisedTimestamp: "2024-01-10T08:00:00",
        label: "Level 1 — Raised (In Review)",
        criteria: demoCriteriaByAppealId["ag-demo-006"].tree,
        determinationIssue: demoCriteriaByAppealId["ag-demo-006"].determinationIssue,
        evidence: [
            {
                name: "Cardiology_Notes.pdf",
                added: "Jan 10",
                size: "1.4 MB",
                type: "pdf",
                change: "new",
            },
            {
                name: "REMS_Enrollment.pdf",
                added: "Jan 10",
                size: "0.3 MB",
                type: "pdf",
                change: "new",
            },
            {
                name: "Medication_History.pdf",
                added: "Jan 10",
                size: "0.5 MB",
                type: "pdf",
                change: "new",
            },
        ],
        aiSummary: {
            recommendation:
                "Do not approve mavacamten at this time. Resting LVOT gradient (A.4), recent echocardiogram (A.5), and LVEF (A.6) are not found in the submitted appeal.",
            recommendationVerdict: "NOT APPROVED",
            confidence: 68,
            rationale:
                "Basys reviewed the mavacamten appeal for symptomatic obstructive hypertrophic cardiomyopathy. Inclusion criteria A.1–A.3, A.7–A.10 are met: Cardiology_Notes.pdf confirms HCM diagnosis, NYHA Class II–III symptoms, max-tolerated metoprolol trial, adult age, specialist management, REMS enrollment, and biomarker monitoring plan. Criteria A.4 (resting LVOT gradient ≥ 30 mmHg), A.5 (echo within six months), and A.6 (LVEF ≥ 55%) are not found — the appeal references August 2023 imaging without attaching the echo report or numeric gradient/EF values. Exclusion E.1 and E.6 are not found (cannot confirm EF or exclude non-obstructive physiology without echo); remaining exclusions E.2–E.5 and E.7–E.10 screen negative. Basys recommends withholding approval until a current echocardiogram with LVEF and LVOT gradient is submitted.",
            checks: [
                {
                    label: "Medical Necessity",
                    sublabel: "Under review",
                    passed: null,
                },
                {
                    label: "Plan Eligibility",
                    sublabel: "Verified",
                    passed: true,
                },
                {
                    label: "Provider Network",
                    sublabel: "In-Network",
                    passed: true,
                },
            ],
        },
    }),
};
