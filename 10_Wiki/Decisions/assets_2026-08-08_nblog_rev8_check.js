// rev8 검증 — 베이스: qa7.js (검수자 원본).
// ★변경분 3영역: (1) 이 헤더 주석 (2) 엔진 SL4_SWEEP의 c3
//   (ACTIVE잡 축 -> 예약 소유권 축) (3) 시나리오 드라이버 전면 재작성.
// ★엔진부 SL2/SL3/SL4/TX/INSERT_JOB/판정식(INV4,G2)은 원본과 바이트 동일.
const M=60; let now=0;
const slot={id:'X', reservedByJobId:null, reservedUntil:null, consumedAt:null, consumedByJobId:null};
let jobs=[];
const ACTIVE=new Set(['QUEUED','CLAIMED','RUNNING','SUBMITTED']);
const TERMINAL=new Set(['VERIFIED','UNVERIFIED','FAILED','EXPIRED','CANCELED','SKIPPED']);
const reset=()=>{jobs=[];Object.assign(slot,{reservedByJobId:null,reservedUntil:null,consumedAt:null,consumedByJobId:null});};

// DB 제약 9 (부분 유니크: slotId WHERE status IN ACTIVE) 를 INSERT 시점에 강제
function INSERT_JOB(id,st){
  if(ACTIVE.has(st) && jobs.some(j=>j.slotId==='X'&&ACTIVE.has(j.status)))
    throw new Error(`제약9 위반: ${id} INSERT 거부(이미 ACTIVE 잡 존재)`);
  const j={id,status:st,slotId:'X',claimedAt:null,publishAttemptAt:null};jobs.push(j);return j;
}
function SL2(jobId){                                                   // doc 951-966
  const ok = slot.consumedAt===null
    && !jobs.some(j=>j.slotId==='X'&&j.id!==jobId&&ACTIVE.has(j.status))
    && (slot.reservedUntil===null || slot.reservedUntil<=now || slot.reservedByJobId===jobId);
  if(ok){ slot.reservedByJobId=jobId; slot.reservedUntil=now+15*M; return 1; } return 0;
}
function SL3(job,at){ job.publishAttemptAt=at; slot.consumedAt=now; slot.consumedByJobId=job.id; }
function SL4(jobId){                                                   // doc 969-985
  const notExists=!jobs.some(j=>j.slotId==='X'&&j.publishAttemptAt!==null);
  const guard = slot.reservedByJobId===null || slot.reservedByJobId===jobId
             || (slot.reservedUntil!==null && slot.reservedUntil<=now);
  if(notExists&&guard){Object.assign(slot,{reservedByJobId:null,reservedUntil:null,consumedAt:null,consumedByJobId:null});return 1;} return 0;
}
function SL4_SWEEP(){                                                  // doc 988-1002
  const c1 = slot.consumedAt!==null;
  const c2 = !jobs.some(j=>j.slotId==='X'&&j.publishAttemptAt!==null);
  // ★rev8 교체: 가드축 = "살아있는 남의 예약"(소유권). ACTIVE 잡 유무가 아니다.
  const owner = jobs.find(j=>j.id===slot.reservedByJobId);
  const c3 = slot.reservedByJobId===null
          || (slot.reservedUntil!==null && slot.reservedUntil<=now)
          || !(owner && ACTIVE.has(owner.status));
  if(c1&&c2&&c3){Object.assign(slot,{reservedByJobId:null,reservedUntil:null,consumedAt:null,consumedByJobId:null});return 1;} return 0;
}
// ★트리거를 하드코딩하지 않고 규범 ⓧⓨ 술어로 복원 (doc 947행)
function TX(job,{status,pubAttempt}={}){
  const s0=job.status, p0=job.publishAttemptAt;
  if(status!==undefined) job.status=status;
  if(pubAttempt!==undefined){ if(pubAttempt===null) job.publishAttemptAt=null; else SL3(job,pubAttempt); }
  const x = TERMINAL.has(job.status) && (!TERMINAL.has(s0) || s0!==job.status); // ⓧ 진입 or 내부이동
  const y = (p0===null)!==(job.publishAttemptAt===null);                        // ⓨ 세팅/해제
  if(x||y){ const r=SL4(job.id); return {fired:true,by:(x?'ⓧ':'')+(y?'ⓨ':''),rows:r}; }
  return {fired:false,rows:0};
}
const INV4=()=> (slot.consumedAt!==null)===jobs.some(j=>j.slotId==='X'&&j.publishAttemptAt!==null);
const G2=()=> slot.consumedAt!==null?1:0;

const line=(s)=>console.log(s);
line('=== [C-재검] SWEEP이 ACTIVE 잡에 막히는가 (rev7 중대1 재발 여부) ===');
reset(); INSERT_JOB('A','FAILED');
Object.assign(slot,{consumedAt:0,consumedByJobId:'A',reservedByJobId:'A',reservedUntil:15*M});
line('  stale 주입: INV4='+(INV4()?'OK':'★VIOLATED')+' G2='+G2());
INSERT_JOB('R','QUEUED'); line('  재시도 잡 R QUEUED INSERT (제약9 통과)');
now=1*M; line('  t=1m  SWEEP rows='+SL4_SWEEP()+'  INV4='+(INV4()?'OK':'★VIOLATED')+'  G2='+G2());
line('  t=1m  R claim SL2 rows='+SL2('R')+'  예약주인='+slot.reservedByJobId);
line('  ==> 1분 내 복구+claim? '+((INV4()&&slot.reservedByJobId==='R')?'YES':'★NO'));
line('');
line('=== [D-재검] SWEEP이 정상 진행 잡을 건드리는가 (회귀) ===');
reset(); now=0; const B=INSERT_JOB('B','RUNNING'); SL2('B'); SL3(B,now);
line('  발행중 잡 B(publishAttemptAt 있음)  SWEEP rows='+SL4_SWEEP()+' (0이어야 정상) INV4='+(INV4()?'OK':'★VIOLATED'));
reset(); now=0; INSERT_JOB('C','CLAIMED'); SL2('C');
line('  예약 쥔 활성 잡 C (stale 아님)      SWEEP rows='+SL4_SWEEP()+' (0이어야 정상) 예약주인='+slot.reservedByJobId);
reset(); now=0; INSERT_JOB('D','CLAIMED'); SL2('D'); Object.assign(slot,{consumedAt:0,consumedByJobId:'D'});
line('  살아있는 예약 쥔 D + stale          SWEEP rows='+SL4_SWEEP()+' (0이어야 정상=보호) 예약주인='+slot.reservedByJobId);
line('');
line('=== [A-재검] 시나리오4 — 트리거를 하드코딩 없이 규범 술어(TX)로 ===');
reset(); now=0; const E=INSERT_JOB('E','CLAIMED'); E.claimedAt=0; SL2('E');
now=16*M; let r=TX(E,{pubAttempt:E.claimedAt,status:'UNVERIFIED'});
line('  ACTIVE→UNVERIFIED: 발동='+r.fired+' '+(r.by||'')+' rows='+r.rows);
now=18*M; r=TX(E,{pubAttempt:null,status:'FAILED'});
line('  UNVERIFIED→FAILED: 발동='+r.fired+' '+(r.by||'')+' rows='+r.rows);
line('  => 자리: '+(slot.consumedAt!==null?'★영구소각':'해제됨')+'  INV4='+(INV4()?'OK':'★VIOLATED')+'  G2='+G2());
line('');
line('=== [B-재검] 부록D 시나리오1 — 제약9에 맞는 셋업으로 재구성 ===');
reset(); now=0; const A2=INSERT_JOB('A','CLAIMED'); A2.claimedAt=0; SL2('A');
line('  A claim: 예약주인='+slot.reservedByJobId+'/'+(slot.reservedUntil/M)+'m');
now=2*M; let r2=TX(A2,{status:'SKIPPED'}); line('  A→SKIPPED: SL4 발동='+r2.fired+' rows='+r2.rows);
now=3*M; const B2=INSERT_JOB('B','QUEUED'); B2.status='CLAIMED';
line('  (A가 TERMINAL 된 뒤에야) B INSERT+claim SL2 rows='+SL2('B')+'  예약주인='+slot.reservedByJobId);
now=4*M; line('  reaper가 종료된 A로 SL4 재실행 rows='+SL4('A')+' (0이어야 정상)');
line('  => B 예약 보존? '+(slot.reservedByJobId==='B'?'YES':'★NO'));
let blocked=false; try{ INSERT_JOB('C','QUEUED'); }catch(e){ blocked=true; line('  수동발행 C INSERT: '+e.message); }
line('  => C가 제약9로 막힘? '+(blocked?'YES(정상)':'★NO'));
