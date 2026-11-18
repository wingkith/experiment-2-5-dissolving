export type PartId = 'A' | 'B' | 'C';
export type StageId = PartId | 'conclusion';

export type HypothesisOption = 'increases' | 'decreases' | 'same';
export type SupportOption = 'yes' | 'no';

export type SolventVolume = 25 | 50 | 75;
export type WaterTempType = 'tap' | 'hot';
export type SoluteForm = 'powder' | 'crystals';
export type SoluteMass = 1 | 2 | 4;

export interface BeakerConfig {
  volumeCm3: SolventVolume;
  tempType: WaterTempType;
  soluteForm: SoluteForm;
  soluteMassG: SoluteMass;
  stirring: boolean;
}

export type VariableKey =
  | 'amount_of_solute'
  | 'amount_of_solvent'
  | 'rate_of_stirring'
  | 'temperature_of_solvent'
  | 'surface_area_of_solute';

export interface FairTestResult {
  isFairTest: boolean;
  matchesTextbookRecommended: boolean;
  headline: string;
  details: string[];
}

export interface PartSpec {
  id: PartId;
  shortLabel: string;
  navLabel: string;
  title: string;
  hypothesisStem: string;
  correctHypothesis: HypothesisOption;
  correctIndependentVar: string;
  correctDependentVar: string;
  correctControlVars: VariableKey[];
  independentVarOptions: string[];
  dependentVarOptions: string[];
  procedures: string[];
  cautions: string[];
  recommendedX: BeakerConfig;
  recommendedY: BeakerConfig;
}

export interface RecordedResult {
  timeX: number;
  timeY: number;
  configX: BeakerConfig;
  configY: BeakerConfig;
}

export interface PartState {
  hypothesis: HypothesisOption | null;
  hypothesisChecked: boolean;
  independentVar: string;
  dependentVar: string;
  controlVars: VariableKey[];
  variablesChecked: boolean;
  beakerX: BeakerConfig;
  beakerY: BeakerConfig;
  recordedResult: RecordedResult | null;
  hypothesisSupported: SupportOption | null;
}

export interface ConclusionState {
  stirring: 'stirred' | 'not_stirred' | null;
  temperature: 'higher' | 'lower' | null;
  surfaceArea: 'larger' | 'smaller' | null;
  checked: boolean;
}

export interface ApparatusItem {
  name: string;
  quantity: string;
  detail: string;
}
