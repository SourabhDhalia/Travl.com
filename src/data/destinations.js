const destinations = [
  {
    slug: "taj-mahal",
    legacyPaths: ["/tajMahal"],
    name: "Taj Mahal",
    summary:
      "A UNESCO World Heritage monument in Agra, known globally as a symbol of love and Mughal craftsmanship.",
    heroImage: "/TAJ/photos/bgg5.jpg.jpeg",
    cardImage: "/TAJ/photos/b.jpeg",
    region: "Agra, Uttar Pradesh",
    bestTime: "October to March",
    featured: true,
    order: 1,
    facts: [
      {
        title: "Built In Marble",
        body:
          "The Taj Mahal was commissioned by Shah Jahan in 1632 and built with ivory-white marble on the banks of the Yamuna.",
        moreUrl: "https://en.wikipedia.org/wiki/Taj_Mahal",
      },
      {
        title: "World Heritage",
        body:
          "It is one of India's most visited UNESCO sites and combines Persian, Islamic, and Indian architectural traditions.",
        moreUrl: "https://en.wikipedia.org/wiki/Taj_Mahal",
      },
    ],
    foods: [
      {
        title: "Agra Petha",
        body:
          "Agra is famous for petha, a translucent sweet usually made from ash gourd and flavored in many styles.",
        moreUrl: "https://en.wikipedia.org/wiki/Petha",
      },
      {
        title: "Mughlai Food",
        body:
          "Visitors commonly explore Mughlai curries, kebabs, breads, and local chaat around the old city.",
        moreUrl: "https://en.wikipedia.org/wiki/Mughlai_cuisine",
      },
    ],
    myths: [
      {
        title: "Changing Colors",
        body:
          "The marble appears to shift from soft pink at sunrise to bright white in daytime and warm gold near sunset.",
        moreUrl: "https://en.wikipedia.org/wiki/Taj_Mahal#Myths",
      },
    ],
    gallery: ["/TAJ/photos/bgg5.jpg.jpeg", "/TAJ/photos/b.jpeg"],
    location: {
      label: "Taj Mahal, Agra",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=Taj+Mahal+Agra",
    },
  },
  {
    slug: "ellora-caves",
    legacyPaths: ["/elloraCaves"],
    name: "Ellora Caves",
    summary:
      "A dramatic rock-cut cave complex in Maharashtra, famous for the single-rock Kailasa Temple.",
    heroImage: "/ellora%20caves/photos/bgg5.jpg.jpg",
    cardImage: "/ellora%20caves/photos/bgg5.jpg.jpg",
    region: "Aurangabad, Maharashtra",
    bestTime: "November to February",
    featured: true,
    order: 2,
    facts: [
      {
        title: "Rock-Cut Wonder",
        body:
          "Ellora brings Buddhist, Hindu, and Jain monuments together in a long sequence of carved caves.",
        moreUrl: "https://en.wikipedia.org/wiki/Ellora_Caves",
      },
      {
        title: "Kailasa Temple",
        body:
          "The Kailasa Temple was carved top-down from a single basalt cliff, making it one of India's great engineering feats.",
        moreUrl: "https://en.wikipedia.org/wiki/Ellora_Caves",
      },
    ],
    foods: [
      {
        title: "Maharashtrian Snacks",
        body:
          "Try misal pav, poha, bhakri, and local sweets while traveling through the Aurangabad region.",
        moreUrl: "https://www.holidify.com/places/ajanta-and-ellora-caves/restaurants-places-to-eat-local-cuisine.html",
      },
    ],
    myths: [
      {
        title: "Carved Too Fast",
        body:
          "Local stories often focus on how astonishingly quickly the Kailasa Temple seems to have been carved.",
        moreUrl: "https://en.wikipedia.org/wiki/Kailasa_temple,_Ellora",
      },
    ],
    gallery: ["/ellora%20caves/photos/bgg5.jpg.jpg"],
    location: {
      label: "Ellora Caves, Maharashtra",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=Ellora+Caves",
    },
  },
  {
    slug: "tsongmo-lake",
    legacyPaths: ["/tsongmoLake"],
    name: "Tsongmo Lake",
    summary:
      "A high-altitude glacial lake near Gangtok whose surface changes color with the season.",
    heroImage: "/tsongmo%20lake/photos/bgg5.jpg.jpg",
    cardImage: "/tsongmo%20lake/photos/bgg5.jpg.jpg",
    region: "East Sikkim",
    bestTime: "April to June",
    featured: true,
    order: 3,
    facts: [
      {
        title: "Glacial Lake",
        body:
          "Tsongmo Lake sits at high elevation and often freezes in winter, creating a stark mountain landscape.",
        moreUrl: "https://en.wikipedia.org/wiki/Lake_Tsomgo",
      },
      {
        title: "Cultural Reverence",
        body:
          "The lake is deeply respected by local communities and has long been associated with seasonal omens.",
        moreUrl: "https://en.wikipedia.org/wiki/Lake_Tsomgo",
      },
    ],
    foods: [
      {
        title: "Mountain Comfort Food",
        body:
          "Nearby food stops often serve momos, thukpa, tea, and warm local dishes suited to the cold climate.",
        moreUrl: "https://en.wikipedia.org/wiki/Sikkimese_cuisine",
      },
    ],
    myths: [
      {
        title: "Color Reading",
        body:
          "Traditional stories say monks once read signs from the changing color of the lake water.",
        moreUrl: "https://en.wikipedia.org/wiki/Lake_Tsomgo",
      },
    ],
    gallery: ["/tsongmo%20lake/photos/bgg5.jpg.jpg"],
    location: {
      label: "Tsongmo Lake, Sikkim",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=Tsongmo+Lake",
    },
  },
  {
    slug: "golden-temple",
    legacyPaths: ["/goldenTemple"],
    name: "Golden Temple",
    summary:
      "A sacred Sikh gurdwara in Amritsar known for its gold-clad sanctum and community kitchen.",
    heroImage: "/golden%20temple/photos/bgg5.jpg.jpg",
    cardImage: "/golden%20temple/photos/bgg5.jpg.jpg",
    region: "Amritsar, Punjab",
    bestTime: "November to March",
    order: 4,
    facts: [
      {
        title: "Open To All",
        body:
          "The Golden Temple welcomes visitors from all backgrounds and is surrounded by the peaceful Amrit Sarovar.",
        moreUrl: "https://en.wikipedia.org/wiki/Golden_Temple",
      },
    ],
    foods: [
      {
        title: "Langar",
        body:
          "The community kitchen serves free meals daily and is one of the most meaningful experiences at the temple.",
        moreUrl: "https://en.wikipedia.org/wiki/Langar_(Sikhism)",
      },
    ],
    myths: [
      {
        title: "Healing Water",
        body:
          "Many visitors associate the surrounding pool with peace, reflection, and spiritual healing.",
        moreUrl: "https://en.wikipedia.org/wiki/Golden_Temple",
      },
    ],
    gallery: ["/golden%20temple/photos/bgg5.jpg.jpg"],
    location: {
      label: "Golden Temple, Amritsar",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=Golden+Temple+Amritsar",
    },
  },
  {
    slug: "hampi",
    legacyPaths: ["/Hampi"],
    name: "Hampi",
    summary:
      "A boulder-filled UNESCO landscape of Vijayanagara ruins, temples, markets, and river views.",
    heroImage: "/hampi/photos/bgg5.jpg.jpg",
    cardImage: "/hampi/photos/bgg5.jpg.jpg",
    region: "Karnataka",
    bestTime: "October to February",
    order: 5,
    facts: [
      {
        title: "Vijayanagara Capital",
        body:
          "Hampi was the capital of the Vijayanagara Empire and still carries traces of grand markets and temple complexes.",
        moreUrl: "https://en.wikipedia.org/wiki/Hampi",
      },
    ],
    foods: [
      {
        title: "Karnataka Staples",
        body:
          "Expect dosas, idlis, ragi dishes, banana-leaf meals, and simple traveler cafes around the town.",
        moreUrl: "https://en.wikipedia.org/wiki/Cuisine_of_Karnataka",
      },
    ],
    myths: [
      {
        title: "Ramayana Landscape",
        body:
          "Many local traditions connect the wider region with stories from the Ramayana.",
        moreUrl: "https://en.wikipedia.org/wiki/Hampi",
      },
    ],
    gallery: ["/hampi/photos/bgg5.jpg.jpg"],
    location: {
      label: "Hampi, Karnataka",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=Hampi",
    },
  },
  {
    slug: "humayun-tomb",
    legacyPaths: ["/humayunTomb"],
    name: "Humayun's Tomb",
    summary:
      "A refined Mughal garden tomb in Delhi that influenced later monuments, including the Taj Mahal.",
    heroImage: "/humayun%20tomb/photos/bgg5.jpg.jpg",
    cardImage: "/humayun%20tomb/photos/bgg5.jpg.jpg",
    region: "Delhi",
    bestTime: "October to March",
    order: 6,
    facts: [
      {
        title: "Garden Tomb",
        body:
          "Humayun's Tomb introduced a grand charbagh garden setting that became central to later Mughal architecture.",
        moreUrl: "https://en.wikipedia.org/wiki/Humayun%27s_Tomb",
      },
    ],
    foods: [
      {
        title: "Old Delhi Flavors",
        body:
          "Pair the visit with Delhi food such as chole bhature, kebabs, parathas, and street snacks.",
        moreUrl: "https://en.wikipedia.org/wiki/Delhi_cuisine",
      },
    ],
    myths: [
      {
        title: "Design Legacy",
        body:
          "Its symmetry and garden layout are often discussed as a precursor to the Taj Mahal's design language.",
        moreUrl: "https://en.wikipedia.org/wiki/Humayun%27s_Tomb",
      },
    ],
    gallery: ["/humayun%20tomb/photos/bgg5.jpg.jpg"],
    location: {
      label: "Humayun's Tomb, Delhi",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=Humayun%27s+Tomb+Delhi",
    },
  },
  {
    slug: "khajuraho",
    legacyPaths: ["/khajuraho"],
    name: "Khajuraho",
    summary:
      "A group of ornate temples in Madhya Pradesh known for sculpture, symmetry, and temple architecture.",
    heroImage: "/khajuraho/photos/bgg5.jpg.jpg",
    cardImage: "/khajuraho/photos/bgg5.jpg.jpg",
    region: "Madhya Pradesh",
    bestTime: "October to March",
    order: 7,
    facts: [
      {
        title: "Temple Group",
        body:
          "Khajuraho's temples were built by the Chandela dynasty and are admired for intricate stone carving.",
        moreUrl: "https://en.wikipedia.org/wiki/Khajuraho_Group_of_Monuments",
      },
    ],
    foods: [
      {
        title: "Regional Meals",
        body:
          "Visitors can try Madhya Pradesh thalis, korma-style dishes, sweets, and simple local snacks.",
        moreUrl: "https://en.wikipedia.org/wiki/Cuisine_of_Madhya_Pradesh",
      },
    ],
    myths: [
      {
        title: "Symbolism",
        body:
          "The sculptures are often interpreted as a broad celebration of life, devotion, and human experience.",
        moreUrl: "https://en.wikipedia.org/wiki/Khajuraho_Group_of_Monuments",
      },
    ],
    gallery: ["/khajuraho/photos/bgg5.jpg.jpg"],
    location: {
      label: "Khajuraho, Madhya Pradesh",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=Khajuraho",
    },
  },
  {
    slug: "nanda-devi",
    legacyPaths: ["/nandaDevi"],
    name: "Nanda Devi",
    summary:
      "A powerful Himalayan landscape and biosphere reserve centered around India's second-highest peak.",
    heroImage: "/nanda%20devi/photos/bgg5.jpg.jpg",
    cardImage: "/nanda%20devi/photos/bgg5.jpg.jpg",
    region: "Uttarakhand",
    bestTime: "May to October",
    order: 8,
    facts: [
      {
        title: "High Himalayan Reserve",
        body:
          "The Nanda Devi region is prized for alpine ecology, protected valleys, and dramatic mountain views.",
        moreUrl: "https://en.wikipedia.org/wiki/Nanda_Devi",
      },
    ],
    foods: [
      {
        title: "Garhwali Food",
        body:
          "Local meals may include mandua roti, lentils, rice, seasonal vegetables, and mountain tea.",
        moreUrl: "https://en.wikipedia.org/wiki/Kumauni_cuisine",
      },
    ],
    myths: [
      {
        title: "Sacred Peak",
        body:
          "Nanda Devi is revered as a protective goddess in many Uttarakhand traditions.",
        moreUrl: "https://en.wikipedia.org/wiki/Nanda_Devi",
      },
    ],
    gallery: ["/nanda%20devi/photos/bgg5.jpg.jpg"],
    location: {
      label: "Nanda Devi, Uttarakhand",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=Nanda+Devi",
    },
  },
  {
    slug: "padmanabhaswamy-temple",
    legacyPaths: ["/padmanabhaswamyTemple"],
    name: "Padmanabhaswamy Temple",
    summary:
      "A historic Vishnu temple in Thiruvananthapuram known for devotion, architecture, and temple legends.",
    heroImage: "/Padmanabhaswamy%20Temple/photos/bgg5.jpg.jpg",
    cardImage: "/Padmanabhaswamy%20Temple/photos/bgg5.jpg.jpg",
    region: "Thiruvananthapuram, Kerala",
    bestTime: "October to February",
    order: 9,
    facts: [
      {
        title: "Kerala Temple Architecture",
        body:
          "The temple combines Kerala and Dravidian architectural traditions and remains an active place of worship.",
        moreUrl: "https://en.wikipedia.org/wiki/Padmanabhaswamy_Temple",
      },
    ],
    foods: [
      {
        title: "Kerala Meals",
        body:
          "Nearby food culture includes appam, stew, banana chips, sadya, and coconut-rich dishes.",
        moreUrl: "https://en.wikipedia.org/wiki/Cuisine_of_Kerala",
      },
    ],
    myths: [
      {
        title: "Hidden Vaults",
        body:
          "The temple is widely associated with stories of ancient vaults and guarded treasures.",
        moreUrl: "https://en.wikipedia.org/wiki/Padmanabhaswamy_Temple#Temple_treasure",
      },
    ],
    gallery: ["/Padmanabhaswamy%20Temple/photos/bgg5.jpg.jpg"],
    location: {
      label: "Padmanabhaswamy Temple, Kerala",
      mapUrl:
        "https://www.google.com/maps/search/?api=1&query=Padmanabhaswamy+Temple",
    },
  },
  {
    slug: "amer-fort",
    legacyPaths: ["/amerFort"],
    name: "Amer Fort",
    summary:
      "A hilltop fort near Jaipur with courtyards, mirror work, gateways, and sweeping Aravalli views.",
    heroImage: "/amerfort/photos/bgg5.jpg.jpg",
    cardImage: "/amerfort/photos/bgg5.jpg.jpg",
    region: "Jaipur, Rajasthan",
    bestTime: "October to March",
    order: 10,
    facts: [
      {
        title: "Rajput Fort Palace",
        body:
          "Amer Fort blends defensive architecture with royal palace spaces, courtyards, and ornate halls.",
        moreUrl: "https://en.wikipedia.org/wiki/Amer_Fort",
      },
    ],
    foods: [
      {
        title: "Rajasthani Food",
        body:
          "Try dal baati churma, kachori, ghewar, halwa, and thali meals while exploring Jaipur.",
        moreUrl: "https://en.wikipedia.org/wiki/Rajasthani_cuisine",
      },
    ],
    myths: [
      {
        title: "Mirror Hall",
        body:
          "The Sheesh Mahal is remembered for mirror work that could glow beautifully with small points of light.",
        moreUrl: "https://en.wikipedia.org/wiki/Amer_Fort#Sheesh_Mahal",
      },
    ],
    gallery: ["/amerfort/photos/bgg5.jpg.jpg"],
    location: {
      label: "Amer Fort, Jaipur",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=Amer+Fort+Jaipur",
    },
  },
];

module.exports = destinations.map((destination) => ({
  publishStatus: "published",
  seo: {
    title: `${destination.name} | Travl.com`,
    description: destination.summary,
  },
  ...destination,
}));
