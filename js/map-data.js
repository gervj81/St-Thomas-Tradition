// Shared map data — extracted from source. Used by all 3 directions.
window.MAP_DATA = (function(){

const tabInfo = {
  political: {
    title: 'The Political World · c. 50 CE',
    short: 'Overlapping empires of the 1st century CE.',
    text: 'The 1st century CE was a world of overlapping empires: Rome, Parthia, the Indo-Parthian kingdoms, and the South Indian polities. <strong>The Parthian Empire was the great middleman</strong> — all overland trade between Rome and India was mediated through Parthian territory.'
  },
  maritime: {
    title: 'The Maritime Web: Alexandria to Malabar',
    short: 'Nile → Red Sea → Arabia → monsoon crossing.',
    text: 'A four-stage chain: Nile → Red Sea → Arabia → monsoon crossing. <strong>Strabo records 120 ships per year</strong> making the crossing from Egypt to India. The entire voyage Alexandria → Muziris took ~90–100 days. The green line shows the Chinese-operated eastward extension.'
  },
  silkroad: {
    title: 'The Overland Silk Roads',
    short: "Chang'an to Antioch through Central Asia.",
    text: 'Running parallel to the maritime route, the Silk Road linked Chang\'an to Antioch through Central Asia and Parthian Mesopotamia. <strong>Its critical feature was not the silk but the human infrastructure</strong> — Aramaic, Sogdian, Jewish, Buddhist, and later Christian diaspora communities at every oasis.'
  },
  evidence: {
    title: 'Archaeological Evidence',
    short: 'Material proof of the trade — coins, pepper, graffiti.',
    text: '<strong>The trade was not a literary conceit — it was a physical reality.</strong> Roman coins of Augustus, Tiberius, Claudius and Nero across South India and Sri Lanka. A Tamil Brahmi graffito at Berenike, Egypt. Roman glass and coins in Han-dynasty tombs at Luoyang.'
  },
  languages: {
    title: 'Language Zones · c. 50 CE',
    short: 'Greek + Aramaic — a universal passport.',
    text: '<strong>Greek and Aramaic between them covered virtually the entire inhabited world from Britain to India.</strong> For a 1st-century apostle, these were not foreign languages — they were the languages of his community.'
  }
};

// Polygons
const POLY = {
  roman: [[44,-10],[44,-2],[43,3],[47,7],[48,8],[47,12],[45,14],[43,17],[41,20],[40,24],[41,29],[40,33],[37,37],[31,35],[29,34],[24,37],[22,35],[22,28],[30,13],[32,12],[36,9],[36,3],[35,-1],[35,-6],[36,-9],[38,-9],[44,-10]],
  britain: [[50,-5],[51,1],[53,0],[55,-1],[56,-5],[55,-4],[53,-4],[50,-5]],
  parthian: [[37,37],[40,40],[40,44],[38,48],[36,50],[37,55],[38,60],[37,63],[35,66],[32,67],[28,65],[25,60],[24,55],[24,50],[26,46],[30,42],[32,40],[35,38],[37,37]],
  indoParthian: [[37,63],[38,66],[40,70],[36,72],[34,72],[30,72],[27,68],[24,67],[22,72],[21,70],[23,65],[25,63],[28,62],[32,63],[35,63],[37,63]],
  chera: [[14.0,74.5],[14.0,75.0],[11.0,76.5],[8.5,77.0],[8.5,76.5],[11.0,76.0],[14.0,74.0]],
  cholaPandya: [[16.0,80.0],[16.0,78.0],[14.0,75.0],[11.0,76.5],[8.5,77.0],[8.5,77.5],[9.5,79.5],[12.0,80.0],[16.0,80.0]],
  arabia: [[30,34],[26,34],[22,38],[20,42],[22,45],[28,47],[32,40],[30,34]],
  greek: [[43,-9],[43,-3],[47,5],[48,8],[46,11],[43,16],[42,20],[40,25],[41,29],[40,33],[37,37],[36,36],[33,36],[31,35],[29,33],[24,37],[22,35],[20,29],[22,25],[25,15],[30,12],[32,12],[33,11],[36,8],[37,3],[36,-2],[35,-6],[37,-9],[43,-9]],
  greekEast: [[37,37],[38,42],[38,50],[37,60],[35,66],[32,67],[27,68],[22,72],[21,70],[24,65],[27,58],[25,60],[24,55],[24,50],[28,42],[35,38],[37,37]],
  aramaic: [[37,35],[40,38],[40,44],[38,50],[37,58],[38,64],[35,68],[30,68],[24,68],[22,72],[18,56],[12,46],[14,48],[20,42],[22,38],[24,37],[28,40],[30,38],[32,36],[37,35]],
  overlap: [[38,34],[38,40],[37,42],[36,42],[37,37],[36,36],[33,36],[31,35],[30,34],[31,33],[33,34],[36,36],[38,34]]
};

// Routes
const ROUTES = {
  nile: [[31.2,29.9],[30.08,31.24],[25.99,32.82]],
  desert: [[25.99,32.82],[23.9,35.5]],
  redSea: [[23.9,35.5],[21.5,38.5],[17.0,40.5],[13.0,43.2],[12.0,44.5],[13.5,47.0],[14.5,48.2]],
  monsoon: [[14.5,48.2],[12.5,54.0],[11.0,65.0],[10.5,74.0],[10.17,76.2]],
  returnVoyage: [[10.17,76.2],[11.0,65.0],[13.0,54.5],[14.5,48.2]],
  nwIndia: [[12.5,54.0],[18.0,60.0],[20.0,70.0],[20.7,71.5],[21.7,72.98]],
  persian: [[30.4,48.0],[27.0,51.0],[26.56,56.25],[24.0,60.0],[20.0,70.0],[20.7,71.5],[21.7,72.98],[15.0,73.0],[10.17,76.2]],
  palghat: [[10.17,76.2],[11.75,76.35],[11.0,77.5],[11.9,79.8]],
  deccan: [[21.7,72.98],[19.5,74.5],[15.5,76.5],[11.0,77.5]],
  kollamLanka: [[10.17,76.2],[8.8,76.4],[8.0,77.5],[8.5,78.5],[7.0,80.0]],
  lankaCircuit: [[11.9,79.8],[10.5,80.0],[9.0,80.5],[7.0,82.0],[6.0,80.5],[7.0,80.0]],
  chinese: [[7.0,80.0],[5.5,95.0],[3.14,101.69],[5.0,105.0],[9.0,107.5],[15.0,109.5],[18.5,107.0],[21.5,109.1]],
  silkMain: [[34.27,108.93],[39.5,94.0],[40.0,87.0],[40.5,80.0],[41.0,75.0],[39.65,66.96],[37.63,62.18],[37.9,57.0],[36.3,50.0],[33.1,44.6],[35.4,40.1],[37.16,38.79],[36.2,36.2]],
  silkPersian: [[37.63,62.18],[35.68,51.42],[32.66,51.67],[29.6,52.5],[30.2,47.8],[33.1,44.6]],
  silkIndia: [[39.65,66.96],[37.1,67.8],[34.5,69.2],[33.74,72.83],[30.8,70.0],[21.7,72.98]],
  silkCircuit: [[34.27,108.93],[28.0,108.0],[21.5,109.1]]
};

// City sets per layer
const CITIES = {
  political: [
    [41.9,12.5,'Rome','Roman Capital','Senators here knew India only as rhetorical abstraction — a drain on gold. Every Latin poet treating India as flourish had never met an Indian.','rome'],
    [31.2,29.9,'Alexandria','Roman Commercial Hub','Greek-speaking. Starting point for the India voyage. The world\'s largest Jewish diaspora.','rome'],
    [36.2,36.2,'Antioch','Roman Syria','Capital of Roman Syria. Greek-speaking. One of the first major Christian communities.','rome'],
    [37.16,38.79,'Edessa','Syriac Hinge City','Capital of Osroene. Syriac-Aramaic speaking. The city of the Thomas tradition.','hinge'],
    [31.77,35.23,'Jerusalem','Apostolic Origin','Bilingual: Aramaic in the streets, Greek in commerce.','hinge'],
    [33.1,44.6,'Ctesiphon','Parthian Capital','The overland trade entrepôt near Baghdad. Chinese silk, Indian spices, Arabian aromatics redistributed westward.','parthian'],
    [32.54,44.42,'Babylon','Jewish Diaspora Centre','The Babylonian Jewish diaspora maintained Aramaic trading networks across the entire arc.','parthian'],
    [34.55,38.28,'Palmyra','Desert Caravan City','A commercial power between Rome and Parthia.','arabia'],
    [30.4,48.0,'Charax Spasinu','Persian Gulf Emporium','The great emporium at the head of the Persian Gulf.','parthian'],
    [21.7,72.98,'Barygaza','NW Indian Port','Modern Bharuch. Premier port of NW India.','india'],
    [10.17,76.2,'Muziris','The Central Emporium','Not the edge of the trade network — the collection point. The midpoint of the Old World trade system.','india',10],
    [11.9,79.8,'Arikamedu','Coromandel Hinge','A manufacturing node in two overlapping commercial networks.','india',10],
    [33.74,72.83,'Taxila','Indo-Parthian Hub','Greek, Aramaic, and Kharosthi inscriptions found at the same site.','indoparth',9],
    [25.61,85.14,'Pataliputra','Mauryan Capital','Greek ambassador Megasthenes resided here c. 300 BCE.','india']
  ],
  maritime: [
    [31.2,29.9,'Alexandria','Stage 1 — Departure','Starting point. Greek-speaking commercial hub. 120 ships/year to India.','blue',10],
    [25.99,32.82,'Koptos','Nile Pivot','Where goods left Nile vessels for camel caravans.','blue',9],
    [26.10,34.25,'Myos Hormos','Major Red Sea Port','Northernmost major Roman port on the Red Sea.','rome',11],
    [23.9,35.5,'Berenike','Red Sea Gateway','7.55kg of black pepper in one container. Tamil Brahmi graffito.','rome',11],
    [14.5,48.2,'Qana','Arabian Waypoint','Frankincense loaded; cargoes transshipped.','pink',9],
    [30.4,48.0,'Charax Spasinu','Persian-Arab Axis','The great emporium at the head of the Persian Gulf.','pink',9],
    [12.5,54.0,'Socotra','Staging Island','Ships gathered here to wait for the SW monsoon.','green',10],
    [10.17,76.2,'Muziris','Central Emporium','The midpoint of the Old World trade system.','india',12],
    [21.7,72.98,'Barygaza','NW India Port','Cotton, aromatics, gems; Roman wine, olive oil, coral.','olive',9],
    [11.9,79.8,'Arikamedu','Coromandel Port','Hinge of two oceans. Fine muslin, beads.','chera',10],
    [10.8,79.84,'Kamara','Coromandel Port','Massive ships cut across the Bay of Bengal to the Ganges.','chera',8],
    [8.8,76.6,'Kollam','Malabar Southern Port','Connected Kerala to Far Eastern spice routes via Sri Lanka.','india',9],
    [7.0,80.0,'Taprobane','Transshipment Hub','Major node between western Indian Ocean and routes east.','gold',9],
    [3.14,101.69,'Malacca Strait','Eastern Bottleneck','Eastern limit of Roman commercial agency.','chinese',10],
    [21.5,109.1,'Hepu / Jiaozhi','Han Maritime Terminus','Principal Han ports for the maritime Silk Road.','chinese',9]
  ],
  silkroad: [
    [34.27,108.93,"Chang'an",'Western Han Capital','Eastern terminus of the Silk Road.','rome'],
    [39.65,66.96,'Samarkand','Sogdian Hub','Sogdian merchants were primary carriers of Silk Road commerce.','gold'],
    [37.63,62.18,'Merv','Critical Junction','Junction of northern and southern Silk Road routes.','parthian'],
    [33.1,44.6,'Ctesiphon','Overland Entrepôt','Where silk and spices were repackaged for the Roman west.','parthian'],
    [34.55,38.28,'Palmyra','Caravan Trade Hub','Connected Antioch to the Persian Gulf.','gold'],
    [30.4,48.0,'Charax Spasinu','Overland Meets Sea','Linked the Silk Road to the Persian Gulf maritime routes.','parthian'],
    [37.16,38.79,'Edessa','Western Terminus','Western anchor of the overland route.','hinge'],
    [36.2,36.2,'Antioch','Roman Endpoint','Where the Silk Road entered the Roman Empire.','rome'],
    [33.74,72.83,'Taxila','Indo-Parthian Gateway','Where the overland Silk Road met northwest Indian ports.','indoparth'],
    [21.7,72.98,'Barygaza','India–Silk Road Junction','Where overland Silk Road met maritime India trade.','india'],
    [21.5,109.1,'Hepu / Jiaozhi','Silk Road → Maritime','Node where overland and maritime systems connected.','chinese',9]
  ],
  evidence: [
    [23.9,35.5,'Berenike, Egypt','Key Excavation','7.55 kg black pepper. Indian teak. A Tamil Brahmi graffito.','red',12],
    [26.10,34.25,'Myos Hormos','Red Sea Port','Tamil Brahmi inscriptions naming Tamil merchants.','red',10],
    [17.03,54.43,'Khor Rori','Omani Coast','Tamil Brahmi inscriptions on pottery.','red',10],
    [12.5,54.0,'Socotra (Hoq Cave)','Indian Ocean Junction','192 Brahmi inscriptions, one Kharosthi.','red',10],
    [9.87,98.60,'Phu Khao Thong','Malay Peninsula','Tamil Brahmi inscription on a goldsmith\'s touchstone.','red',10],
    [10.5,76.0,'Palayur & Eyyal','Malabar Hoards','Roman gold and silver coins of Augustus to Nero.','gold',9],
    [10.17,76.2,'Pattanam / Muziris','Archaeological Site','Roman amphorae, torpedo jars, Mediterranean glass.','india',11],
    [10.96,78.08,'Karur','Inland Capital Hoard','Coin hoard at the inland Chera capital.','gold',10],
    [11.9,79.8,'Arikamedu','Roman Manufacturing','Roman lamps, glass beads, an unfinished intaglio.','gold',10],
    [11.5,76.9,'Coimbatore Region','Roman Coin Hoards','Coins of Augustus, Tiberius, Claudius, Nero.','gold',9],
    [10.5,78.8,'Alagankulam','Roman Pottery + Coins','Roman amphorae, rouletted ware at the Pandya capital.','gold',9],
    [7.0,80.0,'Sri Lanka','Roman Coins','Roman gold and silver coins across Sri Lanka.','gold',9],
    [10.28,105.47,'Oc Eo (Vietnam)','Malacca Corridor','Roman coins and Mediterranean glass.','chinese',10],
    [22.3,114.2,'Guangzhou','Via Intermediaries','Roman glass beads, coins of Augustus and Tiberius.','chinese',9],
    [34.68,112.45,'Luoyang','Eastern Han Capital','Roman glass vessels, amber from Han tombs.','chinese',9],
    [3.14,101.69,'Malay Peninsula','Eastern Limit','Approximate eastern limit of Roman material culture.','olive',9],
    [21.5,109.1,'Hepu / Jiaozhi','Han Maritime Ports','Roman glass and amber beads from Han tombs.','chinese',9]
  ],
  languages: [
    [31.2,29.9,'Alexandria','Greek Capital','Intellectual capital of the Greek-speaking world.','blue'],
    [37.16,38.79,'Edessa','Syriac / Aramaic Capital','"Thomas" is an Aramaic word for twin.','orange'],
    [31.77,35.23,'Jerusalem','Bilingual City','Aramaic in the streets, Greek in commerce.','purple'],
    [33.1,44.6,'Ctesiphon-Seleucia','Aramaic Metropolis','Aramaic was the commercial language.','orange'],
    [10.17,76.2,'Muziris','Greek Commercial','Yavana (Greek) merchants permanently established here.','blue']
  ]
};

const REGIONS = [
  [44, 5, 'ITALIA', '(Roman Heartland)', 12, 3],
  [34, 33, 'LEVANT', '(Syria-Palestine)', 11, 3],
  [35, 47, 'MESOPOTAMIA', '(Iraq)', 12, 3],
  [33, 55, 'PERSIA', '(Iran)', 13, 3],
  [38, 66, 'BACTRIA', '(Afghanistan)', 10, 4],
  [34, 74, 'GANDHĀRA', '(NW Pakistan)', 10, 4],
  [20, 78, 'DECCAN', '(Deccan India)', 11, 4],
  [10, 77, 'TAMILAKAM', '(Tamil South)', 10, 4],
  [28, 31, 'AEGYPTUS', '(Egypt)', 11, 3],
  [20, 45, 'ARABIA FELIX', '(Yemen / Oman)', 10, 4],
  [7, 81, 'TAPROBANE', '(Sri Lanka)', 9, 5],
  [38, 25, 'GRAECIA', '(Greece)', 10, 4],
  [30, 108, 'HAN', '(China)', 12, 3]
];

const OCEANS = [
  [15, 55, 'Mare Erythraeum', '(Arabian Sea)', 14],
  [35, 18, 'Mare Internum', '(Mediterranean)', 12],
  [-5, 70, 'Oceanus Indicus', '(Indian Ocean)', 13],
  [22, 38, 'Sinus Arabicus', '(Red Sea)', 10],
  [27, 52, 'Sinus Persicus', '(Persian Gulf)', 10],
  [18, 90, 'Sinus Gangeticus', '(Bay of Bengal)', 11],
  [5, 100, 'Mare Sinicum', '(South China Sea)', 10]
];

return { tabInfo, POLY, ROUTES, CITIES, REGIONS, OCEANS };
})();
