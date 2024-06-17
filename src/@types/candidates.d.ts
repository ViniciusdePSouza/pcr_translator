  export interface CandidatesProps {
    CandidateId: number
    Candidate: Candidate
    status?: string,
    sub_status?: string,
  }
  
  export interface Candidate {
    EmailAddress: string
  }
