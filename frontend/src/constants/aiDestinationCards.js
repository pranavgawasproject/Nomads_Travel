const destinationImageLinks = [
  {
    city: "Lisbon",
    image:
      "https://cdn-imgix.headout.com/microbrands-content-image/image/f9f98c000d2b02dd4c5cc8837389b8f1-AdobeStock_164147478.jpeg?auto=format&w=1222.3999999999999&h=687.6&q=90&ar=16%3A9&crop=faces&fit=crop",
  },
  {
    city: "Dubai",
    image:
      "https://www.arabtec-construction.com/_next/image?url=https%3A%2F%2Ffirebasestorage.googleapis.com%2Fv0%2Fb%2Farabtec-5eff1.appspot.com%2Fo%2Fprojects%252FBURJ%2520KHALIFA%252FDSC_7356%25201.png1a1ad6a2-0250-4439-a33a-ed7a1daca6d6%3Falt%3Dmedia%26token%3D50266c73-2d0e-496e-96d0-30803ca30be6&w=3840&q=75",
  },
  {
    city: "Barcelona",
    image:
      "https://cdn.britannica.com/15/194815-050-08B5E7D1/Nativity-facade-Sagrada-Familia-cathedral-Barcelona-Spain.jpg",
  },
  {
    city: "Bali",
    image:
      "https://balirescentre.com/wp-content/uploads/2025/05/2915aa58-bffd-46da-8459-797cb086abe8.webp",
  },
  {
    city: "Bangkok",
    image:
      "https://wanderon-images.gumlet.io/gallery/new/2025/04/25/1745569045455-places-to-visit-in-bangkok.jpg",
  },
  {
    city: "Prague",
    image:
      "https://hblimg.mmtcdn.com/content/hubble/img/ttd_img/mmt/activities/m_Prague_Prague_Castle_SS_1_l_566_900.jpg",
  },
  {
    city: "Kuala Lumpur",
    image:
      "https://cdn.audleytravel.com/2997/2140/79/15978471-klcc-district-kuala-lumpur.jpg",
  },
  {
    city: "Mexico City",
    image:
      "https://i.natgeofe.com/n/6c02ad5a-977b-4f12-b9c0-02ffb0736e07/metropolitan-cathedral-zocalo-mexico-city.JPG",
  },
  {
    city: "Medellin",
    image:
      "https://medellin-tours.com/wp-content/uploads/2025/12/colorful-street-in-comuna-13-in-medellin.jpg",
  },
  {
    city: "Porto",
    image:
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/23/e6/28/a3/caption.jpg?w=900&h=-1&s=1",
  },
  {
    city: "Valencia",
    image:
      "https://www.voyagedmagazine.com/wp-content/uploads/2024/12/valencia-best-things-to-do-1080x720.jpg",
  },
  {
    city: "Budapest",
    image:
      "https://www.historyhit.com/app/uploads/bis-images/5158752/parliament-budapest-788x537.jpg?x15201",
  },
  {
    city: "Chiang Mai",
    image:
      "https://storage.googleapis.com/tagthai-prd-content/4_14803aabe7/4_14803aabe7.png",
  },
  {
    city: "Da Nang",
    image: "https://www.holidify.com/images/bgImages/DA-NANG.jpg",
  },
  {
    city: "Tbilisi",
    image:
      "https://lp-cms-production.imgix.net/2022-03/GettyRF_700713549%20crop.jpg?auto=format,compress&q=72&w=1095&h=821&fit=crop&crop=faces,edges",
  },
  {
    city: "Phuket",
    image:
      "https://res.klook.com/image/upload/fl_lossy.progressive,q_60/Mobile/City/p2pfj38lzjf7wsd6gobn.jpg",
  },
  {
    city: "Penang",
    image:
      "https://www.emperortraveline.com/wp-content/uploads/2018/12/Kek-lok.png",
  },
  {
    city: "Las Palmas",
    image:
      "https://cdn.rtvc.es/archivos/2023/06/Las-Palmas-de-Gran-Canaria-.jpeg",
  },
  {
    city: "Goa",
    image:
      "https://s7ap1.scene7.com/is/image/incredibleindia/1-palolem-beach-goa-goa-city-hero?qlt=82&ts=1742182084999",
  },
  {
    city: "Tallinn",
    image:
      "https://www.campingbaltic.com/media/cache/thumb_729x486/uploads/location/61e81a8290fa4256538225.jpg",
  },
  {
    city: "Montreal",
    image: "https://media.timeout.com/images/105890847/image.jpg",
  },
  {
    city: "Vancouver",
    image:
      "https://hblimg.mmtcdn.com/content/hubble/img/destgalleryimages/mmt/activities/m_Vancouver_2_l_661_1000.jpg",
  },
  {
    city: "Toronto",
    image: "https://media.timeout.com/images/102873865/image.jpg",
  },
  {
    city: "Austin",
    image:
      "https://images.trvl-media.com/place/6080975/3fd33d0e-4e53-4eb8-bc29-5e5aa430768a.jpg",
  },
  {
    city: "Miami",
    image:
      "https://cavaliersouthbeach.com/wp-content/uploads/2023/02/history-sobe-1-1080x562.jpg",
  },
  {
    city: "Istanbul",
    image:
      "https://www.mozaweb.com/en/mozaik3D/VIZ/kozepkor/hagia_sophia/960.jpg",
  },
  {
    city: "Athens",
    image:
      "https://cdn-imgix.headout.com/media/images/dcfbf731d7991f91d41640ffd032610f-d2cfb372cf3a129c5ee7d6d3945d0580-AdobeStock-129050920copy.jpg?auto=format&w=900&h=562.5&q=90&ar=16%3A10&fit=crop",
  },
  {
    city: "Kraków",
    image:
      "https://d1bvpoagx8hqbg.cloudfront.net/originals/experience-krakow-poland-barbara-6c226ca30b7eefd3c5c43840418b234d.jpg",
  },
  {
    city: "Buenos Aires",
    image: "https://media.timeout.com/images/106140940/750/562/image.jpg",
  },
  {
    city: "Santiago",
    image:
      "https://res.cloudinary.com/rainforest-cruises/images/c_fill,g_auto/f_auto,q_auto/w_1120,h_732,c_fill,g_auto/v1622150489/shutterstock_585359984-mainjpg1120/shutterstock_585359984-mainjpg1120-1120x732.jpg",
  },
  {
    city: "Ho Chi Minh City",
    image:
      "https://statics.vinwonders.com/Places-to-visit-in-Ho-Chi-Minh-City-01_1680097829.jpg",
  },
  {
    city: "Hanoi",
    image: "https://static.hectindia.com/0000/271/2025/05/28/ha-long-bay2.webp",
  },
  {
    city: "Bucharest",
    image:
      "https://images.contentstack.io/v3/assets/blt06f605a34f1194ff/blta0cad8eccaff55a4/67bd922854cf2f2d5d761a58/iStock-1395936639-Header_Desktop.jpg?fit=crop&disable=upscale&auto=webp&quality=60&crop=smart&width=960&height=540",
  },
  {
    city: "Sofia",
    image:
      "https://media.istockphoto.com/id/1205570855/photo/st-alexander-nevsky-cathedral-sofia.jpg?s=612x612&w=0&k=20&c=NerAD87Xv2hX1-QvVIlyh2uWfdvOMqI7mE1iANqLgyc=",
  },
  {
    city: "Belgrade",
    image: "https://idsb.tmgrup.com.tr/ly/uploads/images/2022/10/27/238116.jpg",
  },
  {
    city: "Quito",
    image:
      "https://turismo.ecuadors.live/wp-content/uploads/2023/07/mitad-del-mundo-ciudad-mitad-del-mundo-quito-turismo-turismo-ecuador.jpg",
  },
  {
    city: "Montevideo",
    image:
      "https://images.trvl-media.com/place/6114124/e89328b4-2161-4771-9ec4-b4c853a43ad5.jpg",
  },
  {
    city: "Nairobi",
    image:
      "https://images.tourscanner.com/wp-content/uploads/2022/07/things-to-do-in-Nairobi-Kenya.jpg",
  },
  {
    city: "Kigali",
    image:
      "https://deih43ym53wif.cloudfront.net/cityscape-things-to-do-in-kigali-rwanda_44e57bd0bf.jpeg",
  },
  {
    city: "Cebu City",
    image:
      "https://seospecialist.com.ph/wp-content/uploads/2025/09/cebu-tourist-spot-2.jpg",
  },
  {
    city: "Yogyakarta",
    image:
      "https://www.tropilogy.com/wp-content/uploads/2023/03/img_buddha-statue-borobudur-temple-2.jpg",
  },
  {
    city: "Bologna",
    image:
      "https://cdn-imgix.headout.com/media/images/2f348682af972d166630c5cf4b971c59-Asinelli%20and%20Garisenda%2C%20symbols%20of%20medieval%20Bologna%20towers.jpg?fm=pjpg&auto=compress&w=1200&crop=faces&fit=min",
  },
  {
    city: "Santa Catarina",
    image:
      "https://media.digitalnomads.world/wp-content/uploads/2021/10/20114835/floriano%CC%81polis-digital-nomads.jpg",
  },
  {
    city: "Playa del Carmen",
    image: "https://g.denik.cz/1/85/chichen-itza-04.jpg",
  },
  {
    city: "Western Cape",
    image:
      "https://secretcapetown.co.za/wp-content/uploads/2022/10/Cape-Town-Big-6-Attractions-24-1030x687.jpg",
  },
  {
    city: "Gold Coast",
    image:
      "https://surfersparadiseslsc.com.au/wp-content/uploads/2023/03/320bb5da3235a3d42533ca98a6032443-scaled-1-1.jpg",
  },
  {
    city: "Auckland",
    image:
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2c/c9/55/42/sky-tower.jpg?w=900&h=500&s=1",
  },
  {
    city: "Amsterdam",
    image:
      "https://res.klook.com/image/upload/fl_lossy.progressive,q_60/Mobile/City/fmrbscgpo5jtrqlqg47u.jpg",
  },
  {
    city: "San José",
    image:
      "https://palmsrealtycr.com/wp-content/uploads/2013/01/la-sabana-4.jpg",
  },
  {
    city: "Tenerife",
    image:
      "https://st3.depositphotos.com/1001146/19442/i/450/depositphotos_194426338-stock-photo-aerial-view-santa-cruz-tenerife.jpg",
  },
  {
    city: "Funchal",
    image:
      "https://images.ctfassets.net/i3kf1olze1gn/4jPIkDTOLe3hAqsBkfFzoA/0b785057265ffe80b663cf0eb530a354/GettyImages-498882476.jpg?fit=fill&h=1620&q=55&w=2880",
  },
  {
    city: "Tulum",
    image:
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2b/28/46/54/caption.jpg?w=1600&h=-1&s=1",
  },
  {
    city: "Bogota",
    image: "https://hansatours.com/images/Monserrate-tour-in-Bogota.jpg",
  },
  {
    city: "Lima",
    image:
      "https://cdn.adventure-life.com/16/63/43/iStock-1075517408/1300x820.webp",
  },
  {
    city: "Colombo",
    image:
      "https://www.onthegotours.com/repository/Temple-in-Colombo--Sri-Lanka-Tours--On-The-Go-Tours-294631461670778.jpg",
  },
  {
    city: "Marrakech",
    image:
      "https://d37rmf1ynyg9aw.cloudfront.net/fit-in/1280x1280/data/v4/destinations/44cab3a1-8515-4193-ad81-4bee9a6cea6f/resources/102821.jpg",
  },
  {
    city: "Casablanca",
    image:
      "https://touringinmorocco.com/wp-content/uploads/2022/10/resize-16679039261642428369thehassaniimosqueg77367e7291280.jpg",
  },
  {
    city: "Lagos (Portugal)",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/0/0d/Ponta_da_Piedade_%2849174016398%29.jpg",
  },
  {
    city: "Koh Phangan",
    image:
      "https://www.placesofjuma.com/wp-content/uploads/2019/04/Koh-Phangan-thailand-1n-scaled.jpg",
  },
  {
    city: "Cairo",
    image:
      "https://cdn.destguides.com/files/store/itinerary/2561/background_image/jpeg_large_4x3_202112291737-c44b72fcd918b3a8c0e78c4c2841e77f.jpeg",
  },
  {
    city: "Surigao del Norte",
    image:
      "https://gttp.images.tshiftcdn.com/198646/x/0/cloud-9-2.jpg?auto=compress%2Cformat&ch=Width%2CDPR&dpr=1&ixlib=php-3.3.0&w=883",
  },
  {
    city: "Nassau",
    image:
      "https://scontent-bom2-3.xx.fbcdn.net/v/t39.30808-6/585312013_2640807586278690_1063269149284148063_n.jpg?stp=cp6_dst-jpg_s720x720_tt6&_nc_cat=101&ccb=1-7&_nc_sid=e06c5d&_nc_ohc=yARTNcqn3XUQ7kNvwF05g6H&_nc_oc=Adk4G12Aj2KZfRZIqvsqOUsQVp3ihizwmLcuzW3Wvt0vuiIeMdobWYvMuZhb7PWMW9E&_nc_zt=23&_nc_ht=scontent-bom2-3.xx&_nc_gid=BhSuOfWPoZq4AQA0m9Zg_w&_nc_ss=8&oh=00_AfxDMi1EqyZDgfGTuh-IllFNK-T4Ga9xiimTPhzu3qQZrg&oe=69B9D63D",
  },
  {
    city: "Otago Region",
    image:
      "https://flywelltours.com/wp-content/uploads/2025/05/queenstown-1-1024x576.webp",
  },
  {
    city: "Nadi",
    image:
      "https://www.travelonline.com/fiji/attractions/sri-siva-subramaniya-temple/sri-siva-subramaniya-temple-nadi-fiji-nadi-temple-83843-banner.jpg",
  },
  {
    city: "Fes-Meknes",
    image:
      "https://www.travellingking.com/wp-content/uploads/2023/03/Fes-el-Bali-Morocco-Africa.jpg",
  },
  {
    city: "Sao Paulo",
    image:
      "https://cdn.getyourguide.com/image/format=auto,fit=crop,gravity=auto,quality=60,width=400,height=265,dpr=2/tour_img/585042053618b.jpeg",
  },
  {
    city: "Rio de Janeiro",
    image:
      "https://www.farejaviagens.com.br/wp-content/uploads/2024/05/1590752476148.jpg",
  },
  {
    city: "Manila",
    image:
      "https://hblimg.mmtcdn.com/content/hubble/img/maniladestimages/mmt/activities/m_Manila_Cathedral_1_l_480_640.jpg",
  },
  {
    city: "Cali",
    image:
      "https://cdn.kimkim.com/files/a/article_images/images/b89b4bb082e52ca83a73c140c404e09ef123afae/big-4e1777cc145807eb15e106c0d24a820f.jpg",
  },
  {
    city: "Oaxaca",
    image:
      "https://whereintheworldisnina.com/wp-content/uploads/2022/04/things-to-do-in-oaxaca.jpeg",
  },
  {
    city: "Pittsburgh",
    image:
      "https://media.istockphoto.com/id/1347263211/photo/duquesne-incline-approaching-pittsburgh-pennsylvania.jpg?s=612x612&w=0&k=20&c=sZeSaJygT1SG7sTudbcIET6XElX6qVFI0TfVfyc8Rz4=",
  },
  {
    city: "Lagos State",
    image:
      "https://images.trvl-media.com/place/2115/228f90cb-6770-4d23-85af-bbcf9a1d922c.jpg",
  },
  {
    city: "Abuja",
    image:
      "https://images.trvl-media.com/place/275/037843f8-40d3-4776-bc98-ae70aa909659.jpg",
  },
  {
    city: "Giza",
    image: "https://egyptra.pro/uploads/photo_library/photo_688beaf65c7fc.webp",
  },
];

const destinationImageMap = new Map(
  destinationImageLinks.map(({ city, image }) => [city, image]),
);

const destinations = [
  ["Lisbon", "Portugal", "Europe"],
  ["Abu Dhabi", "United Arab Emirates", "Asia"],
  ["Dubai", "United Arab Emirates", "Asia"],
  ["Barcelona", "Spain", "Europe"],
  ["Bali", "Indonesia", "Asia"],
  ["Bangkok", "Thailand", "Asia"],
  ["Prague", "Czech Republic", "Europe"],
  ["Kuala Lumpur", "Malaysia", "Asia"],
  ["Mexico City", "Mexico", "North America"],
  ["Medellin", "Colombia", "South America"],
  ["Porto", "Portugal", "Europe"],
  ["Valencia", "Spain", "Europe"],
  ["Budapest", "Hungary", "Europe"],
  ["Chiang Mai", "Thailand", "Asia"],
  ["Da Nang", "Vietnam", "Asia"],
  ["Tbilisi", "Georgia", "Europe"],
  ["Phuket", "Thailand", "Asia"],
  ["Penang", "Malaysia", "Asia"],
  ["Las Palmas", "Spain", "Europe"],
  ["Goa", "India", "Asia"],
  ["Tallinn", "Estonia", "Europe"],
  ["Montreal", "Canada", "North America"],
  ["Vancouver", "Canada", "North America"],
  ["Toronto", "Canada", "North America"],
  ["Texas", "USA", "North America"],
  ["Florida", "USA", "North America"],
  ["Istanbul", "Turkey", "Europe"],
  ["Athens", "Greece", "Europe"],
  ["Kraków", "Poland", "Europe"],
  ["Buenos Aires", "Argentina", "South America"],
  ["Santiago", "Chile", "South America"],
  ["Ho Chi Minh City", "Vietnam", "Asia"],
  ["Hanoi", "Vietnam", "Asia"],
  ["Bucharest", "Romania", "Europe"],
  ["Sofia", "Bulgaria", "Europe"],
  ["Belgrade", "Serbia", "Europe"],
  ["Quito", "Ecuador", "South America"],
  ["Montevideo", "Uruguay", "South America"],
  ["Nairobi", "Kenya", "Africa"],
  ["Kigali", "Rwanda", "Africa"],
  ["Cebu City", "Philippines", "Asia"],
  ["Yogyakarta", "Indonesia", "Asia"],
  ["Bologna", "Italy", "Europe"],
  ["Santa Catarina", "Brazil", "South America"],
  ["Playa del Carmen", "Mexico", "North America"],
  ["Western Cape", "South Africa", "Africa"],
  ["Gold Coast", "Australia", "Oceania"],
  ["Auckland", "New Zealand", "Oceania"],
  ["Amsterdam", "Netherlands", "Europe"],
  ["San José", "Costa Rica", "South America"],
  ["Tenerife", "Spain", "Europe"],
  ["Funchal", "Portugal", "Europe"],
  ["Tulum", "Mexico", "North America"],
  ["Bogota", "Colombia", "South America"],
  ["Lima", "Peru", "South America"],
  ["Colombo", "Sri Lanka", "Asia"],
  ["Marrakech", "Morocco", "Africa"],
  ["Casablanca", "Morocco", "Africa"],
  ["Lagos (Portugal)", "Portugal", "Europe"],
  ["Koh Phangan", "Thailand", "Asia"],
  ["Cairo", "Egypt", "Africa"],
  ["Surigao del Norte", "Philippines", "Asia"],
  ["Nassau", "Bahamas", "North America"],
  ["Otago Region", "New Zealand", "Oceania"],
  ["Nadi", "Fiji", "Oceania"],
  ["Fes-Meknes", "Morocco", "Africa"],
  ["Sao Paulo", "Brazil", "South America"],
  ["Rio de Janeiro", "Brazil", "South America"],
  ["Manila", "Philippines", "Asia"],
  ["Cali", "Colombia", "South America"],
  ["Oaxaca", "Mexico", "North America"],
  ["Victoria", "Australia", "Oceania"],
  ["Pittsburgh", "USA", "North America"],
  ["Lagos State", "Nigeria", "Africa"],
  ["Abuja", "Nigeria", "Africa"],
  ["Giza", "Egypt", "Africa"],
  ["Sarajevo", "Bosnia and Herzegovina", "Europe"],
  ["San Jose", "Costa Rica", "North America"],
  ["Texas", "USA", "North America"],
];

const destinationCardShortNames = {
  "Vietnam|Ho Chi Minh City": "Ho Chi Minh City",
  "Spain|Las Palmas": "Las Palmas",
  "Brazil|Santa Catarina": "Florianopolis",
  "Mexico|Playa del Carmen": "Playa del Carmen",
  "South Africa|Western Cape": "Western Cape",
  "Australia|Gold Coast": "Queensland",
  "Netherlands|Amsterdam": "Amsterdam",
  "Costa Rica|San José": "San José",
  "Spain|Tenerife": "Tenerife",
  "Morocco|Casablanca": "Casablanca",
  "Portugal|Lagos": "Lagos",
  "Egypt|Cairo": "Cairo",
  "Philippines|Surigao del Norte": "Surigao",
  "New Zealand|Otago Region": "Queenstown",
  "Egypt|Giza": "Giza",
};

const countryCardShortNames = {
  "United Arab Emirates": "UAE",
  "Czech Republic": "Czechia",
};

export const aiDestinationCards = destinations.map(
  ([city, country, continent], index) => ({
    city,
    displayCity: destinationCardShortNames[`${country}|${city}`] || city,
    routeCity: city,
    displayCountry: countryCardShortNames[country] || country,
    routeCountry: country,
    country,
    continent,
    suggestions: 102 - (index % 30),
    image:
      destinationImageMap.get(city) ||
      destinationImageMap.get(
        destinationCardShortNames[`${country}|${city}`],
      ) ||
      "/images/goa-image.jpg",
  }),
);
