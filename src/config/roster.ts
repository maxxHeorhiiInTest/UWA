export const rosterCategories = [
  "men",
  "women",
  "guests",
  "teams",
  "managers",
  "referees",
  "alumni",
] as const;

export type RosterCategory = (typeof rosterCategories)[number];

export type LocalizedText = { ua: string; en: string };

export type Wrestler = {
  id: string;
  category: RosterCategory;
  name: LocalizedText;
  bio: LocalizedText[];
  // Empty until real renders are dropped into /public/roster/.
  photos: string[];
  titles: LocalizedText[];
  matches: LocalizedText[];
  videos: LocalizedText[];
  rivalries: LocalizedText[];
};

const placeholderBio: LocalizedText[] = [
  {
    ua: "Ім’я, рингнейм і біографія з’являться тут, щойно буде готовий контент реслера.",
    en: "Name, ring name and biography will land here once wrestler copy is ready.",
  },
  {
    ua: "Цей блок повторює структуру Figma: короткий опис, стиль і шлях у промоушені.",
    en: "This block follows the Figma structure: a short intro, style, and path in the promotion.",
  },
  {
    ua: "Фото-рендери будуть підставлено окремо — зараз це лише каркас сторінки.",
    en: "Photo renders will be swapped in later — this is the page shell only.",
  },
];

function profile(
  statsUa: string,
  statsEn: string,
  ua: string,
  en: string
): LocalizedText[] {
  return [
    { ua: statsUa, en: statsEn },
    { ua, en },
  ];
}

function placeholder(
  id: string,
  category: RosterCategory,
  name: LocalizedText,
  extras?: { photos?: string[]; bio?: LocalizedText[] }
): Wrestler {
  return {
    id,
    category,
    name,
    bio: extras?.bio ?? placeholderBio,
    photos: extras?.photos ?? [],
    titles: [
      { ua: "Титул — плейсхолдер", en: "Title — placeholder" },
    ],
    matches: [
      { ua: "Матч — плейсхолдер", en: "Match — placeholder" },
    ],
    videos: [
      { ua: "Відео — плейсхолдер", en: "Video — placeholder" },
    ],
    rivalries: [
      { ua: "Суперництво — плейсхолдер", en: "Rivalry — placeholder" },
    ],
  };
}

export const wrestlers: Wrestler[] = [
  placeholder("arsen-robben", "men", { ua: "Арсен Роббен", en: "Arsen Robben" }, {
    photos: ["/roster/arsen-robben-hq.png"],
    bio: profile(
      "183 см / 79 кг / технічний, страйкер",
      "183 cm / 79 kg / technical, striker",
      "Поціновувач англійського футболу, який переніс своє хобі у реслінг. Виступає у складі однойменної команди та поєднує футбольну тематику з технічним стилем на ринзі.",
      "A fan of English football who brought his hobby into wrestling. He performs as part of the namesake team and blends football themes with a technical in-ring style."
    ),
  }),
  placeholder("daniel", "men", { ua: "Даніель", en: "Daniel" }, {
    photos: ["/roster/daniel-hq.png"],
    bio: profile(
      "190 см / 81 кг / бравлер",
      "190 cm / 81 kg / brawler",
      "Даніель розпочав свій шлях в UWA як рефері, а згодом дебютував як реслер. Поєднує фізичну силу зі своїм давнім захопленням футболом.",
      "Daniel started his path in UWA as a referee and later debuted as a wrestler. He combines physical strength with his long-standing passion for football."
    ),
  }),
  placeholder("mc-koshernyi", "men", { ua: "MC Кошерний", en: "MC Koshernyi" }, {
    photos: ["/roster/mc-koshernyi-hq.png"],
    bio: profile(
      "178 см / 60 кг / хардкор, ультравайленс",
      "178 cm / 60 kg / hardcore, ultraviolence",
      "Колишній Екстремальний та діючий Командний Чемпіон UWA. Один із найбожевільніших реслерів України, який назавжди вписав своє ім’я в історію екстремального дивізіону завдяки шаленим стрибкам та падінням на гострі предмети.",
      "A former Extreme Champion and current UWA Tag Team Champion. One of Ukraine’s wildest wrestlers, who forever wrote his name into the extreme division with insane jumps and falls onto sharp objects."
    ),
  }),
  placeholder("viktor-vitrolom", "men", { ua: "Віктор Вітролом", en: "Viktor Vitrolom" }, {
    photos: ["/roster/viktor-vitrolom-hq.png"],
    bio: profile(
      "185 см / 95 кг / хай-флай",
      "185 cm / 95 kg / high-flyer",
      "Головний стрейт-еджер та веган українського реслінгу. Діючий Командний Чемпіон UWA та колишній Екстремальний Чемпіон, відомий своїми захопливими стрибками та сальто.",
      "The leading straight-edge vegan of Ukrainian wrestling. Current UWA Tag Team Champion and former Extreme Champion, known for spectacular jumps and somersaults."
    ),
  }),
  placeholder("miller", "men", { ua: "Міллер", en: "Miller" }, {
    photos: ["/roster/miller-hq.png"],
    bio: profile(
      "190 см / 125 кг / пауерхаус",
      "190 cm / 125 kg / powerhouse",
      "Головний охоронець та представник Костянтина Князя з неймовірними габаритами. Має борцівський бекграунд та є однією з найпотужніших фізичних сил UWA.",
      "The chief bodyguard and representative of Kostyantyn Knyaz, with enormous size. He has a grappling background and is one of the most powerful physical forces in UWA."
    ),
  }),
  placeholder("voron", "men", {
    ua: "Зловісний Володимир Ворон",
    en: "Sinister Volodymyr Voron",
  }, {
    photos: ["/roster/voron-hq.png"],
    bio: profile(
      "185 см / 116 кг / пауерхаус",
      "185 cm / 116 kg / powerhouse",
      "Дніпровський велетень, колишній Світовий Чемпіон UWA та нинішній учасник Корпорації. Ворон відомий тим, що завершив кар’єри майже всіх дніпровських реслерів.",
      "A giant from Dnipro, a former UWA World Champion and current member of the Corporation. Voron is known for ending the careers of almost every Dnipro wrestler."
    ),
  }),
  placeholder("dmytro-gambit-shamrai", "men", {
    ua: "Дмитро «Гамбіт» Шамрай",
    en: "Dmytro \"Gambit\" Shamrai",
  }, {
    photos: ["/roster/dmytro-gambit-shamrai-hq3.png"],
    bio: profile(
      "178 см / 80 кг / технічний",
      "178 cm / 80 kg / technical",
      "Неймовірно технічний та винахідливий реслер. Після поразки Ігору Тураму Гамбіт не визнав результат матчу та самопроголосив себе Світовим Чемпіоном UWA, забравши чемпіонський пояс із собою.",
      "An incredibly technical and inventive wrestler. After losing to Ihor Turam, Gambit refused to accept the result and proclaimed himself UWA World Champion, taking the championship belt with him."
    ),
  }),
  placeholder("diehard-dustin-lee", "men", {
    ua: "Дайхард Дастін Лі",
    en: "Diehard Dustin Lee",
  }, {
    photos: ["/roster/diehard-dustin-lee-hq.png"],
    bio: profile(
      "193 см / 86 кг / ультравайленс, хардкор, технічний",
      "193 cm / 86 kg / ultraviolence, hardcore, technical",
      "Американська зірка дезматчів, відома хардкорним фанатам своїми жорсткими поєдинками з лампами та участю у найекстремальніших турнірах. Колишній Командний Чемпіон CZW.",
      "An American deathmatch star, known to hardcore fans for brutal light-tube matches and appearances in the most extreme tournaments. A former CZW Tag Team Champion."
    ),
  }),
  placeholder("hor", "men", { ua: "Гор", en: "Hor" }, {
    photos: ["/roster/hor-hq.png"],
    bio: profile(
      "170 см / 70 кг / технічний",
      "170 cm / 70 kg / technical",
      "Амбітний новачок у масці, готовий довести, що жодні габарити не здатні зупинити його швидкість та техніку.",
      "An ambitious masked newcomer, ready to prove that no size can stop his speed and technique."
    ),
  }),
  placeholder("adam-hart", "men", { ua: "Адам Гарт", en: "Adam Hart" }, {
    photos: ["/roster/adam-hart-hq.png"],
    bio: profile(
      "173 см / 80 кг / пауерхаус, оллраундер",
      "173 cm / 80 kg / powerhouse, all-rounder",
      "Колишній Екстремальний Чемпіон та учасник угрупування «Вулична Аристократія». Попри невеликий зріст, фізична форма та вибухова сила Гарта — одні з найкращих в українському реслінгу.",
      "A former Extreme Champion and member of the Street Aristocracy faction. Despite his shorter stature, Hart’s physical condition and explosive power are among the best in Ukrainian wrestling."
    ),
  }),
  placeholder("russell-cross", "men", { ua: "Расселл Кросс", en: "Russell Cross" }, {
    photos: ["/roster/russell-cross-hq.png"],
    bio: profile(
      "170 см / 65 кг / страйкер",
      "170 cm / 65 kg / striker",
      "«Найвеличніша людина у світі» — саме так Кросс називає себе сам. Справжній маестро на ринзі та найдовший Екстремальний Чемпіон UWA в історії.",
      "“The greatest man in the world” — that’s how Cross refers to himself. A true maestro in the ring and the longest-reigning UWA Extreme Champion in history."
    ),
  }),
  placeholder("vitalii-kovalov", "men", {
    ua: "Віталій Ковальов",
    en: "Vitalii Kovalov",
  }, {
    photos: ["/roster/vitalii-kovalov-hq.png"],
    bio: profile(
      "183 см / 85 кг / технічний",
      "183 cm / 85 kg / technical",
      "Справжній ветеран українського реслінгу з 14-річним досвідом у реслінг-матчах. Один із найдосвідченіших представників української реслінг-сцени.",
      "A true veteran of Ukrainian wrestling with 14 years of in-ring experience. One of the most seasoned figures on the Ukrainian wrestling scene."
    ),
  }),
  placeholder("levin", "men", { ua: "Левін", en: "Levin" }, {
    photos: ["/roster/levin-hq.png"],
    bio: profile(
      "181 см / 76 кг / технічний",
      "181 cm / 76 kg / technical",
      "Двократний Командний Чемпіон UWA. За Левіном уже давно закріпилося одне слово — помста.",
      "A two-time UWA Tag Team Champion. One word has long been attached to Levin — revenge."
    ),
  }),
  placeholder("max-syla", "men", { ua: "Макс Сила", en: "Max Syla" }, {
    photos: ["/roster/max-syla-hq.png"],
    bio: profile(
      "185 см / 90 кг / пауерхаус",
      "185 cm / 90 kg / powerhouse",
      "Найсильніша людина Лівого Берега Києва та діючий володар Кубка Столиці. Найкращий друг Андрія Ведмедя.",
      "The strongest man of Kyiv’s Left Bank and the current holder of the Capital Cup. Best friend of Andriy Vedmid."
    ),
  }),
  placeholder("ivan-san", "men", { ua: "Іван Сан", en: "Ivan San" }, {
    photos: ["/roster/ivan-san-hq.png"],
    bio: profile(
      "174 см / 80 кг / комедійний",
      "174 cm / 80 kg / comedy",
      "Колись був інтерв’юером та терпів знущання, але одного дня його терпіння увірвалося. Тепер Сан — справжній реслер із японським духом та самурайською спадщиною.",
      "He used to be an interviewer and endured mockery, until one day his patience ran out. Now San is a real wrestler with a Japanese spirit and samurai heritage."
    ),
  }),
  placeholder("ranger-leonid", "men", {
    ua: "Рейнджер Леонід",
    en: "Ranger Leonid",
  }, {
    photos: ["/roster/ranger-leonid-hq.png"],
    bio: profile(
      "171 см / 74 кг / технічний, оллраундер",
      "171 cm / 74 kg / technical, all-rounder",
      "Справжній Рейнджер, який майстерно поєднує досвід у східних єдиноборствах із реслінгом. Використовує навіть нунчаки — улюблену зброю свого альтер-его Сіліона; двократний Екстремальний Чемпіон UWA.",
      "A true Ranger who skillfully blends experience in Eastern martial arts with wrestling. He even uses nunchaku — the favorite weapon of his alter ego Silion; a two-time UWA Extreme Champion."
    ),
  }),
  placeholder("anton-turam", "men", { ua: "Антон Турам", en: "Anton Turam" }, {
    photos: ["/roster/anton-turam-hq.png"],
  }),
  placeholder("codename-tony", "men", {
    ua: "Коднейм Тоні",
    en: "Codename Tony",
  }, {
    photos: ["/roster/codename-tony-hq.png"],
    bio: profile(
      "179 см / 80 кг / технічний",
      "179 cm / 80 kg / technical",
      "«Тоні» — його позивний та ім’я, під яким він виступає на ринзі. Діючий Екстремальний Чемпіон UWA, який після перемоги над своїм колишнім найкращим другом Гамбітом готовий прийняти будь-який новий виклик.",
      "“Tony” is both his callsign and the name he wrestles under. The current UWA Extreme Champion, who after defeating his former best friend Gambit is ready to take on any new challenge."
    ),
  }),
  placeholder("vitalii-shcherbyna", "men", {
    ua: "Віталій Щербина",
    en: "Vitalii Shcherbyna",
  }, {
    photos: ["/roster/vitalii-shcherbyna-hq.png"],
    bio: profile(
      "185 см / 102 кг / пауерхаус",
      "185 cm / 102 kg / powerhouse",
      "Клієнт найкращого менеджера UWA — Живка Йовича. Харківський здоровань є колишнім Командним Чемпіоном UWA разом із Яросом Лютим.",
      "A client of UWA’s best manager — Zhyvko Yovich. The Kharkiv strongman is a former UWA Tag Team Champion together with Yaros Liutyi."
    ),
  }),
  placeholder("o-skar", "men", { ua: "О-Скар", en: "O-Skar" }, {
    photos: ["/roster/o-skar-hq.png"],
  }),
  placeholder("dmytro-tyutyun", "men", {
    ua: "Дмитро Тютюн",
    en: "Dmytro Tyutyun",
  }, {
    photos: ["/roster/dmytro-tyutyun-hq.png"],
  }),
  placeholder("dmytro-verkas", "men", {
    ua: "Дмитро Веркас",
    en: "Dmytro Verkas",
  }, {
    photos: ["/roster/dmytro-verkas-hq.png"],
  }),
  placeholder("max-shcherbak", "men", {
    ua: "Макс Щербак",
    en: "Max Shcherbak",
  }, {
    photos: ["/roster/max-shcherbak-hq.png"],
  }),
  placeholder("hantry", "men", { ua: "Хантрі", en: "Hantry" }, {
    photos: ["/roster/hantry-hq.png"],
  }),
  placeholder("ilya-grim", "men", { ua: "Ілья Грім", en: "Ilya Grim" }, {
    photos: ["/roster/ilya-grim-hq.png"],
    bio: profile(
      "187 см / 67 кг / хай-флай",
      "187 cm / 67 kg / high-flyer",
      "Зовсім нова команда двох братів-близнюків. Їхню спритність та швидкість можна порівняти з блискавкою під час грому.",
      "A brand-new team of twin brothers. Their agility and speed can be compared to lightning during thunder."
    ),
  }),
  placeholder("ivan-grim", "men", { ua: "Іван Грім", en: "Ivan Grim" }, {
    photos: ["/roster/ivan-grim-hq.png"],
    bio: profile(
      "187 см / 67 кг / хай-флай",
      "187 cm / 67 kg / high-flyer",
      "Зовсім нова команда двох братів-близнюків. Їхню спритність та швидкість можна порівняти з блискавкою під час грому.",
      "A brand-new team of twin brothers. Their agility and speed can be compared to lightning during thunder."
    ),
  }),
  placeholder("lyubomyr", "men", { ua: "Любомир", en: "Lyubomyr" }, {
    photos: ["/roster/lyubomyr-hq.png"],
  }),
  placeholder("jake-omen", "guests", { ua: "Джейк Омен", en: "Jake Omen" }, {
    photos: ["/roster/jake-omen-hq.png"],
    bio: profile(
      "185 см / 98 кг / технічний",
      "185 cm / 98 kg / technical",
      "«Містер Інтернаціональний» — реслер, який виступав більш ніж у 40 країнах світу. Відомий своїми матчами в Японії (WRESTLE-1), Мексиці (IWRG) та американських промоушенах (AEW, ROH, GCW).",
      "“Mr. International” — a wrestler who has performed in more than 40 countries. Known for matches in Japan (WRESTLE-1), Mexico (IWRG), and American promotions (AEW, ROH, GCW)."
    ),
  }),
  placeholder("jorgu-agresor", "guests", { ua: "Йоргу Агресор", en: "Jorgu Agresor" }, {
    photos: ["/roster/jorgu-agresor-hq.png"],
    bio: profile(
      "190 см / 110 кг / хардкор, пауерхаус",
      "190 cm / 110 kg / hardcore, powerhouse",
      "Румунський здоровань та справжній блек-металіст із рисами трансильванського вампіра. Поєднує неймовірну фізичну силу з любов’ю до хардкорного реслінгу.",
      "A Romanian powerhouse and a true black-metalist with the traits of a Transylvanian vampire. He combines immense physical strength with a love of hardcore wrestling."
    ),
  }),
  placeholder("jake-lawless", "guests", { ua: "Джейк Лоулесс", en: "Jake Lawless" }, {
    photos: ["/roster/jake-lawless-hq.png"],
    bio: profile(
      "185 см / 90 кг / технічний",
      "185 cm / 90 kg / technical",
      "Двократний Світовий Командний Чемпіон шотландського промоушена ICW. Один із найкращих командних реслерів Шотландії, який разом із Броді Турнбуллом зробив командні титули ICW світовими.",
      "A two-time World Tag Team Champion of the Scottish promotion ICW. One of Scotland’s best tag-team wrestlers, who together with Brodie Turnbull made the ICW tag titles world titles."
    ),
  }),
  placeholder("tom-fulton", "guests", { ua: "Том Фултон", en: "Tom Fulton" }, {
    photos: ["/roster/tom-fulton-hq.png"],
    bio: profile(
      "181 см / 84 кг / технічний, хай-флай",
      "181 cm / 84 kg / technical, high-flyer",
      "Шотландський реслер із великим досвідом виступів по всьому світу. У 2014 році відкрив власний промоушен у Румунії.",
      "A Scottish wrestler with extensive experience performing around the world. In 2014 he opened his own promotion in Romania."
    ),
  }),
  placeholder("max-speed", "guests", { ua: "Макс Спід", en: "Max Speed" }, {
    photos: ["/roster/max-speed-hq.png"],
    bio: profile(
      "170 см / 80 кг / технічний",
      "170 cm / 80 kg / technical",
      "Польський реслер, колишній чемпіон польського промоушена PTW. Активно виступає на незалежній сцені по всій Європі.",
      "A Polish wrestler and former champion of the Polish promotion PTW. He actively performs on the independent scene across Europe."
    ),
  }),
  placeholder("jake-scukobyte", "guests", {
    ua: "Джейк Сикобайт",
    en: "Jake Scukobyte",
  }, {
    photos: ["/roster/jake-scukobyte-hq.png"],
  }),
  placeholder("hired-gun-grayson", "guests", {
    ua: "Хайрд Ган Грейсон",
    en: "Hired Gun Grayson",
  }, {
    photos: ["/roster/hired-gun-grayson-hq.png"],
  }),
  placeholder("alex-d-sin", "guests", { ua: "Алекс Д Сін", en: "Alex D Sin" }, {
    photos: ["/roster/alex-d-sin-hq.png"],
  }),
  placeholder("andrew-reed", "guests", { ua: "Ендрю Рід", en: "Andrew Reed" }, {
    photos: ["/roster/andrew-reed-hq.png"],
  }),
  placeholder("kenny-rivera", "guests", { ua: "Кенні Рівера", en: "Kenny Rivera" }, {
    photos: ["/roster/kenny-rivera-hq.png"],
  }),
  placeholder("corporation", "teams", { ua: "Корпорація", en: "Corporation" }, {
    photos: ["/roster/corporation-hq.png"],
  }),
  placeholder("hardcore", "teams", { ua: "Хардкор", en: "Hardcore" }, {
    photos: ["/roster/hardcore-hq.png"],
  }),
  placeholder("footballers", "teams", { ua: "Футболісти", en: "Footballers" }, {
    photos: ["/roster/footballers-hq.png"],
  }),
  placeholder("kostyantyn-knyaz", "managers", {
    ua: "Костянтин Князь",
    en: "Kostyantyn Knyaz",
  }, {
    photos: ["/roster/kostyantyn-knyaz-hq.png"],
  }),
  placeholder("djun", "managers", { ua: "Джун", en: "Djun" }, {
    photos: ["/roster/djun-hq.png"],
  }),
  placeholder("zhyvko-yovich", "managers", {
    ua: "Живко Йович",
    en: "Zhyvko Yovich",
  }, {
    photos: ["/roster/zhyvko-yovich-hq.png"],
  }),
  placeholder("ostin", "referees", { ua: "Остін", en: "Ostin" }, {
    photos: ["/roster/ostin-hq.png"],
  }),
  placeholder("papa-joe", "alumni", { ua: "Папа Джо", en: "Papa Joe" }, {
    photos: ["/roster/papa-joe-hq.png"],
  }),
  placeholder("andriy-gaidai", "alumni", {
    ua: "Андрій Гайдай",
    en: "Andriy Gaidai",
  }, {
    photos: ["/roster/andriy-gaidai-hq.png"],
  }),
  placeholder("vein", "alumni", { ua: "Вейн", en: "Vein" }, {
    photos: ["/roster/vein-hq.png"],
  }),
  placeholder("ruslan-insabe-kalanzhov", "alumni", {
    ua: "Руслан Інсейб Каланжов",
    en: "Ruslan Insabe Kalanzhov",
  }, {
    photos: ["/roster/ruslan-insabe-kalanzhov-hq.png"],
  }),
  placeholder("skella", "alumni", { ua: "Скелла", en: "Skella" }, {
    photos: ["/roster/skella-hq.png"],
  }),
];
