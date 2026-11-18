import {
  ApparatusItem,
  BeakerConfig,
  FairTestResult,
  PartId,
  PartSpec,
  PartState,
  VariableKey,
} from '../types/experiment';

export const CONTROL_VARIABLE_LABELS: { key: VariableKey; label: string }[] = [
  { key: 'amount_of_solute', label: 'amount of solute' },
  { key: 'amount_of_solvent', label: 'amount of solvent' },
  { key: 'rate_of_stirring', label: 'rate of stirring' },
  { key: 'temperature_of_solvent', label: 'temperature of solvent' },
  { key: 'surface_area_of_solute', label: 'surface area of solute' },
];

export const INDEPENDENT_VAR_CHOICES = [
  'rate of stirring',
  'temperature of solvent (water)',
  'surface area of solute (copper(II) sulphate)',
  'amount of solute (copper(II) sulphate)',
  'amount of solvent (water)',
];

export const DEPENDENT_VAR_CHOICES = [
  'time taken for solute (copper(II) sulphate) to dissolve',
  'mass of copper(II) sulphate added',
  'temperature of the water',
  'volume of water in each beaker',
];

export const APPARATUS_LIST: ApparatusItem[] = [
  {
    name: 'Beaker (100 cm³)',
    quantity: '6',
    detail: 'Borosilicate graduated beakers labelled X and Y for each part',
  },
  {
    name: 'Spoon',
    quantity: '1',
    detail: 'For transferring copper(II) sulphate powder or crystals',
  },
  {
    name: 'Glass rod',
    quantity: '2',
    detail: 'Used to stir the mixture smoothly at a steady rate',
  },
  {
    name: 'Stopwatch',
    quantity: '1',
    detail: 'Measures the time taken (s) for the solute to dissolve completely',
  },
  {
    name: 'Electronic balance',
    quantity: '1',
    detail: 'Weighs equal masses (e.g. 2.0 g) of powder or crystals accurately',
  },
  {
    name: 'Hot water (about 60 °C) & tap water',
    quantity: 'As needed',
    detail: 'Solvents at different temperatures for testing thermal effect',
  },
  {
    name: 'Copper(II) sulphate powder',
    quantity: 'Solute',
    detail: 'Finely ground blue solid with a larger total surface area',
  },
  {
    name: 'Copper(II) sulphate crystals',
    quantity: 'Solute',
    detail: 'Larger solid crystals with a smaller total surface area',
  },
];

export const PART_SPECS: Record<PartId, PartSpec> = {
  A: {
    id: 'A',
    shortLabel: 'Part A',
    navLabel: 'Part A: Stirring',
    title: 'Part A: How does stirring affect the rate of dissolving?',
    hypothesisStem: 'When the solution is stirred, the rate of dissolving',
    correctHypothesis: 'increases',
    correctIndependentVar: 'rate of stirring',
    correctDependentVar: 'time taken for solute (copper(II) sulphate) to dissolve',
    correctControlVars: [
      'amount_of_solute',
      'amount_of_solvent',
      'temperature_of_solvent',
      'surface_area_of_solute',
    ],
    independentVarOptions: INDEPENDENT_VAR_CHOICES,
    dependentVarOptions: DEPENDENT_VAR_CHOICES,
    procedures: [
      'Add 50 cm³ of tap water to two beakers labelled X and Y respectively.',
      'Add 2 g of copper(II) sulphate powder to each beaker.',
      'Start timing with a stopwatch. Leave X undisturbed and stir the mixture in Y with a glass rod until the powder is completely dissolved.',
      'Record the time needed for the solute to dissolve in X and Y.',
    ],
    cautions: ['Do not taste the copper(II) sulphate powder or the solutions.'],
    recommendedX: {
      volumeCm3: 50,
      tempType: 'tap',
      soluteForm: 'powder',
      soluteMassG: 2,
      stirring: false,
    },
    recommendedY: {
      volumeCm3: 50,
      tempType: 'tap',
      soluteForm: 'powder',
      soluteMassG: 2,
      stirring: true,
    },
  },
  B: {
    id: 'B',
    shortLabel: 'Part B',
    navLabel: 'Part B: Temperature',
    title: 'Part B: How does the temperature of the solvent affect the rate of dissolving?',
    hypothesisStem: 'When the temperature of the solvent is higher, the rate of dissolving',
    correctHypothesis: 'increases',
    correctIndependentVar: 'temperature of solvent (water)',
    correctDependentVar: 'time taken for solute (copper(II) sulphate) to dissolve',
    correctControlVars: [
      'amount_of_solute',
      'amount_of_solvent',
      'rate_of_stirring',
      'surface_area_of_solute',
    ],
    independentVarOptions: INDEPENDENT_VAR_CHOICES,
    dependentVarOptions: DEPENDENT_VAR_CHOICES,
    procedures: [
      'Add 50 cm³ of tap water to beaker X and 50 cm³ of hot water to beaker Y respectively.',
      'Add 2 g of copper(II) sulphate powder to each beaker.',
      'Start timing with a stopwatch. Stir the mixtures in both beakers at the same rate.',
      'Record the time needed for the solute to dissolve in X and Y.',
    ],
    cautions: [
      'Do not taste the copper(II) sulphate powder or the solutions.',
      'Handle hot water with care.',
    ],
    recommendedX: {
      volumeCm3: 50,
      tempType: 'tap',
      soluteForm: 'powder',
      soluteMassG: 2,
      stirring: true,
    },
    recommendedY: {
      volumeCm3: 50,
      tempType: 'hot',
      soluteForm: 'powder',
      soluteMassG: 2,
      stirring: true,
    },
  },
  C: {
    id: 'C',
    shortLabel: 'Part C',
    navLabel: 'Part C: Surface Area',
    title: 'Part C: How does the surface area of the solute affect the rate of dissolving?',
    hypothesisStem: 'When the surface area of the solute is larger, the rate of dissolving',
    correctHypothesis: 'increases',
    correctIndependentVar: 'surface area of solute (copper(II) sulphate)',
    correctDependentVar: 'time taken for solute (copper(II) sulphate) to dissolve',
    correctControlVars: [
      'amount_of_solute',
      'amount_of_solvent',
      'rate_of_stirring',
      'temperature_of_solvent',
    ],
    independentVarOptions: INDEPENDENT_VAR_CHOICES,
    dependentVarOptions: DEPENDENT_VAR_CHOICES,
    procedures: [
      'Add 50 cm³ of tap water to beaker X and beaker Y respectively.',
      'Use an electronic balance to weigh several copper(II) sulphate crystals (about 2 g). Measure out the same weight of copper(II) sulphate powder.',
      'Add the crystals to X and the powder to Y.',
      'Start timing with a stopwatch. Stir the content in both beakers at the same rate.',
      'Record the time needed for the solute to dissolve in X and Y.',
    ],
    cautions: [
      'Do not taste the copper(II) sulphate powder, copper(II) sulphate crystals or the solutions.',
    ],
    recommendedX: {
      volumeCm3: 50,
      tempType: 'tap',
      soluteForm: 'crystals',
      soluteMassG: 2,
      stirring: true,
    },
    recommendedY: {
      volumeCm3: 50,
      tempType: 'tap',
      soluteForm: 'powder',
      soluteMassG: 2,
      stirring: true,
    },
  },
};

export function createInitialPartState(partId: PartId): PartState {
  // Default starting configuration gives students a clean starting point they can adjust or intentionally test
  const base: BeakerConfig = {
    volumeCm3: 50,
    tempType: 'tap',
    soluteForm: 'powder',
    soluteMassG: 2,
    stirring: partId === 'A' ? false : true,
  };

  return {
    hypothesis: null,
    hypothesisChecked: false,
    independentVar: '',
    dependentVar: '',
    controlVars: [],
    variablesChecked: false,
    beakerX: { ...base },
    beakerY: { ...base },
    recordedResult: null,
    hypothesisSupported: null,
  };
}

export function configsEqual(a: BeakerConfig, b: BeakerConfig): boolean {
  return (
    a.volumeCm3 === b.volumeCm3 &&
    a.tempType === b.tempType &&
    a.soluteForm === b.soluteForm &&
    a.soluteMassG === b.soluteMassG &&
    a.stirring === b.stirring
  );
}

export function validateFairTest(
  partId: PartId,
  x: BeakerConfig,
  y: BeakerConfig
): FairTestResult {
  const spec = PART_SPECS[partId];
  const details: string[] = [];

  // Check control variables (must be equal between X and Y)
  if (x.volumeCm3 !== y.volumeCm3) {
    details.push(
      `Control variable mismatch: Amount of solvent differs (X: ${x.volumeCm3} cm³ vs Y: ${y.volumeCm3} cm³).`
    );
  }
  if (x.soluteMassG !== y.soluteMassG) {
    details.push(
      `Control variable mismatch: Amount of solute differs (X: ${x.soluteMassG.toFixed(1)} g vs Y: ${y.soluteMassG.toFixed(1)} g).`
    );
  }
  if (partId !== 'A' && x.stirring !== y.stirring) {
    details.push(
      `Control variable mismatch: Rate of stirring must be the same in both beakers (X: ${x.stirring ? 'Stirred' : 'Undisturbed'} vs Y: ${y.stirring ? 'Stirred' : 'Undisturbed'}).`
    );
  }
  if (partId !== 'B' && x.tempType !== y.tempType) {
    details.push(
      `Control variable mismatch: Temperature of solvent must be the same (X: ${x.tempType === 'hot' ? 'Hot ~60 °C' : 'Tap ~22 °C'} vs Y: ${y.tempType === 'hot' ? 'Hot ~60 °C' : 'Tap ~22 °C'}).`
    );
  }
  if (partId !== 'C' && x.soluteForm !== y.soluteForm) {
    details.push(
      `Control variable mismatch: Surface area / form of solute must be the same (X: ${x.soluteForm} vs Y: ${y.soluteForm}).`
    );
  }

  // Check independent variable (must differ between X and Y)
  if (partId === 'A' && x.stirring === y.stirring) {
    details.push(
      'Independent variable missing: One beaker must be stirred while the other is left undisturbed.'
    );
  }
  if (partId === 'B' && x.tempType === y.tempType) {
    details.push(
      'Independent variable missing: One beaker must contain tap water (~22 °C) and the other hot water (~60 °C).'
    );
  }
  if (partId === 'C' && x.soluteForm === y.soluteForm) {
    details.push(
      'Independent variable missing: One beaker must receive crystals (smaller surface area) and the other powder (larger surface area).'
    );
  }

  const isFairTest = details.length === 0;
  const matchesTextbookRecommended =
    configsEqual(x, spec.recommendedX) && configsEqual(y, spec.recommendedY);

  if (isFairTest) {
    const ivName =
      partId === 'A'
        ? 'rate of stirring'
        : partId === 'B'
          ? 'temperature of solvent'
          : 'surface area of solute';
    return {
      isFairTest: true,
      matchesTextbookRecommended,
      headline: matchesTextbookRecommended
        ? 'Fair Test Ready — Matches Experiment 2.5 procedure'
        : `Fair Test Ready — Only ${ivName} differs`,
      details: matchesTextbookRecommended
        ? []
        : [
            `All control variables are kept constant while only ${ivName} varies between Beaker X and Beaker Y.`,
          ],
    };
  }

  return {
    isFairTest: false,
    matchesTextbookRecommended: false,
    headline: 'Not a Fair Test yet',
    details,
  };
}

/**
 * Computes realistic dissolving duration (in seconds) calibrated to Experiment 2.5:
 * Baseline: 50 cm³ tap water, 2.0 g powder, stirred -> ~18.5 s
 */
export function calculateDissolveTimeSeconds(
  config: BeakerConfig,
  jitterSeed = 0
): number {
  let baseSeconds = 18.4;

  // Stirring effect (~2.85x slower undisturbed)
  if (!config.stirring) {
    baseSeconds *= 2.85;
  }

  // Solvent temperature effect (~22 °C vs ~60 °C)
  if (config.tempType === 'hot') {
    baseSeconds *= 0.42;
  }

  // Surface area effect (powder vs large crystals)
  if (config.soluteForm === 'crystals') {
    baseSeconds *= 2.75;
  }

  // Mass of solute factor
  if (config.soluteMassG === 1) {
    baseSeconds *= 0.68;
  } else if (config.soluteMassG === 4) {
    baseSeconds *= 1.56;
  }

  // Solvent volume factor
  if (config.volumeCm3 === 25) {
    baseSeconds *= 1.24;
  } else if (config.volumeCm3 === 75) {
    baseSeconds *= 0.86;
  }

  // Natural experimental variance (±0.3 s)
  const jitter = ((jitterSeed % 7) - 3) * 0.1;
  return Math.max(3.2, Number((baseSeconds + jitter).toFixed(1)));
}
