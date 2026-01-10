const CHAVE_API = 'AIzaSyBQhWdy4iyFCk9Lh89x8weSIyl0knXgA34';
const ID_PLANILHA = '1KQXx7TFtbNzMYHzOM5LMT7Fh61hiGOKZHux4K3Q6YpM';
const INTERVALO_DADOS = 'Gerador!B4:J193';
const ID_GRUPO_HABBO = 'g-hhbr-77d2964628f63fce5f105b7be518b1d6';
const URL_API_HABBO = 'https://www.habbo.com.br/api/public/users';
const ID_TOPICO_FORUM = 32243;
const ID_TOPICO_MEDALHA = 36745;


const TEMPLATE_MP_EXPULSAO = `[font=Poppins]<div style="border:1.5rem solid #821F88;border-radius:8px;font-family:Poppins;">[/font][table][tr][td][center][img]https://i.imgur.com/hU7bn8R.gif[/img][/center]

[table style="color: rgb(0, 0, 0);border-radius:10px; overflow:hidden; border-color: rgb(0, 0, 0);" bgcolor="#821F88" border="1"][tr][td][center][img]https://3.bp.blogspot.com/-xgw9Ywvq-kQ/V1ZwrYykphI/AAAAAAAAp0Q/SB7rlT08K3Mqd_vx06J9yXI-GPPuoJwEwCPcB/s1600/ES54A.gif[/img][/center][size=20][font=Poppins][color=white][b]CARTA DE EXPULSÃO[/b][/color][/font][/size][/td][/tr][/table]
<div style="padding:1.5%;border:1px solid #bdbdbd;border-radius:8px;">[justify]Saudações, [b]{USERNAME}[/b].

Informa-se que você foi[b] expulso(a) de nossa companhia e penalizado com cem (100) medalhas negativas[/b] pelo(s) seguinte(s) motivo(s):

[b]{MOTIVO}[/b]

[color=#821F88][b]COMENTÁRIOS:[/b][/color] {CONSIDERACOES}
[color=#821F88][b]ANEXOS:[/b][/color] {LINK_PROVA}

Leia as documentações que regem a companhia [url=https://sites.google.com/view/nexusprof/documenta%C3%A7%C3%B5es?authuser=3]clicando aqui[/url]. Caso queira recorrer da punição recebida, procure a Liderança apresentando argumentos factuais e plausíveis. Sinta-se à vontade para refazer o teste de admissão para a companhia ou ingressar em uma outra.[/justify]</div>[/td][/tr][/table]</div>
[font=Poppins][center]Atentamente,
[img]https://i.imgur.com/1kZvQHs.png[/img][/center][/font]`;

const TEMPLATE_MP_REBAIXAMENTO = `[font=Poppins]<div style="border:1.5rem solid #821F88;border-radius:8px;font-family:Poppins;">[/font][table][tr][td][center][img]https://i.imgur.com/hU7bn8R.gif[/img][/center]

[table style="color: rgb(0, 0, 0);border-radius:10px; overflow:hidden; border-color: rgb(0, 0, 0);" bgcolor="#821F88" border="1"][tr][td][center][img]https://3.bp.blogspot.com/-xgw9Ywvq-kQ/V1ZwrYykphI/AAAAAAAAp0Q/SB7rlT08K3Mqd_vx06J9yXI-GPPuoJwEwCPcB/s1600/ES54A.gif[/img][/center][size=20][font=Poppins][color=white][b]CARTA DE REBAIXAMENTO[/b][/color][/font][/size][/td][/tr][/table]
<div style="padding:1.5%;border:1px solid #bdbdbd;border-radius:8px;">[justify]Saudações, [b]{USERNAME}[/b].

Informa-se que você foi [b]rebaixado(a) na companhia e penalizado com cinquenta (50) medalhas negativas[/b] pelo(s) seguinte(s) motivo(s):

[b]{MOTIVO}[/b]

[color=#821F88][b]COMENTÁRIOS:[/b][/color] {CONSIDERACOES}
[color=#821F88][b]ANEXOS:[/b][/color] {LINK_PROVA}

Leia as documentações que regem a companhia [url=https://sites.google.com/view/nexusprof/documenta%C3%A7%C3%B5es?authuser=3]clicando aqui[/url] e procure manter-se atento para evitar mais punições. Caso queira recorrer da punição recebida, procure a Liderança apresentando argumentos factuais e plausíveis.[/justify]</div>[/td][/tr][/table]</div>
[font=Poppins][center]Atentamente,
[img]https://i.imgur.com/1kZvQHs.png[/img][/center][/font]`;

const HIERARQUIA = ['Líder', 'Vice-líder', 'Conselheiro(a) da Contabilidade', 'Conselheiro(a) das Finanças', 'Conselheiro(a) da Administração', 'Conselheiro(a) da Documentação', 'Conselheiro(a) da Segurança', 'Conselheiro(a) da Atualização²', 'Conselheiro(a) da Atualização¹', 'Estagiário(a)', 'Graduador(a)', 'Coordenador(a)', 'Professor(a)'];


const botaoVerificar = document.getElementById('botaoVerificar');
const listaGratificacoes = document.getElementById('lista-gratificacoes');
const listaForum = document.getElementById('lista-forum');
const carregador = document.getElementById('carregador');
const statusProcesso = document.getElementById('status-processo');
const containerResultados = document.getElementById('container-resultados');




const sobreposicaoModal = document.getElementById('sobreposicao-modal');
const fundoModal = document.getElementById('fundo-modal');
const painelModal = document.getElementById('painel-modal');
const conteudoModal = document.getElementById('conteudo-modal');
const tituloModal = document.getElementById('titulo-modal');



const modalMP = document.getElementById('modal-mp');
const fundoModalMP = document.getElementById('fundo-modal-mp');
const painelModalMP = document.getElementById('painel-modal-mp');
const mpDestinatario = document.getElementById('mp-destinatario');
const mpTipo = document.getElementById('mp-tipo');
const mpMotivo = document.getElementById('mp-motivo');
const mpConsideracoes = document.getElementById('mp-consideracoes');
const mpProva = document.getElementById('mp-prova');
const botaoEnviarMP = document.getElementById('botao-enviar-mp');

const modalConfirmacao = document.getElementById('modal-confirmacao');

let membrosInativos = [];
let membrosOffline = [];
let graduacoesPendentes = [];
let membrosRemoverForum = [];
let topicoRedirecionamento = '';
let checkboxMPAtual = '';





// Limpar campos ao recarregar
window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('lista-gratificacoes').value = '';
    document.getElementById('lista-forum').value = '';
});

// Tema padrão Dark sem cache
document.documentElement.classList.add('dark');



function converterDataPlanilha(dataStr) {
    if (!dataStr) return null;
    const meses = { 'jan': 0, 'fev': 1, 'mar': 2, 'abr': 3, 'mai': 4, 'jun': 5, 'jul': 6, 'ago': 7, 'set': 8, 'out': 9, 'nov': 10, 'dez': 11 };
    try {
        const strLimpa = dataStr.replace('.', '').toLowerCase().trim();
        const partes = strLimpa.split(' ');
        if (partes.length >= 3) {
            return new Date(parseInt(partes[2]), meses[partes[1].substring(0, 3)], parseInt(partes[0]));
        }
    } catch (e) { }
    return null;
}

function obterDataMedalha() {
    const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    const d = new Date();
    return `${d.getDate().toString().padStart(2, '0')} ${meses[d.getMonth()]} ${d.getFullYear()}`;
}

function ativarCooldownGlobal() {
    const botoes = document.querySelectorAll('#conteudo-modal button:not(:disabled)');
    botoes.forEach(btn => {
        btn.disabled = true;
        btn.dataset.original = btn.innerHTML;
        btn.classList.add('opacity-50', 'cursor-not-allowed');
        btn.innerHTML = '<i class="fa-regular fa-clock fa-spin"></i> 5s';
    });

    let contagem = 5;
    const intervalo = setInterval(() => {
        contagem--;
        if (contagem <= 0) {
            clearInterval(intervalo);
            botoes.forEach(btn => {
                btn.innerHTML = btn.dataset.original;
                btn.disabled = false;
                btn.classList.remove('opacity-50', 'cursor-not-allowed');
            });
        } else {
            botoes.forEach(btn => btn.innerHTML = `<i class="fa-regular fa-clock fa-spin"></i> ${contagem}s`);
        }
    }, 1000);
}

botaoVerificar.addEventListener('click', () => {
    const textoSystem = document.getElementById('lista-gratificacoes').value;
    const textoForum = document.getElementById('lista-forum').value;

    if (!textoSystem.trim()) return alert('Por favor, cole a lista do System primeiro.');
    if (!textoForum.trim()) return alert('Por favor, cole a lista de membros do Fórum.');

    iniciarVerificacao();
});

async function iniciarVerificacao() {
    const textoSystem = document.getElementById('lista-gratificacoes').value;
    const textoForumBruto = document.getElementById('lista-forum').value;

    alternarCarregamento(true);

    // Converte para lowercase para comparação case-insensitive
    const nicksAtivos = new Set(textoSystem.split('\n')
        .map(l => l.split('[')[0].trim().split('\t')[0].trim().toLowerCase())
        .filter(n => n.length > 0));

    try {
        statusProcesso.innerText = 'Baixando planilha oficial (RCC)...';

        const urlSheets = `https://sheets.googleapis.com/v4/spreadsheets/${ID_PLANILHA}/values/${encodeURIComponent(INTERVALO_DADOS)}?key=${CHAVE_API}`;
        const resSheets = await fetch(urlSheets);

        if (!resSheets.ok) {
            const errorData = await resSheets.json();
            throw new Error(errorData.error ? errorData.error.message : 'Erro ao acessar planilha');
        }

        const dataSheets = await resSheets.json();
        const linhas = dataSheets.values || [];
        const membrosParaVerificar = [];
        const inativos = [];
        const graduacaoExpirada = [];

        // Coletar todos os nicks válidos da planilha (professores oficiais)
        const nicksOficiaisPlanilha = new Set();

        linhas.forEach(linha => {
            const nick = linha[1] ? linha[1].trim() : '';
            const cargo = linha[0] ? linha[0].trim() : '';

            if (!nick) return;
            if (cargo.toLowerCase().includes('consultor') || cargo.toLowerCase().includes('honrosa')) return;

            // Adiciona à lista de nicks oficiais
            nicksOficiaisPlanilha.add(nick.toLowerCase());

            const estaLicenciado = (linha[7] && linha[7].trim().length > 0);
            const estaNoForum = textoForumBruto && textoForumBruto.toLowerCase().includes(nick.toLowerCase());

            if (nicksAtivos.has(nick.toLowerCase())) {
                membrosParaVerificar.push({ nick, cargo, estaLicenciado, estaNoForum });

                const graduacaoPendente = (linha[4] === 'TRUE' || linha[4] === true);
                if (graduacaoPendente && !estaLicenciado) {
                    const ehProfessor = cargo.toLowerCase().includes('professor') && !cargo.toLowerCase().includes('geral');
                    const dataReferencia = ehProfessor ? converterDataPlanilha(linha[2]) : converterDataPlanilha(linha[3]);

                    if (dataReferencia) {
                        const diferencaTempo = Math.abs(new Date() - dataReferencia);
                        const diasDiferenca = Math.ceil(diferencaTempo / (1000 * 60 * 60 * 24));

                        if (diasDiferenca > 7) {
                            graduacaoExpirada.push({
                                nick, cargo, dias: diasDiferenca,
                                tipo: ehProfessor ? 'expulsao' : 'rebaixamento',
                                estaNoForum
                            });
                        }
                    }
                }
            } else {
                // Se não está na lista do System, é inativo (independente de licença)
                inativos.push({ nick, cargo, status: 'Sem registro no System', estaNoForum });
            }
        });

        // NOVA VERIFICAÇÃO: Nicks no fórum que não estão na planilha
        statusProcesso.innerText = 'Verificando membros do fórum...';
        const removerDoForum = extrairNicksExtrasForum(textoForumBruto, nicksOficiaisPlanilha);

        statusProcesso.innerText = 'Consultando API do Habbo...';
        const offline = await verificarAtividadeHabbo(membrosParaVerificar);

        statusProcesso.innerText = 'Verificando Grupos...';

        const enriquecerComGrupo = async (lista) => {
            const resultado = [];
            for (let m of lista) {
                const dadosGrupo = await verificarGrupo(m.nick);
                resultado.push({ ...m, ...dadosGrupo });
            }
            return resultado;
        };

        const inativosFinal = await enriquecerComGrupo(inativos);
        const graduacaoFinal = await enriquecerComGrupo(graduacaoExpirada);

        alternarCarregamento(false);
        exibirResultados(inativosFinal, offline, graduacaoFinal, removerDoForum);

    } catch (erro) {
        alternarCarregamento(false);
        alert('Erro na verificação: ' + erro.message);
    }
}

// Função para extrair nicks do texto do fórum que NÃO estão na planilha oficial
function extrairNicksExtrasForum(textoForum, nicksOficiais) {
    if (!textoForum) return [];

    const extras = [];
    const linhas = textoForum.split('\n');

    // Contas especiais do fórum para ignorar
    const contasEspeciais = [
        'professores', 'admin', 'com. de desenv. cultural',
        'dep. ap. intendência', 'serv. proteção prof', '[prof] liderança'
    ];

    linhas.forEach(linha => {

        // PADRÃO PRINCIPAL: "Enviar uma mensagem privada" + TAB + NICK + TAB + número...
        // Exemplo: "Enviar uma mensagem privada	,Caarter	412		 		"
        if (linha.includes('Enviar uma mensagem privada')) {
            const partes = linha.split('\t');
            // O nick está SEMPRE na posição 1 (logo após "Enviar uma mensagem privada")
            if (partes.length >= 2 && partes[1]) {
                const nick = partes[1].trim();

                if (!nick || nick.length < 2) return;

                if (contasEspeciais.includes(nick.toLowerCase())) return;

                const nickLower = nick.toLowerCase();

                // Ignora se já está na lista oficial (é professor ativo)
                if (nicksOficiais.has(nickLower)) return;

                // Ignora se já foi adicionado
                if (extras.some(e => e.nick.toLowerCase() === nickLower)) return;

                extras.push({
                    nick: nick,
                    status: 'Não consta na listagem de professores'
                });
            }
        }
    });

    return extras;
}

async function verificarAtividadeHabbo(membros) {
    const listaOffline = [];
    let membrosComErro = [];
    const BATCH_SIZE = 15;
    const PROXY_URL = "https://corsproxy.io/?";

    // Helper para verificar um único membro COM proxy (retorna objeto ou 'ERRO')
    const processarMembroComProxy = async (m) => {
        if (m.estaLicenciado) return null;
        try {
            const targetUrl = `${URL_API_HABBO}?name=${m.nick}`;
            const res = await fetch(`${PROXY_URL}${encodeURIComponent(targetUrl)}`);
            if (res.ok) {
                const dados = await res.json();
                if (dados.lastAccessTime) {
                    const diasDiferenca = Math.floor((new Date() - new Date(dados.lastAccessTime)) / (1000 * 60 * 60 * 24));
                    if (diasDiferenca >= 5) {
                        const verificacaoGrupo = await verificarGrupo(m.nick, dados.uniqueId);
                        return {
                            nick: m.nick, cargo: m.cargo, dias: diasDiferenca,
                            estaNoForum: m.estaNoForum, ...verificacaoGrupo
                        };
                    }
                }
                return null; // Sucesso, mas não é offline
            }
        } catch (e) {
            return 'ERRO';
        }
        return 'ERRO'; // Falha na requisição
    };

    // Helper para verificar um único membro SEM proxy (fallback direto)
    const processarMembroSemProxy = async (m) => {
        if (m.estaLicenciado) return null;
        try {
            const targetUrl = `${URL_API_HABBO}?name=${m.nick}`;
            const res = await fetch(targetUrl);
            if (res.ok) {
                const dados = await res.json();
                if (dados.lastAccessTime) {
                    const diasDiferenca = Math.floor((new Date() - new Date(dados.lastAccessTime)) / (1000 * 60 * 60 * 24));
                    if (diasDiferenca >= 5) {
                        const verificacaoGrupo = await verificarGrupoSemProxy(m.nick, dados.uniqueId);
                        return {
                            nick: m.nick, cargo: m.cargo, dias: diasDiferenca,
                            estaNoForum: m.estaNoForum, ...verificacaoGrupo
                        };
                    }
                }
                return null;
            }
        } catch (e) {
            return 'ERRO';
        }
        return 'ERRO';
    };

    // TENTATIVA 1: Processamento Paralelo com Proxy
    for (let i = 0; i < membros.length; i += BATCH_SIZE) {
        const lote = membros.slice(i, i + BATCH_SIZE);
        statusProcesso.innerText = `Analisando com proxy: ${Math.min(i + BATCH_SIZE, membros.length)}/${membros.length}`;

        const resultados = await Promise.all(lote.map(async m => ({ m, res: await processarMembroComProxy(m) })));

        resultados.forEach(item => {
            if (item.res === 'ERRO') {
                membrosComErro.push(item.m);
            } else if (item.res !== null) {
                listaOffline.push(item.res);
            }
        });
    }

    // TENTATIVA 2: Retry Paralelo com Proxy
    if (membrosComErro.length > 0) {
        let errosPersistentes = [];

        for (let i = 0; i < membrosComErro.length; i += BATCH_SIZE) {
            const lote = membrosComErro.slice(i, i + BATCH_SIZE);
            statusProcesso.innerText = `Retentando com proxy: ${Math.min(i + BATCH_SIZE, membrosComErro.length)}/${membrosComErro.length}`;

            const resultados = await Promise.all(lote.map(async m => ({ m, res: await processarMembroComProxy(m) })));

            resultados.forEach(item => {
                if (item.res === 'ERRO') {
                    errosPersistentes.push(item.m);
                } else if (item.res !== null) {
                    listaOffline.push(item.res);
                }
            });
        }
        membrosComErro = errosPersistentes;
    }

    // TENTATIVA 3: Fallback Lento com Proxy (Sequencial com delay)
    if (membrosComErro.length > 0) {
        let errosPersistentes = [];
        for (let i = 0; i < membrosComErro.length; i++) {
            const m = membrosComErro[i];
            statusProcesso.innerText = `Fallback proxy lento: ${m.nick} (${i + 1}/${membrosComErro.length})`;
            try {
                await new Promise(r => setTimeout(r, 200));
                const res = await processarMembroComProxy(m);
                if (res && res !== 'ERRO') {
                    listaOffline.push(res);
                } else {
                    errosPersistentes.push(m);
                }
            } catch (e) {
                errosPersistentes.push(m);
            }
        }
        membrosComErro = errosPersistentes;
    }

    // TENTATIVA 4: Fallback SEM Proxy (direto à API, sequencial)
    if (membrosComErro.length > 0) {
        statusProcesso.innerText = `Tentando sem proxy: ${membrosComErro.length} membros restantes...`;
        for (let i = 0; i < membrosComErro.length; i++) {
            const m = membrosComErro[i];
            statusProcesso.innerText = `Sem proxy: ${m.nick} (${i + 1}/${membrosComErro.length})`;
            try {
                await new Promise(r => setTimeout(r, 300));
                const res = await processarMembroSemProxy(m);
                if (res && res !== 'ERRO') {
                    listaOffline.push(res);
                }
            } catch (e) { }
        }
    }

    return listaOffline;
}

// Função auxiliar para verificar grupo SEM proxy
async function verificarGrupoSemProxy(nick, uniqueId = null) {
    try {
        let uid = uniqueId;
        if (!uid) {
            const targetUrl = `${URL_API_HABBO}?name=${nick}`;
            const r = await fetch(targetUrl);
            if (r.ok) {
                const d = await r.json();
                uid = d.uniqueId;
            }
        }
        if (uid) {
            const targetGrupoUrl = `${URL_API_HABBO}/${uid}/groups`;
            const gr = await fetch(targetGrupoUrl);
            if (gr.ok) {
                const grupos = await gr.json();
                return { noGrupo: grupos.some(g => g.id === ID_GRUPO_HABBO) };
            }
        }
    } catch (e) { }
    return { noGrupo: false };
}

async function verificarGrupo(nick, uniqueId = null) {
    const PROXY_URL = "https://corsproxy.io/?";
    try {
        let uid = uniqueId;
        if (!uid) {
            const targetUrl = `${URL_API_HABBO}?name=${nick}`;
            const r = await fetch(`${PROXY_URL}${encodeURIComponent(targetUrl)}`);
            if (r.ok) {
                const d = await r.json();
                uid = d.uniqueId;
            }
        }
        if (uid) {
            const targetGrupoUrl = `${URL_API_HABBO}/${uid}/groups`;
            const gr = await fetch(`${PROXY_URL}${encodeURIComponent(targetGrupoUrl)}`);
            if (gr.ok) {
                const grupos = await gr.json();
                return { noGrupo: grupos.some(g => g.id === ID_GRUPO_HABBO) };
            }
        }
    } catch (e) { }
    return { noGrupo: false };
}

window.desconsiderarMembro = function (tipo, idx) {
    const card = document.getElementById(`card-${tipo}-${idx}`);
    if (!card) return;

    const btn = card.querySelector('button[onclick*="desconsiderarMembro"]');
    const icone = btn.querySelector('i');
    const isDesconsiderado = card.classList.contains('opacity-40');

    // Ícone X vermelho para substituir checkbox
    const iconeX = '<span class="w-5 h-5 rounded-md bg-red-500 flex items-center justify-center shrink-0"><i class="fa-solid fa-xmark text-white text-[10px]"></i></span>';

    if (isDesconsiderado) {
        // RESTAURAR
        card.classList.remove('opacity-40');
        card.style.pointerEvents = '';

        // Restaura os checkboxes originais
        const labels = card.querySelectorAll('.checkbox-wrapper');
        labels.forEach(label => {
            const spanX = label.querySelector('span.bg-red-500');
            if (spanX) {
                // Recria o checkbox
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                spanX.replaceWith(checkbox);
            }
            // Remove estilo de riscado
            const spanTexto = label.querySelector('span.ml-2');
            if (spanTexto) {
                spanTexto.classList.remove('line-through', 'text-red-400');
            }
            // Desmarca e habilita
            const chk = label.querySelector('input[type="checkbox"]');
            if (chk) {
                chk.checked = false;
                chk.disabled = false;
            }
        });

        // Muda ícone de volta para lixeira
        icone.classList.remove('fa-rotate-left');
        icone.classList.add('fa-trash-can');
        btn.title = 'Desconsiderar (dado incorreto)';
    } else {
        // DESCONSIDERAR
        card.classList.add('opacity-40');

        // Substitui checkboxes por X vermelhos
        const labels = card.querySelectorAll('.checkbox-wrapper');
        labels.forEach(label => {
            const chk = label.querySelector('input[type="checkbox"]');
            if (chk) {
                chk.checked = true;
                chk.disabled = true;
                // Cria elemento X
                const xSpan = document.createElement('span');
                xSpan.className = 'w-5 h-5 rounded-md bg-red-500 flex items-center justify-center shrink-0';
                xSpan.innerHTML = '<i class="fa-solid fa-xmark text-white text-[10px]"></i>';
                chk.replaceWith(xSpan);
            }
            // Adiciona estilo de riscado ao texto
            const spanTexto = label.querySelector('span.ml-2');
            if (spanTexto) {
                spanTexto.classList.add('line-through', 'text-red-400');
            }
        });

        // Muda ícone para desfazer
        icone.classList.remove('fa-trash-can');
        icone.classList.add('fa-rotate-left');
        btn.title = 'Restaurar membro';
    }

    // Atualiza o progresso da aba
    verificarProgressoAba(tipo);
};

window.alternarTab = function (tipo) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.add('hidden'));

    document.getElementById('tab-' + tipo).classList.add('active');
    document.getElementById('content-' + tipo).classList.remove('hidden');
};

window.verificarProgressoAba = function (tipo) {
    const container = document.getElementById('content-' + tipo);
    const pendentes = container.querySelectorAll('input[type="checkbox"]:not(:checked):not(:disabled)');

    const badge = document.getElementById('badge-count-' + tipo);
    if (pendentes.length === 0) {
        badge.classList.remove('pulse-active');
    } else {
        badge.classList.add('pulse-active');
    }
};

window.atualizarProgressoPorCheckboxId = function (chkId) {
    if (!chkId) return;
    const firstId = chkId.split(',')[0];
    if (firstId.includes('inativos')) verificarProgressoAba('inativos');
    else if (firstId.includes('graduacao')) verificarProgressoAba('graduacao');
    else if (firstId.includes('offline')) verificarProgressoAba('offline');
    else if (firstId.includes('remover-forum')) verificarProgressoAba('remover-forum');
};

function exibirResultados(inativos, offline, graduacao, removerForum = []) {
    membrosInativos = inativos;
    membrosOffline = offline;
    graduacoesPendentes = graduacao;
    membrosRemoverForum = removerForum;

    const badgeInativos = document.getElementById('badge-count-inativos');
    const badgeGraduacao = document.getElementById('badge-count-graduacao');
    const badgeOffline = document.getElementById('badge-count-offline');
    const badgeRemoverForum = document.getElementById('badge-count-remover-forum');

    badgeInativos.innerText = inativos.length;
    badgeGraduacao.innerText = graduacao.length;
    badgeOffline.innerText = offline.length;
    badgeRemoverForum.innerText = removerForum.length;

    if (inativos.length > 0) badgeInativos.classList.add('pulse-active');
    if (graduacao.length > 0) badgeGraduacao.classList.add('pulse-active');
    if (offline.length > 0) badgeOffline.classList.add('pulse-active');
    if (removerForum.length > 0) badgeRemoverForum.classList.add('pulse-active');

    document.getElementById('contador-inativos').innerText = inativos.length + " encontrados";
    document.getElementById('contador-offline').innerText = offline.length + " encontrados";
    document.getElementById('contador-graduacao').innerText = graduacao.length + " encontrados";
    document.getElementById('contador-remover-forum').innerText = removerForum.length + " encontrados";

    const renderizarLista = (lista, containerId, tipo) => {
        const container = document.getElementById(containerId);
        const divAcoes = document.getElementById('acoes-' + tipo);

        if (lista.length > 0) {
            if (divAcoes) divAcoes.classList.remove('hidden');
            container.innerHTML = lista.map((m, idx) => criarCardMembro(m, idx, tipo)).join('');
        } else {
            if (divAcoes) divAcoes.classList.add('hidden');
            container.innerHTML = `
                        <div class="col-span-1 text-center py-8 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                            <i class="fa-solid fa-check-circle text-4xl text-emerald-500 mb-2 opacity-50"></i>
                            <p class="text-slate-500 dark:text-slate-400 text-sm">Nenhum membro encontrado nesta categoria.</p>
                        </div>
                    `;
        }
    };

    renderizarLista(inativos, 'lista-inativos', 'inativos');
    renderizarLista(graduacao, 'lista-graduacao', 'graduacao');
    renderizarLista(offline, 'lista-offline', 'offline');
    renderizarLista(removerForum, 'lista-remover-forum', 'remover-forum');

    containerResultados.classList.remove('hidden');
    containerResultados.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Ativa a primeira aba com resultados
    if (inativos.length > 0) alternarTab('inativos');
    else if (graduacao.length > 0) alternarTab('graduacao');
    else if (offline.length > 0) alternarTab('offline');
    else if (removerForum.length > 0) alternarTab('remover-forum');
}

function criarCardMembro(m, idx, tipo) {
    const urlAvatar = `https://www.habbo.com.br/habbo-imaging/avatarimage?img_format=png&user=${m.nick}&direction=2&head_direction=3&size=l&headonly=0`;

    let badgeStatus = '';
    let tipoAcao = 'rebaixamento';

    if (tipo === 'graduacao') {
        badgeStatus = `<span class="bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 text-xs px-2 py-1 rounded font-bold uppercase">${m.tipo}</span>`;
        tipoAcao = m.tipo;
    }
    if (tipo === 'offline') {
        badgeStatus = `<span class="bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 text-xs px-2 py-1 rounded font-bold">${m.dias} dias off</span>`;
        const ehProfessor = m.cargo.toLowerCase().includes('professor') && !m.cargo.toLowerCase().includes('geral');
        tipoAcao = ehProfessor ? 'expulsao' : 'rebaixamento';
    }
    if (tipo === 'remover-forum') {
        badgeStatus = `<span class="bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300 text-xs px-2 py-1 rounded font-bold">Não é professor</span>`;
    }

    // Só mostra opções de tirar do grupo/fórum para EXPULSÃO ou SAÍDA (inativos)
    const mostrarOpcoesTirar = tipo === 'inativos' || tipoAcao === 'expulsao';

    // Card simplificado para "remover-forum"
    if (tipo === 'remover-forum') {
        return `
                <div id="card-${tipo}-${idx}" class="member-card bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 p-4 flex flex-col md:flex-row gap-4 items-center md:items-start relative overflow-hidden group transition-opacity">
                    <div class="relative shrink-0 flex flex-col items-center gap-2">
                        <div class="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border-2 border-slate-200 dark:border-slate-700 group-hover:border-sky-500 transition-colors avatar-glow">
                            <img src="${urlAvatar}" alt="${m.nick}" class="object-cover -mt-2">
                        </div>
                        <button onclick="desconsiderarMembro('${tipo}', ${idx})" title="Desconsiderar (dado incorreto)" class="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-red-100 dark:hover:bg-red-900/30 text-slate-400 hover:text-red-500 transition-colors flex items-center justify-center border border-slate-200 dark:border-slate-700 hover:border-red-300 dark:hover:border-red-700">
                            <i class="fa-solid fa-trash-can text-xs"></i>
                        </button>
                    </div>

                    <div class="flex-grow text-center md:text-left w-full">
                        <div class="flex flex-col md:flex-row justify-between items-center mb-1">
                            <h4 class="font-bold text-lg text-slate-800 dark:text-slate-100">${m.nick}</h4>
                            ${badgeStatus}
                        </div>
                        <p class="text-sm text-slate-500 dark:text-slate-400 font-mono bg-slate-100 dark:bg-slate-800/50 px-2 py-0.5 rounded inline-block mb-3 border border-slate-200 dark:border-slate-700">${m.status || 'Verificar manualmente'}</p>
                        
                        <div class="grid grid-cols-2 md:grid-cols-3 gap-2 text-left">
                            <label class="checkbox-wrapper flex items-center text-xs text-slate-600 dark:text-slate-300 bg-sky-50 dark:bg-sky-800/30 p-2 rounded cursor-pointer hover:bg-sky-100 dark:hover:bg-sky-800 transition-colors border border-sky-200 dark:border-sky-700">
                                <input type="checkbox" onchange="verificarProgressoAba('${tipo}')" id="chk-remover-${tipo}-${idx}">
                                <span class="ml-2 font-semibold text-sky-700 dark:text-sky-300">Remover do Subfórum</span>
                            </label>
                            <a href="https://www.policiarcc.com/g10-professores" target="_blank" class="flex items-center text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/30 p-2 rounded cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors gap-2">
                                <i class="fa-solid fa-external-link text-sky-500"></i>
                                <span class="ml-1">Abrir Grupo no Fórum</span>
                            </a>
                        </div>
                    </div>
                </div>`;
    }

    return `
            <div id="card-${tipo}-${idx}" class="member-card bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 p-4 flex flex-col md:flex-row gap-4 items-center md:items-start relative overflow-hidden group transition-opacity">
                <div class="relative shrink-0 flex flex-col items-center gap-2">
                    <div class="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border-2 border-slate-200 dark:border-slate-700 group-hover:border-emerald-500 transition-colors avatar-glow">
                        <img src="${urlAvatar}" alt="${m.nick}" class="object-cover -mt-2">
                    </div>
                    <button onclick="desconsiderarMembro('${tipo}', ${idx})" title="Desconsiderar (dado incorreto)" class="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-red-100 dark:hover:bg-red-900/30 text-slate-400 hover:text-red-500 transition-colors flex items-center justify-center border border-slate-200 dark:border-slate-700 hover:border-red-300 dark:hover:border-red-700">
                        <i class="fa-solid fa-trash-can text-xs"></i>
                    </button>
                </div>

                <div class="flex-grow text-center md:text-left w-full">
                    <div class="flex flex-col md:flex-row justify-between items-center mb-1">
                        <h4 class="font-bold text-lg text-slate-800 dark:text-slate-100">${m.nick}</h4>
                        ${badgeStatus}
                    </div>
                    <p class="text-sm text-slate-500 dark:text-slate-400 font-mono bg-slate-100 dark:bg-slate-800/50 px-2 py-0.5 rounded inline-block mb-3 border border-slate-200 dark:border-slate-700">${m.cargo}</p>
                    
                    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 text-left">
                        <label class="checkbox-wrapper flex items-center text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/30 p-2 rounded cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                            <input type="checkbox" onchange="verificarProgressoAba('${tipo}')" id="chk-req-${tipo}-${idx}">
                            <span class="ml-2">Requerimento</span>
                        </label>
                        
                        ${tipo !== 'inativos' ? `
                        <label class="checkbox-wrapper flex items-center text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/30 p-2 rounded cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                            <input type="checkbox" onchange="verificarProgressoAba('${tipo}')" id="chk-mp-${tipo}-${idx}">
                            <span class="ml-2">MP Enviada</span>
                        </label>
                        <label class="checkbox-wrapper flex items-center text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/30 p-2 rounded cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                            <input type="checkbox" onchange="verificarProgressoAba('${tipo}')" id="chk-medal-${tipo}-${idx}">
                            <span class="ml-2">Medalha</span>
                        </label>` : ''}

                        ${mostrarOpcoesTirar ? `
                        ${m.noGrupo ? `
                        <label class="checkbox-wrapper flex items-center text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/30 p-2 rounded cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                            <input type="checkbox">
                            <span class="ml-2">Tirar do Grupo</span>
                        </label>` : `
                        <div class="flex items-center text-xs bg-slate-50 dark:bg-slate-800/30 p-2 rounded cursor-not-allowed opacity-80">
                            <span class="w-5 h-5 rounded-md bg-red-500 flex items-center justify-center shrink-0"><i class="fa-solid fa-xmark text-white text-[10px]"></i></span>
                            <span class="ml-2 line-through text-red-400">Tirar do Grupo</span>
                        </div>`}

                        ${m.estaNoForum ? `
                        <label class="checkbox-wrapper flex items-center text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/30 p-2 rounded cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                            <input type="checkbox">
                            <span class="ml-2">Tirar do Subfórum</span>
                        </label>` : `
                        <div class="flex items-center text-xs bg-slate-50 dark:bg-slate-800/30 p-2 rounded cursor-not-allowed opacity-80">
                            <span class="w-5 h-5 rounded-md bg-red-500 flex items-center justify-center shrink-0"><i class="fa-solid fa-xmark text-white text-[10px]"></i></span>
                            <span class="ml-2 line-through text-red-400">Tirar do Subfórum</span>
                        </div>`}` : ''}
                    </div>
                </div>
            </div>`;
}

function alternarCarregamento(ativo) {
    if (ativo) {
        carregador.classList.remove('hidden');
        containerResultados.classList.add('hidden');
        botaoVerificar.disabled = true;
        botaoVerificar.classList.add('opacity-70');
    } else {
        carregador.classList.add('hidden');
        botaoVerificar.disabled = false;
        botaoVerificar.classList.remove('opacity-70');
    }
}

function obterAcao(cargo) {
    const indiceCargoAtual = HIERARQUIA.findIndex(rank => cargo.toLowerCase().includes(rank.toLowerCase()));
    if (indiceCargoAtual === -1 || indiceCargoAtual === HIERARQUIA.length - 1) {
        return { nome: 'EXPULSÃO', novoCargo: null, tipo: 'expulsao' };
    }
    const novoCargo = HIERARQUIA[indiceCargoAtual + 1];
    return { nome: 'REBAIXAMENTO', novoCargo: novoCargo, tipo: 'rebaixamento' };
}

function criarBBCode(titulo, campos) {
    const cor = "#560c7e";
    let codigo = `[font=Poppins][center][table  style="border-color: black; border-radius: 10px; overflow: hidden; width: auto;" bgcolor="${cor}"][tr][td][size=16][center][color=#ffffff][b]${titulo}[/b][/color][/center][/size][/td][/tr][/table][/center]\n[size=13][left]`;

    if (titulo === "EXPULSÃO") {
        const nick = campos["Nickname"];
        codigo += `[font=Poppins][b][color=#000000]${nick}[/b][/color][/font]\n`;
        for (const [chave, valor] of Object.entries(campos)) {
            if (chave !== "Nickname" && valor) {
                codigo += `[color=${cor}][b]${chave}[/b][/color]: ${valor}\n`;
            }
        }
    } else {
        for (const [chave, valor] of Object.entries(campos)) {
            if (valor) {
                codigo += `[color=${cor}][b]${chave}[/b][/color]: ${valor}\n`;
            }
        }
    }

    if (titulo === "SAÍDA") {
        codigo += `[color=${cor}][b]☒[/b][/color] Li e concordo com as normas de saída, sendo que caso o meu tempo na companhia seja inferior a 30 dias e superior a 14 dias, receberei 50 medalhas efetivas negativas por saída precoce.\n`;
    }

    codigo += `[/size][/font][/left]`;
    return codigo;
}

function criarBBCodeMedalha(tipo, nickMembro, motivo, nickResponsavel, cargoAlvo) {
    const quantidadeMedalha = (tipo === 'expulsao') ? '(-100)' : '(-50)';
    return `[font=Poppins][color=#004d1a][b][size=17]✗ DADOS DO RESPONSÁVEL[/size][/b][/color]

[b]Nickname:[/b] ${nickResponsavel}
[b]Grupo de tarefas:[/b] Professores
[b]Cargo referente:[/b] ${cargoAlvo}

[color=#004d1a][b][size=17]✗ MEDALHAS ATRIBUÍDAS[/size][/b][/color]

[b]Período de referência:[/b] ${obterDataMedalha()}
[b]Policiais:[/b] ${nickMembro}
[b]Número de medalhas:[/b] [color=red]${quantidadeMedalha}[/color]

[b]Motivo:[/b] ${motivo}[/font]`;
}

function agruparMembros(lista, tipoModal) {
    const grupos = {};
    const hoje = new Date().toLocaleDateString('pt-BR');

    lista.forEach((m, idx) => {
        let dadosAcao = { nome: '', novoCargo: null, tipo: null };
        let motivo = '';
        let acaoNome = '';
        const campos = {};

        if (tipoModal === 'req-inativos') {
            acaoNome = 'SAÍDA';
            motivo = "Sem vínculo.";
            campos["Nickname"] = m.nick;
            campos["Cargo"] = m.cargo;
            campos["Permissão"] = "Conselho da Segurança";
            campos["Motivo"] = motivo;
            campos["Data"] = hoje;
        } else {
            dadosAcao = obterAcao(m.cargo);
            acaoNome = dadosAcao.nome;
            motivo = (tipoModal === 'req-grad') ? "Não realizou a graduação no prazo" : "Limite de dias offline";

            if (acaoNome === 'EXPULSÃO') {
                campos["Nickname"] = m.nick;
                campos["Cargo"] = m.cargo;
                campos["Motivo"] = motivo;
                campos["Permissão"] = "Conselho da Segurança";
                campos["Data"] = hoje;
            } else {
                campos["Nickname"] = m.nick;
                campos["Cargo atual"] = m.cargo;
                if (dadosAcao.novoCargo) campos["Novo cargo"] = dadosAcao.novoCargo;
                campos["Motivo"] = motivo;
                campos["Data"] = hoje;
            }
        }

        const chave = `${acaoNome}-${motivo}-${m.cargo}-${dadosAcao.novoCargo || ''}`;

        if (!grupos[chave]) {
            grupos[chave] = {
                membros: [],
                indices: [],
                camposBase: { ...campos },
                acaoNome: acaoNome,
                tipoAcao: dadosAcao.tipo || (tipoModal === 'req-inativos' ? 'saida' : ''),
                motivoMedalha: (dadosAcao.tipo === 'expulsao' || acaoNome === 'EXPULSÃO') ? "Expulsão do grupo de tarefas." : "Infração cometida no grupo de tarefas.",
                motivoReq: motivo,
                cargoOriginal: m.cargo
            };
        }
        grupos[chave].membros.push(m);
        grupos[chave].indices.push(idx);
    });
    return grupos;
}

// Versão que usa m._idx (índice original) para membros filtrados
function agruparMembrosComIdx(lista, tipoModal) {
    const grupos = {};
    const hoje = new Date().toLocaleDateString('pt-BR');

    lista.forEach(m => {
        const idx = m._idx; // Usa o índice original
        let dadosAcao = { nome: '', novoCargo: null, tipo: null };
        let motivo = '';
        let acaoNome = '';
        const campos = {};

        if (tipoModal === 'req-inativos') {
            acaoNome = 'SAÍDA';
            motivo = "Sem vínculo.";
            campos["Nickname"] = m.nick;
            campos["Cargo"] = m.cargo;
            campos["Permissão"] = "Conselho da Segurança";
            campos["Motivo"] = motivo;
            campos["Data"] = hoje;
        } else {
            dadosAcao = obterAcao(m.cargo);
            acaoNome = dadosAcao.nome;
            motivo = (tipoModal === 'req-grad') ? "Não realizou a graduação no prazo" : "Limite de dias offline";

            if (acaoNome === 'EXPULSÃO') {
                campos["Nickname"] = m.nick;
                campos["Cargo"] = m.cargo;
                campos["Motivo"] = motivo;
                campos["Permissão"] = "Conselho da Segurança";
                campos["Data"] = hoje;
            } else {
                campos["Nickname"] = m.nick;
                campos["Cargo atual"] = m.cargo;
                if (dadosAcao.novoCargo) campos["Novo cargo"] = dadosAcao.novoCargo;
                campos["Motivo"] = motivo;
                campos["Data"] = hoje;
            }
        }

        const chave = `${acaoNome}-${motivo}-${m.cargo}-${dadosAcao.novoCargo || ''}`;

        if (!grupos[chave]) {
            grupos[chave] = {
                membros: [],
                indices: [],
                camposBase: { ...campos },
                acaoNome: acaoNome,
                tipoAcao: dadosAcao.tipo || (tipoModal === 'req-inativos' ? 'saida' : ''),
                motivoMedalha: (dadosAcao.tipo === 'expulsao' || acaoNome === 'EXPULSÃO') ? "Expulsão do grupo de tarefas." : "Infração cometida no grupo de tarefas.",
                motivoReq: motivo,
                cargoOriginal: m.cargo
            };
        }
        grupos[chave].membros.push(m);
        grupos[chave].indices.push(idx); // Usa o índice original
    });
    return grupos;
}

let filaMPLote = [];
let indexFilaMP = -1;

function abrirModal(tipo) {
    sobreposicaoModal.classList.remove('hidden');
    setTimeout(() => {
        fundoModal.classList.remove('opacity-0');
        painelModal.classList.remove('scale-95', 'opacity-0');
        painelModal.classList.add('scale-100', 'opacity-100');
    }, 10);

    const hoje = new Date().toLocaleDateString('pt-BR');
    let conteudoHTML = '';
    let listaFonte = [];
    let prefixoId = '';

    if (tipo === 'req-inativos') {
        listaFonte = membrosInativos.map((m, i) => ({ ...m, _idx: i }));
        prefixoId = 'req-inativos';
    } else if (tipo === 'req-grad') {
        listaFonte = graduacoesPendentes.map((m, i) => ({ ...m, _idx: i }));
        prefixoId = 'req-graduacao';
    } else if (tipo === 'actions-offline') {
        listaFonte = membrosOffline.map((m, i) => ({ ...m, _idx: i }));
        prefixoId = 'req-offline';
    }

    // Filtrar membros desconsiderados (que têm card com opacity-40)
    const tipoCard = tipo === 'req-inativos' ? 'inativos' : (tipo === 'req-grad' ? 'graduacao' : 'offline');
    listaFonte = listaFonte.filter(m => {
        const card = document.getElementById(`card-${tipoCard}-${m._idx}`);
        return !card || !card.classList.contains('opacity-40');
    });

    if (listaFonte.length === 0) {
        alert('Nenhum membro para processar (todos foram desconsiderados ou já processados).');
        fecharModal();
        return;
    }

    if (tipo !== 'req-inativos') {
        conteudoHTML += `
                <div class="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800 mb-6">
                    <label class="block text-xs font-bold text-indigo-800 dark:text-indigo-300 uppercase mb-2">Responsável pela Postagem</label>
                    <input type="text" id="nick-responsavel" value="${localStorage.getItem('nickResponsavel') || ''}" onchange="localStorage.setItem('nickResponsavel', this.value)" class="w-full bg-white dark:bg-[#1e293b] border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Digite seu nickname aqui (será salvo automaticamente)...">
                </div>`;
    }

    // Lógica de Postagem Coletiva (usa m._idx para índice original)
    const grupos = agruparMembrosComIdx(listaFonte, tipo);
    let coletivaHTML = '';
    Object.values(grupos).forEach(g => {
        if (g.membros.length > 1) {
            const nicks = g.membros.map(m => m.nick).join(' / ');
            const camposLote = { ...g.camposBase, Nickname: nicks };
            const bbcodeLote = criarBBCode(g.acaoNome, camposLote);
            const idsReq = g.indices.map(idx => `chk-${prefixoId}-${idx}`).join(',');
            const idsMedalPrefix = prefixoId === 'req-graduacao' ? 'graduacao' : (prefixoId === 'req-offline' ? 'offline' : '');
            const idsMedal = g.indices.map(idx => `chk-medal-${idsMedalPrefix}-${idx}`).join(',');

            const mpsData = g.membros.map((m, idx) => ({
                nick: m.nick,
                tipo: g.tipoAcao,
                motivo: g.motivoReq,
                chkId: `chk-mp-${prefixoId.replace('req-', '')}-${g.indices[idx]}`
            }));

            // Verifica se TODOS do lote já foram feitos
            const todosReqFeitos = g.indices.every(idx => document.getElementById(`chk-${prefixoId}-${idx}`)?.checked);
            const todosMedalFeitos = g.indices.every(idx => document.getElementById(`chk-medal-${idsMedalPrefix}-${idx}`)?.checked);
            const todasMPsFeitas = g.indices.every(idx => document.getElementById(`chk-mp-${prefixoId.replace('req-', '')}-${idx}`)?.checked);

            coletivaHTML += `
                        <div class="bg-purple-50 dark:bg-purple-900/10 p-5 rounded-2xl border-2 border-purple-200 dark:border-purple-800/50 mb-8 shadow-sm">
                            <div class="flex justify-between items-center mb-4">
                                <h4 class="font-bold text-purple-700 dark:text-purple-300 flex items-center gap-2">
                                    <i class="fa-solid fa-users-viewfinder"></i> Postagem Coletiva (${g.membros.length} membros)
                                </h4>
                                <span class="bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-200 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">${g.acaoNome}</span>
                            </div>
                            <div class="bg-white/50 dark:bg-black/20 p-3 rounded-lg border border-purple-100 dark:border-purple-800/30 mb-4">
                                <p class="text-[11px] text-slate-500 dark:text-slate-400 mb-1 font-semibold uppercase">Membros do lote:</p>
                                <p class="text-sm font-medium text-slate-700 dark:text-slate-200">${nicks}</p>
                            </div>
                            <div class="flex flex-col md:flex-row gap-3">
                                <button class="btn ${todosReqFeitos ? 'bg-green-600' : 'bg-purple-600 hover:bg-purple-700'} text-white flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20" 
                                    ${todosReqFeitos ? 'disabled' : ''}
                                    onclick="postarAcao(this, '${encodeURIComponent(bbcodeLote)}', '${ID_TOPICO_FORUM}', '${idsReq}')">
                                    <i class="fa-solid ${todosReqFeitos ? 'fa-check' : 'fa-file-signature'}"></i> ${todosReqFeitos ? 'Requerimentos Postados' : 'Postar Requerimentos'}
                                </button>
                                ${g.tipoAcao && g.tipoAcao !== 'saida' ? `
                                <button class="btn ${todosMedalFeitos ? 'bg-green-600' : 'bg-indigo-600 hover:bg-indigo-700'} text-white flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20" 
                                    ${todosMedalFeitos ? 'disabled' : ''}
                                    onclick="postarMedalha(this, '${nicks}', '${g.tipoAcao}', '${g.motivoMedalha}', '${g.cargoOriginal}', '${idsMedal},${idsReq}')">
                                    <i class="fa-solid ${todosMedalFeitos ? 'fa-check' : 'fa-medal'}"></i> ${todosMedalFeitos ? 'Medalhas Postadas' : 'Postar Medalhas'}
                                </button>
                                <button class="btn ${todasMPsFeitas ? 'bg-green-600' : 'bg-amber-500 hover:bg-amber-600'} text-white flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20" 
                                    ${todasMPsFeitas ? 'disabled' : ''}
                                    onclick="iniciarMPLote(${JSON.stringify(mpsData).replace(/"/g, '&quot;')})">
                                    <i class="fa-solid ${todasMPsFeitas ? 'fa-check' : 'fa-envelopes-bulk'}"></i> ${todasMPsFeitas ? 'MPs Enviadas' : 'Enviar MPs'}
                                </button>` : ''}
                            </div>
                        </div>
                    `;
        }
    });

    if (coletivaHTML) {
        conteudoHTML += `
                    <div class="mb-4">
                        <h5 class="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[2px] mb-4 flex items-center gap-2">
                             <div class="h-[1px] flex-grow bg-slate-200 dark:bg-slate-800"></div>
                             OPÇÕES EM LOTE
                             <div class="h-[1px] flex-grow bg-slate-200 dark:bg-slate-800"></div>
                        </h5>
                        ${coletivaHTML}
                        <h5 class="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[2px] mt-8 mb-4 flex items-center gap-2">
                             <div class="h-[1px] flex-grow bg-slate-200 dark:bg-slate-800"></div>
                             POSTAGENS INDIVIDUAIS
                             <div class="h-[1px] flex-grow bg-slate-200 dark:bg-slate-800"></div>
                        </h5>
                    </div>
                `;
    }

    const gerarItem = (m, titulo, bbcode, tipoAcao, motivo, motivoReq, chkId, medalChkId, tipoModal) => {
        const bbCodificado = encodeURIComponent(bbcode);

        const reqFeito = document.getElementById(chkId)?.checked;
        const medalFeita = document.getElementById(medalChkId)?.checked;
        const mpFeita = document.getElementById(chkId?.replace('chk-req-', 'chk-mp-'))?.checked;

        let botoes = `
                    <button class="btn ${reqFeito ? 'bg-green-600 cursor-default' : 'btn-primary'} flex-1 py-2 rounded-lg text-sm flex items-center justify-center gap-2" 
                        ${reqFeito ? 'disabled' : ''}
                        onclick="postarAcao(this, '${bbCodificado}', '${ID_TOPICO_FORUM}', '${chkId}')">
                        <i class="fa-solid ${reqFeito ? 'fa-check' : 'fa-paper-plane'}"></i> ${reqFeito ? 'Postado' : 'Postar Requerimento'}
                    </button>`;

        if (tipoAcao) {
            botoes += `
                    <button class="btn ${medalFeita ? 'bg-green-600 cursor-default' : 'bg-purple-600 hover:bg-purple-700'} text-white flex-1 py-2 rounded-lg text-sm flex items-center justify-center gap-2" 
                        ${medalFeita ? 'disabled' : ''}
                        onclick="postarMedalha(this, '${m.nick}', '${tipoAcao}', '${motivo}', '${m.cargo}', '${medalChkId}')">
                        <i class="fa-solid ${medalFeita ? 'fa-check' : 'fa-medal'}"></i> ${medalFeita ? 'Postada' : 'Postar Medalha'}
                    </button>`;
        }

        if (tipoModal !== 'req-inativos') {
            const mpChkId = chkId ? chkId.replace('chk-req-', 'chk-mp-') : '';
            botoes += `
                    <button class="btn ${mpFeita ? 'bg-green-600 cursor-default' : 'bg-amber-500 hover:bg-amber-600'} text-white flex-1 py-2 rounded-lg text-sm flex items-center justify-center gap-2" 
                        ${mpFeita ? 'disabled' : ''}
                        onclick="abrirModalMP('${m.nick}', '${tipoAcao || 'rebaixamento'}', '${motivoReq}', '${mpChkId}')">
                        <i class="fa-solid ${mpFeita ? 'fa-check' : 'fa-envelope'}"></i> ${mpFeita ? 'Enviada' : 'Enviar MP'}
                    </button>`;
        }

        return `
                <div class="bg-white dark:bg-[#1e293b] p-5 rounded-xl border border-slate-200 dark:border-slate-700 mb-4 shadow-sm">
                    <div class="flex justify-between items-start mb-3">
                        <h4 class="font-bold text-slate-800 dark:text-slate-100">${m.nick}</h4>
                        <span class="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">${titulo}</span>
                    </div>
                    <pre class="bg-slate-50 dark:bg-[#020617] p-3 rounded-lg text-[10px] text-slate-600 dark:text-slate-400 font-mono mb-4 overflow-x-auto border border-slate-200 dark:border-slate-800 custom-scrollbar">${bbcode}</pre>
                    <div class="flex flex-col md:flex-row gap-3">${botoes}</div>
                </div>`;
    };

    if (tipo === 'req-inativos') {
        tituloModal.innerHTML = '<i class="fa-solid fa-user-xmark text-rose-500"></i> Postar Saídas';
        listaFonte.forEach(m => {
            const i = m._idx;
            const campos = { "Nickname": m.nick, "Cargo": m.cargo, "Permissão": "Conselho da Segurança", "Motivo": "Sem vínculo.", "Data": hoje };
            conteudoHTML += gerarItem(m, 'SAÍDA', criarBBCode("SAÍDA", campos), null, null, "Sem vínculo.", `chk-req-inativos-${i}`, null, tipo);
        });
    } else if (tipo === 'req-grad') {
        tituloModal.innerHTML = '<i class="fa-solid fa-user-graduate text-purple-500"></i> Postar Punições (Graduação)';
        listaFonte.forEach(m => {
            const i = m._idx;
            const acao = m.tipo === 'expulsao' ? 'EXPULSÃO' : 'REBAIXAMENTO';
            const dadosAcao = obterAcao(m.cargo);
            const campos = {};

            if (acao === 'EXPULSÃO') {
                campos["Nickname"] = m.nick;
                campos["Cargo"] = m.cargo;
                campos["Motivo"] = "Não realizou a graduação no prazo";
                campos["Permissão"] = "Conselho da Segurança";
                campos["Data"] = hoje;
            } else {
                campos["Nickname"] = m.nick;
                campos["Cargo atual"] = m.cargo;
                if (dadosAcao.novoCargo) campos["Novo cargo"] = dadosAcao.novoCargo;
                campos["Motivo"] = "Não realizou a graduação no prazo";
                campos["Data"] = hoje;
            }

            const motivoMedalha = m.tipo === 'expulsao' ? "Expulsão do grupo de tarefas." : "Infração cometida no grupo de tarefas.";
            conteudoHTML += gerarItem(m, acao, criarBBCode(acao, campos), m.tipo, motivoMedalha, campos["Motivo"], `chk-req-graduacao-${i}`, `chk-medal-graduacao-${i}`, tipo);
        });
    } else if (tipo === 'actions-offline') {
        tituloModal.innerHTML = '<i class="fa-solid fa-clock text-amber-500"></i> Postar Ações Offline';
        listaFonte.forEach(m => {
            const i = m._idx;
            const dadosAcao = obterAcao(m.cargo);
            const acao = dadosAcao.nome; // 'EXPULSÃO' ou 'REBAIXAMENTO'
            const campos = {};

            if (acao === 'EXPULSÃO') {
                campos["Nickname"] = m.nick;
                campos["Cargo"] = m.cargo;
                campos["Motivo"] = "Limite de dias offline";
                campos["Permissão"] = "Conselho da Segurança";
                campos["Data"] = hoje;
            } else {
                campos["Nickname"] = m.nick;
                campos["Cargo atual"] = m.cargo;
                if (dadosAcao.novoCargo) campos["Novo cargo"] = dadosAcao.novoCargo;
                campos["Motivo"] = "Limite de dias offline";
                campos["Data"] = hoje;
            }

            const motivoMedalha = dadosAcao.tipo === 'expulsao' ? "Expulsão do grupo de tarefas." : "Infração cometida no grupo de tarefas.";
            conteudoHTML += gerarItem(m, `${acao} (${m.dias}d)`, criarBBCode(acao, campos), dadosAcao.tipo, motivoMedalha, campos["Motivo"], `chk-req-offline-${i}`, `chk-medal-offline-${i}`, tipo);
        });
    }

    conteudoModal.innerHTML = conteudoHTML;
}

function fecharModal() {
    fundoModal.classList.add('opacity-0');
    painelModal.classList.remove('scale-100', 'opacity-100');
    painelModal.classList.add('scale-95', 'opacity-0');
    setTimeout(() => {
        sobreposicaoModal.classList.add('hidden');
    }, 300);
}

function exibirModalConfirmacao(topicoId) {
    topicoRedirecionamento = topicoId;
    modalConfirmacao.classList.remove('hidden');
}

function fecharModalConfirmacao() {
    modalConfirmacao.classList.add('hidden');
    topicoRedirecionamento = '';
}

function confirmarERedirecionar() {
    if (topicoRedirecionamento === 'mp') {
        window.open('https://www.policiarcc.com/privmsg?folder=outbox', '_blank');
    } else if (topicoRedirecionamento) {
        window.open(`https://www.policiarcc.com/t${topicoRedirecionamento}-`, '_blank');
    }
    fecharModalConfirmacao();
}

function abrirModalRevisaoBBCode(titulo, conteudo, callback) {
    document.getElementById('titulo-revisao-bbcode').innerText = titulo;
    document.getElementById('bbcode-revisao-conteudo').innerText = conteudo;

    const btnConfirmar = document.getElementById('btn-confirmar-postagem');
    const novoBtnConfirmar = btnConfirmar.cloneNode(true);
    btnConfirmar.parentNode.replaceChild(novoBtnConfirmar, btnConfirmar);

    novoBtnConfirmar.addEventListener('click', callback);

    const modal = document.getElementById('modal-revisao-bbcode');
    const fundo = document.getElementById('fundo-revisao-bbcode');
    const painel = document.getElementById('painel-revisao-bbcode');

    modal.classList.remove('hidden');
    setTimeout(() => {
        fundo.classList.remove('opacity-0');
        painel.classList.remove('scale-95', 'opacity-0');
        painel.classList.add('scale-100', 'opacity-100');
    }, 10);
}

window.fecharModalRevisaoBBCode = function () {
    const modal = document.getElementById('modal-revisao-bbcode');
    const fundo = document.getElementById('fundo-revisao-bbcode');
    const painel = document.getElementById('painel-revisao-bbcode');

    fundo.classList.add('opacity-0');
    painel.classList.remove('scale-100', 'opacity-100');
    painel.classList.add('scale-95', 'opacity-0');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
};

window.postarAcao = function (btn, bbcode, topicoId, chkId) {
    const codigo = decodeURIComponent(bbcode);
    const jaFeito = chkId.split(',').every(id => document.getElementById(id)?.checked);

    if (jaFeito) {
        abrirModalVerificacao(topicoId, codigo);
        return;
    }

    abrirModalRevisaoBBCode('Revisar Requerimento', codigo, () => {
        fecharModalRevisaoBBCode();
        processarPostagem(btn, codigo, topicoId, chkId);
    });
};

function processarPostagem(btnOriginal, codigo, topicoId, chkId) {
    btnOriginal.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
    btnOriginal.disabled = true;

    $.post("/post", { t: topicoId, message: codigo, mode: "reply", post: 1 })
        .done(() => {
            btnOriginal.innerHTML = '<i class="fa-solid fa-check"></i> Sucesso';
            btnOriginal.className = "btn bg-green-600 text-white flex-1 py-2 rounded-lg text-sm flex items-center justify-center gap-2";
            if (chkId) {
                const ids = chkId.split(',');
                ids.forEach(id => {
                    const el = document.getElementById(id);
                    if (el) { el.checked = true; el.disabled = true; }
                });
                atualizarProgressoPorCheckboxId(chkId);
            }
            ativarCooldownGlobal();
            exibirModalConfirmacao(topicoId);
        }).fail(() => {
            btnOriginal.innerHTML = '<i class="fa-solid fa-xmark"></i> Erro';
            btnOriginal.className = "btn bg-red-600 text-white flex-1 py-2 rounded-lg text-sm flex items-center justify-center gap-2";
            setTimeout(() => {
                btnOriginal.disabled = false;
                btnOriginal.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Tentar Novamente';
                btnOriginal.className = "btn btn-primary flex-1 py-2 rounded-lg text-sm flex items-center justify-center gap-2";
            }, 2000);
        });
}

window.iniciarMPLote = function (membros) {
    filaMPLote = membros;
    indexFilaMP = 0;
    document.getElementById('progresso-mp-container').classList.remove('hidden');
    processarProximaMP();
};

function processarProximaMP() {
    if (indexFilaMP >= filaMPLote.length) {
        filaMPLote = [];
        indexFilaMP = -1;
        document.getElementById('progresso-mp-container').classList.add('hidden');
        return;
    }

    const m = filaMPLote[indexFilaMP];
    const total = filaMPLote.length;
    const atual = indexFilaMP + 1;
    const porcentagem = (atual / total) * 100;

    document.getElementById('progresso-mp-texto').innerText = `${atual}/${total}`;
    document.getElementById('progresso-mp-barra').style.width = `${porcentagem}%`;

    abrirModalMP(m.nick, m.tipo, m.motivo, m.chkId);
}

window.abrirModalMP = function (nick, tipo, motivo, chkId) {
    const jaFeito = chkId && document.getElementById(chkId)?.checked;
    if (jaFeito) {
        abrirModalVerificacao('mp', 'Código de MP indisponível para cópia em modo de verificação.');
        return;
    }

    mpDestinatario.value = nick;
    mpTipo.value = tipo;
    mpMotivo.value = motivo || "Infração";
    mpConsideracoes.value = "";
    mpProva.value = "";
    checkboxMPAtual = chkId || '';

    botaoEnviarMP.disabled = false;
    botaoEnviarMP.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Enviar MP';
    botaoEnviarMP.className = "w-full btn bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2";

    modalMP.classList.remove('hidden');
    setTimeout(() => {
        fundoModalMP.classList.remove('opacity-0');
        painelModalMP.classList.remove('scale-95', 'opacity-0');
        painelModalMP.classList.add('scale-100', 'opacity-100');
    }, 10);
}

window.fecharModalMP = function () {
    fundoModalMP.classList.add('opacity-0');
    painelModalMP.classList.remove('scale-100', 'opacity-100');
    painelModalMP.classList.add('scale-95', 'opacity-0');
    setTimeout(() => {
        modalMP.classList.add('hidden');
    }, 300);
};

window.enviarMP = function () {
    const nick = mpDestinatario.value;
    const tipo = mpTipo.value;
    const motivo = mpMotivo.value || "Infração";
    const consideracoes = mpConsideracoes.value || "Fundamento";
    const linkProva = mpProva.value || "#";
    const hoje = new Date().toLocaleDateString('pt-BR');

    let template = (tipo === 'expulsao') ? TEMPLATE_MP_EXPULSAO : TEMPLATE_MP_REBAIXAMENTO;

    let mensagem = template
        .replace(/{MOTIVO}/g, motivo)
        .replace(/{CONSIDERACOES}/g, consideracoes)
        .replace(/{LINK_PROVA}/g, linkProva);

    const assunto = `[PROF] Carta de ${tipo === 'expulsao' ? 'Expulsão' : 'Rebaixamento'}`;

    botaoEnviarMP.disabled = true;
    botaoEnviarMP.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...';

    $.post("/privmsg", {
        "username[]": [nick],
        subject: assunto,
        message: mensagem,
        mode: "post",
        post: 1
    })
        .done(function () {
            botaoEnviarMP.innerHTML = '<i class="fa-solid fa-check"></i> Enviado com Sucesso!';
            botaoEnviarMP.classList.remove('bg-amber-500', 'hover:bg-amber-600');
            botaoEnviarMP.classList.add('bg-green-600', 'hover:bg-green-700');

            if (checkboxMPAtual) {
                const el = document.getElementById(checkboxMPAtual);
                if (el) {
                    el.checked = true;
                    el.disabled = true;
                }
                atualizarProgressoPorCheckboxId(checkboxMPAtual);
            }

            ativarCooldownGlobal();

            if (indexFilaMP !== -1 && indexFilaMP < filaMPLote.length - 1) {
                indexFilaMP++;
                botaoEnviarMP.innerHTML = '<i class="fa-solid fa-clock"></i> Aguardando Cooldown (5s)...';
                setTimeout(() => {
                    fecharModalMP();
                    setTimeout(() => processarProximaMP(), 500);
                }, 5000);
            } else {
                setTimeout(() => {
                    fecharModalMP();
                    exibirModalConfirmacao('mp');
                    indexFilaMP = -1;
                    filaMPLote = [];
                    document.getElementById('progresso-mp-container').classList.add('hidden');
                }, 1500);
            }
        })
        .fail(function () {
            botaoEnviarMP.innerHTML = '<i class="fa-solid fa-xmark"></i> Erro ao Enviar';
            botaoEnviarMP.classList.remove('bg-amber-500', 'hover:bg-amber-600');
            botaoEnviarMP.classList.add('bg-red-600', 'hover:bg-red-700');
            setTimeout(() => {
                botaoEnviarMP.disabled = false;
                botaoEnviarMP.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Tentar Novamente';
                botaoEnviarMP.className = "w-full btn bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2";
            }, 2000);
        });
};



window.postarMedalha = function (btn, nick, tipo, motivo, cargo, chkId) {
    const resp = document.getElementById('nick-responsavel').value;
    if (!resp) { alert('Digite seu nick no topo do modal.'); return; }

    const codigo = criarBBCodeMedalha(tipo, nick, motivo, resp, cargo);
    const jaFeito = chkId.split(',').every(id => document.getElementById(id)?.checked);

    if (jaFeito) {
        abrirModalVerificacao(ID_TOPICO_MEDALHA, codigo);
        return;
    }

    abrirModalRevisaoBBCode('Revisar Medalha', codigo, () => {
        fecharModalRevisaoBBCode();
        confirmarPostagemMedalha(btn, codigo, chkId);
    });
};

function abrirModalVerificacao(topicoOuMP, bbcode) {
    const modal = document.getElementById('modal-verificacao-postagem');
    const fundo = document.getElementById('fundo-verificacao-postagem');
    const painel = document.getElementById('painel-verificacao-postagem');
    const link = topicoOuMP === 'mp' ? 'https://www.policiarcc.com/privmsg?folder=outbox' : `https://www.policiarcc.com/t${topicoOuMP}-`;

    document.getElementById('bbcode-erro-copia').innerText = bbcode;
    document.getElementById('conteudo-verificacao-normal').classList.remove('hidden');
    document.getElementById('conteudo-verificacao-erro').classList.add('hidden');

    const btnLink = document.getElementById('btn-verificar-link');
    const btnLinkErro = document.getElementById('btn-link-erro');
    const btnCopiar = document.getElementById('btn-copiar-erro');

    btnLink.onclick = () => window.open(link, '_blank');
    btnLinkErro.onclick = () => window.open(link, '_blank');
    btnCopiar.onclick = () => {
        navigator.clipboard.writeText(bbcode);
        btnCopiar.innerHTML = '<i class="fa-solid fa-check"></i> Copiado!';
        setTimeout(() => btnCopiar.innerHTML = '<i class="fa-solid fa-copy"></i> Copiar Código', 2000);
    };

    modal.classList.remove('hidden');
    setTimeout(() => {
        fundo.classList.remove('opacity-0');
        painel.classList.remove('scale-95', 'opacity-0');
        painel.classList.add('scale-100', 'opacity-100');
    }, 10);
}

window.fecharModalVerificacao = function () {
    const modal = document.getElementById('modal-verificacao-postagem');
    const fundo = document.getElementById('fundo-verificacao-postagem');
    const painel = document.getElementById('painel-verificacao-postagem');
    fundo.classList.add('opacity-0');
    painel.classList.remove('scale-100', 'opacity-100');
    painel.classList.add('scale-95', 'opacity-0');
    setTimeout(() => modal.classList.add('hidden'), 300);
};

window.exibirErroPostagem = function () {
    document.getElementById('conteudo-verificacao-normal').classList.add('hidden');
    document.getElementById('conteudo-verificacao-erro').classList.remove('hidden');
};

window.voltarVerificacaoNormal = function () {
    document.getElementById('conteudo-verificacao-normal').classList.remove('hidden');
    document.getElementById('conteudo-verificacao-erro').classList.add('hidden');
};

function confirmarPostagemMedalha(btnOriginal, codigo, chkId) {
    btnOriginal.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
    btnOriginal.disabled = true;

    $.post("/post", { t: ID_TOPICO_MEDALHA, message: codigo, mode: "reply", post: 1 })
        .done(() => {
            btnOriginal.innerHTML = '<i class="fa-solid fa-check"></i>';
            btnOriginal.classList.add('bg-green-600');
            if (chkId) {
                const ids = chkId.split(',');
                ids.forEach(id => {
                    const el = document.getElementById(id);
                    if (el) { el.checked = true; el.disabled = true; }
                });
                atualizarProgressoPorCheckboxId(chkId);
            }
            ativarCooldownGlobal();
            exibirModalConfirmacao(ID_TOPICO_MEDALHA);
        }).fail(() => {
            btnOriginal.innerHTML = '<i class="fa-solid fa-xmark"></i> Erro';
            btnOriginal.className = "btn bg-red-600 text-white flex-1 py-2 rounded-lg text-sm flex items-center justify-center gap-2";
            setTimeout(() => {
                btnOriginal.disabled = false;
                btnOriginal.innerHTML = '<i class="fa-solid fa-medal"></i> Tentar Novamente';
                btnOriginal.className = "btn bg-purple-600 hover:bg-purple-700 text-white flex-1 py-2 rounded-lg text-sm flex items-center justify-center gap-2";
            }, 2000);
        });
}
