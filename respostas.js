
function montarEnvio(formulario) {
  const campo = (nome) =>
    formulario.elements.namedItem(nome);

  const valor = (nome) =>
    String(campo(nome)?.value ?? "").trim();

  return {
    id_participacao: obterId(),
    versao_formulario: "3",
    respostas: obterTodas(),

    avaliacao: Number(valor("avaliacao")),

    nome: valor("nome"),
    email: valor("email"),
    idade: valor("idade"),

    conhecimento_previo: valor("conhecimento_previo"),
    mudanca_percepcao: valor("mudanca_percepcao"),
    dificuldade: valor("dificuldade"),
    aprofundamento: valor("aprofundamento"),

    comentarios: valor("comentarios"),

    consentimento:
      campo("consentimento")?.checked === true
  };
}
