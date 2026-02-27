function validFile() {
  return {
    name: "SPED-EFD.txt",
    content: Buffer.from("REG|0000|SPED|VALIDO")
  };
}

function emptyFile() {
  return {
    name: "arquivo_vazio.txt",
    content: Buffer.alloc(0)
  };
}

function invalidStructureFile() {
  return {
    name: "arquivo_estrutura_invalida.txt",
    content: Buffer.from("###")
  };
}

function corruptedFile() {
  return {
    name: "arquivo_corrompido.bin",
    content: Buffer.from([0xff, 0x00, 0xaa])
  };
}

module.exports = {
  validFile,
  emptyFile,
  invalidStructureFile,
  corruptedFile
};
