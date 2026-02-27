const {
  upload,
  getProcesso,
  waitForProcess,
  getResultado,
  resetStore
} = require("../../src/simulator/asisSimulator");
const { validFile } = require("./_fixtures");
const { writeRequirementEvidence } = require("../../utils/evidence");

describe("RNF1 - Integridade da trilha", () => {
  beforeEach(() => {
    resetStore();
  });

  test("deve manter correlacao entre arquivoId e processoId em toda a jornada", async () => {
    const metadata = {
      id: "RNF1",
      driver: "Rastreabilidade",
      team: "Blue",
      expected: "arquivoId/processoId devem permanecer consistentes no upload, processo e resultado"
    };

    const up = upload(validFile());
    expect(up.ok).toBe(true);

    const processoParcial = getProcesso(up.data.processoId);
    expect(processoParcial.ok).toBe(true);
    expect(processoParcial.data.arquivoId).toBe(up.data.arquivoId);

    const processoFinal = await waitForProcess(up.data.processoId);
    expect(processoFinal.ok).toBe(true);
    expect(processoFinal.data.arquivoId).toBe(up.data.arquivoId);
    expect(processoFinal.data.processoId).toBe(up.data.processoId);

    const resultado = getResultado(up.data.processoId);
    expect(resultado.ok).toBe(true);
    expect(resultado.data.arquivoId).toBe(up.data.arquivoId);
    expect(resultado.data.processoId).toBe(up.data.processoId);

    writeRequirementEvidence({
      ...metadata,
      status: "PASS",
      execution: {
        arquivoId: up.data.arquivoId,
        processoId: up.data.processoId
      }
    });
  });
});
