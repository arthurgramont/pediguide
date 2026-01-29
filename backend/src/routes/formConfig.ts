import { Router, Response } from 'express';
import { eq } from 'drizzle-orm';
import { db } from '../db';
import { formConfig } from '../db/schema';
import { AuthRequest, authenticateToken } from '../middleware/auth.middleware';

const DEFAULT_FORM_CONFIG = {
  version: 1,
  fields: [
    {
      key: 'childFirstName',
      label: "Prénom de l'enfant",
      type: 'text',
      required: true,
      order: 1,
      isActive: true,
    },
    {
      key: 'childLastName',
      label: "Nom de l'enfant",
      type: 'text',
      required: true,
      order: 2,
      isActive: true,
    },
    {
      key: 'childBirthDate',
      label: 'Date de naissance',
      type: 'date',
      required: true,
      order: 3,
      isActive: true,
    },
    {
      key: 'consultationReason',
      label: 'Motif de consultation',
      type: 'textarea',
      required: true,
      order: 4,
      isActive: true,
    },
    {
      key: 'behaviorChanges',
      label: 'Changements de comportement',
      type: 'checkbox',
      required: false,
      order: 1,
      isActive: true,
      helpText: 'Plusieurs choix possibles.',
      options: [
        { label: "Il mange moins que d'habitude", value: "Il mange moins que d'habitude" },
        { label: "Il dort moins ou plus que d'habitude", value: "Il dort moins ou plus que d'habitude" },
        { label: 'Il est plus fatigué', value: 'Il est plus fatigué' },
      ],
    },
    {
      key: 'clinicalSigns',
      label: 'Signes cliniques observés',
      type: 'checkbox',
      required: false,
      order: 2,
      isActive: true,
      helpText: 'Plusieurs choix possibles.',
      options: [
        { label: 'Fièvre', value: 'Fièvre' },
        { label: 'Toux', value: 'Toux' },
        { label: 'Vomissements', value: 'Vomissements' },
      ],
    },
    {
      key: 'duration',
      label: 'Depuis quand ?',
      type: 'radio',
      required: true,
      order: 1,
      isActive: true,
      options: [
        { label: "Aujourd'hui", value: "Aujourd'hui" },
        { label: 'Depuis 1 à 2 jours', value: 'Depuis 1 à 2 jours' },
        { label: 'Depuis plusieurs jours', value: 'Depuis plusieurs jours' },
        { label: "Depuis plus d'une semaine", value: "Depuis plus d'une semaine" },
      ],
    },
    {
      key: 'worryLevel',
      label: "Niveau d'inquiétude",
      type: 'radio',
      required: true,
      order: 2,
      isActive: true,
      options: [
        { label: 'Peu inquiétant', value: 'Peu inquiétant' },
        { label: 'Moyennement inquiétant', value: 'Moyennement inquiétant' },
        { label: 'Très inquiétant', value: 'Très inquiétant' },
      ],
    },
    {
      key: 'actionsTaken',
      label: 'Actions déjà réalisées',
      type: 'checkbox',
      required: false,
      order: 1,
      isActive: true,
      helpText: 'Plusieurs choix possibles.',
      options: [
        { label: "J'ai pris la température", value: "J'ai pris la température" },
        { label: "J'ai donné un médicament", value: "J'ai donné un médicament" },
        { label: "Je n'ai rien fait pour le moment", value: "Je n'ai rien fait pour le moment" },
      ],
    },
    {
      key: 'additionalNotes',
      label: 'Message complémentaire',
      type: 'textarea',
      required: false,
      order: 1,
      isActive: true,
    },
  ],
};

const allowedKeys = [
  'childFirstName',
  'childLastName',
  'childBirthDate',
  'consultationReason',
  'behaviorChanges',
  'clinicalSigns',
  'duration',
  'worryLevel',
  'actionsTaken',
  'additionalNotes',
] as const;

type AllowedKey = (typeof allowedKeys)[number];

type FieldOption = { label: string; value: string };

type FieldConfig = {
  key: AllowedKey;
  label: string;
  type: string;
  required: boolean;
  order: number;
  isActive: boolean;
  helpText?: string | null;
  options?: FieldOption[];
};

type FormConfigPayload = {
  version?: number;
  fields?: FieldConfig[];
};

const allowedTypesByKey: Record<AllowedKey, string[]> = {
  childFirstName: ['text'],
  childLastName: ['text'],
  childBirthDate: ['date'],
  consultationReason: ['text', 'textarea'],
  behaviorChanges: ['checkbox'],
  clinicalSigns: ['checkbox'],
  duration: ['radio', 'select'],
  worryLevel: ['radio', 'select'],
  actionsTaken: ['checkbox'],
  additionalNotes: ['text', 'textarea'],
};

const choiceTypes = new Set(['checkbox', 'radio', 'select']);

const normalizeText = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

const getStoredConfig = async () => {
  const rows = await db
    .select({ config: formConfig.config })
    .from(formConfig)
    .where(eq(formConfig.id, 'default'))
    .limit(1);

  if (rows.length > 0) {
    return rows[0].config as typeof DEFAULT_FORM_CONFIG;
  }

  await db.insert(formConfig).values({
    id: 'default',
    config: DEFAULT_FORM_CONFIG,
    updatedAt: new Date(),
  });

  return DEFAULT_FORM_CONFIG;
};

const validateFormConfig = (payload: FormConfigPayload) => {
  const errors: string[] = [];
  const fieldsInput = Array.isArray(payload.fields) ? payload.fields : [];

  if (fieldsInput.length === 0) {
    errors.push('La configuration doit contenir des questions.');
  }

  const seenKeys = new Set<string>();
  const normalizedFields: FieldConfig[] = fieldsInput.map((field, index) => {
    const key = field?.key as AllowedKey;
    const label = normalizeText(field?.label);
    const type = normalizeText(field?.type);
    const required = typeof field?.required === 'boolean' ? field.required : false;
    const isActive = typeof field?.isActive === 'boolean' ? field.isActive : true;
    const order = typeof field?.order === 'number' ? field.order : index + 1;
    const helpText = normalizeText(field?.helpText);

    if (!allowedKeys.includes(key)) {
      errors.push(`Clé de question invalide: ${String(key)}.`);
    }

    if (seenKeys.has(String(key))) {
      errors.push(`Clé de question dupliquée: ${String(key)}.`);
    }
    seenKeys.add(String(key));

    if (!label) {
      errors.push(`La question ${index + 1} doit avoir un libellé.`);
    }

    const allowedTypes = allowedTypesByKey[key];
    if (!allowedTypes?.includes(type)) {
      errors.push(`Type invalide pour la question ${String(key)}.`);
    }

    let options: FieldOption[] | undefined;
    if (choiceTypes.has(type)) {
      const rawOptions = Array.isArray(field?.options) ? field.options : [];
      options = rawOptions
        .map((option) => {
          const optionLabel = normalizeText(option?.label);
          if (!optionLabel) return null;
          const optionValue = normalizeText(option?.value) || optionLabel;
          return { label: optionLabel, value: optionValue };
        })
        .filter((option): option is FieldOption => Boolean(option));

      if (isActive && options.length === 0) {
        errors.push(`Ajoutez au moins une option pour ${String(key)}.`);
      }
    }

    return {
      key,
      label,
      type,
      required,
      order,
      isActive,
      helpText: helpText || null,
      options,
    };
  });

  const missingKeys = allowedKeys.filter((key) => !seenKeys.has(key));
  if (missingKeys.length > 0) {
    errors.push(`Questions manquantes: ${missingKeys.join(', ')}.`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    data: {
      version: 1,
      fields: normalizedFields,
    },
  };
};

export const formConfigRouter = Router();
export const doctorFormConfigRouter = Router();

formConfigRouter.get('/', async (_req, res: Response): Promise<any> => {
  try {
    const config = await getStoredConfig();
    return res.json({ success: true, data: config });
  } catch (error: any) {
    console.error('Error fetching form config:', error);
    return res.status(500).json({ error: 'Failed to fetch form config' });
  }
});

doctorFormConfigRouter.get('/', authenticateToken, async (_req: AuthRequest, res: Response): Promise<any> => {
  try {
    const config = await getStoredConfig();
    return res.json({ success: true, data: config });
  } catch (error: any) {
    console.error('Error fetching form config (doctor):', error);
    return res.status(500).json({ error: 'Failed to fetch form config' });
  }
});

doctorFormConfigRouter.put('/', authenticateToken, async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const validation = validateFormConfig(req.body as FormConfigPayload);
    if (!validation.isValid) {
      return res.status(400).json({ error: 'Validation error', details: validation.errors });
    }

    const updatedAt = new Date();
    await db
      .insert(formConfig)
      .values({
        id: 'default',
        config: validation.data,
        updatedAt,
      })
      .onConflictDoUpdate({
        target: formConfig.id,
        set: { config: validation.data, updatedAt },
      });

    return res.json({ success: true, data: validation.data });
  } catch (error: any) {
    console.error('Error updating form config:', error);
    return res.status(500).json({ error: 'Failed to update form config' });
  }
});
