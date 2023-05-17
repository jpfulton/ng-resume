/**
 * Interface to define structure of a work history item object.
 */
export interface WorkHistory {
    startYear: number;
    endYear: number;
    title: string;
    organization: string;
    organizationURL: URL;
    bullets: string[];
    skills: string[];
}
