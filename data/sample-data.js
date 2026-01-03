// Sample data structure for future modules
// This file shows how to structure data for expanded features

// Books of the Bible
export const biblicalBooks = {
    oldTestament: [
        { name: 'Génesis', chapters: 50, order: 1 },
        { name: 'Éxodo', chapters: 40, order: 2 },
        { name: 'Levítico', chapters: 27, order: 3 },
        // ... más libros
    ],
    newTestament: [
        { name: 'Mateo', chapters: 28, order: 40 },
        { name: 'Marcos', chapters: 16, order: 41 },
        { name: 'Lucas', chapters: 24, order: 42 },
        // ... más libros
    ]
};

// Characters for future character database
export const biblicalCharacters = {
    'jesus': {
        name: 'Jesús',
        born: 'Belén',
        period: '4 AC - 30 DC aprox',
        appearances: [
            { book: 'Mateo', verse: '1:1' },
            { book: 'Marcos', verse: '1:1' },
            // ...
        ],
        significance: 'Central figure of Christianity'
    },
    'moses': {
        name: 'Moisés',
        born: 'Egipto',
        period: '1450 AC aprox',
        appearances: [],
        significance: 'Liberador del pueblo de Israel'
    },
    // Más personajes...
};

// Timeline events
export const timelineEvents = [
    {
        id: 1,
        year: -4000,
        eventEs: 'Creación según cronología tradicional',
        eventEn: 'Creation according to traditional chronology',
        book: 'Génesis',
        references: ['Génesis 1-2']
    },
    {
        id: 2,
        year: -2000,
        eventEs: 'Nacimiento de Abraham',
        eventEn: 'Birth of Abraham',
        book: 'Génesis',
        references: ['Génesis 12:1']
    },
    // Más eventos...
];

// Geographic locations
export const biblicalLocations = [
    {
        id: 'jerusalem',
        nameEs: 'Jerusalén',
        nameEn: 'Jerusalem',
        latitude: 31.7683,
        longitude: 35.2137,
        significance: 'Center of Jewish faith and Christianity',
        appearances: []
    },
    {
        id: 'bethlehem',
        nameEs: 'Belén',
        nameEn: 'Bethlehem',
        latitude: 31.7054,
        longitude: 35.2048,
        significance: 'Birthplace of Jesus',
        appearances: ['Mateo 2:1', 'Lucas 2:4']
    },
    // Más ubicaciones...
];

// Thematic connections
export const thematicConnections = {
    'love': {
        theme: 'Amor (Agape)',
        verses: [
            { reference: '1 Corintios 13:4-8', theme: 'Nature of love' },
            { reference: 'Juan 3:16', theme: 'God\'s love' },
            { reference: '1 Juan 4:8', theme: 'God is love' }
        ],
        relatedThemes: ['grace', 'forgiveness', 'sacrifice']
    },
    'grace': {
        theme: 'Gracia',
        verses: [
            { reference: 'Efesios 2:8', theme: 'Salvation by grace' },
            { reference: 'Romanos 3:24', theme: 'Justified by grace' }
        ],
        relatedThemes: ['faith', 'salvation', 'mercy']
    },
    // Más temas...
};

export default {
    biblicalBooks,
    biblicalCharacters,
    timelineEvents,
    biblicalLocations,
    thematicConnections
};
