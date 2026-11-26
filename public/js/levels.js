// SOVA v2: level maps. 5 stages x (10 levels + 1 boss) per world = 55 nodes per world, 220 total.
// Story levels (v1 scripted adventures) sit at Stage 1 levels 3 and 7 of each world.
import { STAGES, makeQuestion } from './questions.js';
import { adventuresFor } from './adventures.js';

export const WORLD_IDS = ['dino', 'space', 'cars', 'jungle'];
export const STORY_SLOTS = { 3: 0, 7: 1 }; // stage-1 level n -> adventure index

export const BOSSES = {
  dino:   { id: 'pythagoras', ru: 'Профессор Пифагор', name: 'Professor Pythagoras', subject: 'math',
            intro: 'Сегодня я, Сова, играю роль профессора Пифагора! Это понарошку, как в театре. Настоящий Пифагор жил очень давно в Греции и очень любил числа и треугольники.' },
  space:  { id: 'einstein', ru: 'Альберт Эйнштейн', name: 'Albert Einstein', subject: 'space & curiosity',
            intro: 'Сегодня я, Сова, играю роль Альберта Эйнштейна! Это понарошку, как в сказке. Настоящий Эйнштейн был учёным, который всё время удивлялся звёздам и задавал вопросы «почему?».' },
  cars:   { id: 'tesla', ru: 'Капитан Тесла', name: 'Captain Tesla', subject: 'science & electricity',
            intro: 'Сегодня я, Сова, играю роль Капитана Теслы! Это понарошку, как в театре. Настоящий Никола Тесла был изобретателем и очень любил электричество.' },
  jungle: { id: 'darwin', ru: 'Профессор Дарвин', name: 'Professor Darwin', subject: 'animals & nature',
            intro: 'Сегодня я, Сова, играю роль Чарльза Дарвина! Это понарошку, как в книжке. Настоящий Дарвин путешествовал по миру и изучал животных.' },
};

export function nodes(world) {
  const out = [];
  for (const st of STAGES) {
    for (let n = 1; n <= 10; n++) out.push({ id: `${st.n}-${n}`, stage: st.n, n, type: st.n === 1 && STORY_SLOTS[n] !== undefined ? 'story' : 'quiz', world });
    out.push({ id: `${st.n}-B`, stage: st.n, n: 11, type: 'boss', world });
  }
  return out;
}
export const nodeById = (world, id) => nodes(world).find((x) => x.id === id);

export function storyAdventure(world, node) { return adventuresFor(world)[STORY_SLOTS[node.n]]; }

export function levelPlan(world, node, attempt, ctx) {
  const st = STAGES[node.stage - 1]; const sk = st.skills;
  const seed = (i) => `${world}|${node.id}|${attempt}|${i}`;
  if (node.type === 'boss') { const sh = shuffleSkills(sk, `${world}${node.id}${attempt}`); return Array.from({ length: 5 }, (_, i) => makeQuestion(sh[i % sh.length], world, seed(i), 1, ctx)); }
  const d = (node.n - 1) / 9;
  const a = sk[(node.n - 1) % sk.length], b = sk[node.n % sk.length];
  const count = node.stage <= 2 ? 4 : 5;
  return Array.from({ length: count }, (_, i) => makeQuestion(i % 2 ? b : a, world, seed(i), d, ctx));
}
export function practicePlan(world, stage, skill, ctx, seed) {
  return [0, 1, 2].map((i) => ({ ...makeQuestion(skill, world, `${seed}|p${i}`, 0, ctx), practice: true }));
}
function shuffleSkills(a, seed) { let h = 7; for (const c of seed) h = (h * 33 + c.charCodeAt(0)) >>> 0; const b = [...a]; for (let i = b.length - 1; i > 0; i--) { h = (h * 1103515245 + 12345) >>> 0; const j = h % (i + 1); [b[i], b[j]] = [b[j], b[i]]; } return b; }
