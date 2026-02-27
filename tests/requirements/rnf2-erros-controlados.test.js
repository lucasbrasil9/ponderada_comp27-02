const { upload, resetStore } = require("../../src/simulator/asisSimulator");
const {
  emptyFile,
  invalidStructureFile,
  corruptedFile
} = require("./_fixtures");
const { writeRequirementEvidence } = require("../../utils/evidence");

describe("RNF2 - Tratamento de erro previsivel", () => {
  beforeEach(() => {
    resetStore();
  });

  test("deve rejeitar arquivo vazio e estrutura invalida com erro controlado", () => {
    const metadata = {
      id: "RNF2",
      driver: "Confiabilidade",
      team: "Red",
      expected: "Entradas invalidas devem retornar 400 e erro conhecido"
    };

    const vazio = upload(emptyFile());
    const invalido = upload(invalidStructureFile());
    const corrompido = upload(corruptedFile());

    expect(vazio.ok).toBe(false);
    expect(vazio.statusCode).toBe(400);
    expect(vazio.error).toBe("empty_file");

    expect(invalido.ok).toBe(false);
    expect(invalido.statusCode).toBe(400);
    expect(invalido.error).toBe("invalid_structure");

    expect(corrompido.ok).toBe(false);
    expect(corrompido.statusCode).toBe(400);
    expect(corrompido.error).toBe("corrupted_file");

    writeRequirementEvidence({
      ...metadata,
      status: "PASS",
      execution: {
        errors: [vazio.error, invalido.error, corrompido.error]
      }
    });
  });
});
