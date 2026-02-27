const store = new Map();
let sequence = 1;

function nextId(prefix) {
  const id = `${prefix}_${String(sequence).padStart(4, "0")}`;
  sequence += 1;
  return id;
}

function validateFile(file) {
  if (!file || typeof file !== "object") {
    return { valid: false, reason: "invalid_payload" };
  }
  if (!file.name || typeof file.name !== "string") {
    return { valid: false, reason: "missing_name" };
  }
  if (!Buffer.isBuffer(file.content)) {
    return { valid: false, reason: "invalid_content_type" };
  }
  if (file.content.length === 0) {
    return { valid: false, reason: "empty_file" };
  }
  if (file.name.includes("invalida")) {
    return { valid: false, reason: "invalid_structure" };
  }
  if (file.name.includes("corrompido")) {
    return { valid: false, reason: "corrupted_file" };
  }
  return { valid: true };
}

function upload(file) {
  const validation = validateFile(file);
  if (!validation.valid) {
    return {
      ok: false,
      statusCode: 400,
      error: validation.reason
    };
  }

  const arquivoId = nextId("arq");
  const processoId = nextId("proc");
  const now = Date.now();
  const processingMs = 120;

  store.set(processoId, {
    processoId,
    arquivoId,
    uploadedAt: now,
    willFinishAt: now + processingMs,
    status: "PROCESSANDO",
    result: { status: "ok" }
  });

  return {
    ok: true,
    statusCode: 201,
    data: {
      arquivoId,
      processoId,
      status: "PROCESSANDO"
    }
  };
}

function getProcesso(processoId) {
  const p = store.get(processoId);
  if (!p) {
    return { ok: false, statusCode: 404, error: "process_not_found" };
  }

  if (Date.now() >= p.willFinishAt) {
    p.status = "FINALIZADO";
    store.set(processoId, p);
  }

  return {
    ok: true,
    statusCode: 200,
    data: {
      processoId: p.processoId,
      arquivoId: p.arquivoId,
      status: p.status
    }
  };
}

function getResultado(processoId) {
  const p = store.get(processoId);
  if (!p) {
    return { ok: false, statusCode: 404, error: "process_not_found" };
  }
  if (p.status !== "FINALIZADO") {
    return { ok: false, statusCode: 409, error: "process_not_finished" };
  }

  return {
    ok: true,
    statusCode: 200,
    data: {
      processoId: p.processoId,
      arquivoId: p.arquivoId,
      auditoria: p.result
    }
  };
}

async function waitForProcess(processoId, opts = {}) {
  const timeoutMs = opts.timeoutMs || 3000;
  const pollIntervalMs = opts.pollIntervalMs || 60;
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    const processo = getProcesso(processoId);
    if (!processo.ok) return processo;
    if (processo.data.status === "FINALIZADO") return processo;
    await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
  }

  return { ok: false, statusCode: 408, error: "poll_timeout" };
}

function resetStore() {
  store.clear();
  sequence = 1;
}

module.exports = {
  upload,
  getProcesso,
  getResultado,
  waitForProcess,
  resetStore
};
