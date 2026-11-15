
/*
 * CAFÉ, CASAS E GENTE
 * Gerenciador central de respostas
 *
 * Guarda as respostas no navegador e reúne
 * os dados para envio ao Google Sheets.
 */

window.CamposRespostas = (() => {
  const CHAVE_ID =
    "campos-eliseos-id-participacao-v1";

  const CHAVE_INICIAIS =
    "campos-eliseos-primeiras-impressoes-v1";

  const CHAVE_FINAIS =
    "campos-eliseos-impressoes-finais-v1";

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

  const PERGUNTAS_FINAIS = [
    {
      id: "final_moradores",
      pergunta: "Que tipo de pessoa mora aqui?",
      tela: "screen-14"
    },
    {
      id: "final_circulacao",
      pergunta: "Que tipo de pessoa circula aqui?",
      tela: "screen-14"
    },
    {
      id: "final_construcao",
      pergunta: "Que tipo de pessoa construiu isso?",
      tela: "screen-14"
    }
  ];

  function lerJSON(chave, padrao) {
    try {
      const valor = localStorage.getItem(chave);

      return valor === null
        ? padrao
        : JSON.parse(valor);

    } catch (erro) {
      console.warn(
        "Erro ao ler:",
        chave,
        erro
      );

      return padrao;
    }
  }

  function obterId() {
    let id = localStorage.getItem(CHAVE_ID);

    if (!id) {
      id = crypto.randomUUID();

      localStorage.setItem(
        CHAVE_ID,
        id
      );
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
      throw new Error(
        "Identificação da pergunta inválida."
      );
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
    const finais = lerJSON(CHAVE_FINAIS, []);
    const extras = lerJSON(CHAVE_EXTRAS, {});

    const respostasIniciais =
      PERGUNTAS_INICIAIS.map(
        (item, indice) => ({
          ...item,
          resposta: String(
            iniciais[indice] ?? ""
          )
        })
      );

    const respostasFinais =
      PERGUNTAS_FINAIS.map(
        (item, indice) => ({
          ...item,
          resposta: String(
            finais[indice] ?? ""
          )
        })
      );

    const respostas = [
      ...respostasIniciais,
      ...respostasFinais
    ];

    const ids = new Set(
      respostas.map(item => item.id)
    );

    for (const item of Object.values(extras)) {
      if (
        item &&
        typeof item.id === "string" &&
        !ids.has(item.id)
      ) {
        respostas.push(item);
        ids.add(item.id);
      }
    }

    return respostas;
  }

  function montarEnvio(formulario) {
    const campo = (nome) =>
      formulario.elements.namedItem(nome);

    const valor = (nome) =>
      String(campo(nome)?.value ?? "").trim();

    return {
      id_participacao: obterId(),
      versao_formulario: "3",

      respostas: obterTodas(),

      avaliacao: Number(
        valor("avaliacao")
      ),

      nome: valor("nome"),
      email: valor("email"),
      idade: valor("idade"),

      conhecimento_previo:
        valor("conhecimento_previo"),

      mudanca_percepcao:
        valor("mudanca_percepcao"),

      dificuldade:
        valor("dificuldade"),

