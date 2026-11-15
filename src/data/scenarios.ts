export type Answer = 'mito' | 'realidad';

export interface ScenarioMeta {
  id: string;
  code: string;
  title: string;
  statement: string;
  answer: Answer;
  feedback: string;
}

export const SCENARIOS: ScenarioMeta[] = [
  {
    id: 'mosquito',
    code: '01',
    title: 'El mosquito',
    statement:
      'Si un mosquito pica a una persona con VIH y luego te pica a ti, ¿te contagias de VIH?',
    answer: 'mito',
    feedback:
      'El mosquito no funciona como una jeringa. Al picar inyecta su propia saliva sin virus, no sangre de la persona anterior, y el VIH no sobrevive en su estómago.',
  },
  {
    id: 'social',
    code: '02',
    title: 'Contacto social',
    statement:
      'Abrazar, dar un beso social o compartir vasos y cubiertos puede transmitir el VIH.',
    answer: 'mito',
    feedback:
      'El VIH no se transmite por saliva, sudor, abrazos, besos sociales ni por compartir alimentos o utensilios.',
  },
  {
    id: 'bloodborne',
    code: '03',
    title: 'Jeringas compartidas',
    statement:
      'Compartir jeringas o agujas sin esterilizar transmite el VIH.',
    answer: 'realidad',
    feedback:
      'La vía sanguínea es una de las tres vías principales. Al compartir agujas, la sangre con el virus entra directo al torrente sanguíneo.',
  },
  {
    id: 'sexual',
    code: '04',
    title: 'Vía sexual',
    statement:
      'Tener relaciones sexuales sin preservativo es una vía real de transmisión del VIH, y el riesgo aumenta si hay otras infecciones de transmisión sexual.',
    answer: 'realidad',
    feedback:
      'La vía sexual transmite el VIH mediante semen, líquido preseminal y secreciones vaginales o rectales. Otras ITS o lesiones multiplican el riesgo.',
  },
  {
    id: 'mother-child',
    code: '05',
    title: 'Embarazo y VIH',
    statement:
      'Si una madre vive con VIH, su bebé inevitablemente nacerá con el virus.',
    answer: 'mito',
    feedback:
      'La vía maternoinfantil puede ocurrir en embarazo, parto o lactancia, pero con control médico y tratamiento antirretroviral el riesgo se reduce a casi cero.',
  },
  {
    id: 'hygiene',
    code: '06',
    title: 'Sudor y baños',
    statement:
      'El sudor, las lágrimas o usar el mismo baño público pueden transmitir el VIH.',
    answer: 'mito',
    feedback:
      'El sudor, las lágrimas, la saliva y la orina no transmiten el VIH. Solo lo transmiten sangre, semen, líquido preseminal, secreciones vaginales o rectales y leche materna.',
  },
];
