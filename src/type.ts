export interface Argv {
  branch?: string;
  glob?: string;
  help?: boolean;
  list?: boolean;
  version?: boolean;
  _: string[];
}