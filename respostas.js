
/*
 * CAFÉ, CASAS E GENTE
 * Gerenciador central de respostas
 *
 * Guarda respostas no navegador e reúne
 * os dados para o envio final ao Google Sheets.
 */

window.CamposRespostas = (() => {

  const CHAVE_ID =
    "campos-eliseos-id-participacao-v1";

  const CHAVE_INICIAIS =
    "campos-eliseos-primeiras-impressoes-v1";

  const CHAVE_EXTRAS =
    "campos-eliseos-respostas-extras-v1";

  const PERGUNTAS_INICIAIS = [
    {
      id: "primeira_moradores",
      pergunta: "Que tipo de pessoa mora aqui?",
      tela: "screen-03"
    },
    {
      id: "primeira_circulacao",
      pergunta: "Que tipo de pessoa circula aqui?",
      tela: "screen-03"
    },
    {
      id: "primeira_construcao",
      pergunta: "Que tipo de pessoa construiu isso?",
      tela: "screen-03"
    }
  ];

  function lerJSON(chave, padrao) {
    try {
      const valor = localStorage.getItem(chave);

      return valor === null
        ? padrao
        : JSON.parse(valor);

    } catch (erro) {
      console.warn("Erro ao ler:", chave, erro);
      return padrao;
    }
  }

  function obterId() {
    let id = localStorage.getItem(CHAVE_ID);

    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(CHAVE_ID, id);
    }

    return id;
  }

  function registrar(id, pergunta, resposta, tela) {
    if (
      typeof id !== "string" ||
      !id.trim() ||
      typeof pergunta !== "string" ||
      !pergunta.trim()
    ) {
      throw new Error("Identificação da pergunta inválida.");
    }

    const extras = lerJSON(CHAVE_EXTRAS, {});

    extras[id] = {
      id,
      pergunta,
      resposta: String(resposta ?? ""),
      tela: String(tela ?? "")
    };

    localStorage.setItem(
      CHAVE_EXTRAS,
      JSON.stringify(extras)
    );
  }

  function obterResposta(id) {
    const extras = lerJSON(CHAVE_EXTRAS, {});

    return extras[id]?.resposta ?? "";
  }

  function obterTodas() {
    const iniciais = lerJSON(CHAVE_INICIAIS, []);
    const extras = lerJSON(CHAVE_EXTRAS, {});

    const respostas = PERGUNTAS_INICIAIS.map(
      (item, indice) => ({
        ...item,
        resposta: String(iniciais[indice] ?? "")
      })
    );

    for (const item of Object.values(extras)) {
      if (item && typeof item.id === "string") {
        respostas.push(item);
      }
    }

    return respostas;
  }

  function montarEnvio(formulario) {
    return {
      id_participacao: obterId(),
      versao_formulario: "2",
      respostas: obterTodas(),

      avaliacao: Number(
        formulario.querySelector(
          '[name="avaliacao"]'
        ).value
      ),

      nome:
        formulario.elements.nome.value.trim(),

      email:
        formulario.elements.email.value.trim(),

      telefone:
        formulario.elements.telefone.value.trim(),

      comentarios:
        formulario.elements.comentarios.value.trim(),

      consentimento:
        formulario.elements.consentimento.checked
    };
  }

  return {
    registrar,
    obterResposta,
    obterTodas,
    montarEnvio,
    obterId
  };

})();
