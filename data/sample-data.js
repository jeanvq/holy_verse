// Sample data structure for future modules
// This file shows how to structure data for expanded features

// Books of the Bible - COMPLETE LIST
export const biblicalBooks = {
    oldTestament: [
        { name: 'Génesis', nameEn: 'Genesis', chapters: 50, order: 1 },
        { name: 'Éxodo', nameEn: 'Exodus', chapters: 40, order: 2 },
        { name: 'Levítico', nameEn: 'Leviticus', chapters: 27, order: 3 },
        { name: 'Números', nameEn: 'Numbers', chapters: 36, order: 4 },
        { name: 'Deuteronomio', nameEn: 'Deuteronomy', chapters: 34, order: 5 },
        { name: 'Josué', nameEn: 'Joshua', chapters: 24, order: 6 },
        { name: 'Jueces', nameEn: 'Judges', chapters: 21, order: 7 },
        { name: 'Rut', nameEn: 'Ruth', chapters: 4, order: 8 },
        { name: '1 Samuel', nameEn: '1 Samuel', chapters: 31, order: 9 },
        { name: '2 Samuel', nameEn: '2 Samuel', chapters: 24, order: 10 },
        { name: '1 Reyes', nameEn: '1 Kings', chapters: 22, order: 11 },
        { name: '2 Reyes', nameEn: '2 Kings', chapters: 25, order: 12 },
        { name: '1 Crónicas', nameEn: '1 Chronicles', chapters: 29, order: 13 },
        { name: '2 Crónicas', nameEn: '2 Chronicles', chapters: 36, order: 14 },
        { name: 'Esdras', nameEn: 'Ezra', chapters: 10, order: 15 },
        { name: 'Nehemías', nameEn: 'Nehemiah', chapters: 13, order: 16 },
        { name: 'Ester', nameEn: 'Esther', chapters: 10, order: 17 },
        { name: 'Job', nameEn: 'Job', chapters: 42, order: 18 },
        { name: 'Salmos', nameEn: 'Psalms', chapters: 150, order: 19 },
        { name: 'Proverbios', nameEn: 'Proverbs', chapters: 31, order: 20 },
        { name: 'Eclesiastés', nameEn: 'Ecclesiastes', chapters: 12, order: 21 },
        { name: 'Cantares', nameEn: 'Song of Solomon', chapters: 8, order: 22 },
        { name: 'Isaías', nameEn: 'Isaiah', chapters: 66, order: 23 },
        { name: 'Jeremías', nameEn: 'Jeremiah', chapters: 52, order: 24 },
        { name: 'Lamentaciones', nameEn: 'Lamentations', chapters: 5, order: 25 },
        { name: 'Ezequiel', nameEn: 'Ezekiel', chapters: 48, order: 26 },
        { name: 'Daniel', nameEn: 'Daniel', chapters: 12, order: 27 },
        { name: 'Oseas', nameEn: 'Hosea', chapters: 14, order: 28 },
        { name: 'Joel', nameEn: 'Joel', chapters: 3, order: 29 },
        { name: 'Amós', nameEn: 'Amos', chapters: 9, order: 30 },
        { name: 'Abdías', nameEn: 'Obadiah', chapters: 1, order: 31 },
        { name: 'Jonás', nameEn: 'Jonah', chapters: 4, order: 32 },
        { name: 'Miqueas', nameEn: 'Micah', chapters: 7, order: 33 },
        { name: 'Nahúm', nameEn: 'Nahum', chapters: 3, order: 34 },
        { name: 'Habacuc', nameEn: 'Habakkuk', chapters: 3, order: 35 },
        { name: 'Sofonías', nameEn: 'Zephaniah', chapters: 3, order: 36 },
        { name: 'Hageo', nameEn: 'Haggai', chapters: 2, order: 37 },
        { name: 'Zacarías', nameEn: 'Zechariah', chapters: 14, order: 38 },
        { name: 'Malaquías', nameEn: 'Malachi', chapters: 4, order: 39 },
    ],
    newTestament: [
        { name: 'Mateo', nameEn: 'Matthew', chapters: 28, order: 40 },
        { name: 'Marcos', nameEn: 'Mark', chapters: 16, order: 41 },
        { name: 'Lucas', nameEn: 'Luke', chapters: 24, order: 42 },
        { name: 'Juan', nameEn: 'John', chapters: 21, order: 43 },
        { name: 'Hechos', nameEn: 'Acts', chapters: 28, order: 44 },
        { name: 'Romanos', nameEn: 'Romans', chapters: 16, order: 45 },
        { name: '1 Corintios', nameEn: '1 Corinthians', chapters: 16, order: 46 },
        { name: '2 Corintios', nameEn: '2 Corinthians', chapters: 13, order: 47 },
        { name: 'Gálatas', nameEn: 'Galatians', chapters: 6, order: 48 },
        { name: 'Efesios', nameEn: 'Ephesians', chapters: 6, order: 49 },
        { name: 'Filipenses', nameEn: 'Philippians', chapters: 4, order: 50 },
        { name: 'Colosenses', nameEn: 'Colossians', chapters: 4, order: 51 },
        { name: '1 Tesalonicenses', nameEn: '1 Thessalonians', chapters: 5, order: 52 },
        { name: '2 Tesalonicenses', nameEn: '2 Thessalonians', chapters: 3, order: 53 },
        { name: '1 Timoteo', nameEn: '1 Timothy', chapters: 6, order: 54 },
        { name: '2 Timoteo', nameEn: '2 Timothy', chapters: 4, order: 55 },
        { name: 'Tito', nameEn: 'Titus', chapters: 3, order: 56 },
        { name: 'Filemón', nameEn: 'Philemon', chapters: 1, order: 57 },
        { name: 'Hebreos', nameEn: 'Hebrews', chapters: 13, order: 58 },
        { name: 'Santiago', nameEn: 'James', chapters: 5, order: 59 },
        { name: '1 Pedro', nameEn: '1 Peter', chapters: 5, order: 60 },
        { name: '2 Pedro', nameEn: '2 Peter', chapters: 3, order: 61 },
        { name: '1 Juan', nameEn: '1 John', chapters: 5, order: 62 },
        { name: '2 Juan', nameEn: '2 John', chapters: 1, order: 63 },
        { name: '3 Juan', nameEn: '3 John', chapters: 1, order: 64 },
        { name: 'Judas', nameEn: 'Jude', chapters: 1, order: 65 },
        { name: 'Apocalipsis', nameEn: 'Revelation', chapters: 22, order: 66 },
    ]
};

// Characters for character database - EXPANDED
export const biblicalCharacters = {
    'jesus': {
        name: 'Jesús',
        nameEn: 'Jesus',
        born: 'Belén',
        bornEn: 'Bethlehem',
        period: '4 AC - 30 DC aprox',
        periodEn: '4 BC - 30 AD approx',
        appearances: [
            { book: 'Mateo', verse: '1:1' },
            { book: 'Marcos', verse: '1:1' },
            { book: 'Lucas', verse: '1:1' },
            { book: 'Juan', verse: '1:1' }
        ],
        significance: 'Central figure of Christianity / Figura central del cristianismo',
        keyMiracles: [
            { nameEs: 'Multiplicación de panes', nameEn: 'Loaves and Fishes', reference: 'Mateo 14:15-21' },
            { nameEs: 'Caminata sobre el agua', nameEn: 'Walking on Water', reference: 'Mateo 14:22-33' },
            { nameEs: 'Resurrección de Lázaro', nameEn: 'Raising of Lazarus', reference: 'Juan 11:1-44' },
        ]
    },
    'moses': {
        name: 'Moisés',
        nameEn: 'Moses',
        born: 'Egipto',
        bornEn: 'Egypt',
        period: '1450 AC aprox',
        periodEn: '1450 BC approx',
        appearances: [],
        significance: 'Liberador del pueblo de Israel / Liberator of Israel',
        achievements: [
            { nameEs: 'Parting the Red Sea', reference: 'Éxodo 14' },
            { nameEs: 'Las Tablas de la Ley', nameEn: 'Tablets of the Law', reference: 'Éxodo 20' },
        ]
    },
    'david': {
        name: 'David',
        nameEn: 'David',
        born: 'Belén',
        bornEn: 'Bethlehem',
        period: '1040 AC - 970 AC aprox',
        periodEn: '1040 BC - 970 BC approx',
        significance: 'Segundo rey de Israel / Second King of Israel',
        achievements: [
            { nameEs: 'Derrota de Goliat', nameEn: 'Defeat of Goliath', reference: '1 Samuel 17' },
            { nameEs: 'Fundador del imperio israelita', nameEn: 'Founder of Israelite empire', reference: '1 Samuel 16' },
        ]
    },
    'pablo': {
        name: 'Pablo',
        nameEn: 'Paul',
        born: 'Tarso',
        bornEn: 'Tarsus',
        significance: 'Apóstol de los gentiles / Apostle to the Gentiles',
        achievements: [
            { nameEs: 'Escribió 13 cartas (epístolas)', nameEn: 'Wrote 13 letters (epistles)', reference: 'Romanos - Filemón' },
            { nameEs: 'Fundador de iglesias en Europa', nameEn: 'Founder of churches in Europe', reference: 'Hechos 13-28' },
        ]
    }
};

// Timeline events - EXPANDED with more detail
export const timelineEvents = [
    {
        id: 1,
        year: -4000,
        eventEs: 'Creación según cronología tradicional',
        eventEn: 'Creation according to traditional chronology',
        book: 'Génesis',
        bookEn: 'Genesis',
        references: ['Génesis 1-2']
    },
    {
        id: 2,
        year: -2000,
        eventEs: 'Nacimiento de Abraham',
        eventEn: 'Birth of Abraham',
        book: 'Génesis',
        bookEn: 'Genesis',
        references: ['Génesis 12:1'],
        details: 'Abraham es el padre de la fe / Abraham is the father of faith'
    },
    {
        id: 3,
        year: -1450,
        eventEs: 'Éxodo de Egipto bajo Moisés',
        eventEn: 'Exodus from Egypt under Moses',
        book: 'Éxodo',
        bookEn: 'Exodus',
        references: ['Éxodo 12-14']
    },
    {
        id: 4,
        year: -1000,
        eventEs: 'Establecimiento del reino de David',
        eventEn: 'Establishment of David\'s Kingdom',
        book: '1 Samuel',
        bookEn: '1 Samuel',
        references: ['1 Samuel 16-17']
    },
    {
        id: 5,
        year: -586,
        eventEs: 'Caída de Jerusalén y cautiverio',
        eventEn: 'Fall of Jerusalem and captivity',
        book: '2 Reyes',
        bookEn: '2 Kings',
        references: ['2 Reyes 25']
    },
    {
        id: 6,
        year: 1,
        eventEs: 'Nacimiento de Jesús',
        eventEn: 'Birth of Jesus',
        book: 'Mateo',
        bookEn: 'Matthew',
        references: ['Mateo 1-2', 'Lucas 1-2']
    },
    {
        id: 7,
        year: 30,
        eventEs: 'Crucifixión y Resurrección de Jesús',
        eventEn: 'Crucifixion and Resurrection of Jesus',
        book: 'Mateo',
        bookEn: 'Matthew',
        references: ['Mateo 27-28', 'Juan 19-21']
    },
    {
        id: 8,
        year: 50,
        eventEs: 'Primer viaje misionero de Pablo',
        eventEn: 'Paul\'s First Missionary Journey',
        book: 'Hechos',
        bookEn: 'Acts',
        references: ['Hechos 13-14']
    },
    {
        id: 9,
        year: 95,
        eventEs: 'Escritura del Apocalipsis por Juan',
        eventEn: 'Writing of Revelation by John',
        book: 'Apocalipsis',
        bookEn: 'Revelation',
        references: ['Apocalipsis 1:1']
    }
];

// Geographic locations - EXPANDED
export const biblicalLocations = [
    {
        id: 'jerusalem',
        nameEs: 'Jerusalén',
        nameEn: 'Jerusalem',
        latitude: 31.7683,
        longitude: 35.2137,
        significance: 'Centro de la fe judía y cristiana / Center of Jewish and Christian faith',
        appearances: ['Mateo 21:1', 'Lucas 19:28', 'Juan 2:13'],
        historicalEvents: ['Última Cena', 'Crucifixión', 'Resurrección']
    },
    {
        id: 'bethlehem',
        nameEs: 'Belén',
        nameEn: 'Bethlehem',
        latitude: 31.7054,
        longitude: 35.2048,
        significance: 'Lugar de nacimiento de Jesús / Birthplace of Jesus',
        appearances: ['Mateo 2:1', 'Lucas 2:4'],
        historicalEvents: ['Nacimiento de Jesús', 'Nacimiento de David']
    },
    {
        id: 'nazareth',
        nameEs: 'Nazaret',
        nameEn: 'Nazareth',
        latitude: 32.6980,
        longitude: 35.2975,
        significance: 'Pueblo donde creció Jesús / Town where Jesus grew up',
        appearances: ['Mateo 4:13', 'Lucas 1:26']
    },
    {
        id: 'galilee',
        nameEs: 'Galilea',
        nameEn: 'Galilee',
        latitude: 32.8363,
        longitude: 35.5275,
        significance: 'Región del ministerio de Jesús / Region of Jesus\' ministry',
        appearances: ['Mateo 4:23', 'Marcos 1:14']
    },
    {
        id: 'jordan',
        nameEs: 'Río Jordán',
        nameEn: 'Jordan River',
        latitude: 31.8949,
        longitude: 35.5031,
        significance: 'Lugar del bautismo de Jesús / Site of Jesus\' baptism',
        appearances: ['Mateo 3:13-17', 'Marcos 1:9-11']
    },
    {
        id: 'mount_sinai',
        nameEs: 'Monte Sinaí',
        nameEn: 'Mount Sinai',
        latitude: 28.3389,
        longitude: 33.9737,
        significance: 'Donde Moisés recibió los Diez Mandamientos / Where Moses received the Ten Commandments',
        appearances: ['Éxodo 19:1-25', 'Deuteronomio 5:1-22']
    }
];

// Thematic connections - EXPANDED
export const thematicConnections = {
    'love': {
        theme: 'Amor (Agape)',
        themeEn: 'Love (Agape)',
        verses: [
            { reference: '1 Corintios 13:4-8', referenceEn: '1 Corinthians 13:4-8', theme: 'Nature of love / Naturaleza del amor' },
            { reference: 'Juan 3:16', referenceEn: 'John 3:16', theme: 'God\'s love / Amor de Dios' },
            { reference: '1 Juan 4:8', referenceEn: '1 John 4:8', theme: 'God is love / Dios es amor' }
        ],
        relatedThemes: ['grace', 'forgiveness', 'sacrifice', 'compassion']
    },
    'grace': {
        theme: 'Gracia',
        themeEn: 'Grace',
        verses: [
            { reference: 'Efesios 2:8', referenceEn: 'Ephesians 2:8', theme: 'Salvation by grace / Salvación por gracia' },
            { reference: 'Romanos 3:24', referenceEn: 'Romans 3:24', theme: 'Justified by grace / Justificados por gracia' },
            { reference: '2 Corintios 12:9', referenceEn: '2 Corinthians 12:9', theme: 'Sufficient grace / Gracia suficiente' }
        ],
        relatedThemes: ['faith', 'salvation', 'mercy', 'redemption']
    },
    'hope': {
        theme: 'Esperanza',
        themeEn: 'Hope',
        verses: [
            { reference: 'Romanos 15:13', referenceEn: 'Romans 15:13', theme: 'God of hope / Dios de esperanza' },
            { reference: 'Hebreos 6:19', referenceEn: 'Hebrews 6:19', theme: 'Hope as anchor / Esperanza como ancla' },
            { reference: '1 Pedro 1:3', referenceEn: '1 Peter 1:3', theme: 'Living hope / Esperanza viva' }
        ],
        relatedThemes: ['faith', 'resurrection', 'eternal life']
    },
    'faith': {
        theme: 'Fe',
        themeEn: 'Faith',
        verses: [
            { reference: 'Hebreos 11:1', referenceEn: 'Hebrews 11:1', theme: 'Definition of faith / Definición de fe' },
            { reference: 'Romanos 10:17', referenceEn: 'Romans 10:17', theme: 'Faith comes by hearing / La fe viene por oír' },
            { reference: 'Marcos 11:24', referenceEn: 'Mark 11:24', theme: 'Believing and receiving / Creer y recibir' }
        ],
        relatedThemes: ['hope', 'trust', 'salvation', 'prayer']
    }
};

export default {
    biblicalBooks,
    biblicalCharacters,
    timelineEvents,
    biblicalLocations,
    thematicConnections
};
