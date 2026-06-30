import type { AppealCycle, WorkflowEvent } from "@/lib/appeal-workflow";
import type { Criterion } from "@/lib/data";

const lumbarFusionExclusions: Criterion[] = [
    {
        id: "E.1",
        label: "Active systemic or local infection at operative site",
        description:
            "Known active infection contraindicates elective spinal fusion.",
        state: "not-met",
        evidence: "No infection documented in clinical notes or labs.",
        patientMapping: "No fever, elevated WBC, or wound infection noted.",
        rationale:
            "Exclusion not present — no active infection identified in submitted records.",
        sourceRef: "Clinical_Notes_PCP.pdf",
    },
    {
        id: "E.2",
        label: "Fusion requested solely for axial low back pain without neural compression",
        description:
            "Fusion is not indicated when only low back pain is present without radiculopathy or instability.",
        state: "not-met",
        evidence: "Radicular leg pain and neural compression documented.",
        patientMapping:
            "Chart documents left leg radiculopathy correlating with L4-L5.",
        rationale:
            "Exclusion not present — neural compression and radicular symptoms are documented.",
    },
    {
        id: "E.3",
        label: "Untreated osteoporosis or metabolic bone disease",
        description: "Uncorrected bone disease increases fusion failure risk.",
        state: "not-met",
        evidence: "Metabolic panel within acceptable limits.",
        patientMapping: "Calcium, vitamin D, and bone markers unremarkable.",
        rationale:
            "Exclusion not present — no untreated metabolic bone disease identified.",
    },
];

export const workflowSeeds: Record<
    string,
    { cycles: AppealCycle[]; events: WorkflowEvent[] }
> = {
    "ag-902341": {
        cycles: [
            {
                id: "ag-902341-cycle-1",
                cycleNumber: 1,
                raisedAt: "Oct 24, 2023",
                label: "Level 1 — Initial submission (1 PT file)",
                status: "superseded",
                evidence: [
                    {
                        name: "Clinical_Notes_PCP.pdf",
                        added: "Oct 24",
                        size: "2.1 MB",
                        type: "pdf",
                        change: "unchanged",
                    },
                    {
                        name: "PT_Records_V2.pdf",
                        added: "Oct 22",
                        size: "4.5 MB",
                        type: "pdf",
                        change: "insufficient",
                        changeNote: "Only 6 weeks of PT documented.",
                    },
                ],
                letter: {
                    type: "denial",
                    title: "Denial Letter",
                    generatedAt: "Oct 28, 2023",
                    aiSummary:
                        "Basys recommends upholding the denial for lumbar spinal fusion. Submitted PT records cover only six weeks of conservative therapy — policy CMS-L33747 requires twelve weeks minimum. The drafted letter cites the conservative-management gap and notifies the provider of appeal rights.",
                    body: `Dear Dr. Aris Thompson, MD,

Re: Appeal AG-902341 — Lumbar Spinal Fusion (CPT 22612)
Member: Jonathan Miller
Plan: New Century Health

After review of the appeal submission and applicable medical policy (Policy #CMS-L33747), we are unable to approve the requested lumbar spinal fusion at this time.

Submitted documentation confirms only 6 weeks of physical therapy — policy CMS-L33747 requires 12 weeks minimum of documented conservative management before advanced surgical intervention.

This determination is based on the documentation submitted with the appeal. You may submit supplemental records for reconsideration or request a peer-to-peer review within the timeframe specified in your plan materials.

Sincerely,
Clinical Review Unit
New Century Health`,
                },
                criteria: {
                    inclusion: [
                        {
                            id: "A.1",
                            label: "Diagnosis: Spondylolisthesis",
                            description:
                                "Confirmed radiographic diagnosis grade II or higher.",
                            state: "met",
                            evidence: "Imaging confirmed Aug 2023.",
                            sourceRef: "MRI_Lumbar_Spine_0823.png",
                            children: [
                                {
                                    id: "A.1.1",
                                    label: "Radiographic Grade II+",
                                    description:
                                        "Spondylolisthesis grade II or higher on imaging.",
                                    state: "met",
                                    evidence:
                                        "MRI Aug 2023 confirms grade II at L4-L5.",
                                    sourceRef: "MRI_Lumbar_Spine_0823.png",
                                },
                            ],
                        },
                        {
                            id: "A.2",
                            label: "Failure of Conservative Mgmt (6mo)",
                            description:
                                "Documented failure of 6 months of conservative therapy including PT and ESI.",
                            state: "not-met",
                            evidence:
                                "Only 6 weeks of PT documented in initial submission.",
                            rationale:
                                "This criterion is not met. Policy requires 12 weeks minimum of physical therapy; only 6 weeks were documented.",
                            children: [
                                {
                                    id: "A.2.1",
                                    label: "Physical Therapy (6 months)",
                                    description:
                                        "Minimum 6 months of structured physical therapy.",
                                    state: "not-met",
                                    evidence: "Only 6 weeks of PT documented.",
                                    sourceRef: "PT_Records_V2.pdf",
                                    patientMapping:
                                        "PT records show sessions from Sep 2023 to Oct 2023 only (6 weeks).",
                                    rationale:
                                        "This criterion is not met. Submitted PT documentation covers only 6 weeks, short of the 12-week policy minimum.",
                                },
                                {
                                    id: "A.2.2",
                                    label: "Epidural Steroid Injection",
                                    description:
                                        "Trial of ESI unless contraindicated.",
                                    state: "not-found",
                                    evidence: "None",
                                    patientMapping:
                                        "No ESI procedure found in submitted records.",
                                    rationale:
                                        "This criterion could not be evaluated — no epidural steroid injection documentation was found in the medical record.",
                                },
                            ],
                        },
                    ],
                    exclusion: lumbarFusionExclusions,
                },
                aiSummary: {
                    recommendation:
                        "Deny coverage. Submitted documentation confirms only 6 weeks of physical therapy — policy CMS-L33747 requires 12 weeks minimum.",
                    recommendationVerdict: "NOT APPROVED",
                    confidence: 38,
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
                    rationale:
                        "This determination is based on a structured review of the Level 1 submission against CMS-L33747 lumbar fusion criteria. The patient’s diagnosis of grade II spondylolisthesis at L4-L5 is supported by MRI dated August 2023 and correlates with documented radicular symptoms. However, the inclusion criterion for failure of conservative management is not satisfied. Submitted physical therapy records (PT_Records_V2.pdf) cover only six weeks of treatment, whereas the policy requires a minimum of twelve weeks of documented conservative therapy unless a clinical contraindication is noted. No epidural steroid injection record was found in the initial package, leaving criterion A.2.2 unevaluated as not found. Plan eligibility and provider network status were verified without issue. Exclusion screening did not identify active infection, isolated axial pain without neural compression, or untreated metabolic bone disease. Because the primary medical-necessity pathway depends on demonstrated failure of conservative care, Basys recommends upholding denial at this stage pending supplemental documentation.",
                },
                determinationIssue: {
                    requirement: "A.2 (Failure of Conservative Mgmt)",
                    detail: "has not been satisfied with initial submission.",
                },
            },
            {
                id: "ag-902341-cycle-2",
                cycleNumber: 2,
                raisedAt: "Oct 28, 2023",
                label: "Level 2 — Re-appeal with additional PT logs",
                status: "active",
                evidence: [
                    {
                        name: "MRI_Lumbar_Spine_0823.png",
                        added: "Oct 24",
                        size: "12.4 MB",
                        type: "image",
                        change: "unchanged",
                    },
                    {
                        name: "Clinical_Notes_PCP.pdf",
                        added: "Oct 24",
                        size: "2.1 MB",
                        type: "pdf",
                        change: "unchanged",
                    },
                    {
                        name: "PT_Logs_Oct-Jan.pdf",
                        added: "Oct 28",
                        size: "3.8 MB",
                        type: "pdf",
                        change: "new",
                        changeNote: "Extended PT logs — 16 weeks documented.",
                    },
                    {
                        name: "ESI_Record_Feb10.pdf",
                        added: "Oct 28",
                        size: "0.5 MB",
                        type: "pdf",
                        change: "new",
                        changeNote: "Epidural steroid injection record.",
                    },
                    {
                        name: "Lab_Results_Metabolic.pdf",
                        added: "Oct 20",
                        size: "0.8 MB",
                        type: "lab",
                        change: "unchanged",
                    },
                ],
                criteria: {
                    inclusion: [
                        {
                            id: "A.1",
                            label: "Diagnosis: Spondylolisthesis",
                            description:
                                "Confirmed radiographic diagnosis grade II or higher.",
                            state: "met",
                            evidence: "Imaging confirmed Aug 2023.",
                            sourceRef: "MRI_Lumbar_Spine_0823.png",
                            children: [
                                {
                                    id: "A.1.1",
                                    label: "Radiographic Grade II+",
                                    description:
                                        "Spondylolisthesis grade II or higher on imaging.",
                                    state: "met",
                                    evidence:
                                        "MRI Aug 2023 confirms grade II at L4-L5.",
                                    sourceRef: "MRI_Lumbar_Spine_0823.png",
                                },
                                {
                                    id: "A.1.2",
                                    label: "Clinical Symptom Correlation",
                                    description:
                                        "Symptoms consistent with diagnosed condition.",
                                    state: "met",
                                    evidence:
                                        "Radicular leg pain documented in chart.",
                                    sourceRef: "Clinical_Notes_PCP.pdf",
                                },
                            ],
                        },
                        {
                            id: "A.2",
                            label: "Failure of Conservative Mgmt (6mo)",
                            description:
                                "Documented failure of 6 months of conservative therapy including PT and ESI.",
                            state: "met",
                            evidence:
                                "PT logs and ESI record satisfy policy requirement.",
                            children: [
                                {
                                    id: "A.2.1",
                                    label: "Physical Therapy (6 months)",
                                    description:
                                        "Minimum 6 months of structured physical therapy.",
                                    state: "met",
                                    evidence:
                                        "PT logs Oct–Jan confirm 16 weeks of therapy.",
                                    sourceRef: "PT_Logs_Oct-Jan.pdf",
                                    patientMapping:
                                        "32 PT sessions documented across 16 weeks (Oct 2022–Jan 2023).",
                                    rationale:
                                        "This criterion is met. Extended PT logs satisfy the conservative therapy requirement.",
                                },
                                {
                                    id: "A.2.2",
                                    label: "Epidural Steroid Injection",
                                    description:
                                        "Trial of ESI unless contraindicated.",
                                    state: "met",
                                    evidence: "ESI performed Feb 10, 2023.",
                                    sourceRef: "ESI_Record_Feb10.pdf",
                                    patientMapping:
                                        "L4-L5 transforaminal ESI documented Feb 10, 2023.",
                                    rationale:
                                        "This criterion is met. ESI record confirms interventional conservative therapy prior to fusion request.",
                                },
                            ],
                        },
                        {
                            id: "A.3",
                            label: "Imaging Correlation",
                            description:
                                "Radiographic findings correlate with clinical diagnosis.",
                            state: "met",
                            evidence: "MRI correlates with reported symptoms.",
                            children: [
                                {
                                    id: "A.3.1",
                                    label: "MRI Findings Match Diagnosis",
                                    description:
                                        "Imaging supports the stated diagnosis.",
                                    state: "met",
                                    evidence:
                                        "MRI findings consistent with spondylolisthesis.",
                                },
                                {
                                    id: "A.3.2",
                                    label: "Symptom Correlation Documented",
                                    description:
                                        "Clinical symptoms align with imaging.",
                                    state: "met",
                                    evidence:
                                        "Radicular symptoms correlate with L4-L5 level.",
                                },
                            ],
                        },
                    ],
                    exclusion: lumbarFusionExclusions,
                },
                aiSummary: {
                    recommendation:
                        "Approve coverage: Appeal documentation confirms guideline compliance. Supplemental PT logs and ESI record satisfy previously unmet conservative therapy criteria.",
                    recommendationVerdict: "APPROVED",
                    confidence: 87,
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
                    rationale:
                        "Following receipt of supplemental records in Level 2, Basys re-evaluated the appeal against the same CMS-L33747 decision tree. Diagnosis and imaging correlation criteria remain met: MRI confirms grade II spondylolisthesis at L4-L5 with symptom correlation documented in clinical notes. The prior gap in conservative management is now addressed. PT_Logs_Oct-Jan.pdf documents thirty-two sessions across sixteen weeks (October 2022 through January 2023), satisfying the structured physical therapy requirement. ESI_Record_Feb10.pdf confirms a transforaminal epidural steroid injection at L4-L5 on February 10, 2023, fulfilling the interventional conservative therapy expectation. Exclusion criteria continue to show no active infection, no isolated axial pain pattern, and no untreated bone disease. With all inclusion branches satisfied and no exclusions present, the evidence supports medical necessity for lumbar spinal fusion. Basys therefore recommends approving coverage and overturning the initial denial, with high confidence based on complete documentation of failed conservative care.",
                },
            },
        ],
        events: [
            {
                id: "evt-902341-1",
                cycleNumber: 1,
                type: "appeal_raised",
                title: "Appeal Raised",
                description:
                    "Level 1 appeal filed with initial clinical documentation (1 PT file).",
                timestamp: "2023-10-24T09:12:00",
            },
            {
                id: "evt-902341-2",
                cycleNumber: 1,
                type: "submit_med_director",
                title: "Submitted to Medical Director",
                description:
                    "QMRU completed summary and submitted to Medical Director in A&G.",
                timestamp: "2023-10-26T14:00:00",
            },
            {
                id: "evt-902341-3",
                cycleNumber: 1,
                type: "med_director_review",
                title: "Medical Director Review",
                description: "Medical Director reviewed Level 1 decision tree.",
                timestamp: "2023-10-28T10:30:00",
            },
            {
                id: "evt-902341-4",
                cycleNumber: 1,
                type: "denied",
                title: "Appeal Denied",
                description:
                    "Denial upheld — insufficient conservative therapy documentation.",
                timestamp: "2023-10-28T16:00:00",
                outcome: "deny",
            },
            {
                id: "evt-902341-5",
                cycleNumber: 2,
                type: "re_appeal_raised",
                title: "Re-appeal Raised",
                description:
                    "Provider re-raised appeal with PT_Logs_Oct-Jan.pdf and ESI_Record_Feb10.pdf.",
                timestamp: "2023-10-28T17:30:00",
            },
            {
                id: "evt-902341-6",
                cycleNumber: 2,
                type: "submit_med_director",
                title: "Submitted to Medical Director",
                description:
                    "Level 2 submitted for Medical Director review with updated AI analysis.",
                timestamp: "2023-11-01T09:00:00",
            },
        ],
    },
    "ag-882193": {
        cycles: [
            {
                id: "ag-882193-cycle-1",
                cycleNumber: 1,
                raisedAt: "Oct 21, 2023",
                label: "Level 1 — Pharmacy appeal (Mavacamten)",
                status: "active",
                evidence: [
                    {
                        name: "Echo_Report_Sept23.pdf",
                        added: "Oct 21",
                        size: "3.2 MB",
                        type: "pdf",
                        change: "unchanged",
                    },
                    {
                        name: "Medication_History.pdf",
                        added: "Oct 20",
                        size: "0.6 MB",
                        type: "pdf",
                        change: "insufficient",
                        changeNote: "Only 2-week Metoprolol trial documented.",
                    },
                ],
                letter: {
                    type: "denial",
                    title: "Denial Letter",
                    generatedAt: "Nov 18, 2023",
                    aiSummary:
                        "Basys recommends upholding the Mavacamten denial. Medication records document only a 21-day Metoprolol trial — policy CAR-2023-44 requires a minimum 30-day first-line therapy trial. The letter cites criterion A.2 and appeal rights.",
                    body: `Dear Dr. Sarah Jenkins, MD,

Re: Appeal AG-882193 — Mavacamten (Camzyos) (J-Code J8499)
Member: Robert Hayes
Plan: New Century Health

After review of the appeal submission and applicable medical policy (Policy #CAR-2023-44), we are unable to approve Mavacamten (Camzyos) at this time.

Documentation does not satisfy prior therapy failure requirements. A minimum 30-day trial of first-line therapy is required unless contraindicated. Submitted records confirm only a 21-day Metoprolol trial.

You may submit additional clinical records for reconsideration or request a peer-to-peer review within the timeframe specified in your plan materials.

Sincerely,
Clinical Review Unit
New Century Health`,
                },
                criteria: {
                    inclusion: [
                        {
                            id: "A",
                            label: "Confirmed oHCM diagnosis",
                            description:
                                "Obstructive hypertrophic cardiomyopathy on echocardiography.",
                            state: "met",
                            evidence: "Echo confirmed Sept 2023.",
                            sourceRef: "Echo_Report_Sept23.pdf",
                            children: [
                                {
                                    id: "A.2",
                                    label: "Prior Therapy Failure",
                                    description:
                                        "Inadequate response to first-line beta-blocker therapy.",
                                    state: "not-met",
                                    evidence:
                                        "Only 2 weeks trial of Metoprolol documented.",
                                    sourceRef: "Medication_History.pdf",
                                    rationale:
                                        "This criterion is not met. Policy requires a minimum 30-day trial of first-line therapy.",
                                },
                            ],
                        },
                    ],
                    exclusion: [
                        {
                            id: "E.1",
                            label: "LVEF below 50%",
                            description:
                                "Reduced ejection fraction contraindicates Mavacamten initiation.",
                            state: "not-met",
                            evidence: "LVEF 62% on September echo.",
                            sourceRef: "Echo_Report_Sept23.pdf",
                            rationale:
                                "Exclusion not present — LVEF is within acceptable range.",
                        },
                        {
                            id: "E.2",
                            label: "Pregnancy or nursing",
                            description:
                                "Mavacamten is contraindicated during pregnancy and lactation.",
                            state: "not-met",
                            evidence: "No pregnancy documented in chart.",
                            rationale:
                                "Exclusion not present — patient is not pregnant or nursing.",
                        },
                    ],
                },
                aiSummary: {
                    recommendation:
                        "Uphold denial. Documentation does not satisfy 30-day prior therapy failure requirement.",
                    recommendationVerdict: "NOT APPROVED",
                    confidence: 71,
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
                    rationale:
                        "Basys evaluated this pharmacy appeal for Mavacamten under policy CAR-2023-44 for obstructive hypertrophic cardiomyopathy. Inclusion criteria for confirmed oHCM on echocardiography are met based on Echo_Report_Sept23.pdf, which documents appropriate septal hypertrophy and symptom burden. REMS enrollment and baseline LVEF of 62% satisfy safety monitoring requirements, and exclusion screening shows no reduced ejection fraction below 55% and no pregnancy. The decisive factor is prior therapy failure. Policy requires documentation of an inadequate response to at least thirty days of first-line beta-blocker or calcium channel blocker therapy unless contraindicated. Medication_History.pdf reflects only a two-week trial of Metoprolol, which is insufficient to establish therapeutic failure. Without evidence of a completed first-line trial at guideline duration, the medical-necessity standard for Mavacamten initiation is not met. Plan eligibility and network status are confirmed. Basys recommends upholding the denial until extended medication records demonstrating a qualifying prior therapy trial are submitted.",
                },
                determinationIssue: {
                    requirement: "A.2 (Prior Therapy Failure)",
                    detail: "has not been satisfied.",
                },
            },
        ],
        events: [
            {
                id: "evt-882193-1",
                cycleNumber: 1,
                type: "appeal_raised",
                title: "Appeal Raised",
                description: "Pharmacy appeal filed for Mavacamten (Camzyos).",
                timestamp: "2023-10-21T11:05:00",
            },
            {
                id: "evt-882193-2",
                cycleNumber: 1,
                type: "route_pharmacy",
                title: "Routed to Pharmacy",
                description: "Pharmacy template created and submitted in A&G.",
                timestamp: "2023-10-22T09:00:00",
            },
            {
                id: "evt-882193-3",
                cycleNumber: 1,
                type: "pharmacy_review_complete",
                title: "Pharmacy Review Complete",
                description:
                    "Pharmacy returned to QMRU with uphold recommendation.",
                timestamp: "2023-11-10T14:00:00",
            },
            {
                id: "evt-882193-4",
                cycleNumber: 1,
                type: "denied",
                title: "Appeal Denied",
                description:
                    "Denial upheld after pharmacy and medical director review.",
                timestamp: "2023-11-18T15:15:00",
                outcome: "deny",
            },
        ],
    },
    "ag-771045": {
        cycles: [
            {
                id: "ag-771045-cycle-1",
                cycleNumber: 1,
                raisedAt: "Oct 18, 2023",
                label: "Level 1 — Initial Rituximab appeal",
                status: "active",
                evidence: [
                    {
                        name: "Pathology_Report.pdf",
                        added: "Oct 18",
                        size: "2.0 MB",
                        type: "pdf",
                        change: "unchanged",
                    },
                    {
                        name: "Treatment_History_Summary.pdf",
                        added: "Oct 18",
                        size: "1.1 MB",
                        type: "pdf",
                        change: "insufficient",
                        changeNote:
                            "Missing R-CHOP dates and response assessment.",
                    },
                ],
                criteria: {
                    inclusion: [
                        {
                            id: "A",
                            label: "Confirmed CD20-positive lymphoma",
                            description:
                                "Pathology confirms follicular lymphoma grade 2.",
                            state: "met",
                            evidence:
                                "Pathology confirmed follicular lymphoma grade 2.",
                            sourceRef: "Pathology_Report.pdf",
                        },
                        {
                            id: "B",
                            label: "Prior Therapy Requirements",
                            description:
                                "Documented prior line failure or contraindication.",
                            state: "not-met",
                            evidence: "No R-CHOP completion documented.",
                            sourceRef: "Treatment_History_Summary.pdf",
                            rationale:
                                "This criterion is not met. First-line chemoimmunotherapy completion not documented.",
                        },
                    ],
                    exclusion: [
                        {
                            id: "E.1",
                            label: "Active hepatitis B infection",
                            description:
                                "Rituximab is contraindicated with active HBV.",
                            state: "not-met",
                            evidence: "HBsAg negative in labs.",
                            rationale:
                                "Exclusion not present — no active hepatitis B identified.",
                        },
                        {
                            id: "E.2",
                            label: "Pregnancy or nursing",
                            description:
                                "Rituximab is contraindicated during pregnancy and lactation.",
                            state: "not-met",
                            evidence: "No pregnancy documented in chart.",
                            rationale:
                                "Exclusion not present — patient is not pregnant or nursing.",
                        },
                    ],
                },
                aiSummary: {
                    recommendation:
                        "Deny coverage. Second-line Rituximab not supported without documented R-CHOP failure or contraindication.",
                    recommendationVerdict: "NOT APPROVED",
                    confidence: 58,
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
                    rationale:
                        "This Rituximab appeal was reviewed against ONC-2023-12 second-line criteria. Pathology_Report.pdf confirms CD20-positive follicular lymphoma grade 2, satisfying the diagnosis inclusion branch. The outstanding issue is prior line of therapy. Policy requires documented failure of, or contraindication to, first-line chemoimmunotherapy before second-line Rituximab is supported. Treatment_History_Summary.pdf did not include R-CHOP infusion dates or a formal response assessment. Supplemental Infusion_Records_R-CHOP.pdf and PET_Restaging_Nov2023.pdf were reviewed but do not conclusively demonstrate completed first-line therapy with documented progression. Exclusion screening for active hepatitis B and pregnancy is negative based on available records. Basys assigns moderate confidence and recommends upholding denial until first-line therapy completion and progression are clearly documented.",
                },
                determinationIssue: {
                    requirement: "B.1 (First-Line Chemoimmunotherapy)",
                    detail: "has not been satisfied.",
                },
            },
        ],
        events: [
            {
                id: "evt-771045-1",
                cycleNumber: 1,
                type: "appeal_raised",
                title: "Appeal Raised",
                description:
                    "Level 1 appeal filed for Rituximab with pathology and treatment summary.",
                timestamp: "2023-10-18T15:21:00",
            },
            {
                id: "evt-771045-2",
                cycleNumber: 1,
                type: "submit_med_director",
                title: "Submitted to Medical Director",
                description:
                    "QMRU summary submitted. Awaiting Medical Director decision.",
                timestamp: "2023-11-05T10:00:00",
            },
        ],
    },
    "ag-664821": {
        cycles: [
            {
                id: "ag-664821-cycle-1",
                cycleNumber: 1,
                raisedAt: "Nov 02, 2023",
                label: "Level 1 — Dupixent appeal",
                status: "active",
                evidence: [
                    {
                        name: "Derm_Assessment_Nov02.pdf",
                        added: "Nov 02",
                        size: "1.2 MB",
                        type: "pdf",
                        change: "new",
                    },
                    {
                        name: "Topical_Therapy_History.pdf",
                        added: "Nov 02",
                        size: "0.5 MB",
                        type: "pdf",
                        change: "new",
                    },
                ],
                criteria: {
                    inclusion: [
                        {
                            id: "A",
                            label: "Moderate-to-severe atopic dermatitis",
                            description: "EASI ≥16 or BSA ≥10% documented.",
                            state: "met",
                            evidence:
                                "EASI 22, BSA 18% on dermatology assessment.",
                            sourceRef: "Derm_Assessment_Nov02.pdf",
                        },
                        {
                            id: "B",
                            label: "Failure of topical therapies",
                            description:
                                "Documented inadequate response to high-potency topical steroids.",
                            state: "met",
                            evidence:
                                "8-week topical steroid trial documented.",
                            sourceRef: "Topical_Therapy_History.pdf",
                        },
                    ],
                    exclusion: [
                        {
                            id: "E.1",
                            label: "Active uncontrolled parasitic infection",
                            state: "not-met",
                            evidence: "No parasitic infection documented.",
                            description: "No parasitic infection documented.",
                        },
                    ],
                },
                aiSummary: {
                    recommendation:
                        "Approve Dupilumab. Appeal satisfies severity and prior therapy criteria per DERM-2023-08.",
                    recommendationVerdict: "APPROVED",
                    confidence: 91,
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
                    rationale:
                        "Basys reviewed the Dupixent appeal under DERM-2023-08 for moderate-to-severe atopic dermatitis. Derm_Assessment_Nov02.pdf documents an EASI score of 22 and body surface area involvement of 18%, exceeding policy thresholds for biologic eligibility. Topical_Therapy_History.pdf confirms an eight-week trial of high-potency topical corticosteroids with persistent symptoms, establishing failure of conventional therapy. Exclusion review found no evidence of active uncontrolled parasitic infection. Plan eligibility and in-network provider status were verified. The initial denial appeared to rely on incomplete severity documentation in the original submission; the appeal materials now provide the clinical detail required to support Dupilumab initiation. All inclusion criteria are met and no exclusions apply. Basys recommends approving the appeal and overturning the prior denial, with high confidence that the submitted record aligns with medical necessity and policy intent for patients with inadequately controlled moderate-to-severe atopic dermatitis.",
                },
                letter: {
                    type: "approval",
                    title: "Approval Letter",
                    generatedAt: "Nov 22, 2023",
                    aiSummary:
                        "Basys supports overturning the prior Dupixent denial. Appeal documentation confirms EASI 22, BSA 18%, and failure of topical corticosteroids under DERM-2023-08. The approval letter confirms medical necessity, authorization effective dates, and plan benefit requirements.",
                    body: `Dear Dr. Priya Nair, MD,

Re: Appeal AG-664821 — Dupixent (Dupilumab) (J-Code J3590)
Member: Maria Santos
Plan: BlueCross BlueShield TX

We have completed our review of the appeal submitted for the above-referenced service. Based on the clinical documentation provided and Policy #DERM-2023-08, coverage is approved.

Appeal documentation confirms EASI score ≥16 and failure of topical corticosteroids plus crisaborole. Dupilumab initiation is medically necessary.

Basys reviewed the Dupixent appeal under DERM-2023-08 for moderate-to-severe atopic dermatitis. Derm_Assessment_Nov02.pdf documents an EASI score of 22 and body surface area involvement of 18%, exceeding policy thresholds for biologic eligibility. Topical_Therapy_History.pdf confirms an eight-week trial of high-potency topical corticosteroids with persistent symptoms, establishing failure of conventional therapy.

Authorization is granted subject to plan benefits and any applicable prior authorization requirements. Please retain this notice with the member's medical record.

Sincerely,
Clinical Review Unit
BlueCross BlueShield TX`,
                },
            },
        ],
        events: [
            {
                id: "evt-664821-1",
                cycleNumber: 1,
                type: "appeal_raised",
                title: "Appeal Raised",
                description:
                    "Level 1 appeal filed for Dupixent with severity assessment and topical therapy history.",
                timestamp: "2023-11-02T08:30:00",
            },
            {
                id: "evt-664821-2",
                cycleNumber: 1,
                type: "submit_med_director",
                title: "Submitted to Medical Director",
                description:
                    "QMRU summary submitted for medical director review.",
                timestamp: "2023-11-12T10:00:00",
            },
            {
                id: "evt-664821-3",
                cycleNumber: 1,
                type: "med_director_review",
                title: "Medical Director Review",
                description:
                    "Medical Director reviewed appeal documentation and AI recommendation.",
                timestamp: "2023-11-20T14:30:00",
            },
            {
                id: "evt-664821-4",
                cycleNumber: 1,
                type: "approved",
                title: "Appeal Approved",
                description:
                    "Coverage approved — appeal overturns initial denial.",
                timestamp: "2023-11-22T14:45:00",
                outcome: "approve",
            },
        ],
    },
    "ag-558902": {
        cycles: [
            {
                id: "ag-558902-cycle-1",
                cycleNumber: 1,
                raisedAt: "Nov 10, 2023",
                label: "Level 1 — SCS trial appeal",
                status: "active",
                evidence: [
                    {
                        name: "Pain_Management_Referral.pdf",
                        added: "Nov 10",
                        size: "0.9 MB",
                        type: "pdf",
                        change: "new",
                    },
                    {
                        name: "PT_Summary_6mo.pdf",
                        added: "Nov 10",
                        size: "2.3 MB",
                        type: "pdf",
                        change: "unchanged",
                    },
                ],
                criteria: {
                    inclusion: [
                        {
                            id: "A",
                            label: "Failed conservative management",
                            description: "Documented PT and medication trials.",
                            state: "met",
                            evidence: "6 months PT on file.",
                        },
                        {
                            id: "B",
                            label: "4-week pain diary",
                            description:
                                "Daily pain scores over 4 consecutive weeks.",
                            state: "not-found",
                            evidence: "None",
                            rationale:
                                "Required pain diary not included in appeal submission.",
                        },
                    ],
                    exclusion: [
                        {
                            id: "E.1",
                            label: "Active implantable device infection",
                            state: "not-met",
                            evidence: "No active infection documented.",
                            description: "No active infection documented.",
                        },
                    ],
                },
                aiSummary: {
                    recommendation:
                        "Deny SCS trial. Required 4-week pain diary not submitted — cannot confirm chronic intractable pain severity threshold.",
                    recommendationVerdict: "NOT APPROVED",
                    confidence: 52,
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
                    rationale:
                        "Basys reviewed this spinal cord stimulator trial appeal under NEURO-2022-15. Documentation supports that the patient completed six months of conservative management, including physical therapy summarized in PT_Summary_6mo.pdf, which satisfies the failed conservative care inclusion branch. Pain_Management_Referral.pdf establishes clinical intent for SCS evaluation but does not substitute for required objective monitoring data. Policy mandates a minimum four-week pain diary with daily pain scores to demonstrate chronic intractable pain severity and baseline functional impact before trial implantation. No pain diary or functional assessment was located in the appeal submission, leaving criterion B marked as not found. Exclusion screening did not identify active implantable device infection. Because the missing diary prevents completion of the medical-necessity evaluation, Basys recommends denying authorization and issuing a request for additional information so the provider can submit the pain diary and functional scores needed for reconsideration.",
                },
                determinationIssue: {
                    requirement: "B (4-Week Pain Diary)",
                    detail: "has not been submitted.",
                },
                letter: {
                    type: "missing_info",
                    title: "Missing Information Letter",
                    generatedAt: "Nov 20, 2023",
                    aiSummary:
                        "Basys cannot finalize the SCS trial determination without a 4-week pain diary. The missing-information letter lists the required pain scores and functional assessment under NEURO-2022-15 and provides a 30-day response deadline.",
                    body: `Dear Dr. Alan Brooks, MD,

Re: Appeal AG-558902 — Spinal Cord Stimulator Trial (CPT 63650)
Member: Thomas Wright
Plan: Aetna

We have reviewed the appeal submitted for the above-referenced service. Additional information is required before a final determination can be issued under Policy #NEURO-2022-15.

Deny SCS trial. Required 4-week pain diary not submitted — cannot confirm chronic intractable pain severity threshold.

Please submit a minimum four-week pain diary with daily pain scores and a functional assessment documenting baseline impact. Policy requires this objective monitoring data before spinal cord stimulator trial authorization can be evaluated. Submit the requested documentation within 30 calendar days of this notice. If the information is not received, the appeal may be decided based on the records currently on file.

Sincerely,
Clinical Review Unit
Aetna`,
                },
            },
        ],
        events: [
            {
                id: "evt-558902-1",
                cycleNumber: 1,
                type: "appeal_raised",
                title: "Appeal Raised",
                description:
                    "Appeal filed for spinal cord stimulator trial after initial denial.",
                timestamp: "2023-11-10T13:15:00",
            },
            {
                id: "evt-558902-2",
                cycleNumber: 1,
                type: "submit_med_director",
                title: "Submitted to Medical Director",
                description:
                    "Case routed to medical director for appeal review.",
                timestamp: "2023-11-15T09:00:00",
            },
            {
                id: "evt-558902-3",
                cycleNumber: 1,
                type: "missing_info",
                title: "Missing Information Requested",
                description:
                    "RFI sent to provider for 4-week pain diary and functional assessment.",
                timestamp: "2023-11-20T09:10:00",
                outcome: "missing_info",
            },
        ],
    },
    "ag-441203": {
        cycles: [
            {
                id: "ag-441203-cycle-1",
                cycleNumber: 1,
                raisedAt: "Nov 25, 2023",
                label: "Level 1 — MRI knee appeal",
                status: "active",
                evidence: [
                    {
                        name: "Appeal_Letter_AG-441203.pdf",
                        added: "Nov 25",
                        size: "0.3 MB",
                        type: "pdf",
                        change: "new",
                    },
                    {
                        name: "Ortho_Clinic_Note.pdf",
                        added: "Nov 25",
                        size: "1.0 MB",
                        type: "pdf",
                        change: "new",
                    },
                ],
                criteria: {
                    inclusion: [
                        {
                            id: "A.1",
                            label: "Prior weight-bearing X-ray",
                            description:
                                "Knee X-ray within 6 months before MRI request.",
                            state: "not-found",
                            evidence: "None",
                            rationale:
                                "No weight-bearing knee X-ray found in appeal submission.",
                        },
                        {
                            id: "A.2",
                            label: "Failed conservative management",
                            description:
                                "Minimum 4 weeks structured conservative therapy.",
                            state: "not-met",
                            evidence: "Only 10 days home exercise documented.",
                            sourceRef: "Ortho_Clinic_Note.pdf",
                            rationale:
                                "This criterion is not met. Ortho note documents 10 days of home exercise only; policy requires 4 weeks minimum.",
                        },
                        {
                            id: "A.3",
                            label: "Clinical suspicion of internal derangement",
                            description:
                                "Documented meniscal or ligamentous injury suspicion.",
                            state: "met",
                            evidence:
                                "Positive joint line tenderness and effusion on exam.",
                            sourceRef: "Ortho_Clinic_Note.pdf",
                            rationale:
                                "Exam findings support internal derangement suspicion, but prior imaging and conservative care prerequisites are unmet.",
                        },
                    ],
                    exclusion: [
                        {
                            id: "E.1",
                            label: "Acute trauma with fracture",
                            description:
                                "Fracture evident on exam — CT may be preferred.",
                            state: "not-met",
                            evidence: "No fracture documented on exam.",
                            rationale:
                                "Exclusion not present — no acute fracture identified.",
                        },
                    ],
                },
                aiSummary: {
                    recommendation:
                        "Deny coverage. Orthopedic documentation confirms only 10 days of conservative care — policy RAD-2023-02 requires minimum 4 weeks before advanced knee MRI.",
                    recommendationVerdict: "NOT APPROVED",
                    confidence: 71,
                    rationale:
                        "Basys evaluated this right knee MRI appeal (CPT 73721) under RAD-2023-02 advanced imaging criteria. Ortho_Clinic_Note.pdf documents medial joint line tenderness, effusion, and suspected meniscal pathology, satisfying the clinical suspicion branch. However, the patient completed only 10 days of home exercise program — well short of the 4-week minimum conservative management requirement. No weight-bearing knee X-ray within the prior 6 months was located in Appeal_Letter_AG-441203.pdf or the orthopedic note, leaving criterion A.1 as not found. Plan eligibility and provider network status were verified without issue. Exclusion screening did not identify acute fracture requiring alternate imaging. Because prerequisite conservative care and prior imaging criteria are not met, Basys recommends upholding the utilization denial at this stage.",
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
                determinationIssue: {
                    requirement: "A.2 (Failed Conservative Management)",
                    detail: "has not been satisfied — only 10 days of conservative care documented.",
                },
            },
        ],
        events: [
            {
                id: "evt-441203-1",
                cycleNumber: 1,
                type: "appeal_raised",
                title: "Appeal Raised",
                description:
                    "Appeal submitted for right knee MRI after utilization denial.",
                timestamp: "2023-11-25T08:00:00",
            },
            {
                id: "evt-441203-2",
                cycleNumber: 1,
                type: "submit_med_director",
                title: "Submitted to Medical Director",
                description:
                    "AI summary complete. Case routed to medical director for appeal review.",
                timestamp: "2023-11-26T14:15:00",
            },
        ],
    },
};
