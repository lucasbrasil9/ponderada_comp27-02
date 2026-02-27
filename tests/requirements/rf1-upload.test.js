const { upload, resetStore } = require("../../src/simulator/asisSimulator");
const { validFile } = require("./_fixtures");
const { writeRequirementEvidence } = require("../../utils/evidence");

describe("RF1 - Ingestao valida com protocolo", () => {
  beforeEach(() => {
    resetStore();
  });

  test("deve retornar processoId e status inicial consistente", () => {
    const metadata = {
      id: "RF1",
      driver: "Confiabilidade",
      team: "Blue",
      expected: "Upload valido retorna 201 com arquivoId, processoId e status PROCESSANDO"
    };

    const response = upload(validFile());

    expect(response.ok).toBe(true);
    expect(response.statusCode).toBe(201);
    expect(response.data.arquivoId).toMatch(/^arq_/);
    expect(response.data.processoId).toMatch(/^proc_/);
    expect(response.data.status).toBe("PROCESSANDO");

    writeRequirementEvidence({
      ...metadata,
      status: "PASS",
      execution: {
        statusCode: response.statusCode,
        data: response.data
      }
    });
  });
});
