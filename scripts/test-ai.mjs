#!/usr/bin/env node
/** Quick Galaxy Guide smoke test — run while `npm run dev` is active. */
const base = process.env.AI_TEST_URL || 'http://localhost:5173';
const healthUrl = `${base}/api/assistant/health`;
const chatUrl = `${base}/api/assistant/chat`;

const ctx =
  'Galaxy Guide. Ten roles: Super Admin, Help Desk Manager, Support Supervisor, Support Agent, IT Technician, Department Head, Employee/Customer, Knowledge Base Editor, QA Officer, System Auditor. Demo password password123.';

async function main() {
  console.log('Galaxy Guide smoke test\n');
  console.log('1. Health', healthUrl);
  const health = await fetch(healthUrl);
  const healthJson = await health.json();
  console.log(health.ok ? '   OK' : '   FAIL', healthJson);
  if (!health.ok) {
    console.error('\nStart the app with: npm run dev');
    process.exit(1);
  }

  const cases = [
    ['Helpdesk', 'What is the demo password? One short sentence.'],
    ['General', 'What is 12 + 8? Reply with the number only.'],
    ['Open', 'One sentence: what does SLA mean in IT support?'],
  ];

  for (let i = 0; i < cases.length; i++) {
    const [label, question] = cases[i];
    console.log(`\n2.${i + 1} ${label}:`, question);
    const res = await fetch(chatUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: question }],
        systemContext: ctx,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      console.error('   FAIL', data.error);
      process.exit(1);
    }
    console.log('   OK', data.reply?.slice(0, 120) + (data.reply?.length > 120 ? '…' : ''));
  }

  console.log('\nAll checks passed.');
}

main().catch((e) => {
  console.error(e.message || e);
  console.error('\nIs npm run dev running? Try: AI_TEST_URL=http://localhost:5178 npm run test:ai');
  process.exit(1);
});
