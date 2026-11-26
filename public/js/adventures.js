// SOVA scripted adventures (v1 "brain"). 4 worlds x 2 adventures.
// Segment helpers: R = Russian story glue, G = Greek target word, E = English target word.
// {x:true} marks an optional extra line used only when the parent picks "More Greek & English".
import { icon, bg, put, nest, C } from './art.js';

export const R = (t) => ({ lang: 'ru', t });
export const G = (t, o = {}) => ({ lang: 'el', t, hl: true, ...o });
export const E = (t, o = {}) => ({ lang: 'en', t, hl: true, ...o });
const X = (seg) => ({ ...seg, x: true });

const eggsRow = (n, y = 250, extra = '') => Array.from({ length: n }, (_, i) => put(icon.egg(), 300 + i * 70, y, 80, 'wobble')).join('') + extra;

export const WORLDS = {
  dino:   { id: 'dino',   name: 'Dino Valley',    ru: 'Долина динозавров', el: 'Κοιλάδα δεινοσαύρων', accessory: 'bandana', color: C.leaf,  keys: ['дино', 'динозавр', 'dino', 'δεινόσαυρ', 'долин'] },
  space:  { id: 'space',  name: 'Space Station',  ru: 'Космическая станция', el: 'Διαστημικός σταθμός', accessory: 'helmet', color: C.navy,  keys: ['космос', 'косми', 'ракет', 'space', 'διάστημ', 'звезд', 'планет'] },
  cars:   { id: 'cars',   name: 'Car Race City',  ru: 'Город гонок', el: 'Πόλη αγώνων', accessory: 'goggles', color: C.terra, keys: ['машин', 'гонк', 'car', 'αυτοκίνητ', 'врум', 'город'] },
  jungle: { id: 'jungle', name: 'Animal Jungle',  ru: 'Джунгли зверей', el: 'Ζούγκλα ζώων', accessory: 'crown', color: '#4E8F3A', keys: ['живот', 'звер', 'джунгл', 'animal', 'ζώ', 'ζούγκλ', 'лев'] },
};

export const ADVENTURES = [
  /* ---------------- DINO VALLEY ---------------- */
  {
    id: 'dino-eggs', world: 'dino', title: 'The Wobbly Eggs', practiced: 'counted to 3 and 4; round vs. triangle',
    tip: 'At dinner, ask David to count the plates and say "αυγό" when you have eggs.',
    beats: [
      { scene: () => bg.dino(nest(400, 330, 150) + eggsRow(3)),
        say: [R('Смотри, Давид! Гнездо, а в нём яйца. Они качаются!'), R('Сколько тут яиц? Давай посчитаем!')],
        choices: [
          { icon: icon.dots(2), keys: ['два', '2', 'two', 'δύο'] },
          { icon: icon.dots(3), ok: true, keys: ['три', '3', 'three', 'τρία'] },
          { icon: icon.dots(4), keys: ['четыре', '4', 'four', 'τέσσερ'] }],
        okSay: [R('Один, два, три! Три яйца!')],
        hint: [R('Давай вместе: один… два… три. Нажми, где три точки.')] },
      { scene: () => bg.dino(nest(400, 330, 150) + put(icon.egg(), 330, 150, 150, 'wobble')),
        say: [R('Яйцо по-гречески —'), G('αυγό'), R('. Попробуй: ав-ГО!'), X(R('А по-английски —')), X(E('egg'))],
        word: { ru: 'яйцо', el: 'αυγό', en: 'egg', elHint: 'ав-ГО', enHint: 'эг', icon: icon.egg() } },
      { scene: () => bg.dino(nest(400, 330, 150) + eggsRow(3) + put(icon.rock('triangle'), 90, 220, 150) + put(icon.rock('circle'), 570, 230, 150)),
        say: [R('Ой! Мама-динозавр говорит: яиц должно быть четыре. Одно спряталось!'), R('Оно за круглым камнем или за треугольным?')],
        choices: [
          { icon: icon.rock('triangle'), keys: ['треуг', 'triangle', 'τρίγων'], reply: [R('Хи-хи, тут только жучок! Может, за круглым камнем?')] },
          { icon: icon.rock('circle'), ok: true, keys: ['кругл', 'круг', 'circle', 'κύκλ', 'στρογγυλ'] }],
        okSay: [R('Нашли! Вот оно, четвёртое яйцо. Один, два, три, четыре!')] },
      { scene: () => bg.dino(nest(400, 330, 150) + eggsRow(3) + put(icon.dino(), 330, 120, 170, 'hop')),
        say: [R('Тук-тук… Крак! Вылупился малыш-динозавр!'), G('Αυγό'), E('egg'), R('— и вот динозаврик!'), R('Встань и потопай как динозавр. Три раза: топ, топ, топ!')],
        celebrate: true },
    ] },
  {
    id: 'dino-tiko', world: 'dino', title: "Tiko's Lost Footprints", practiced: 'big vs. small; triangle shape',
    tip: 'On a walk, ask David "μεγάλος or μικρός?" about dogs, cars and trees.',
    beats: [
      { scene: () => bg.dino(put(icon.foot('big'), 170, 230, 130) + put(icon.foot('small'), 360, 270, 110) + put(icon.foot('big'), 520, 230, 130)),
        say: [R('Тико, маленький трицератопс, потерялся! Вот следы.'), R('Какой след большой? Нажми на большой!')],
        choices: [
          { icon: icon.foot('small'), keys: ['маленьк', 'small', 'μικρ'], reply: [R('Это маленький след. А где большой-пребольшой?')] },
          { icon: icon.foot('big'), ok: true, keys: ['больш', 'big', 'μεγάλ'] }],
        okSay: [R('Да! Этот след большой!')] },
      { scene: () => bg.dino(put(icon.foot('big'), 310, 150, 200)),
        say: [R('Большой по-гречески —'), G('μεγάλος'), R('. Скажи: ме-га-ЛОС!'), X(R('По-английски —')), X(E('big'))],
        word: { ru: 'большой', el: 'μεγάλος', en: 'big', elHint: 'ме-га-ЛОС', enHint: 'биг', icon: icon.foot('big') } },
      { scene: () => bg.dino(put(icon.foot('small'), 220, 280, 90) + put(icon.foot('small'), 340, 250, 90) + put(icon.foot('small'), 460, 280, 90)),
        say: [R('А эти следы — Тико! Они какие?')],
        choices: [
          { icon: icon.foot('small'), ok: true, keys: ['маленьк', 'small', 'μικρ'] },
          { icon: icon.foot('big'), keys: ['больш', 'big', 'μεγάλ'], reply: [R('Хм, Тико ещё малыш. Его следы большие или маленькие?')] }],
        okSay: [R('Маленькие! Тико ещё малыш.')] },
      { scene: () => bg.dino(put(icon.foot('small'), 340, 200, 120)),
        say: [R('Маленький по-гречески —'), G('μικρός'), R('. Скажи: ми-КРОС!'), X(R('А по-английски —')), X(E('small'))],
        word: { ru: 'маленький', el: 'μικρός', en: 'small', elHint: 'ми-КРОС', enHint: 'смол', icon: icon.foot('small') } },
      { scene: () => bg.dino(`<path d="M240 330 Q400 60 560 330Z" fill="#8F8273"/><path d="M340 330 L400 210 L460 330Z" fill="#3B3229"/>`),
        say: [R('Следы ведут в пещеру! Дверь откроется, если нажать на треугольник.')],
        choices: [
          { icon: icon.shape('circle', C.gold), keys: ['кругл', 'круг', 'circle', 'κύκλ'], reply: [R('Это круг. А у треугольника три уголка!')] },
          { icon: icon.shape('triangle', C.terra), ok: true, keys: ['треуг', 'triangle', 'τρίγων'] },
          { icon: icon.shape('star', C.teal), keys: ['звезд', 'star', 'αστέρ'], reply: [R('Это звёздочка! Найди фигуру с тремя уголками.')] }],
        okSay: [R('Треугольник! Дверь открывается…')] },
      { scene: () => bg.dino(`<path d="M240 330 Q400 60 560 330Z" fill="#8F8273"/>` + put(icon.dino(), 320, 150, 170, 'hop')),
        say: [R('Тико! Вот ты где! Он нашёлся, потому что ты помог.'), R('Большой —'), G('μεγάλος'), R(', маленький —'), G('μικρός'), R('. Хут-хут!')],
        celebrate: true },
    ] },

  /* ---------------- SPACE STATION ---------------- */
  {
    id: 'space-rocket', world: 'space', title: 'Three Windows on the Rocket', practiced: 'counted to 3; star shape; "let\'s go" in 3 languages',
    tip: 'Before leaving the house, do a rocket countdown together: "три, два, один… πάμε!"',
    beats: [
      { scene: () => bg.space(rocketBig(false)),
        say: [R('Это ракета Лумик! Чтобы взлететь, нужно посчитать окошки.'), R('Сколько окон?')],
        choices: [
          { icon: icon.num(2), keys: ['два', '2', 'two', 'δύο'] },
          { icon: icon.num(3), ok: true, keys: ['три', '3', 'three', 'τρία'] },
          { icon: icon.num(5), keys: ['пять', '5', 'five', 'πέντε'] }],
        okSay: [R('Одно, два, три! Окошки загорелись!')],
        hint: [R('Давай посчитаем вместе: одно… два… три.')] },
      { scene: () => bg.space(rocketBig(true)),
        say: [R('Теперь нажми на кнопку-звезду!')],
        choices: [
          { icon: icon.shape('circle', '#7FC7F0'), keys: ['кругл', 'круг', 'circle', 'κύκλ'], reply: [R('Это кружок. А звезда с лучиками!')] },
          { icon: icon.shape('square', C.terra), keys: ['квадрат', 'square', 'τετράγων'], reply: [R('Это квадрат. Где звёздочка?')] },
          { icon: icon.shape('star', C.gold), ok: true, keys: ['звезд', 'star', 'αστέρ'] }],
        okSay: [R('Звезда! Мотор гудит: у-у-у!')] },
      { scene: () => bg.space(put(icon.shape('star', C.gold), 320, 110, 170, 'spin')),
        say: [R('Звезда по-гречески —'), G('αστέρι'), R('. Скажи: ас-ТЕ-ри!'), X(R('По-английски —')), X(E('star'))],
        word: { ru: 'звезда', el: 'αστέρι', en: 'star', elHint: 'ас-ТЕ-ри', enHint: 'стар', icon: icon.shape('star', C.gold) } },
      { scene: () => bg.space(rocketBig(true)),
        say: [R('Космонавты говорят «Поехали!». По-гречески —'), G('πάμε'), R('. Скажи громко: ПА-ме!'), X(R('По-английски —')), X(E("let's go"))],
        word: { ru: 'поехали', el: 'πάμε', en: "let's go", elHint: 'ПА-ме', enHint: 'летс гоу', icon: icon.rocket() } },
      { scene: () => bg.space(`<g class="liftoff">${rocketBig(true)}</g>`),
        say: [R('Три, два, один… Поехали!'), G('Πάμε!'), E("Let's go!"), R('Мы летим к звёздам!')],
        celebrate: true },
    ] },
  {
    id: 'space-moon', world: 'space', title: 'Where Did the Moon Go?', practiced: 'planets are round (circle); moon shapes',
    tip: 'Tonight, look at the Moon together and ask David what shape it is today: φεγγάρι!',
    beats: [
      { scene: () => bg.space(put(icon.planet('#E9A15B'), 120, 120, 180) + put(icon.planet('#7FC7F0', false), 340, 200, 130) + put(icon.planet('#E07A5F', false), 520, 90, 150)),
        say: [R('Посмотри на планеты! Какой они формы?')],
        choices: [
          { icon: icon.shape('square', C.teal), keys: ['квадрат', 'square', 'τετράγων'], reply: [R('Хм, у квадрата уголки. А у планет есть уголки?')] },
          { icon: icon.shape('circle', '#E9A15B'), ok: true, keys: ['кругл', 'круг', 'шар', 'мяч', 'circle', 'round', 'κύκλ', 'στρογγυλ'] },
          { icon: icon.shape('triangle', C.terra), keys: ['треуг', 'triangle', 'τρίγων'], reply: [R('Треугольник острый. А планеты гладкие и…')] }],
        okSay: [R('Да! Планеты круглые, как мячик.')] },
      { scene: () => bg.space(put(icon.moon('full'), 320, 90, 180)),
        say: [R('А это Луна! Луна по-гречески —'), G('φεγγάρι'), R('. Скажи: фен-ГА-ри!'), X(R('По-английски —')), X(E('moon'))],
        word: { ru: 'луна', el: 'φεγγάρι', en: 'moon', elHint: 'фен-ГА-ри', enHint: 'мун', icon: icon.moon('full') } },
      { scene: () => bg.space(put(icon.moon('crescent'), 560, 70, 120, 'peek')),
        say: [R('Ой! Луна стала тоненькой, как улыбка. Она спряталась?'), R('Найди Луну-улыбку!')],
        choices: [
          { icon: icon.moon('full'), keys: ['кругл', 'блин', 'full'], reply: [R('Это круглая Луна. А где тоненькая, как улыбка?')] },
          { icon: icon.moon('crescent'), ok: true, keys: ['улыб', 'тонк', 'тонень', 'smile'] },
          { icon: icon.moon('half'), keys: ['половин', 'half'], reply: [R('Это половинка. Ещё тоньше!')] }],
        okSay: [R('Нашёл! Луна не теряется. Она просто меняет форму.')] },
      { scene: () => bg.space(put(icon.moon('half'), 200, 120, 120) + put(icon.moon('crescent'), 480, 120, 120)),
        say: [R('А где Луна совсем круглая, как блинчик?')],
        choices: [
          { icon: icon.moon('crescent'), keys: ['улыб', 'тонк'], reply: [R('Это улыбка. А круглая, как блинчик?')] },
          { icon: icon.moon('half'), keys: ['половин', 'half'], reply: [R('Это половинка. Найди целую!')] },
          { icon: icon.moon('full'), ok: true, keys: ['кругл', 'блин', 'full', 'circle', 'κύκλ'] }],
        okSay: [R('Круглая Луна! Как блинчик!')] },
      { scene: () => bg.space(put(icon.moon('full'), 320, 80, 170, 'glow')),
        say: [R('Луна —'), G('φεγγάρι'), E('moon'), R('. Она всегда с нами, даже когда прячется. Как спокойно и красиво!')],
        celebrate: true },
    ] },

  /* ---------------- CAR RACE CITY ---------------- */
  {
    id: 'cars-garage', world: 'cars', title: 'The Rainbow Garage', practiced: 'colors red and blue; counted to 4',
    tip: 'In the car, play "find something κόκκινο / red" out of the window.',
    beats: [
      { scene: () => bg.cars(put(icon.garage('#E04B3A'), 80, 150, 140) + put(icon.garage('#3D7DD8'), 330, 150, 140) + put(icon.garage('#F4C45A'), 580, 150, 140) + put(icon.car('#E04B3A'), 330, 290, 130, 'drive')),
        say: [R('Это Врум, красная гоночная машинка! Ему нужно в свой гараж.'), R('Какой гараж красный?')],
        choices: [
          { icon: icon.garage('#3D7DD8'), keys: ['син', 'blue', 'μπλε'], reply: [R('Би-бип! Это синий гараж. А где красный?')] },
          { icon: icon.garage('#E04B3A'), ok: true, keys: ['красн', 'red', 'κόκκιν'] },
          { icon: icon.garage('#F4C45A'), keys: ['жёлт', 'желт', 'yellow', 'κίτριν'], reply: [R('Би-бип! Это жёлтый. Врум красный!')] }],
        okSay: [R('Врум-врум! Красная машина в красном гараже!')] },
      { scene: () => bg.cars(put(icon.car('#E04B3A'), 300, 160, 200, 'drive')),
        say: [R('Красный по-гречески —'), G('κόκκινο'), R('. Скажи: КО-ки-но!'), X(R('По-английски —')), X(E('red'))],
        word: { ru: 'красный', el: 'κόκκινο', en: 'red', elHint: 'КО-ки-но', enHint: 'рэд', icon: icon.car('#E04B3A') } },
      { scene: () => bg.cars(put(icon.garage('#F4C45A'), 80, 150, 140) + put(icon.garage('#3D7DD8'), 580, 150, 140) + put(icon.car('#3D7DD8'), 330, 290, 130, 'drive')),
        say: [R('А вот синяя машинка. Найди синий гараж!')],
        choices: [
          { icon: icon.garage('#F4C45A'), keys: ['жёлт', 'желт', 'yellow', 'κίτριν'], reply: [R('Би-бип! Это жёлтый. А синий где?')] },
          { icon: icon.garage('#3D7DD8'), ok: true, keys: ['син', 'blue', 'μπλε'] }],
        okSay: [R('Синий! Ура, приехали!')] },
      { scene: () => bg.cars(put(icon.car('#3D7DD8'), 300, 160, 200, 'drive')),
        say: [R('Синий по-гречески —'), G('μπλε'), R('. Скажи: БЛЕ!'), X(R('По-английски —')), X(E('blue'))],
        word: { ru: 'синий', el: 'μπλε', en: 'blue', elHint: 'бле', enHint: 'блу', icon: icon.car('#3D7DD8') } },
      { scene: () => bg.cars(['#E04B3A', '#3D7DD8', '#F4C45A', '#7CB342'].map((c, i) => put(icon.car(c), 60 + i * 175, 270, 130)).join('')),
        say: [R('Сколько машин готово к гонке? Посчитай!')],
        choices: [
          { icon: icon.num(3), keys: ['три', '3', 'three', 'τρία'] },
          { icon: icon.num(4), ok: true, keys: ['четыре', '4', 'four', 'τέσσερ'] },
          { icon: icon.num(5), keys: ['пять', '5', 'five', 'πέντε'] }],
        okSay: [R('Один, два, три, четыре! Четыре машины!')],
        hint: [R('Давай пальчиком: одна… две… три… четыре.')] },
      { scene: () => bg.cars(`<rect x="370" y="60" width="60" height="170" rx="20" fill="#333"/><circle cx="400" cy="95" r="20" fill="#E04B3A" class="lamp l1"/><circle cx="400" cy="145" r="20" fill="#F4C45A" class="lamp l2"/><circle cx="400" cy="195" r="20" fill="#7CB342" class="lamp l3"/>` + put(icon.car('#E04B3A'), 120, 270, 130, 'drive')),
        say: [R('Красный… жёлтый… зелёный!'), E('Ready, steady, go!'), R('Хут-хут, какая гонка!')],
        celebrate: true },
    ] },
  {
    id: 'cars-signs', world: 'cars', title: 'Signs on the Street', practiced: 'triangle and circle signs; slow near people',
    tip: 'On a walk, point at road signs and ask: "τρίγωνο or circle?"',
    beats: [
      { scene: () => bg.cars(`<g transform="rotate(-70 200 330)">${put(icon.sign('triangle'), 150, 260, 120)}</g><g transform="rotate(80 560 330)">${put(icon.sign('circle'), 510, 260, 120)}</g>` + put(icon.car('#E04B3A'), 330, 280, 120)),
        say: [R('Ой! Ветер уронил дорожные знаки. Помоги Вруму!'), R('Где треугольник?')],
        choices: [
          { icon: icon.sign('circle'), keys: ['кругл', 'круг', 'circle', 'κύκλ'], reply: [R('Это круглый знак. А у треугольника три уголка!')] },
          { icon: icon.sign('triangle'), ok: true, keys: ['треуг', 'triangle', 'τρίγων'] },
          { icon: icon.sign('square'), keys: ['квадрат', 'square', 'τετράγων'], reply: [R('Это квадрат. Найди три уголка!')] }],
        okSay: [R('Треугольник! Знак снова стоит.')] },
      { scene: () => bg.cars(put(icon.sign('triangle'), 320, 90, 180)),
        say: [R('Треугольник по-гречески —'), G('τρίγωνο'), R('. Скажи: ТРИ-го-но!'), X(R('По-английски —')), X(E('triangle'))],
        word: { ru: 'треугольник', el: 'τρίγωνο', en: 'triangle', elHint: 'ТРИ-го-но', enHint: 'трай-энгл', icon: icon.shape('triangle', C.terra) } },
      { scene: () => bg.cars(`<circle cx="400" cy="345" r="60" fill="#7CB342" stroke="#fff" stroke-width="6"/>` + put(icon.sign('triangle'), 120, 150, 120)),
        say: [R('Здесь круговая дорога. Какой знак тут нужен — круглый!'), R('Найди круглый знак.')],
        choices: [
          { icon: icon.sign('square'), keys: ['квадрат', 'square'], reply: [R('Это квадрат. А круглый где?')] },
          { icon: icon.sign('circle'), ok: true, keys: ['кругл', 'круг', 'circle', 'κύκλ'] }],
        okSay: [R('Круглый! Врум едет по кругу: вжух!')] },
      { scene: () => bg.cars(`<rect x="520" y="200" width="260" height="70" fill="#9BCF72"/><circle cx="600" cy="190" r="34" fill="#5E9A2E"/><circle cx="700" cy="185" r="40" fill="#6FAE48"/>` + put(icon.car('#E04B3A'), 200, 270, 130)),
        say: [R('Тут парк, тут гуляют дети. Здесь надо ехать медленно.'), R('Кто едет медленно?')],
        choices: [
          { icon: icon.rocket(), keys: ['ракет', 'быстр', 'rocket', 'fast'], reply: [R('Ракета — очень быстрая! А кто ползёт медленно?')] },
          { icon: icon.turtle(), ok: true, keys: ['черепах', 'медлен', 'turtle', 'slow', 'χελών', 'αργά'] }],
        okSay: [R('Черепаха! Она едет медленно-медленно.')] },
      { scene: () => bg.cars(put(icon.turtle(), 320, 140, 170, 'crawl')),
        say: [R('Медленно по-гречески —'), G('αργά'), R('. Скажи: ар-ГА!'), X(R('По-английски —')), X(E('slow'))],
        word: { ru: 'медленно', el: 'αργά', en: 'slow', elHint: 'ар-ГА', enHint: 'слоу', icon: icon.turtle() } },
      { scene: () => bg.cars(put(icon.sign('triangle'), 90, 150, 120) + put(icon.sign('circle'), 600, 150, 120) + put(icon.car('#E04B3A'), 330, 270, 130, 'drive')),
        say: [R('Ура! Знаки на месте. Возле людей едем'), G('αργά'), E('slow'), R('. Ты помог Вруму, Давид!')],
        celebrate: true },
    ] },

  /* ---------------- ANIMAL JUNGLE ---------------- */
  {
    id: 'jungle-sounds', world: 'jungle', title: 'Who Says That?', practiced: 'animal sounds; lion and frog words',
    tip: 'Play "who says r-r-r?" at bedtime — let David answer in any language.',
    beats: [
      { scene: () => bg.jungle(put(icon.lion(), 330, 160, 160, 'peek')),
        say: [R('Это львёнок Мики. Слушай: р-р-р! Кто так рычит?')],
        choices: [
          { icon: icon.frog(), keys: ['лягуш', 'frog', 'βάτραχ'], reply: [R('Лягушка говорит «ква». А кто рычит р-р-р?')] },
          { icon: icon.lion(), ok: true, keys: ['лев', 'львён', 'lion', 'λιοντάρ', 'мики'] },
          { icon: icon.mouse(), keys: ['мыш', 'mouse', 'ποντίκ'], reply: [R('Мышка пищит «пи-пи». А кто рычит?')] }],
        okSay: [R('Лев! Р-р-р! Но Мики добрый.')] },
      { scene: () => bg.jungle(put(icon.lion(), 310, 120, 200)),
        say: [R('Лев по-гречески —'), G('λιοντάρι'), R('. Скажи: лё-ДА-ри!'), X(R('По-английски —')), X(E('lion'))],
        word: { ru: 'лев', el: 'λιοντάρι', en: 'lion', elHint: 'лё-ДА-ри', enHint: 'лайон', icon: icon.lion() } },
      { scene: () => bg.jungle(`<ellipse cx="400" cy="350" rx="140" ry="30" fill="#5BB7E8"/>` + put(icon.parrot(), 600, 90, 110)),
        say: [R('У пруда кто-то говорит: ква-ква! Кто это?')],
        choices: [
          { icon: icon.parrot(), keys: ['попуга', 'parrot', 'παπαγάλ'], reply: [R('Попугай болтает слова! А кто квакает?')] },
          { icon: icon.frog(), ok: true, keys: ['лягуш', 'frog', 'βάτραχ', 'ква'] },
          { icon: icon.elephant(), keys: ['слон', 'elephant', 'ελέφαντ'], reply: [R('Слон трубит ту-ту! А кто квакает?')] }],
        okSay: [R('Лягушка! Ква-ква!')] },
      { scene: () => bg.jungle(put(icon.frog(), 320, 150, 170, 'hop')),
        say: [R('Лягушка по-гречески —'), G('βάτραχος'), R('. Скажи: ВА-тра-хос!'), X(R('По-английски —')), X(E('frog'))],
        word: { ru: 'лягушка', el: 'βάτραχος', en: 'frog', elHint: 'ВА-тра-хос', enHint: 'фрог', icon: icon.frog() } },
      { scene: () => bg.jungle(put(icon.parrot(), 330, 110, 160, 'hop')),
        say: [R('Попугай всё повторяет:'), G('λιοντάρι'), G('βάτραχος'), E('lion'), E('frog'), R('. Хи-хи! Какой болтун! Хут-хут!')],
        celebrate: true },
    ] },
  {
    id: 'jungle-sizes', world: 'jungle', title: 'Big, Small and Thirsty', practiced: 'biggest and smallest; what animals need',
    tip: 'At the zoo or in a picture book, ask David who is the biggest — ελέφαντας!',
    beats: [
      { scene: () => bg.jungle(put(icon.mouse(), 140, 280, 70) + put(icon.elephant(), 300, 140, 220) + put(icon.frog(), 600, 280, 80)),
        say: [R('Кто самый большой в джунглях?')],
        choices: [
          { icon: icon.mouse(), keys: ['мыш', 'mouse', 'ποντίκ'], reply: [R('Мышка крошечная! А кто огромный?')] },
          { icon: icon.elephant(), ok: true, keys: ['слон', 'elephant', 'ελέφαντ'] },
          { icon: icon.frog(), keys: ['лягуш', 'frog', 'βάτραχ'], reply: [R('Лягушка маленькая. Кто самый большой?')] }],
        okSay: [R('Слон! Он самый большой.')] },
      { scene: () => bg.jungle(put(icon.elephant(), 300, 110, 220)),
        say: [R('Слон по-гречески —'), G('ελέφαντας'), R('. Скажи: э-ЛЕ-фан-дас!'), X(R('По-английски —')), X(E('elephant'))],
        word: { ru: 'слон', el: 'ελέφαντας', en: 'elephant', elHint: 'э-ЛЕ-фан-дас', enHint: 'Э-ле-фант', icon: icon.elephant() } },
      { scene: () => bg.jungle(put(icon.lion(), 140, 220, 130) + put(icon.elephant(), 330, 160, 190) + put(icon.mouse(), 600, 300, 60, 'peek')),
        say: [R('А кто самый маленький? Он спрятался!')],
        choices: [
          { icon: icon.elephant(), keys: ['слон', 'elephant'], reply: [R('Слон огромный! А кто крошечный?')] },
          { icon: icon.lion(), keys: ['лев', 'lion'], reply: [R('Львёнок поменьше слона. Но есть ещё меньше!')] },
          { icon: icon.mouse(), ok: true, keys: ['мыш', 'mouse', 'ποντίκ'] }],
        okSay: [R('Мышка! Самая маленькая. Пи-пи!')] },
      { scene: () => bg.jungle(put(icon.mouse(), 330, 180, 150)),
        say: [R('Мышка по-гречески —'), G('ποντίκι'), R('. Скажи: пон-ДИ-ки!'), X(R('По-английски —')), X(E('mouse'))],
        word: { ru: 'мышка', el: 'ποντίκι', en: 'mouse', elHint: 'пон-ДИ-ки', enHint: 'маус', icon: icon.mouse() } },
      { scene: () => bg.jungle(rain() + put(icon.elephant(), 300, 150, 200)),
        say: [R('Пошёл дождик, а слону хочется пить. Что ему дать?')],
        choices: [
          { icon: icon.banana(), keys: ['банан', 'banana', 'μπανάν'], reply: [R('Банан — это еда, вкусно! А пить что?')] },
          { icon: icon.drop(), ok: true, keys: ['вод', 'water', 'νερ', 'пить'] },
          { icon: icon.leafroof(), keys: ['лист', 'крыш', 'leaf'], reply: [R('Это крыша от дождя. А пить слону что?')] }],
        okSay: [R('Водичка! Слон пьёт: буль-буль.')] },
      { scene: () => bg.jungle(put(icon.elephant(), 140, 170, 170) + put(icon.mouse(), 420, 280, 80) + put(icon.banana(), 560, 260, 100)),
        say: [R('Животным нужна еда и вода. Людям тоже!'), R('А я Сова из историй — мне есть не нужно. А тебе нужен вкусный перекус с мамой или папой!')],
        celebrate: true },
    ] },
];

function rocketBig(lit) {
  const win = lit ? '#FFE58A' : '#7FC7F0';
  return `<g class="${lit ? 'shake' : ''}" style="transform-origin:400px 220px">
    <path d="M400 50 Q470 110 465 290 L335 290 Q330 110 400 50Z" fill="#F4EEE2" stroke="#9FB3C2" stroke-width="6"/>
    ${[120, 175, 230].map((y) => `<circle cx="400" cy="${y}" r="20" fill="${win}" stroke="#5B8BA8" stroke-width="5"/>`).join('')}
    <path d="M335 230 L285 310 L335 295Z M465 230 L515 310 L465 295Z" fill="${C.terra}"/>
    ${lit ? `<path class="flame" d="M360 292 Q400 400 440 292Z" fill="${C.gold}"/><path class="flame" d="M378 292 Q400 360 422 292Z" fill="${C.terra}"/>` : ''}
  </g>`;
}
function rain() {
  return Array.from({ length: 30 }, (_, i) => `<path class="rain" style="animation-delay:${(i % 6) * 0.2}s" d="M${(i * 53) % 800} ${(i * 37) % 200} l-6 18" stroke="#5BB7E8" stroke-width="4" stroke-linecap="round"/>`).join('');
}

export const adventuresFor = (world) => ADVENTURES.filter((a) => a.world === world);
