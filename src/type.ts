export interface Argv {
  branch?: string;
  glob?: string;
  help?: boolean;
  list?: boolean;
  version?: boolean;
  dryRun?: boolean;
  _: string[];
}