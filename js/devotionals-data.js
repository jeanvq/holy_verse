// Daily Devotionals — local pre-generated bank (no external API required)
// Rotates by day-of-year (dayOfYear % DAILY_DEVOTIONALS.length) so every visitor
// sees the same devotional on the same day, and it still works fully offline (PWA).
//
// Shape per entry:
// {
//   id: unique slug,
//   verseRef: reference shown in both languages (e.g. "Salmos 23:1" / "Psalm 23:1"),
//   es: { title, verseText, reflection },
//   en: { title, verseText, reflection }
// }

const DAILY_DEVOTIONALS = [
  {
    id: 'fe-01',
    es: { title: 'La fe que sostiene', verseRef: 'Hebreos 11:1', verseText: 'La fe es la certeza de lo que se espera, la convicción de lo que no se ve.', reflection: 'La fe no es cerrar los ojos ante la realidad, sino confiar en Dios cuando todavía no vemos el desenlace. Hoy, si estás esperando una respuesta, recuerda que la fe sostiene incluso cuando el camino no está claro.' },
    en: { title: 'The Faith That Sustains', verseRef: 'Hebrews 11:1', verseText: 'Faith is confidence in what we hope for and assurance about what we do not see.', reflection: 'Faith isn\u2019t closing your eyes to reality — it\u2019s trusting God before you see the outcome. If you\u2019re waiting on an answer today, remember faith holds steady even when the path isn\u2019t clear yet.' }
  },
  {
    id: 'esperanza-01',
    es: { title: 'Esperanza que no defrauda', verseRef: 'Romanos 5:5', verseText: 'Y la esperanza no defrauda, porque Dios ha derramado su amor en nuestro corazón por el Espíritu Santo que nos fue dado.', reflection: 'La esperanza cristiana no es un deseo vago; está fundamentada en el amor de Dios ya derramado en ti. Puedes esperar con confianza porque no dependes de tus fuerzas, sino de su fidelidad.' },
    en: { title: 'A Hope That Does Not Disappoint', verseRef: 'Romans 5:5', verseText: 'Hope does not put us to shame, because God\u2019s love has been poured out into our hearts through the Holy Spirit.', reflection: 'Christian hope isn\u2019t wishful thinking — it\u2019s grounded in love God has already poured into you. You can wait with confidence because it doesn\u2019t rest on your strength, but on His faithfulness.' }
  },
  {
    id: 'amor-01',
    es: { title: 'Amados primero', verseRef: '1 Juan 4:19', verseText: 'Nosotros amamos porque él nos amó primero.', reflection: 'No amamos para ganar el amor de Dios; amamos porque ya lo recibimos. Hoy puedes descansar sabiendo que tu valor no depende de cuánto produces, sino de cuánto ya eres amado.' },
    en: { title: 'Loved First', verseRef: '1 John 4:19', verseText: 'We love because he first loved us.', reflection: 'We don\u2019t love to earn God\u2019s love — we love because we\u2019ve already received it. Today you can rest knowing your worth isn\u2019t based on what you produce, but on how deeply you\u2019re already loved.' }
  },
  {
    id: 'gracia-01',
    es: { title: 'Gracia suficiente', verseRef: '2 Corintios 12:9', verseText: 'Mi gracia es suficiente para ti, porque mi poder se perfecciona en la debilidad.', reflection: 'Dios no espera que llegues sin fallas para usarte. Su poder se manifiesta precisamente donde tú reconoces que no puedes solo. Tu debilidad no lo detiene; es el lugar donde su gracia actúa.' },
    en: { title: 'Sufficient Grace', verseRef: '2 Corinthians 12:9', verseText: 'My grace is sufficient for you, for my power is made perfect in weakness.', reflection: 'God isn\u2019t waiting for you to arrive flawless before He uses you. His power shows up exactly where you admit you can\u2019t do it alone. Your weakness doesn\u2019t stop Him — it\u2019s where His grace works best.' }
  },
  {
    id: 'perdon-01',
    es: { title: 'Perdonados para perdonar', verseRef: 'Efesios 4:32', verseText: 'Antes sed benignos unos con otros, misericordiosos, perdonándoos unos a otros, como Dios también os perdonó a vosotros en Cristo.', reflection: 'El perdón que damos nace del perdón que recibimos. Si hay alguien difícil de perdonar hoy, recuerda cuánto se te ha perdonado a ti, y pide fuerzas para extender esa misma gracia.' },
    en: { title: 'Forgiven to Forgive', verseRef: 'Ephesians 4:32', verseText: 'Be kind and compassionate to one another, forgiving each other, just as in Christ God forgave you.', reflection: 'The forgiveness we give flows from the forgiveness we\u2019ve received. If someone is hard to forgive today, remember how much you\u2019ve been forgiven, and ask for strength to extend that same grace.' }
  },
  {
    id: 'paciencia-01',
    es: { title: 'Paciencia que madura', verseRef: 'Santiago 1:4', verseText: 'Y tenga la paciencia su obra completa, para que seáis perfectos y cabales, sin que os falte cosa alguna.', reflection: 'La espera no es tiempo perdido; es el proceso en el que Dios forma carácter en ti. Lo que hoy se siente lento, mañana será la base de tu madurez.' },
    en: { title: 'Patience That Matures', verseRef: 'James 1:4', verseText: 'Let perseverance finish its work so that you may be mature and complete, not lacking anything.', reflection: 'Waiting isn\u2019t wasted time — it\u2019s the process God uses to shape your character. What feels slow today becomes the foundation of your maturity tomorrow.' }
  },
  {
    id: 'confianza-01',
    es: { title: 'Confía con todo tu corazón', verseRef: 'Proverbios 3:5-6', verseText: 'Fíate de Jehová de todo tu corazón, y no te apoyes en tu propia prudencia. Reconócelo en todos tus caminos, y él enderezará tus veredas.', reflection: 'No siempre entenderás el porqué de cada paso, pero puedes confiar en quién guía el camino. Entrégale hoy la decisión que te preocupa.' },
    en: { title: 'Trust With All Your Heart', verseRef: 'Proverbs 3:5-6', verseText: 'Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.', reflection: 'You won\u2019t always understand every step, but you can trust the One guiding the way. Hand over today the decision that\u2019s been weighing on you.' }
  },
  {
    id: 'paz-01',
    es: { title: 'Paz que sobrepasa', verseRef: 'Filipenses 4:6-7', verseText: 'Por nada estéis afanosos... y la paz de Dios, que sobrepasa todo entendimiento, guardará vuestros corazones y vuestros pensamientos en Cristo Jesús.', reflection: 'La ansiedad busca respuestas; la oración busca a Dios. Cuando le entregas tu preocupación en oración, Él no siempre quita el problema, pero sí custodia tu corazón en medio de él.' },
    en: { title: 'Peace That Surpasses', verseRef: 'Philippians 4:6-7', verseText: 'Do not be anxious about anything... and the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.', reflection: 'Anxiety looks for answers; prayer looks to God. When you hand Him your worry in prayer, He doesn\u2019t always remove the problem, but He guards your heart in the middle of it.' }
  },
  {
    id: 'gozo-01',
    es: { title: 'Gozo en toda circunstancia', verseRef: 'Nehemías 8:10', verseText: 'El gozo de Jehová es vuestra fuerza.', reflection: 'El gozo bíblico no depende de que todo salga bien; nace de saber a quién perteneces. Ese gozo se convierte en la fuerza que necesitas para el día de hoy.' },
    en: { title: 'Joy in Every Circumstance', verseRef: 'Nehemiah 8:10', verseText: 'The joy of the Lord is your strength.', reflection: 'Biblical joy doesn\u2019t depend on everything going right — it comes from knowing whose you are. That joy becomes the strength you need for today.' }
  },
  {
    id: 'fortaleza-01',
    es: { title: 'Fuerzas renovadas', verseRef: 'Isaías 40:31', verseText: 'Pero los que esperan a Jehová tendrán nuevas fuerzas; levantarán alas como las águilas; correrán, y no se cansarán; caminarán, y no se fatigarán.', reflection: 'Cuando esperas en Dios, no es pasividad — es la fuente de una fuerza que no viene de ti. Si hoy sientes cansancio, esta es tu invitación a esperar en Él antes que en tus propias fuerzas.' },
    en: { title: 'Renewed Strength', verseRef: 'Isaiah 40:31', verseText: 'Those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.', reflection: 'Waiting on God isn\u2019t passivity — it\u2019s the source of a strength that doesn\u2019t come from you. If you feel tired today, this is your invitation to wait on Him before your own strength runs out.' }
  },
  {
    id: 'sabiduria-01',
    es: { title: 'Pide sabiduría', verseRef: 'Santiago 1:5', verseText: 'Y si alguno de vosotros tiene falta de sabiduría, pídala a Dios, el cual da a todos abundantemente y sin reproche, y le será dada.', reflection: 'No tienes que resolver todo con tu propio entendimiento. Dios ofrece sabiduría a quien la pide con sinceridad, sin condenarte por no saber.' },
    en: { title: 'Ask for Wisdom', verseRef: 'James 1:5', verseText: 'If any of you lacks wisdom, you should ask God, who gives generously to all without finding fault, and it will be given to you.', reflection: 'You don\u2019t have to figure everything out on your own understanding. God offers wisdom to anyone who asks sincerely, without condemning you for not knowing.' }
  },
  {
    id: 'humildad-01',
    es: { title: 'El camino de la humildad', verseRef: '1 Pedro 5:6', verseText: 'Humillaos, pues, bajo la poderosa mano de Dios, para que él os exalte cuando fuere tiempo.', reflection: 'La humildad no es pensar menos de ti, sino confiar en que Dios ve lo que otros no ven. Su tiempo de exaltación llega después de la fidelidad en lo oculto.' },
    en: { title: 'The Path of Humility', verseRef: '1 Peter 5:6', verseText: 'Humble yourselves, therefore, under God\u2019s mighty hand, that he may lift you up in due time.', reflection: 'Humility isn\u2019t thinking less of yourself — it\u2019s trusting that God sees what others don\u2019t. His time of lifting up comes after faithfulness in the hidden places.' }
  },
  {
    id: 'gratitud-01',
    es: { title: 'Dar gracias en todo', verseRef: '1 Tesalonicenses 5:18', verseText: 'Dad gracias en todo, porque esta es la voluntad de Dios para con vosotros en Cristo Jesús.', reflection: 'No se nos pide dar gracias por todo, sino en todo — incluso en medio de lo difícil. La gratitud cambia la forma en que ves el día que tienes por delante.' },
    en: { title: 'Give Thanks in All Things', verseRef: '1 Thessalonians 5:18', verseText: 'Give thanks in all circumstances; for this is God\u2019s will for you in Christ Jesus.', reflection: 'We\u2019re not asked to give thanks for everything, but in everything — even in the middle of what\u2019s hard. Gratitude changes how you see the day ahead of you.' }
  },
  {
    id: 'perseverancia-01',
    es: { title: 'Corre con paciencia', verseRef: 'Hebreos 12:1', verseText: 'Despojémonos de todo peso... y corramos con paciencia la carrera que tenemos por delante.', reflection: 'No se trata de velocidad, sino de constancia. Suelta lo que te pesa hoy y sigue avanzando, un paso a la vez.' },
    en: { title: 'Run With Perseverance', verseRef: 'Hebrews 12:1', verseText: 'Let us throw off everything that hinders... and run with perseverance the race marked out for us.', reflection: 'It\u2019s not about speed — it\u2019s about staying the course. Let go of what\u2019s weighing you down today and keep moving forward, one step at a time.' }
  },
  {
    id: 'oracion-01',
    es: { title: 'Orad sin cesar', verseRef: '1 Tesalonicenses 5:17', verseText: 'Orad sin cesar.', reflection: 'La oración no es solo un momento del día, es una postura del corazón. Puedes hablar con Dios mientras trabajas, caminas o esperas — Él escucha en cualquier momento.' },
    en: { title: 'Pray Without Ceasing', verseRef: '1 Thessalonians 5:17', verseText: 'Pray continually.', reflection: 'Prayer isn\u2019t just a moment in your day — it\u2019s a posture of the heart. You can talk to God while you work, walk, or wait. He listens at any moment.' }
  },
  {
    id: 'guia-01',
    es: { title: 'Lámpara a mis pies', verseRef: 'Salmos 119:105', verseText: 'Lámpara es a mis pies tu palabra, y lumbrera a mi camino.', reflection: 'No siempre verás todo el camino iluminado, pero sí el siguiente paso. Eso basta para seguir avanzando con confianza.' },
    en: { title: 'A Lamp for My Feet', verseRef: 'Psalm 119:105', verseText: 'Your word is a lamp for my feet, a light on my path.', reflection: 'You won\u2019t always see the whole road lit up, but you will see the next step. That\u2019s enough to keep moving forward with confidence.' }
  },
  {
    id: 'consuelo-01',
    es: { title: 'Dios de todo consuelo', verseRef: '2 Corintios 1:3-4', verseText: 'El Padre de misericordias, y Dios de toda consolación, el cual nos consuela en todas nuestras tribulaciones.', reflection: 'El consuelo que recibes hoy no es solo para ti; te prepara para consolar a otros mañana. Ninguna lágrima está fuera del alcance de Dios.' },
    en: { title: 'The God of All Comfort', verseRef: '2 Corinthians 1:3-4', verseText: 'The Father of compassion and the God of all comfort, who comforts us in all our troubles.', reflection: 'The comfort you receive today isn\u2019t just for you — it prepares you to comfort others tomorrow. No tear is beyond God\u2019s reach.' }
  },
  {
    id: 'valor-01',
    es: { title: 'Esfuérzate y sé valiente', verseRef: 'Josué 1:9', verseText: 'Mira que te mando que te esfuerces y seas valiente; no temas ni desmayes, porque Jehová tu Dios estará contigo en dondequiera que vayas.', reflection: 'La valentía bíblica no niega el miedo; avanza a pesar de él, porque sabe que no está sola. Dondequiera que vayas hoy, Él ya está ahí.' },
    en: { title: 'Be Strong and Courageous', verseRef: 'Joshua 1:9', verseText: 'Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.', reflection: 'Biblical courage doesn\u2019t deny fear — it moves forward despite it, because it knows it isn\u2019t alone. Wherever you go today, He\u2019s already there.' }
  },
  {
    id: 'contentamiento-01',
    es: { title: 'He aprendido a contentarme', verseRef: 'Filipenses 4:11-13', verseText: 'He aprendido a contentarme, cualquiera que sea mi situación... Todo lo puedo en Cristo que me fortalece.', reflection: 'El contentamiento no es resignación, es una lección aprendida con el tiempo. La fuerza para vivirlo no viene de las circunstancias, sino de Cristo.' },
    en: { title: 'I Have Learned to Be Content', verseRef: 'Philippians 4:11-13', verseText: 'I have learned to be content whatever the circumstances... I can do all this through him who gives me strength.', reflection: 'Contentment isn\u2019t resignation — it\u2019s a lesson learned over time. The strength to live it doesn\u2019t come from circumstances, but from Christ.' }
  },
  {
    id: 'servicio-01',
    es: { title: 'Servid por amor', verseRef: 'Gálatas 5:13', verseText: 'Servíos por amor los unos a los otros.', reflection: 'El servicio genuino no busca reconocimiento; nace del amor que ya recibiste. Hoy, ¿a quién puedes servir sin esperar nada a cambio?' },
    en: { title: 'Serve One Another in Love', verseRef: 'Galatians 5:13', verseText: 'Serve one another humbly in love.', reflection: 'Genuine service doesn\u2019t seek recognition — it flows from love you\u2019ve already received. Who can you serve today without expecting anything back?' }
  },
  {
    id: 'generosidad-01',
    es: { title: 'Dios ama al dador alegre', verseRef: '2 Corintios 9:7', verseText: 'Dios ama al dador alegre.', reflection: 'Dar no se mide por la cantidad, sino por la actitud del corazón. Lo que das con alegría multiplica algo más que lo material.' },
    en: { title: 'God Loves a Cheerful Giver', verseRef: '2 Corinthians 9:7', verseText: 'God loves a cheerful giver.', reflection: 'Giving isn\u2019t measured by amount, but by the attitude of the heart. What you give cheerfully multiplies something more than the material.' }
  },
  {
    id: 'integridad-01',
    es: { title: 'Camina en integridad', verseRef: 'Proverbios 10:9', verseText: 'El que camina en integridad anda confiado.', reflection: 'La integridad no es perfección, es coherencia entre lo que dices y lo que haces cuando nadie te ve. Esa coherencia te da una paz que nada más ofrece.' },
    en: { title: 'Walk in Integrity', verseRef: 'Proverbs 10:9', verseText: 'Whoever walks in integrity walks securely.', reflection: 'Integrity isn\u2019t perfection — it\u2019s consistency between what you say and do when no one\u2019s watching. That consistency gives a peace nothing else offers.' }
  },
  {
    id: 'renovacion-01',
    es: { title: 'Nuevas misericordias', verseRef: 'Lamentaciones 3:22-23', verseText: 'Nuevas son cada mañana; grande es tu fidelidad.', reflection: 'Ayer terminó, con sus fallas y sus victorias. Hoy Dios te ofrece misericordias frescas, no reciclaje de tus errores pasados.' },
    en: { title: 'New Mercies', verseRef: 'Lamentations 3:22-23', verseText: 'They are new every morning; great is your faithfulness.', reflection: 'Yesterday is over, with its failures and its victories. Today God offers you fresh mercies — not a recycling of your past mistakes.' }
  },
  {
    id: 'descanso-01',
    es: { title: 'Venid a mí y descansad', verseRef: 'Mateo 11:28', verseText: 'Venid a mí todos los que estáis trabajados y cargados, y yo os haré descansar.', reflection: 'El descanso que Cristo ofrece no depende de que termines todas tus tareas; depende de que vengas a Él tal como estás, cansado.' },
    en: { title: 'Come to Me and Rest', verseRef: 'Matthew 11:28', verseText: 'Come to me, all you who are weary and burdened, and I will give you rest.', reflection: 'The rest Christ offers doesn\u2019t depend on finishing every task — it depends on coming to Him just as you are, tired.' }
  },
  {
    id: 'provision-01',
    es: { title: 'Mi Dios suplirá', verseRef: 'Filipenses 4:19', verseText: 'Mi Dios, pues, suplirá todo lo que os falta conforme a sus riquezas en gloria en Cristo Jesús.', reflection: 'La provisión de Dios no siempre llega como lo imaginas, pero llega según sus riquezas, no según tu escasez.' },
    en: { title: 'My God Will Supply', verseRef: 'Philippians 4:19', verseText: 'And my God will meet all your needs according to the riches of his glory in Christ Jesus.', reflection: 'God\u2019s provision doesn\u2019t always arrive the way you imagine, but it arrives according to His riches, not your lack.' }
  },
  {
    id: 'proteccion-01',
    es: { title: 'Bajo sus alas', verseRef: 'Salmos 91:4', verseText: 'Con sus plumas te cubrirá, y debajo de sus alas estarás seguro.', reflection: 'La protección de Dios no siempre elimina la tormenta, pero sí te da un refugio en medio de ella.' },
    en: { title: 'Under His Wings', verseRef: 'Psalm 91:4', verseText: 'He will cover you with his feathers, and under his wings you will find refuge.', reflection: 'God\u2019s protection doesn\u2019t always remove the storm, but it does give you a refuge in the middle of it.' }
  },
  {
    id: 'unidad-01',
    es: { title: 'Un solo cuerpo', verseRef: '1 Corintios 12:27', verseText: 'Vosotros sois el cuerpo de Cristo, y miembros cada uno en particular.', reflection: 'No fuiste diseñado para caminar solo la fe. Cada parte del cuerpo importa, incluida la tuya.' },
    en: { title: 'One Body', verseRef: '1 Corinthians 12:27', verseText: 'Now you are the body of Christ, and each one of you is a part of it.', reflection: 'You weren\u2019t designed to walk out your faith alone. Every part of the body matters — including yours.' }
  },
  {
    id: 'proposito-01',
    es: { title: 'Creados para buenas obras', verseRef: 'Efesios 2:10', verseText: 'Porque somos hechura suya, creados en Cristo Jesús para buenas obras.', reflection: 'No eres un accidente ni un proyecto inacabado. Fuiste creado con propósito, y ese propósito se revela paso a paso.' },
    en: { title: 'Created for Good Works', verseRef: 'Ephesians 2:10', verseText: 'For we are God\u2019s handiwork, created in Christ Jesus to do good works.', reflection: 'You aren\u2019t an accident or an unfinished project. You were created with purpose, and that purpose is revealed step by step.' }
  },
  {
    id: 'disciplina-01',
    es: { title: 'La disciplina que forma', verseRef: 'Hebreos 12:11', verseText: 'Ninguna disciplina al presente parece ser causa de gozo, sino de tristeza; pero después da fruto apacible de justicia.', reflection: 'La corrección de Dios no busca castigarte, busca formarte. El fruto llega después, aunque el proceso duela.' },
    en: { title: 'Discipline That Shapes', verseRef: 'Hebrews 12:11', verseText: 'No discipline seems pleasant at the time, but painful. Later on, however, it produces a harvest of righteousness and peace.', reflection: 'God\u2019s correction isn\u2019t meant to punish you — it\u2019s meant to shape you. The fruit comes later, even when the process hurts.' }
  },
  {
    id: 'libertad-01',
    es: { title: 'Libres de verdad', verseRef: 'Juan 8:36', verseText: 'Así que, si el Hijo os libertare, seréis verdaderamente libres.', reflection: 'La verdadera libertad no es hacer lo que quieras, es ser liberado de lo que te esclavizaba por dentro.' },
    en: { title: 'Free Indeed', verseRef: 'John 8:36', verseText: 'So if the Son sets you free, you will be free indeed.', reflection: 'True freedom isn\u2019t doing whatever you want — it\u2019s being released from what enslaved you on the inside.' }
  },
  {
    id: 'identidad-01',
    es: { title: 'Hechura admirable', verseRef: 'Salmos 139:14', verseText: 'Te alabaré; porque formidables, maravillosas son tus obras.', reflection: 'Antes de que alguien opinara sobre ti, Dios ya te había formado con cuidado. Tu identidad no depende de la opinión ajena.' },
    en: { title: 'Wonderfully Made', verseRef: 'Psalm 139:14', verseText: 'I praise you because I am fearfully and wonderfully made.', reflection: 'Before anyone had an opinion about you, God had already formed you with care. Your identity doesn\u2019t depend on others\u2019 opinions.' }
  },
  {
    id: 'batalla-01',
    es: { title: 'No contra sangre y carne', verseRef: 'Efesios 6:12', verseText: 'Porque no tenemos lucha contra sangre y carne, sino contra principados, contra potestades.', reflection: 'Algunas batallas no se ganan discutiendo con personas, se ganan de rodillas. Reconoce hoy dónde está la verdadera lucha.' },
    en: { title: 'Not Against Flesh and Blood', verseRef: 'Ephesians 6:12', verseText: 'For our struggle is not against flesh and blood, but against the rulers, against the authorities.', reflection: 'Some battles aren\u2019t won by arguing with people — they\u2019re won on your knees. Recognize today where the real fight is.' }
  },
  {
    id: 'familia-01',
    es: { title: 'Como para el Señor', verseRef: 'Colosenses 3:23', verseText: 'Y todo lo que hagáis, hacedlo de corazón, como para el Señor y no para los hombres.', reflection: 'Ya sea en casa, en el trabajo o en clase, lo que haces hoy tiene valor cuando se lo ofreces a Dios primero.' },
    en: { title: 'As Working for the Lord', verseRef: 'Colossians 3:23', verseText: 'Whatever you do, work at it with all your heart, as working for the Lord.', reflection: 'Whether at home, work, or school, what you do today has value when you offer it to God first.' }
  },
  {
    id: 'ansiedad-01',
    es: { title: 'Echad vuestra ansiedad', verseRef: '1 Pedro 5:7', verseText: 'Echando toda vuestra ansiedad sobre él, porque él tiene cuidado de vosotros.', reflection: 'No tienes que cargar solo lo que te preocupa. Dios no solo te invita a soltarlo, promete que le importa.' },
    en: { title: 'Cast Your Anxiety', verseRef: '1 Peter 5:7', verseText: 'Cast all your anxiety on him because he cares for you.', reflection: 'You don\u2019t have to carry what worries you alone. God doesn\u2019t just invite you to let it go — He promises He cares.' }
  },
  {
    id: 'tentacion-01',
    es: { title: 'Una salida', verseRef: '1 Corintios 10:13', verseText: 'Fiel es Dios, que no os dejará ser tentados más de lo que podéis resistir, sino que dará también juntamente con la tentación la salida.', reflection: 'Ninguna tentación te toma por sorpresa a Dios. Siempre hay una salida, aunque en el momento sea difícil verla.' },
    en: { title: 'A Way Out', verseRef: '1 Corinthians 10:13', verseText: 'God is faithful; he will not let you be tempted beyond what you can bear. But when you are tempted, he will also provide a way out.', reflection: 'No temptation catches God by surprise. There\u2019s always a way out, even when it\u2019s hard to see in the moment.' }
  },
  {
    id: 'arrepentimiento-01',
    es: { title: 'Un corazón contrito', verseRef: 'Salmos 51:17', verseText: 'Al corazón contrito y humillado no despreciarás tú, oh Dios.', reflection: 'Dios no rechaza a quien viene con un corazón sincero, aunque llegue quebrantado. Ese es el mejor punto de partida.' },
    en: { title: 'A Broken Heart', verseRef: 'Psalm 51:17', verseText: 'A broken and contrite heart you, God, will not despise.', reflection: 'God doesn\u2019t reject anyone who comes with a sincere heart, even a broken one. That\u2019s the best starting point.' }
  },
  {
    id: 'eternidad-01',
    es: { title: 'Una esperanza eterna', verseRef: 'Juan 3:16', verseText: 'Para que todo aquel que en él cree, no se pierda, mas tenga vida eterna.', reflection: 'Lo que vives hoy no es todo lo que hay. Hay una esperanza que va más allá de esta vida, y está al alcance de todos.' },
    en: { title: 'An Eternal Hope', verseRef: 'John 3:16', verseText: 'That whoever believes in him shall not perish but have eternal life.', reflection: 'What you\u2019re living today isn\u2019t all there is. There\u2019s a hope that goes beyond this life, and it\u2019s within everyone\u2019s reach.' }
  },
  {
    id: 'fidelidad-01',
    es: { title: 'Grande es su fidelidad', verseRef: 'Salmos 36:5', verseText: 'Hasta los cielos llega tu misericordia, y hasta las nubes tu fidelidad.', reflection: 'Cuando tu fe se siente pequeña, la fidelidad de Dios sigue siendo grande. No depende de tu constancia, sino de la suya.' },
    en: { title: 'Great Is His Faithfulness', verseRef: 'Psalm 36:5', verseText: 'Your love, Lord, reaches to the heavens, your faithfulness to the skies.', reflection: 'When your faith feels small, God\u2019s faithfulness remains great. It doesn\u2019t depend on your consistency, but on His.' }
  },
  {
    id: 'adoracion-01',
    es: { title: 'En espíritu y en verdad', verseRef: 'Juan 4:24', verseText: 'Dios es Espíritu; y los que le adoran, en espíritu y en verdad es necesario que adoren.', reflection: 'La adoración va más allá de una canción; es la postura del corazón que reconoce quién es Dios en medio de tu día.' },
    en: { title: 'In Spirit and Truth', verseRef: 'John 4:24', verseText: 'God is spirit, and his worshipers must worship in the Spirit and in truth.', reflection: 'Worship is more than a song — it\u2019s the posture of a heart that recognizes who God is in the middle of your day.' }
  },
  {
    id: 'consagracion-01',
    es: { title: 'Templos del Espíritu', verseRef: '1 Corintios 6:19', verseText: '¿O ignoráis que vuestro cuerpo es templo del Espíritu Santo?', reflection: 'Cómo cuidas tu cuerpo, tus pensamientos y tu tiempo importa, porque Dios ya habita ahí. Hoy es una buena oportunidad para tratarte con ese honor.' },
    en: { title: 'Temples of the Spirit', verseRef: '1 Corinthians 6:19', verseText: 'Do you not know that your bodies are temples of the Holy Spirit?', reflection: 'How you care for your body, thoughts, and time matters, because God already dwells there. Today\u2019s a good chance to treat yourself with that honor.' }
  },
  {
    id: 'mansedumbre-01',
    es: { title: 'Mansos de corazón', verseRef: 'Mateo 11:29', verseText: 'Aprended de mí, que soy manso y humilde de corazón, y hallaréis descanso para vuestras almas.', reflection: 'La mansedumbre no es debilidad, es fuerza bajo control. Aprender de Cristo en esto trae un descanso que la lucha constante no da.' },
    en: { title: 'Gentle of Heart', verseRef: 'Matthew 11:29', verseText: 'Learn from me, for I am gentle and humble in heart, and you will find rest for your souls.', reflection: 'Gentleness isn\u2019t weakness — it\u2019s strength under control. Learning this from Christ brings a rest constant striving never gives.' }
  },
  {
    id: 'esperanza-viva-01',
    es: { title: 'Esperanza viva', verseRef: '1 Pedro 1:3', verseText: 'Nos hizo renacer para una esperanza viva, por la resurrección de Jesucristo de los muertos.', reflection: 'Tu esperanza no está basada en que las circunstancias mejoren, sino en que Cristo ya venció la muerte. Eso la hace viva, no un simple optimismo.' },
    en: { title: 'A Living Hope', verseRef: '1 Peter 1:3', verseText: 'He has given us new birth into a living hope through the resurrection of Jesus Christ from the dead.', reflection: 'Your hope isn\u2019t based on circumstances improving — it\u2019s based on Christ already conquering death. That\u2019s what makes it living, not mere optimism.' }
  }
];

// Expose globally (no ES module syntax, matches the rest of the codebase)
if (typeof window !== 'undefined') {
  window.DAILY_DEVOTIONALS = DAILY_DEVOTIONALS;
}