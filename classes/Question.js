const Helper = new (require("./Helper.js"))();

module.exports = class Question {

  constructor() {
    this.question = "";
    this.answer = "";
    this.askedArray = [];
    this.questionnaireString = `=============================================================\n\t\t\t\t\t\t\t\t\t\tCheat Sheet (${this.getLength()} questions)\n=============================================================\n`;
  }

  resetReviewer() {
    this.questionnaireString = `=============================================================\n\t\t\t\t\t\t\t\t\t\tCheat Sheet (${this.getLength()} questions)\n=============================================================\n`;
  }

  reset() {
    this.question = "";
    this.answer = "";
    this.askedArray = [];
  }

  alreadyAsked(question) {
    if (this.askedArray.includes(question)) {
      return true;
    }
    this.askedArray.push(question);
    return false;
  }

  rollQuestion() {
    const newQuestion = Helper.randomProperty(this.questionAndAnswer());
    this.question = newQuestion.key;
    this.answer = newQuestion.value;
  }
  
  getQuestion() {
    return this.question;
  }

  getAnswer() {
    return this.answer;
  }

  getLength() {
    return Object.keys(this.questionAndAnswer()).length;
  }

  questionAndAnswer() {
    return {
      // elements of art
      "Are fundamental visual components that artists use to create works of art. These elements are the building blocks of artistic expression and are essential to understanding and appreciating art.":"Elements of Art",
      "Are marks made on a surface. They can be straight, curved, wavy, thick, thin, or broken. It can create boundaries, define shapes, and add movement to a composition.":"Line",
      "Are two-dimensional, enclosed areas. They can be geometric (e.g., circles, squares) or organic (irregular and freeform). They are the foundation of all visual art.":"Shape",
      "Refers to the three-dimensional quality of an object, creating the illusion of depth and volume. Artists use techniques like shading and perspective to achieve this.":"Form",
      "Is the visual element produced by the different wavelengths of light. It can convey emotion, set the mood, and create visual interest in art. It can be categorized into primary, secondary, and tertiary.":"Color",
      "Refers to the range of lightness and darkness in an artwork. It is achieved through contrast, shading, and the use of different tones. It is crucial for creating dimension and depth.":"Value",
      "Is the surface quality or tactile feel of an object in an artwork. It can be real, implied, or simulated. It can add richness and depth to a composition.":"Texture",
      "Refers to the area in and around objects within a composition. It can be two-dimensional (positive and negative space) or three-dimensional (depth and perspective). It creates the illusion of distance and depth.":"Space",
          "> The way the artist use the elements of the art to make an effect, to depict and deliver clearly the idea of the artist. An artist may not use all of it but using one can connect and be related with the other.\n\n-MARDER, 2019":"Principles of Art",
      "Is the distribution of visual weight in a work of art. It can be symmetrical, asymmetrical, and radial symmetry.":"Balance",
      "Involves the juxtaposition of different elements to create visual interest. It can be achieved through variations in color, value, texture, and more.":"Contrast",
      "Repetition of lines, shapes, and colors used in artwork.":"Pattern",
      "Directs the viewer's attention to a specific area or focal point within the artwork. It is often achieved through color, size, or placement of elements.":"Emphasis",
      "Is the sense of wholeness or coherence in an artwork. It is achieved when all elements work together harmoniously to convey a single idea or message.":"Unity",
      "Involves the relationship between the sizes and scale of different elements within an artwork. It is essential for creating a sense of realism and balance.":"Proportion",
      "A visual element that makes an effect of actions or motions.":"Rythm",
      // art criticism
      "Is an art movement that emphasizes the depiction of the world as it is, without idealization or exaggeration.":"Realism",
      "Is an art movement that emphasizes the use of abstract forms and shapes to create a visual langauge that is independent of representation.":"Abstractionism",
      "[blank] and caricature are techniques used to exaggerate certain features of a subject in order to create a more expressive or humorous portrayal.":"Distortion",
      "Used in art to stretch the subject, creating a distorted or exaggerated effect.":"Elongation",
      "Breaking down forms into geometric shapes and reassembling them in a new way.":"Cubism",
      "A misconception about [blank] is that it was always referred to as an act of commenting only about an artwork or pointing out what is wrong.":"Art Criticism",
      "How many steps are there in art criticism?":"4",
      "Describe what you see, the elements.":"Description",
      "Determining what the elements are suggesting":"Analysis",
      "Overall meaning of the work by pointing to evidence inside the work, historical context clues.":"Interpretation",
      "judgment. (One of the steps in art criticism)":"Evaluation",
      // art history
      "Is the study of art objects in their historical context. It involves more than just cataloging art movements chronologically; it delves into the analysis of the significance of visual arts such as painting, sculpture, and architecture within the time of their creation.":"Art History",
      "refers to the prehistoric period of stone tool usage. Notably, it's recognized for its cave paintings depicting the hunting of animals like reindeer and bison during the Ice Age.":"Paleolithic",
      "bridging the Upper Paleolithic and the Neolithic, was marked by climatic fluctuations. [blank] art, primarily geometric, featured a limited color palette, often centered around red ochre. Artifacts included painted pebbles, ground stone beads, pierced shells and teeth, as well as amber.":"Mesolithic",
      "refers to the prehistoric period of stone tool usage. Notably, it's recognized for its cave paintings depicting the hunting of animals like reindeer and bison during the Ice Age.":"Neolithic",
      "refers to paintings and engravings in European caves dating from the Ice Age (Upper Paleolithic), about 40,000 to 14,000 years ago. Also termed \"parietal art\" or \"Ice Age rock art\". It encompasses any human-made images on cave or rock shelter walls, ceilings, or floors.":"Cave Art",
      "In this period, Greek city-states saw competition among artists for commissions to create religious and civic buildings, sculptures, and ceramics. It marked the emergence of freestanding sculptures, with early life-size figures known as \"kouros\" and \"kore\". Greek pottery evolved to include narrative and decorative elements. Temple architecture became more refined, with three classical Greek orders: Doric, Ionic, and Corinthian.":"Archaic",
      "After repelling the Persian threat, Greek art and architecture embraced a naturalistic style that embodied the Classical Greek ideal of human self-reliance. This era displayed regularity and ideal proportionality in temple design and sculpture, such as the Riace Bronze.":"Classical",
      "[blank] art, spanning from 5000 BCE to 300 AD, featured stylized and symbolic works in painting, sculpture, and architecture. Tombs and monuments emphasized life, death, and preserving knowledge of the past. Monumental sculpture and delicate smaller pieces were created using sunk relief techniques.":"Egyptian",
      "[blank] art of the Republican period focused on civil and political ideals and leaders. Roman artists admired Greek craftsmanship and adopted Greek proportions and architectural orders. They combined Greek idealism with realistic portraits in sculpture and built spectacular temples, palaces, and monuments, with a focus on city planning and concrete construction.":"Roman",
      "The [blank] period, spanning the 11th and 12th centuries, featured Western European structures reminiscent of ancient Roman forms, including rounded arches and thick masonry walls. Thousands of churches were built for pilgrims. Stone masonry vaulting replaced wooden roofs in earlier Christian basilicas, and artistic expressions included wall painting, manuscript illumination, enamel work, and ivory carving. An example is the Cathedral of Speyer in Germany.":"Romanesque",
      "[blank] art, the painting, sculpture, and architecture characteristic of the second of two great international eras that flourished in western and central Europe during the Middle Ages. [blank] art evolved from Romanesque art and lasted from the mid-12th century to as late as the end of the 16th century in some areas.":"Gothic",
      "The term \"[blank]\" derived from the French word for \"rebirth\" denotes a significant period in Europe recognized for a resurgence of Greek and Roman ideals, including an increased usage of classical artistic forms. The rise of a middle class comprising merchants and bankers provided newfound support for the arts.":"Renaissance",
      "Although the majority of paintings and sculptures continued to depict religious themes, they were now presented in earthly settings rather than celestial ones. Renaissance artists moved away from the flat, abstract backdrops of many medieval works, creating scenes with naturalistic landscapes and employing mathematical perspective. Artists like Jan Van Eyck (Flemish) and Masaccio (Italian) exemplify these techniques in their works.":"Early Renaissance",
      "This era marked an intense phase of artistic development. Florence and Rome were prominent hubs of artistic production, while equally significant work emerged from Northern Europe. Under the patronage of influential popes, artists like Raphael produced celebrated frescoes, such as the School of Athens (c. 1510 – 12) in the Vatican palace. Oil painting gained popularity, enabling artists to create shimmering effects and dramatic chiaroscuro.":"High Renaissance",
      "Introduced twisting and unstable forms in art and architecture, departing from the regularity and symmetry of the preceding period. Artists adopted a bold, colorful style, often elongating or contorting the human body, exemplified in works like \"The Burial of Count Orgaz\" (1586) by El Greco. This style is often termed Mannerist, characterized by an exaggerated stylization drawing attention to itself, reflecting a sort of \"art for art's sake\". Notable examples include the completion of the new basilica of St. Peter in Rome by Michelangelo (1546 – 1564) and Giacomo Della Porta (1590 – 1593).":"Late Renaissance",
      "Artists in France embraced symmetrical and rectilinear forms, depicting Republican themes with works like the Arc de Triomphe.":"Neoclassicism",
      "Romantic artists rebelled against strict rationality, focusing on nature, dramatic emotions, and individual isolation, exemplified by paintings like \"Monk by the Sea\" by Caspar David Friedrich.":"Romanticism",
      "Realist painters portrayed everyday life and workers, highlighting the vanishing culture of the time, as seen in Edouard Manet's painting \"Olympia\".":"Realism",
      "Impressionists captured modern life elements using loose brushstrokes, while Post-impressionists like George Seurat experimented with pointillism. Railroads and factories became subjects of art, representing new architectural forms.":"Impressionism",
      // art history (continued)
      "Is a literary and cultural international movement which flourished in the first decades of the 20th century. Modernism is not a term to which a single meaning can be ascribed. It may be applied both to the content and to the form of a work, or to either in isolation.":"Modernism",
      "Can be seen as a reaction against the ideas and values of modernism, as well as a description of the period that followed modernism's dominance in cultural theory and practice in the early and middle decades of the 20th century.":"Postmodernism",
      "[blank] art has varied throughout its ancient history, divided into periods by the ruling dynasties of China and changing technology. [blank] art is art, whether modern or ancient, that originated in or is practiced in China or by [blank] artists or performers.":"Chinese",
      "[blank] art covers a wide range of art styles and media, including ancient pottery, sculpture, ink painting and calligraphy on silk and paper, ukiyo-e paintings and woodblock prints, ceramics, origami, and more recently manga and anime. It has a long history, ranging from the beginnings of human habitation in Japan, sometime in the 10th millennium BCE, to the present day.":"Japanese",
      "[blank] art consists of a variety of art forms, including painting, sculpture, pottery, and textile arts such as woven silk. Geographically, it spans the entire Indian subcontinent, including what is now India, Pakistan, Bangladesh, Sri Lanka, Nepal, and at times eastern Afghanistan. A strong sense of design is characteristic of Indian art and can be observed in its modern and traditional forms.":"Indian",
      "Earliest among the religious in themes and composed of 18th-century icons and images created by local artisans under the tutelage of the friars. The devotional pieces of the collection are of outstanding significance.":"Philippine Art History",
      "In the succeeding American period, Fernando C. Amorsolo, who was later declared as the First National Artist, rose into fame and established his style or \"school\" which was primarily  characterized by countryside scenery with golden sunlight. Example, La Descencion de Jesus.":"1900",
      "The period is represented by proliferation of genre themes, landscapes and still lifes as well as the emergence of pre-modernism.":"1920",
      "Artists represented in the collection: Victorio Edades, Diosdado Lorenzo, Galo Ocampo, Carlos Francisco, Gabriel Custodio, Vicente Manansala, Ricarte Purruganan, Romeo Tabuena, and others.":"1930",
      "A suspension on artistic activity was prevalent during the Japanese occupation. However, some visual artists still managed to produce artworks based on the atrocities brought by the  war. Artists represented in the collection: Dominador Castañeda, Demetrio Diego, Diosdado Lorenzo, Romeo Tabuena, Gene Cabrera and others.":"1942-1945",
      "After the Japanese occupation, the art community sprang back to life. Various themes and styles were explored and pioneered by Filipino artists who gained experience abroad. Mural painting emerged, spearheaded by Carlos Francisco. Art Association of the Philippines (AAP) was established in 1948.":"1946-1949",
      "The Philippine Art Gallery (PAG) was founded with young modernists as the leading figures. The emergence of different schools of thought (e.g. school of Botong Francisco, school of Manansala, development of the \"Mabini\" art group.":"1950",
      "Modern art reached its peak. Examples are Ink Fish, First Mass in Limasawa, Planting of the first Cross, Mother and Child paintings.":"1960",
      "Most of the artists in the 1960s continued to produce meaningful works in this period. The emergence of different movements such as People's Art or Art for the Masses, Protest Art, Social Realism, and the institutionalization of the National Artist Award (1972). 11 National Artists whose works are represented in the collection.":"1970",
      "The period is characterized by a revival of traditional art and ethnic art. Contemporary sculpture became an integral part of buildings and parks. Artists in the collection: Eduardo Castrillo, Ramon Orlina, Solomon Saprid, Raul Isidro, Red Mansueto, Charito Bitanga, Phillip Victor, Emilio Aguilar Cruz, Federico Alcuaz, Al Perez, Virginia T. Navarro, Abdul Mari Imao, Rey Paz Contreras, Jerusalino Araos, Norris Castillo, and others.":"1980",
      "The new generation of painters, sculptors and printmakers expressing their personal feelings and expressions emerged. The first art movement in Europe and the Americas gained entry to the local scene, such as installation art and experimental art. Galleries and museums were institutionalized spearheading activities in the cultural scene. Artists represented in the collection: Ibarra de la Rosa, Prudencio Lamarroza, Elizabeth Chan, Eduardo Castrillo, Pacita Abad, Fil de la Cruz, Romulo Galicano, Symfronio Y. Mendoza, Godofredo Y. Mendoza, Rafael Pacheco, and others.":"1990",
      "Philippine art has come a long way, from the primitive ingenuity of the Filipinos to the present Avante-Garde artists exploring all possible techniques. And in schools, ranging from the traditionalists, representation lists, abstractionists, abstract expressionists, semi-abstractionists, figurative expressionists, non-objectivists and other forms of -isms.Art today is an open forum of visual statements.":"2000 to present"
    };
  }
}
