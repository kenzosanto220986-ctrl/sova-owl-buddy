// Optional, parent-enabled camera. On-device face detection only (MediaPipe Face Landmarker, loaded from CDN).
// No frames, photos, video or landmarks are stored or sent anywhere. Only coarse signals are emitted:
//   'present' | 'gone' | 'away' | 'back' | 'smile'
const VER = '0.10.14';
const CDN = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${VER}`;
const MODEL = 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task';

let stream = null, video = null, lm = null, timer = null, handler = () => {};
const st = { present: false, lastSeen: 0, awaySince: 0, smiling: false, goneFired: false, awayFired: false };
export const cameraStats = { smiles: 0, awayEvents: 0, goneEvents: 0, samples: 0, smileSamples: 0 };

export async function startCamera(onSignal) {
  handler = onSignal || (() => {});
  if (!navigator.mediaDevices?.getUserMedia) throw new Error('Camera not supported on this browser');
  stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: 320, height: 240 }, audio: false });
  video = document.createElement('video');
  video.playsInline = true; video.muted = true; video.srcObject = stream;
  video.className = 'cam-video'; document.body.appendChild(video);
  await video.play();
  const vision = await import(/* @vite-ignore */ `${CDN}/vision_bundle.mjs`);
  const files = await vision.FilesetResolver.forVisionTasks(`${CDN}/wasm`);
  lm = await vision.FaceLandmarker.createFromOptions(files, {
    baseOptions: { modelAssetPath: MODEL, delegate: 'GPU' }, runningMode: 'VIDEO', numFaces: 1, outputFaceBlendshapes: true,
  });
  st.lastSeen = performance.now();
  timer = setInterval(tick, 250);
}

function tick() {
  if (!lm || !video || video.readyState < 2) return;
  const now = performance.now();
  let res; try { res = lm.detectForVideo(video, now); } catch { return; }
  const face = res.faceLandmarks?.[0];
  cameraStats.samples++;
  if (!face) {
    if (st.present && now - st.lastSeen > 1500) st.present = false;
    if (!st.goneFired && now - st.lastSeen > 6000) { st.goneFired = true; cameraStats.goneEvents++; handler('gone'); }
    return;
  }
  if (st.goneFired) { st.goneFired = false; handler('back'); }
  if (!st.present) { st.present = true; handler('present'); }
  st.lastSeen = now;
  // head yaw: nose tip (1) between outer eye corners (33, 263)
  const l = face[33], r = face[263], n = face[1];
  const ratio = (n.x - l.x) / ((r.x - l.x) || 1e-6);
  const away = ratio < 0.22 || ratio > 0.78;
  if (away) { if (!st.awaySince) st.awaySince = now; if (!st.awayFired && now - st.awaySince > 5000) { st.awayFired = true; cameraStats.awayEvents++; handler('away'); } }
  else { if (st.awayFired) handler('back'); st.awaySince = 0; st.awayFired = false; }
  const bs = res.faceBlendshapes?.[0]?.categories || [];
  const g = (name) => bs.find((c) => c.categoryName === name)?.score || 0;
  const smile = (g('mouthSmileLeft') + g('mouthSmileRight')) / 2 > 0.45;
  if (smile) cameraStats.smileSamples++;
  if (smile && !st.smiling) { cameraStats.smiles++; handler('smile'); }
  st.smiling = smile;
}

export function stopCamera() {
  clearInterval(timer); timer = null;
  try { lm?.close(); } catch {}
  lm = null;
  stream?.getTracks().forEach((t) => t.stop()); stream = null;
  video?.remove(); video = null;
  Object.assign(st, { present: false, lastSeen: 0, awaySince: 0, smiling: false, goneFired: false, awayFired: false });
}
export const cameraOn = () => !!stream;
export const resetCameraStats = () => Object.keys(cameraStats).forEach((k) => (cameraStats[k] = 0));
