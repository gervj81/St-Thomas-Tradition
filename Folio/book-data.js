// Shared book data for all three prototypes.
// Real titles + actual opening text from the manuscript;
// later paragraphs are placeholders so navigation feels complete.

window.BOOK = {
  title: "St. Thomas Tradition",
  subtitle: "A Step-by-Step Historical Analysis",
  author: "Gerald Johnson",
  description: "A rigorous historical reconstruction of the apostolic era — tracing the Thomas tradition through trade routes, diaspora, and centuries of memory.",
  parts: [
    {
      id: "front",
      label: "Front Matter",
      chapters: ["title", "preface"],
    },
    {
      id: "part-1",
      label: "Part I",
      title: "Origins and the Commonwealth",
      subtitle: "The First Fifteen Centuries · 1st c. BCE – 1498 CE",
      chapters: [
        "part-1-intro",
        "chapter-01",
        "chapter-02",
        "chapter-03",
        "chapter-04",
        "part-1-synthesis",
      ],
    },
    {
      id: "part-2",
      label: "Part II",
      title: "The Long Disruption",
      subtitle: "The Padroado and the Colonial Centuries · 1498 – 1947 CE",
      chapters: [
        "part-2-intro",
        "chapter-05",
        "chapter-06",
        "chapter-07",
        "chapter-08",
        "chapter-09",
        "chapter-10",
      ],
    },
  ],
  chapters: {
    "title": {
      title: "Title Page",
      kind: "title",
    },
    "preface": {
      title: "Preface",
      subtitle: "Setting the Stage",
      kind: "preface",
      excerpt: "History is often written backward, tracing the monumental institutions of the present to their inevitable origins in the past. But history was not lived forward, by individuals navigating the immediate realities, the physical constraints, and the immense complexities of the worlds they inhabited.",
      paragraphs: [
        "History is often written backward, tracing the monumental institutions of the present to their inevitable origins in the past. But history was not lived backward. It was lived forward, by individuals navigating the immediate realities, the physical constraints, and the immense complexities of the worlds they inhabited.",
        "The tradition that St. Thomas the Apostle travelled past the boundaries of the Roman Empire to establish the Christian faith in India is one of the oldest, most resilient, and most debated narratives in historical theology. For centuries, it has been dismissed by skeptics as pious legend, and defended by believers as unquestionable truth. This book attempts something different: it subjects the tradition to a rigorous, step-by-step historical analysis.",
        "We begin not with texts and theology, but with geography and trade. Before asking <em>if</em> Thomas went to India, we must first firmly establish <em>how</em> anyone could have gone to India. By mapping the commercial and linguistic realities of the 1st century CE, we reconstruct the cosmopolitan matrix that connected the Mediterranean basin to the Malabar Coast.",
        "From there, we will follow the threads of evidence — archaeological, textual, and ecclesiastical — through the centuries, watching how a deeply rooted tradition was passed down through the Syriac-speaking world, eventually solidifying into the institutional identity of the St. Thomas Christians of Kerala.",
        "This is not a work of apologetics. It is a work of historical reconstruction. It invites the reader to walk the ancient routes, read the surviving clues, and weigh the balance of probability for themselves.",
      ],
      signoff: "— Gerald Johnson",
    },
    "part-1-intro": {
      title: "Part I: Origins and the Commonwealth",
      subtitle: "The First Fifteen Centuries, 1st c. BCE – 1498 CE",
      kind: "part-intro",
      excerpt: "The first fifteen centuries of the Thomas Christian community present a unique historiographical challenge: genuine documentary scarcity.",
      paragraphs: [
        "The first fifteen centuries of the Thomas Christian community present a unique historiographical challenge: genuine documentary scarcity. The primary evidence is sparse, scattered, and often temporally remote from the events it purports to describe. How does a historian reason honestly when the evidentiary ground is thin and the gap between tradition and attestation is measured in centuries?",
        "To navigate this landscape, Part I employs a three-tier analytical framework: the Legend, the Plausible, and the Historical. This section traces the community from its origins within the broader interconnected world of late antiquity to the eve of the Portuguese arrival.",
      ],
    },
    "chapter-01": {
      number: 1,
      title: "The Cosmopolitan Matrix",
      subtitle: "1st Century BCE – 1st Century CE",
      excerpt: "Before tracing the apostle, we must trace the trade routes. The Indian subcontinent was not an isolated peninsula, but a vital node in a cosmopolitan matrix.",
      hasMap: true,
      htmlFile: "chapter-01",
      keywords: ["trade routes", "Roman Empire", "Parthia", "Malabar"],
      paragraphs: [
        "Before tracing the apostle, we must trace the trade routes. The Indian subcontinent was not an isolated peninsula, but a vital node in an extensive and intricate cosmopolitan matrix. By mapping the commercial, maritime, and cultural exchanges between the Roman, Parthian, and Indian worlds, this chapter establishes the physical plausibility and the practical means by which early Christianity could have reached the Malabar coast.",
        "Strabo records 120 ships per year making the crossing from Egypt to India. The entire voyage Alexandria → Muziris took approximately 90–100 days. This was not occasional contact; it was industrial-scale trade.",
        "The Parthian Empire was the great middleman — all overland trade between Rome and India was mediated through Parthian territory. Greek and Aramaic between them covered virtually the entire inhabited world from Britain to India. For a 1st-century apostle, these were not foreign languages.",
      ],
    },
    "chapter-02": {
      number: 2,
      title: "The Apostolic Imprint",
      subtitle: "Text, Memory, and Geography · 1st – 6th c. CE",
      excerpt: "This chapter directly addresses the core tradition: the mission, martyrdom, and legacy of St. Thomas.",
      hasMap: true,
      keywords: ["Acts of Thomas", "Edessa", "Mylapore", "patristic"],
      paragraphs: [
        "This chapter directly addresses the core tradition of the community: the mission, martyrdom, and legacy of St. Thomas. Analyzing texts such as the Acts of Judas Thomas alongside patristic memory, the Edessan relic cult, and geographical evidence, this section navigates the delicate boundary between theological memory and verifiable history.",
        "The Acts of Thomas survives in two recensions — Syriac and Greek — sharing a common core that places Thomas's mission in the kingdom of Gondophares, an Indo-Parthian ruler whose existence was once doubted and is now firmly attested by coins and inscriptions.",
      ],
    },
    "chapter-03": {
      number: 3,
      title: "The Tomb, the Trade, and the Long Silence",
      subtitle: "c. 550 – 883 CE",
      excerpt: "From the mid-sixth to the late-ninth century, the narrative encounters what is often perceived as a documentary silence. Yet, this silence was not an absence.",
      keywords: ["Pahlavi crosses", "copper plates", "Church of the East"],
      paragraphs: [
        "From the mid-sixth to the late-ninth century, the narrative encounters what is often perceived as a documentary silence. Yet, as this chapter demonstrates, this silence was not an absence. This era saw the deepening integration of the Thomas Christians within the mercantile and political structures of South India.",
        "The Pahlavi-inscribed crosses of Kottayam, Kadamattom, and Mylapore — together with the Tharisapalli copper plates of the 9th century — testify to a community fully embedded in the Indian Ocean economy and the Church of the East.",
      ],
    },
    "chapter-04": {
      number: 4,
      title: "The Legend, the Witnesses, and the Collision",
      subtitle: "1037 – 1498 CE",
      excerpt: "The Thomas Christians became an acknowledged feature of the global Christian imagination, entwined with the legend of Prester John.",
      keywords: ["Prester John", "Marco Polo", "Vasco da Gama"],
      paragraphs: [
        "During this period, the Thomas Christians became an acknowledged feature of the global Christian imagination, appearing in the accounts of European and West Asian travelers, and inextricably entwined with the legend of Prester John.",
        "This visibility set the stage for the dramatic collision that would follow the arrival of Vasco da Gama's fleet in 1498, concluding the community's era of autonomy.",
      ],
    },
    "part-1-synthesis": {
      title: "Part I: Grand Synthesis",
      subtitle: "Fifteen centuries before 1498",
      kind: "part-synthesis",
      excerpt: "What the long arc demonstrates: a continuous, living communion that thrived in the unique cultural ecosystem of the Indian Ocean.",
      paragraphs: [
        "What the long arc demonstrates is a continuous, living communion that thrived in the unique cultural ecosystem of the Indian Ocean for more than a millennium before the arrival of European colonial powers.",
      ],
    },
    "part-2-intro": {
      title: "Part II: The Long Disruption",
      subtitle: "1498 – 1947 CE",
      kind: "part-intro",
      excerpt: "The arrival of Vasco da Gama's fleet did not encounter an isolated community. It encountered a sophisticated, self-governing Church.",
      paragraphs: [
        "The arrival of Vasco da Gama's fleet in 1498 did not encounter an isolated, primitive community in need of rescue. It encountered a sophisticated, self-governing Church embedded in an ancient commercial world. What followed was not contact but collision.",
      ],
    },
    "chapter-05": {
      number: 5,
      title: "Prelude to the Padroado",
      subtitle: "The Iberian Stage Before Goa",
      excerpt: "To understand what the Portuguese brought to Malabar, we must first understand what they were carrying out of Iberia.",
      keywords: ["Reconquista", "Padroado", "Iberia"],
      paragraphs: [
        "To understand what the Portuguese brought to Malabar, we must first understand what they were carrying out of Iberia: a militant, crusading Catholicism forged in eight centuries of Reconquista.",
      ],
    },
    "chapter-06": {
      number: 6,
      title: "The Colonial Fantasy and the Red Staff",
      subtitle: "1498 – 1542",
      excerpt: "Vasco da Gama landed at Calicut expecting to find Prester John. He found Thomas Christians. He understood neither.",
      keywords: ["Vasco da Gama", "Calicut", "Prester John"],
      paragraphs: [
        "Vasco da Gama landed at Calicut in 1498 expecting to find the kingdom of Prester John. He found, instead, the Thomas Christians of Malabar — and proceeded to misunderstand them in ways that would shape four centuries of relations.",
      ],
    },
    "chapter-07": {
      number: 7,
      title: "The Empire of Souls",
      subtitle: "The Synod of Diamper and After · 1599",
      excerpt: "The Synod of Diamper attempted, in eight days, to undo fifteen centuries of an autonomous Eastern church.",
      keywords: ["Synod of Diamper", "Menezes", "Latinization"],
      paragraphs: [
        "The Synod of Diamper, convened by Archbishop Aleixo de Menezes in June 1599, attempted in eight days to undo fifteen centuries of an autonomous Eastern church. Its decrees burned books, redrew liturgies, and severed the Thomas Christians from their ancient Syriac patriarchate.",
      ],
    },
    "chapter-08": {
      number: 8,
      title: "Shadow Worlds",
      subtitle: "The Coonan Cross and the Great Schism · 1653",
      excerpt: "On 3 January 1653, the community gathered at the Coonan Cross in Mattancherry and swore, by touching a rope tied to the cross, never again to submit to Jesuit authority.",
      keywords: ["Coonan Cross", "Mattancherry", "schism"],
      paragraphs: [
        "On 3 January 1653, the community gathered at the Coonan Cross in Mattancherry and swore, by touching a rope tied to the leaning stone cross, never again to submit to Jesuit authority. The Great Schism had arrived.",
      ],
    },
    "chapter-09": {
      number: 9,
      title: "The New Instrument",
      subtitle: "Carmelites, Dutch, and the Reorganization",
      excerpt: "After 1653, Rome shifted strategies. Out went the Padroado Jesuits; in came the Propaganda Fide Carmelites.",
      keywords: ["Carmelites", "Propaganda Fide", "Dutch VOC"],
      paragraphs: [
        "After the catastrophe of 1653, Rome shifted strategies. Out went the heavy-handed Padroado Jesuits; in came the Propaganda Fide Carmelites — softer in approach, equally insistent in goal.",
      ],
    },
    "chapter-10": {
      number: 10,
      title: "The Collapsed Sword",
      subtitle: "British Patronage and the Long Reorganization",
      excerpt: "When the Padroado finally collapsed in the nineteenth century, what filled the vacuum was not freedom but new patrons.",
      hasMap: true,
      keywords: ["British Raj", "CMS", "Mar Thoma"],
      paragraphs: [
        "When the Padroado finally collapsed under its own contradictions in the nineteenth century, what filled the vacuum was not freedom but new patrons: the British Raj, the Anglican CMS missionaries, and a fragmenting set of internal reform movements that would produce the modern denominational landscape.",
      ],
    },
  },
};
