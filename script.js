const CHAVE_API = 'AIzaSyBQhWdy4iyFCk9Lh89x8weSIyl0knXgA34';
const ID_PLANILHA = '1KQXx7TFtbNzMYHzOM5LMT7Fh61hiGOKZHux4K3Q6YpM';
const INTERVALO_DADOS = 'Gerador!B4:J193';

const LISTA_PROXIES = [
    'https://proxydopegas.lipe81444.workers.dev/?url=',
    'https://api.allorigins.win/raw?url=',
    'https://thingproxy.freeboard.io/fetch/',
    'https://api.codetabs.com/v1/proxy?quest='
];

const URL_API_HABBO = 'https://www.habbo.com.br/api/public/users';
const ID_GRUPO_HABBO = 'g-hhbr-77d2964628f63fce5f105b7be518b1d6';
const ID_GRUPO_GRADUADORES = 'g-hhbr-4678e9d206cb74d9696d39a17660d51a';
const ID_GRUPO_SPP = 'g-hhbr-c8b78c26bbe3494726111806bc26c2c6';
const ID_GRUPO_DEP_APLICACAO = 'g-hhbr-d6c10ba3ac926a89d16c46c217960b6f';
const ID_GRUPO_CDC = 'g-hhbr-b7293bcaf77d1a7ef22ee7b274bc78a9';
const ID_GRUPO_CORREGEDORIA = 'g-hhbr-8e057e366f037ccbc2a5de1bdbb8f6a0';
const ID_GRUPO_GATE = 'g-hhbr-6a69ea77637188b67832c7b8e034bf5c';
const ID_GRUPO_GSS = 'g-hhbr-4d2f8fa6bad619fb52f9f9b97de71a87';

const ID_TOPICO_FORUM = 32243;
const ID_TOPICO_MEDALHA = 36745;
const REQUEST_TIMEOUT_MS = 8000;

async function fetchComTimeout(url, options = {}, timeoutMs = REQUEST_TIMEOUT_MS) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
        return await fetch(url, { ...options, signal: controller.signal });
    } catch (erro) {
        if (erro.name === 'AbortError') {
            let destino = String(url);
            try {
                destino = new URL(url, window.location.href).hostname;
            } catch (e) { }
            throw new Error(`Tempo limite excedido ao acessar ${destino}`);
        }
        throw erro;
    } finally {
        clearTimeout(timeoutId);
    }
}

async function fetchWithProxy(url, options = {}, prioridadeDireto = false) {
    let ultimoErro = null;

    try {
        const directResponse = await fetchComTimeout(url, options);
        if (directResponse.ok) return directResponse;
        if (directResponse.status === 404) return directResponse;
    } catch (e) {
        console.log('[Proxy] Fetch direto inicial falhou, usando proxies...');
        ultimoErro = e;
    }

    for (const proxy of LISTA_PROXIES) {
        try {
            const targetUrl = proxy + encodeURIComponent(url);
            const response = await fetchComTimeout(targetUrl, options);
            if (response.ok) return response;
            if (response.status === 404) return response;
            console.warn(`[Proxy] Falha no proxy ${proxy}: ${response.status}`);
        } catch (e) {
            console.warn(`[Proxy] Erro ao conectar com ${proxy}`);
            ultimoErro = e;
        }
    }

    throw ultimoErro || new Error('Todos os proxies falharam');
}

let m_modoVerificacao = 'direto';

window.atualizarEstiloModo = function () {
    const radios = document.getElementsByName('modo-verificacao');
    radios.forEach(r => {
        const label = document.getElementById(r.value === 'direto' ? 'label-modo-rapido' : 'label-modo-estavel');
        const dot = document.getElementById(r.value === 'direto' ? 'dot-rapido' : 'dot-estavel');

        if (r.checked) {
            label.classList.add('border-purple-500', 'bg-purple-50/50', 'dark:bg-purple-500/10');
            label.classList.remove('border-slate-200', 'dark:border-slate-800', 'bg-white', 'dark:bg-[#0f172a]');
            dot.classList.add('bg-purple-500');
            dot.classList.remove('bg-transparent');
            m_modoVerificacao = r.value;
        } else {
            label.classList.remove('border-purple-500', 'bg-purple-50/50', 'dark:bg-purple-500/10');
            label.classList.add('border-slate-200', 'dark:border-slate-800', 'bg-white', 'dark:bg-[#0f172a]');
            dot.classList.remove('bg-purple-500');
            dot.classList.add('bg-transparent');
        }
    });
};

const SHEETS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbzzEUQN5twPDbTAbUQA27ysVi-PAwbgoQe1w8BQwY2f8_jzlhI2NPvYpETkYgfe5qdl/exec';

let estadoAtualGlobal = {
    verificador: '',
    timestamp: null,
    resultados: {},
    checkboxes: {}
};

let todosOsLogsCache = [];
let timeoutSalvamentoEstado = null;

function salvarEstadoAtual() {
    if (!estadoAtualGlobal.timestamp) return;

    const checkboxes = document.querySelectorAll('input[type="checkbox"][id^="chk-"]');
    checkboxes.forEach(chk => {
        estadoAtualGlobal.checkboxes[chk.id] = chk.checked;
    });

    const payload = {
        action: 'SAVE_LOG',
        id: estadoAtualGlobal.id,
        verificador: localStorage.getItem('verificadorNick'),
        resumo: gerarResumoLog(),
        estado: estadoAtualGlobal,
        nicksSystem: extrairNicksDaListagemMembros(document.getElementById('lista-gratificacoes').value).join('\n')
    };

    enviarLogBackground(payload);
}

function agendarSalvamentoEstado() {
    clearTimeout(timeoutSalvamentoEstado);
    timeoutSalvamentoEstado = setTimeout(salvarEstadoAtual, 350);
}

function gerarResumoLog() {
    const r = estadoAtualGlobal.resultados;
    if (!r) return 'Sem dados';
    let resumo = [];
    if (r.inativos?.length) resumo.push(`${r.inativos.length} Inativos`);
    if (r.graduacao?.length) resumo.push(`${r.graduacao.length} Grad.`);
    if (r.offline?.length) resumo.push(`${r.offline.length} Off.`);
    if (r.removerForum?.length) resumo.push(`${r.removerForum.length} Fórum`);
    return resumo.join(', ') || 'Nenhuma pendência';
}

function enviarLogBackground(dados) {
    if (!SHEETS_WEB_APP_URL || SHEETS_WEB_APP_URL.includes('COLE_SUA_URL_AQUI')) return;

    fetch(SHEETS_WEB_APP_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
    }).then(() => console.log('[Log] Estado salvo/atualizado.'))
        .catch(e => console.warn('[Log] Falha ao salvar:', e));
}

function registrarVerificacaoNaPlanilha(inativos, graduacao, offline, removerForum, retirarDosGrupos, textoSystem, erros = []) {

    estadoAtualGlobal = {
        id: crypto.randomUUID(),
        verificador: localStorage.getItem('verificadorNick'),
        timestamp: new Date().toISOString(),
        resultados: {
            inativos: inativos.map(m => ({ ...m, _idx: undefined })),
            graduacao: graduacao.map(m => ({ ...m, _idx: undefined })),
            offline: offline.map(m => ({ ...m, _idx: undefined })),
            removerForum: removerForum,
            retirarDosGrupos: retirarDosGrupos,
            erros: erros
        },
        checkboxes: {}
    };

    salvarEstadoAtual();
}

document.addEventListener('change', (e) => {
    if (e.target.matches('input[type="checkbox"][id^="chk-"]')) {
        agendarSalvamentoEstado();
    }
});

function registrarAcaoNaPlanilha(categoria, nickMembro, cargoMembro, tipoAcao, marcado, observacoes = '') {
    agendarSalvamentoEstado();
}

let clicksLogo = 0;
let timeoutLogo;

function setupAdminTrigger() {
    const logo = document.getElementById('logo-professores');
    if (logo) {

        const newLogo = logo.cloneNode(true);
        logo.parentNode.replaceChild(newLogo, logo);

        newLogo.addEventListener('click', (e) => {

            newLogo.style.transform = 'scale(0.9)';
            setTimeout(() => newLogo.style.transform = '', 100);

            clicksLogo++;
            if (clicksLogo === 1) {

                timeoutLogo = setTimeout(() => {
                    clicksLogo = 0;
                }, 2000);
            }

            if (clicksLogo >= 5) {
                clearTimeout(timeoutLogo);
                clicksLogo = 0;
                abrirModalLogs();
            }
        });
        console.log('Admin trigger configurado no logo.');
    } else {
        console.warn('Logo não encontrado para trigger Admin.');
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupAdminTrigger);
} else {
    setupAdminTrigger();
}

async function abrirModalLogs() {

    if (!document.getElementById('modal-logs')) {
        criarModalLogsHTML();
    }

    const modal = document.getElementById('modal-logs');
    const lista = document.getElementById('lista-logs-conteudo');

    modal.classList.remove('hidden');
    lista.innerHTML = '<div class="text-center p-4 text-slate-500"><i class="fa-solid fa-spinner fa-spin"></i> Carregando logs...</div>';

    try {
        const response = await fetchComTimeout(`${SHEETS_WEB_APP_URL}?action=GET_LOGS`);
        const data = await response.json();

        renderizarListaLogs(data.logs);
    } catch (e) {
        lista.innerHTML = `<div class="text-center p-4 text-red-500">Erro ao carregar logs: ${e.message}</div>`;
    }
}

function criarModalLogsHTML() {
    const html = `
    <div id="modal-logs" class="fixed inset-0 z-[60] hidden" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="fixed inset-0 bg-slate-900/90 transition-opacity backdrop-blur-sm" onclick="fecharModalLogs()"></div>
        <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <div class="relative transform overflow-hidden rounded-2xl bg-white dark:bg-[#0f172a] text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-4xl border border-slate-200 dark:border-slate-800">
                    <div class="bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-5 flex justify-between items-center">
                        <div class="flex items-center gap-3">
                            <div class="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                                <i class="fa-solid fa-clock-rotate-left text-white text-lg"></i>
                            </div>
                            <div>
                                <h3 class="text-lg font-bold leading-6 text-white" id="modal-title">
                                    Histórico de Fiscalizações
                                </h3>
                                <p class="text-indigo-100 text-xs mt-0.5">Clique em um registro para restaurar o estado</p>
                            </div>
                        </div>
                        <button type="button" class="text-indigo-100 hover:text-white hover:bg-white/10 rounded-lg p-2 transition-colors" onclick="fecharModalLogs()">
                            <i class="fa-solid fa-xmark text-xl"></i>
                        </button>
                    </div>


                    <div class="p-6 pb-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <i class="fa-solid fa-magnifying-glass text-slate-400"></i>
                            </div>
                            <input type="text" id="busca-logs"
                                class="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-700 rounded-xl leading-5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all shadow-sm"
                                placeholder="Buscar por nick, data ou resumo..."
                                onkeyup="filtrarLogs(this.value)">
                        </div>
                    </div>

                    <div class="p-6 bg-slate-50 dark:bg-slate-900/20 min-h-[400px]">
                        <div id="lista-logs-conteudo" class="grid grid-cols-1 gap-3 max-h-[50vh] overflow-y-auto custom-scrollbar pr-2">

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', html);
}

function fecharModalLogs() {
    document.getElementById('modal-logs').classList.add('hidden');
}

let logsCacheGlobal = [];

function renderizarListaLogs(logs) {
    logsCacheGlobal = logs || [];
    atualizarListaVisual(logsCacheGlobal);
}

function filtrarLogs(termo) {
    if (!termo) {
        atualizarListaVisual(logsCacheGlobal);
        return;
    }
    const termoLower = termo.toLowerCase();
    const filtrados = logsCacheGlobal.filter(log =>
        (log.verificador && log.verificador.toLowerCase().includes(termoLower)) ||
        (log.resumo && log.resumo.toLowerCase().includes(termoLower)) ||
        (formatarDataLegivel(log.data).toLowerCase().includes(termoLower))
    );
    atualizarListaVisual(filtrados);
}

function formatarDataLegivel(dataISO) {
    if (!dataISO) return 'Data desconhecida';
    try {
        const data = new Date(dataISO);
        return data.toLocaleString('pt-BR', {
            day: '2-digit', month: '2-digit', year: '2-digit',
            hour: '2-digit', minute: '2-digit'
        });
    } catch (e) {
        return dataISO;
    }
}

function atualizarListaVisual(logs) {
    const container = document.getElementById('lista-logs-conteudo');

    if (!logs || logs.length === 0) {
        container.innerHTML = `
            <div class="text-center py-10 flex flex-col items-center justify-center opacity-50">
                <i class="fa-solid fa-ghost text-4xl mb-3 text-slate-300"></i>
                <p class="text-slate-500">Nenhum registro encontrado.</p>
            </div>`;
        return;
    }

    let html = '';
    logs.forEach(log => {
        const dataFormatada = formatarDataLegivel(log.data);
        const inicial = log.verificador ? log.verificador.charAt(0).toUpperCase() : '?';

        let iconResumo = '<i class="fa-solid fa-list-check"></i>';
        let corResumo = 'text-slate-500';
        let bgResumo = 'bg-slate-100 dark:bg-slate-800';

        if (log.resumo.includes('Inativos')) {
            iconResumo = '<i class="fa-solid fa-user-slash"></i>';
            corResumo = 'text-red-500';
            bgResumo = 'bg-red-50 dark:bg-red-900/20';
        } else if (log.resumo.includes('Grad')) {
            iconResumo = '<i class="fa-solid fa-graduation-cap"></i>';
            corResumo = 'text-purple-500';
            bgResumo = 'bg-purple-50 dark:bg-purple-900/20';
        }

        html += `
        <div onclick="carregarLogDetalhado('${log.id}')"
             class="group cursor-pointer bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/50 rounded-xl p-4 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all shadow-sm hover:shadow-md flex justify-between items-center relative overflow-hidden">

            <div class="absolute left-0 top-0 bottom-0 w-1 bg-transparent group-hover:bg-indigo-500 transition-colors"></div>

            <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-slate-700/50 flex items-center justify-center overflow-hidden border border-indigo-100 dark:border-slate-600/50 shadow-sm">
                   <img src="https://www.habbo.com.br/habbo-imaging/avatarimage?img_format=png&user=${log.verificador}&direction=2&head_direction=3&size=M&headonly=1"
                        alt="${log.verificador}"
                        class="w-full h-full object-contain scale-150 translate-y-1"
                        onerror="this.style.display='none'; this.parentElement.innerHTML='<span class=\'text-xs font-bold text-indigo-500\'>?</span>'">
                </div>
                <div>
                    <h4 class="font-bold text-slate-800 dark:text-slate-200 text-sm">${log.verificador || 'Desconhecido'}</h4>
                    <p class="text-[11px] text-slate-400 font-mono mt-0.5 flex items-center gap-1.5">
                        <i class="fa-regular fa-clock text-[10px]"></i> ${dataFormatada}
                    </p>
                </div>
            </div>

            <div class="text-right">
                <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${bgResumo} border border-transparent group-hover:border-slate-200 dark:group-hover:border-slate-700 transition-colors">
                    <span class="${corResumo} text-xs">${iconResumo}</span>
                    <span class="text-xs font-semibold text-slate-600 dark:text-slate-300">
                        ${log.resumo}
                    </span>
                </div>
            </div>
        </div>`;
    });
    container.innerHTML = html;
}

async function carregarLogDetalhado(id) {
    const btn = document.activeElement;

    const overlay = document.getElementById('loading-overlay');
    if (overlay) overlay.classList.remove('hidden');
    if (overlay) overlay.classList.add('flex');

    try {
        const response = await fetchComTimeout(`${SHEETS_WEB_APP_URL}?action=GET_LOG_DETAILS&id=${id}`);
        const data = await response.json();

        if (data.success && data.estado) {

            await new Promise(r => setTimeout(r, 800));

            restaurarEstado(data.estado);
            fecharModalLogs();

            showToast(`Sessão restaurada com sucesso!`, 'success');
            showToast(`Verificador: ${data.estado.verificador}`, 'info');
        } else {
            showToast('Erro ao carregar detalhes do log.', 'error');
        }
    } catch (e) {
        showToast('Erro ao buscar log: ' + e.message, 'error');
    } finally {
        if (overlay) {
            overlay.classList.add('opacity-0');
            setTimeout(() => {
                overlay.classList.remove('flex', 'opacity-0');
                overlay.classList.add('hidden');
            }, 300);
        }
    }
}

function showToast(mensagem, tipo = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const id = 'toast-' + Math.random().toString(36).substr(2, 9);

    let icon = '<i class="fa-solid fa-circle-info"></i>';
    let colors = 'bg-slate-800 border-slate-700 text-white';

    if (tipo === 'success') {
        icon = '<i class="fa-solid fa-circle-check"></i>';
        colors = 'bg-emerald-600 border-emerald-500 text-white shadow-emerald-500/20';
    } else if (tipo === 'error') {
        icon = '<i class="fa-solid fa-circle-xmark"></i>';
        colors = 'bg-rose-600 border-rose-500 text-white shadow-rose-500/20';
    }

    const html = `
    <div id="${id}" class="pointer-events-auto transform transition-all duration-500 translate-x-full opacity-0 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg ${colors} min-w-[300px] max-w-md">
        <div class="text-xl shrink-0">${icon}</div>
        <div class="text-sm font-medium">${mensagem}</div>
    </div>`;

    container.insertAdjacentHTML('beforeend', html);
    const toastElement = document.getElementById(id);

    requestAnimationFrame(() => {
        toastElement.classList.remove('translate-x-full', 'opacity-0');
    });

    setTimeout(() => {
        toastElement.classList.add('translate-x-full', 'opacity-0');
        setTimeout(() => toastElement.remove(), 500);
    }, 4000);
}

function restaurarEstado(estado) {
    estadoAtualGlobal = estado;

    exibirResultados(
        estado.resultados.inativos || [],
        estado.resultados.offline || [],
        estado.resultados.graduacao || [],
        estado.resultados.removerForum || [],
        estado.resultados.retirarDosGrupos || { retirar: [], subgrupos: [], sets: {} },
        estado.resultados.erros || []
    );

    setTimeout(() => {
        if (estado.checkboxes) {
            Object.entries(estado.checkboxes).forEach(([id, checked]) => {
                const el = document.getElementById(id);
                if (el) {
                    el.checked = checked;

                }
            });
        }
    }, 500);
}

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
const containerResultados = document.getElementById('container-resultados');
const statusProcesso = document.getElementById('status-processo');

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

document.documentElement.classList.add('dark');

function extrairNicksDaListagemMembros(texto) {
    if (!texto) return [];
    const lines = texto.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const nicks = [];
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].replace(/[\u200B-\u200D\uFEFF]/g, '');

        const colsPipe = line.split('|').map(col => col.trim());
        if (colsPipe.length >= 5) {
            const primeiraColuna = colsPipe[0].match(/^\d+\.\s*(.+)$/);
            const possuiCamposEsperados =
                /^Medalhas Efetivas\s*:/i.test(colsPipe[2]) &&
                /^Medalhas Tempor[aá]rias\s*:/i.test(colsPipe[3]) &&
                /^Sal[aá]rio\s*:/i.test(colsPipe[4]);

            if (primeiraColuna && possuiCamposEsperados) {
                const nick = primeiraColuna[1].trim();
                if (nick) nicks.push(nick);
                continue;
            }
        }

        const cols = line.split('\t');
        if (cols.length >= 3) {
            const numeracao = cols[0].trim();
            const nick = cols[1] ? cols[1].replace(/[\u200B-\u200D\uFEFF]/g, '').trim() : '';

            if (/^-?\d+$/.test(numeracao) && nick && nick.length >= 1) {
                nicks.push(nick);
            }
        }
    }
    return Array.from(new Set(nicks));
}

function normalizarNick(nick) {
    return String(nick || '')
        .replace(/[\u200B-\u200D\uFEFF]/g, '')
        .normalize('NFC')
        .trim()
        .toLowerCase();
}

function extrairNicksDoSubforum(texto) {
    if (!texto) return [];
    const nicks = new Map();

    texto.split(/\r?\n/).forEach(linha => {
        if (!linha.includes('Enviar uma mensagem privada')) return;
        const partes = linha.split('\t');
        const nick = partes[1] ? partes[1].trim() : '';
        const nickNormalizado = normalizarNick(nick);
        if (nickNormalizado.length >= 2 && !nicks.has(nickNormalizado)) {
            nicks.set(nickNormalizado, nick);
        }
    });

    return Array.from(nicks.values());
}

const CONTAS_FORUM_IGNORADAS = new Set([
    'admin', 'professores', 'graduadores', 'coordenadores dos professores',
    'com. de desenv. cultural', 'dep. ap. intendência',
    'serv. proteção prof', '[prof] liderança'
].map(normalizarNick));

function atualizarEstadoDasFontes() {
    const fontes = [
        { id: 'lista-gratificacoes', statusId: 'status-gratificacoes', extrair: extrairNicksDaListagemMembros, singular: 'policial', plural: 'policiais' },
        { id: 'lista-forum-professores', statusId: 'status-forum-professores', extrair: extrairNicksDoSubforum, singular: 'membro', plural: 'membros' },
        { id: 'lista-forum-coordenadores', statusId: 'status-forum-coordenadores', extrair: extrairNicksDoSubforum, singular: 'membro', plural: 'membros' },
        { id: 'lista-forum-graduadores', statusId: 'status-forum-graduadores', extrair: extrairNicksDoSubforum, singular: 'membro', plural: 'membros' }
    ];

    let fontesValidas = 0;
    fontes.forEach(fonte => {
        const campo = document.getElementById(fonte.id);
        const status = document.getElementById(fonte.statusId);
        if (!campo || !status) return;

        const quantidade = fonte.extrair(campo.value).length;
        const preenchido = campo.value.trim().length > 0;
        const valido = quantidade > 0;
        if (valido) fontesValidas++;

        campo.classList.toggle('is-valid', valido);
        campo.classList.toggle('is-invalid', preenchido && !valido);
        status.className = `source-status ${valido ? 'is-ready' : preenchido ? 'has-error' : ''}`;
        status.innerHTML = valido
            ? `<i class="fa-solid fa-circle-check"></i> ${quantidade} ${quantidade === 1 ? fonte.singular : fonte.plural} reconhecido${quantidade === 1 ? '' : 's'}`
            : preenchido
                ? '<i class="fa-solid fa-triangle-exclamation"></i> Formato não reconhecido'
                : '<i class="fa-regular fa-circle"></i> Aguardando dados';
    });

    const progresso = document.getElementById('progresso-fontes');
    if (progresso) progresso.textContent = `${fontesValidas}/4 fontes prontas`;
}

['lista-gratificacoes', 'lista-forum-professores', 'lista-forum-coordenadores', 'lista-forum-graduadores']
    .forEach(id => document.getElementById(id)?.addEventListener('input', atualizarEstadoDasFontes));

atualizarEstadoDasFontes();

function converterDataPlanilha(dataStr) {
    if (!dataStr) return null;
    const meses = { 'jan': 0, 'fev': 1, 'mar': 2, 'abr': 3, 'mai': 4, 'jun': 5, 'jul': 6, 'ago': 7, 'set': 8, 'out': 9, 'nov': 10, 'dez': 11 };
    try {
        const strLimpa = dataStr.replace('.', '').toLowerCase().trim();
        const partes = strLimpa.split(' ');
        if (partes.length >= 3) {
            const mes = meses[partes[1].substring(0, 3)];
            const dia = parseInt(partes[0], 10);
            const ano = parseInt(partes[2], 10);
            if (mes === undefined || !Number.isInteger(dia) || !Number.isInteger(ano)) return null;
            const data = new Date(ano, mes, dia);
            return Number.isNaN(data.getTime()) ? null : data;
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
    const textoForumProfessores = document.getElementById('lista-forum-professores').value;
    const textoForumCoordenadores = document.getElementById('lista-forum-coordenadores').value;
    const textoForumGraduadores = document.getElementById('lista-forum-graduadores').value;

    if (!textoSystem.trim()) return showToast('Por favor, cole a lista do System primeiro.', 'error');
    if (extrairNicksDaListagemMembros(textoSystem).length === 0) {
        return showToast('Nenhum policial foi reconhecido na lista do System. Copie novamente pelo botao da listagem.', 'error');
    }
    if (!textoForumProfessores.trim() || !textoForumCoordenadores.trim() || !textoForumGraduadores.trim()) {
        return showToast('Por favor, cole as listas dos 3 subfóruns (Professores, Coordenadores e Graduadores).', 'error');
    }

    abrirModalVerificador();
});

function abrirModalAvisoInicial() {
    const modal = document.getElementById('modal-aviso-inicial');
    const fundo = document.getElementById('fundo-aviso-inicial');
    const painel = document.getElementById('painel-aviso-inicial');

    modal.classList.remove('hidden');

    setTimeout(() => {
        fundo.classList.remove('opacity-0');
        painel.classList.remove('scale-95', 'opacity-0');
        painel.classList.add('scale-100', 'opacity-100');
    }, 10);
}

window.fecharModalAvisoInicial = function () {
    const modal = document.getElementById('modal-aviso-inicial');
    const fundo = document.getElementById('fundo-aviso-inicial');
    const painel = document.getElementById('painel-aviso-inicial');

    fundo.classList.add('opacity-0');
    painel.classList.remove('scale-100', 'opacity-100');
    painel.classList.add('scale-95', 'opacity-0');

    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);

};

window.addEventListener('load', () => {

});

function abrirModalVerificador() {
    const modal = document.getElementById('modal-verificador');
    const fundo = document.getElementById('fundo-modal-verificador');
    const painel = document.getElementById('painel-modal-verificador');
    const input = document.getElementById('input-verificador-nick');

    input.value = localStorage.getItem('verificadorNick') || '';

    modal.classList.remove('hidden');
    setTimeout(() => {
        fundo.classList.remove('opacity-0');
        painel.classList.remove('scale-95', 'opacity-0');
        painel.classList.add('scale-100', 'opacity-100');
        input.focus();
    }, 10);

    input.onkeydown = (e) => {
        if (e.key === 'Enter') {
            confirmarVerificador();
        }
    };
}

window.fecharModalVerificador = function () {
    const modal = document.getElementById('modal-verificador');
    const fundo = document.getElementById('fundo-modal-verificador');
    const painel = document.getElementById('painel-modal-verificador');

    fundo.classList.add('opacity-0');
    painel.classList.remove('scale-100', 'opacity-100');
    painel.classList.add('scale-95', 'opacity-0');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
};

window.confirmarVerificador = function () {
    const input = document.getElementById('input-verificador-nick');
    const nick = input.value.trim();

    if (!nick) {
        showToast('Por favor, digite seu nickname para continuar.', 'error');
        input.focus();
        return;
    }

    verificadorAtual = nick;
    localStorage.setItem('verificadorNick', nick);

    const modoEscolhido = m_modoVerificacao;

    fecharModalVerificador();

    setTimeout(() => {
        iniciarVerificacao(modoEscolhido);
    }, 350);
};

async function iniciarVerificacao(modo) {
    const prioridadeDireto = (modo === 'direto');
    const textoSystem = document.getElementById('lista-gratificacoes').value;
    const textoForumProfessores = document.getElementById('lista-forum-professores').value;
    const textoForumCoordenadores = document.getElementById('lista-forum-coordenadores').value;
    const textoForumGraduadores = document.getElementById('lista-forum-graduadores').value;

    const nicksPorSubforum = {
        professores: new Set(extrairNicksDoSubforum(textoForumProfessores).map(normalizarNick)),
        coordenadores: new Set(extrairNicksDoSubforum(textoForumCoordenadores).map(normalizarNick)),
        graduadores: new Set(extrairNicksDoSubforum(textoForumGraduadores).map(normalizarNick))
    };

    const obterSubforunsDoMembro = (nick) => {
        const nickLower = normalizarNick(nick);
        const subforuns = [];
        if (nicksPorSubforum.professores.has(nickLower)) {
            subforuns.push('professores');
        }
        if (nicksPorSubforum.coordenadores.has(nickLower)) {
            subforuns.push('coordenadores');
        }
        if (nicksPorSubforum.graduadores.has(nickLower)) {
            subforuns.push('graduadores');
        }
        return subforuns;
    };

    alternarCarregamento(true);

    const nicksAtivos = new Set(extrairNicksDaListagemMembros(textoSystem).map(normalizarNick));

    try {

        const urlSheets = `https://sheets.googleapis.com/v4/spreadsheets/${ID_PLANILHA}/values/${encodeURIComponent(INTERVALO_DADOS)}?key=${CHAVE_API}`;
        statusProcesso.innerText = 'Carregando listagem oficial...';
        const resSheets = await fetchComTimeout(urlSheets);

        if (!resSheets.ok) {
            const errorData = await resSheets.json();
            throw new Error(errorData.error ? errorData.error.message : 'Erro ao acessar planilha');
        }

        const dataSheets = await resSheets.json();
        const linhas = dataSheets.values || [];
        const membrosParaVerificar = [];
        const inativosFinal = [];
        const graduacaoFinal = [];

        const mapaMembrosOficiais = new Map();

        linhas.forEach(linha => {
            const nick = linha[1] ? linha[1].trim() : '';
            const cargo = linha[0] ? linha[0].trim() : '';

            if (!nick) return;
            if (cargo.toLowerCase().includes('consultor') || cargo.toLowerCase().includes('honrosa')) return;

            const estaLicenciado = (linha[7] && linha[7].trim().length > 0);
            const nickNormalizado = normalizarNick(nick);

            mapaMembrosOficiais.set(nickNormalizado, {
                nick,
                cargo,
                cargoLower: cargo.toLowerCase(),
                estaLicenciado
            });

            const subforunsDoMembro = obterSubforunsDoMembro(nick);
            const estaNoForum = subforunsDoMembro.length > 0;

            if (nicksAtivos.has(nickNormalizado)) {
                membrosParaVerificar.push({ nick, cargo, estaLicenciado, estaNoForum, subforunsDoMembro });

                const graduacaoPendente = (linha[4] === 'TRUE' || linha[4] === true);
                if (graduacaoPendente && !estaLicenciado) {
                    const ehProfessor = cargo.toLowerCase().includes('professor') && !cargo.toLowerCase().includes('geral');
                    const dataReferencia = ehProfessor ? converterDataPlanilha(linha[2]) : converterDataPlanilha(linha[3]);

                    if (dataReferencia) {
                        const diferencaTempo = Date.now() - dataReferencia.getTime();
                        if (diferencaTempo < 0) return;
                        const diasDiferenca = Math.floor(diferencaTempo / (1000 * 60 * 60 * 24));

                        if (diasDiferenca > 7) {
                            graduacaoFinal.push({
                                nick, cargo, dias: diasDiferenca,
                                diasAtraso: Math.max(0, diasDiferenca - 7),
                                tipo: ehProfessor ? 'expulsao' : 'rebaixamento',
                                estaNoForum,
                                subforunsDoMembro
                            });
                        }
                    }
                }
            } else {

                inativosFinal.push({ nick, cargo, status: 'Sem registro no System', estaNoForum, subforunsDoMembro });
            }
        });

        const dadosSubforuns = {
            professores: textoForumProfessores,
            coordenadores: textoForumCoordenadores,
            graduadores: textoForumGraduadores
        };
        const removerDoForum = extrairNicksExtrasForum(dadosSubforuns, mapaMembrosOficiais);

        const retirarDosGrupos = await verificarMembrosGruposHabbo(mapaMembrosOficiais, nicksAtivos, prioridadeDireto);

        const resultadoOffline = await verificarAtividadeHabbo(membrosParaVerificar, prioridadeDireto, retirarDosGrupos.sets);
        const offline = resultadoOffline.offline;
        const errosVerificacao = resultadoOffline.erros;

        const enriquecerComDadosHabbo = (lista) => {
            lista.forEach(m => {
                m.subgruposHabbo = [];
                const nickLower = m.nick.toLowerCase();
                if (retirarDosGrupos.sets.spp.has(nickLower)) m.subgruposHabbo.push('SPP');
                if (retirarDosGrupos.sets.dep.has(nickLower)) m.subgruposHabbo.push('Dep. Aplicação');
                if (retirarDosGrupos.sets.cdc.has(nickLower)) m.subgruposHabbo.push('CDC');

                m.noProfessores = retirarDosGrupos.sets.prof.has(nickLower);
                m.noGraduadores = retirarDosGrupos.sets.grad.has(nickLower);
                m.noGrupo = m.noProfessores || m.noGraduadores;

                m.isAdminNoGrupo = retirarDosGrupos.sets.admins.has(nickLower);
            });
        };
        enriquecerComDadosHabbo(inativosFinal);
        enriquecerComDadosHabbo(graduacaoFinal);
        enriquecerComDadosHabbo(offline);

        alternarCarregamento(false);
        exibirResultados(inativosFinal, offline, graduacaoFinal, removerDoForum, retirarDosGrupos, errosVerificacao);

        registrarVerificacaoNaPlanilha(inativosFinal, graduacaoFinal, offline, removerDoForum, retirarDosGrupos, textoSystem, errosVerificacao);

    } catch (erro) {
        alternarCarregamento(false);
        showToast('Erro na verificação: ' + erro.message, 'error');
    }
}

function extrairNicksExtrasForum(dadosSubforuns, mapaMembrosOficiais) {

    const nickMap = new Map();

    const obterNivelCargo = (cargo) => {
        if (!cargo) return 0;
        const c = cargo.toLowerCase();
        if (c.includes('líder') || c.includes('lider') || c.includes('vice')) return 7;
        if (c.includes('conselheiro')) return 6;
        if (c.includes('estagiári')) return 5;
        if (c.includes('graduador')) return 4;
        if (c.includes('coordenador')) return 3;
        if (c.includes('professor')) return 2;
        return 0;
    };

    const processarSubforum = (textoForum, nomeSubforum) => {
        if (!textoForum) return;

        extrairNicksDoSubforum(textoForum).forEach(nick => {
                    if (CONTAS_FORUM_IGNORADAS.has(normalizarNick(nick))) return;

                    const nickLower = normalizarNick(nick);
                    const dadosOficiais = mapaMembrosOficiais.get(nickLower);

                    let temPermissao = false;

                    if (dadosOficiais) {
                        const nivel = obterNivelCargo(dadosOficiais.cargo);

                        if (nomeSubforum === 'professores') {
                            temPermissao = nivel >= 2;
                        } else if (nomeSubforum === 'coordenadores') {

                            temPermissao = (nivel === 3) || (nivel >= 5);
                        } else if (nomeSubforum === 'graduadores') {

                            temPermissao = (nivel === 4) || (nivel >= 5);
                        }
                    }

                    if (temPermissao) return;

                    if (!nickMap.has(nickLower)) {
                        nickMap.set(nickLower, {
                            nick: nick,
                            subforuns: new Set(),
                            cargo: dadosOficiais ? dadosOficiais.cargo : 'Não consta na listagem'
                        });
                    }
                    nickMap.get(nickLower).subforuns.add(nomeSubforum);
        });
    };

    processarSubforum(dadosSubforuns.professores, 'professores');
    processarSubforum(dadosSubforuns.coordenadores, 'coordenadores');
    processarSubforum(dadosSubforuns.graduadores, 'graduadores');

    const extras = [];
    nickMap.forEach((dados, nickLower) => {
        const subforunsArray = Array.from(dados.subforuns);
        extras.push({
            nick: dados.nick,
            subforuns: subforunsArray,
            status: 'Não consta na listagem dos professores'
        });
    });

    return extras;
}

async function buscarMembrosGrupoHabbo(groupId, prioridadeDireto = false) {
    const api = `https://www.habbo.com.br/api/public/groups/${groupId}/members`;
    try {
        const response = await fetchWithProxy(api, {}, prioridadeDireto);
        const dados = await response.json();
        if (!Array.isArray(dados)) throw new Error('Resposta inesperada da API de grupos');
        return dados;
    } catch (e) {
        console.warn('[Grupos] Erro crítico ao buscar membros do grupo', groupId, e);
        return [];
    }
}

async function verificarMembrosGruposHabbo(mapaMembrosOficiais, nicksNoSystem, prioridadeDireto = false) {

    const contasEspeciais = ['professores', 'graduadores', '-professores-'];
    const contasImunesHardcoded = ['rccemblemas', 'arquitetocdc'];

    try {

        const promises = [
            buscarMembrosGrupoHabbo(ID_GRUPO_HABBO, prioridadeDireto),
            buscarMembrosGrupoHabbo(ID_GRUPO_GRADUADORES, prioridadeDireto),
            buscarMembrosGrupoHabbo(ID_GRUPO_CORREGEDORIA, prioridadeDireto),
            buscarMembrosGrupoHabbo(ID_GRUPO_GATE, prioridadeDireto),
            buscarMembrosGrupoHabbo(ID_GRUPO_GSS, prioridadeDireto),
            buscarMembrosGrupoHabbo(ID_GRUPO_SPP, prioridadeDireto),
            buscarMembrosGrupoHabbo(ID_GRUPO_DEP_APLICACAO, prioridadeDireto),
            buscarMembrosGrupoHabbo(ID_GRUPO_CDC, prioridadeDireto)
        ];

        const [
            membrosProf, membrosGrad,
            membrosCorregedoria, membrosGate, membrosGss,
            membrosSpp, membrosDep, membrosCdc
        ] = await Promise.all(promises);

        const nomesParaSet = membros => new Set(membros.filter(m => m && m.name).map(m => normalizarNick(m.name)));
        const setCorregedoria = nomesParaSet(membrosCorregedoria);
        const setGate = nomesParaSet(membrosGate);
        const setGss = nomesParaSet(membrosGss);
        const setSpp = nomesParaSet(membrosSpp);
        const setDep = nomesParaSet(membrosDep);
        const setCdc = nomesParaSet(membrosCdc);
        const setProf = nomesParaSet(membrosProf);
        const setGrad = nomesParaSet(membrosGrad);

        const nickMap = new Map();

        const validarPermissaoGrupo = (nomeGrupo, cargo) => {
            if (!cargo) return false;
            const cargoLower = cargo.toLowerCase();

            if (nomeGrupo === 'professores') return true;

            if (nomeGrupo === 'graduadores') {
                if (cargoLower === 'professor') return false;
                return true;
            }

            return true;
        };

        const processarGrupoAlvo = (listaMembros, nomeGrupo) => {
            listaMembros.forEach(membro => {
                const nick = membro.name;
                if (!nick) return;
                const nickLower = normalizarNick(nick);

                if (contasEspeciais.includes(nickLower)) return;

                const eContaImuneHardcoded = contasImunesHardcoded.includes(nickLower);
                const estaCorregedoria = setCorregedoria.has(nickLower);
                const estaGate = setGate.has(nickLower);
                const estaGss = setGss.has(nickLower);
                const eImune = eContaImuneHardcoded || estaCorregedoria || estaGate || estaGss;

                const dadosOficiais = mapaMembrosOficiais.get(nickLower);
                const isOfficial = !!dadosOficiais;
                const isNoSystem = nicksNoSystem && nicksNoSystem.has(nickLower);

                const isRegular = isOfficial;

                let temPermissaoParaEsteGrupo = true;
                if (isOfficial) {
                    temPermissaoParaEsteGrupo = validarPermissaoGrupo(nomeGrupo, dadosOficiais.cargo);
                }

                if (!eImune && isRegular && temPermissaoParaEsteGrupo) return;

                if (!nickMap.has(nickLower)) {
                    nickMap.set(nickLower, {
                        nick,
                        grupos: new Set(),
                        eImune: false,
                        motivoImune: '',
                        subgrupos: [],
                        isAdminNoGrupo: membro.isAdmin || false,
                        cargo: dadosOficiais ? dadosOficiais.cargo : 'Não consta na listagem'
                    });
                }
                nickMap.get(nickLower).grupos.add(nomeGrupo);
                if (membro.isAdmin) nickMap.get(nickLower).isAdminNoGrupo = true;
            });
        };

        processarGrupoAlvo(membrosProf, 'professores');
        processarGrupoAlvo(membrosGrad, 'graduadores');

        const retirar = [];
        const imunes = [];
        const subgrupos = [];
        const admins = new Set();

        for (const [nickLower, dados] of nickMap) {

            if (dados.isAdminNoGrupo) admins.add(nickLower);

            const eContaImune = contasImunesHardcoded.includes(nickLower);
            const estaCorregedoria = setCorregedoria.has(nickLower);
            const estaGate = setGate.has(nickLower);
            const estaGss = setGss.has(nickLower);

            if (eContaImune || estaCorregedoria || estaGate || estaGss) {
                dados.eImune = true;
                if (eContaImune) dados.motivoImune = 'Conta Especial';
                else if (estaCorregedoria) dados.motivoImune = 'Corregedoria';
                else if (estaGate) dados.motivoImune = 'GATE';
                else dados.motivoImune = 'GSS';

                imunes.push({
                    nick: dados.nick,
                    grupos: Array.from(dados.grupos),
                    motivoImune: dados.motivoImune,
                    isAdminNoGrupo: dados.isAdminNoGrupo
                });
                continue;
            }

            if (setSpp.has(nickLower)) dados.subgrupos.push('SPP');
            if (setDep.has(nickLower)) dados.subgrupos.push('Dep. Aplicação');
            if (setCdc.has(nickLower)) dados.subgrupos.push('CDC');

            if (dados.subgrupos.length > 0) {
                subgrupos.push({
                    nick: dados.nick,
                    grupos: Array.from(dados.grupos),
                    subgrupos: dados.subgrupos,
                    isAdminNoGrupo: dados.isAdminNoGrupo
                });
            }

            retirar.push({
                nick: dados.nick,
                grupos: Array.from(dados.grupos),
                isAdminNoGrupo: dados.isAdminNoGrupo,
                status: 'Não consta na listagem dos professores'
            });
        }

        return {
            retirar,
            imunes,
            subgrupos,
            sets: { spp: setSpp, dep: setDep, cdc: setCdc, prof: setProf, grad: setGrad, admins }
        };

    } catch (erro) {
        console.error('Erro crítico na verificação de grupos:', erro);
        showToast('Erro ao buscar dados dos grupos do Habbo. Verifique o console ou tente novamente.', 'error');
        return {
            retirar: [], imunes: [], subgrupos: [],
            sets: {
                spp: new Set(), dep: new Set(), cdc: new Set(),
                prof: new Set(), grad: new Set(), admins: new Set()
            }
        };
    }
}

async function verificarAtividadeHabbo(membros, prioridadeDireto = false, setsHabbo = null) {
    const listaOffline = [];
    const listaErros = [];
    const BATCH_SIZE = 5;
    const MAX_TENTATIVAS = 6;

    const processarMembro = async (m) => {
        if (m.estaLicenciado) return { tipo: 'ok' };

        let ultimoErroMsg = '';
        for (let tentativa = 1; tentativa <= MAX_TENTATIVAS; tentativa++) {
            try {
                const targetUrl = `${URL_API_HABBO}?name=${m.nick}`;
                const res = await fetchWithProxy(targetUrl, {}, prioridadeDireto);

                if (res.status === 404) {
                    return { tipo: 'erro', nick: m.nick, cargo: m.cargo, motivo: 'Usuário não encontrado (Nome alterado/banido)' };
                }

                const texto = await res.text();

                if (!texto.startsWith('{') && !texto.startsWith('[')) {
                    ultimoErroMsg = 'Resposta inválida (não-JSON)';
                    console.warn(`[Offline] ${ultimoErroMsg} para ${m.nick}, tentativa ${tentativa}/${MAX_TENTATIVAS}`);
                    statusProcesso.innerText = `Analisando: ${m.nick} (Aviso: Proxy retornou não-JSON na tent. ${tentativa}/${MAX_TENTATIVAS})`;
                    if (tentativa < MAX_TENTATIVAS) {
                        await new Promise(r => setTimeout(r, 600 * tentativa));
                        continue;
                    }
                    return { tipo: 'erro', nick: m.nick, cargo: m.cargo, motivo: ultimoErroMsg };
                }

                const dados = JSON.parse(texto);

                if (!dados || typeof dados !== 'object' || !dados.uniqueId) {
                    ultimoErroMsg = 'Dados incompletos da API';
                    console.warn(`[Offline] ${ultimoErroMsg} para ${m.nick}, tentativa ${tentativa}/${MAX_TENTATIVAS}`);
                    statusProcesso.innerText = `Analisando: ${m.nick} (Aviso: JSON malformado na tent. ${tentativa}/${MAX_TENTATIVAS})`;
                    if (tentativa < MAX_TENTATIVAS) {
                        await new Promise(r => setTimeout(r, 600 * tentativa));
                        continue;
                    }
                    return { tipo: 'erro', nick: m.nick, cargo: m.cargo, motivo: ultimoErroMsg };
                }

                if (dados.lastAccessTime) {
                    const diasDiferenca = Math.floor((new Date() - new Date(dados.lastAccessTime)) / (1000 * 60 * 60 * 24));
                    if (diasDiferenca >= 5) {
                        const nickLower = m.nick.toLowerCase();
                        const noProfessores = setsHabbo ? setsHabbo.prof.has(nickLower) : false;
                        const noGraduadores = setsHabbo ? setsHabbo.grad.has(nickLower) : false;
                        const noGrupo = noProfessores || noGraduadores;

                        return {
                            tipo: 'offline',
                            nick: m.nick, cargo: m.cargo, dias: diasDiferenca,
                            estaNoForum: m.estaNoForum, subforunsDoMembro: m.subforunsDoMembro,
                            noGrupo, noProfessores, noGraduadores,
                            ultimoAcesso: dados.lastAccessTime
                        };
                    }
                    return { tipo: 'ok' };
                } else {
                    return { tipo: 'erro', nick: m.nick, cargo: m.cargo, motivo: 'Perfil privado (último acesso oculto)' };
                }
            } catch (e) {
                ultimoErroMsg = e.message || 'Erro desconhecido';
                console.warn(`[Offline] Erro ao verificar ${m.nick} (tentativa ${tentativa}/${MAX_TENTATIVAS}):`, ultimoErroMsg);
                statusProcesso.innerText = `Analisando: ${m.nick} (Erro na tent. ${tentativa}/${MAX_TENTATIVAS}: ${ultimoErroMsg})`;
                if (tentativa < MAX_TENTATIVAS) {
                    await new Promise(r => setTimeout(r, 600 * tentativa));
                }
            }
        }
        return { tipo: 'erro', nick: m.nick, cargo: m.cargo, motivo: ultimoErroMsg };
    };

    for (let i = 0; i < membros.length; i += BATCH_SIZE) {
        const lote = membros.slice(i, i + BATCH_SIZE);
        statusProcesso.innerText = `Analisando membros: ${Math.min(i + BATCH_SIZE, membros.length)}/${membros.length}`;

        const resultados = await Promise.all(lote.map(m => processarMembro(m)));

        resultados.forEach(res => {
            if (res.tipo === 'offline') listaOffline.push(res);
            else if (res.tipo === 'erro') listaErros.push(res);
        });

        if (i + BATCH_SIZE < membros.length) {
            await new Promise(r => setTimeout(r, 300));
        }
    }

    return { offline: listaOffline, erros: listaErros };
}

async function verificarGrupo(nick, uniqueId = null, prioridadeDireto = false) {
    try {
        let uid = uniqueId;
        if (!uid) {
            const targetUrl = `${URL_API_HABBO}?name=${nick}`;
            const r = await fetchWithProxy(targetUrl, {}, prioridadeDireto);
            const d = await r.json();
            uid = d.uniqueId;
        }

        if (uid) {
            const targetGrupoUrl = `${URL_API_HABBO}/${uid}/groups`;
            const gr = await fetchWithProxy(targetGrupoUrl, {}, prioridadeDireto);
            const grupos = await gr.json();
            const noProfessores = grupos.some(g => g.id === ID_GRUPO_HABBO);
            const noGraduadores = grupos.some(g => g.id === ID_GRUPO_GRADUADORES);
            return { noGrupo: noProfessores || noGraduadores, noProfessores, noGraduadores };
        }
    } catch (e) {
        console.warn(`[Grupos] Erro ao verificar grupos de ${nick}:`, e.message);
    }
    return { noGrupo: false, noProfessores: false, noGraduadores: false };
}

window.desconsiderarMembro = function (botao, tipo, idx) {

    if (typeof botao === 'string') {
        idx = tipo;
        tipo = botao;
        botao = null;
    }

    const card = botao?.closest('[id^="card-"]') || document.getElementById(`card-${tipo}-${idx}`);
    if (!card) return;

    const btn = botao || card.querySelector('[data-action="desconsiderar"]');
    const icone = btn?.querySelector('i');
    const isDesconsiderado = card.dataset.desconsiderado === 'true';

    if (isDesconsiderado) {

        card.classList.remove('opacity-40');
        card.classList.remove('is-disregarded');
        card.dataset.desconsiderado = 'false';
        card.style.opacity = '';
        card.style.pointerEvents = '';
        card.querySelector('[data-desconsiderado-status]')?.remove();

        const labels = card.querySelectorAll('.checkbox-wrapper');
        labels.forEach(label => {
            const spanX = label.querySelector('span.bg-red-500');
            if (spanX) spanX.remove();

            const spanTexto = label.querySelector('span[class*="ml-"]');
            if (spanTexto) {
                spanTexto.classList.remove('line-through', 'text-red-400');
            }

            const chk = label.querySelector('input[type="checkbox"]');
            if (chk) {
                chk.classList.remove('hidden');
                chk.checked = chk.dataset.estadoAntesDesconsiderar === 'true';
                chk.disabled = chk.dataset.disabledAntesDesconsiderar === 'true';
                delete chk.dataset.estadoAntesDesconsiderar;
                delete chk.dataset.disabledAntesDesconsiderar;
            }
        });

        icone?.classList.remove('fa-rotate-left');
        icone?.classList.add('fa-trash-can');
        if (btn) {
            btn.title = 'Desconsiderar (dado incorreto)';
            btn.setAttribute('aria-label', 'Desconsiderar membro');
        }
    } else {

        card.classList.add('opacity-40');
        card.classList.add('is-disregarded');
        card.dataset.desconsiderado = 'true';
        card.style.opacity = '';

        const status = document.createElement('span');
        status.dataset.desconsideradoStatus = 'true';
        status.className = 'desconsiderado-status';
        status.innerHTML = '<i class="fa-solid fa-eye-slash"></i> Desconsiderado';
        card.appendChild(status);

        const labels = card.querySelectorAll('.checkbox-wrapper');
        labels.forEach(label => {
            const chk = label.querySelector('input[type="checkbox"]');
            if (chk) {
                chk.dataset.estadoAntesDesconsiderar = String(chk.checked);
                chk.dataset.disabledAntesDesconsiderar = String(chk.disabled);
                chk.disabled = true;
            }

            const spanTexto = label.querySelector('span[class*="ml-"]');
            if (spanTexto) {
                spanTexto.classList.remove('line-through', 'text-red-400');
            }
        });

        icone?.classList.remove('fa-trash-can');
        icone?.classList.add('fa-rotate-left');
        if (btn) {
            btn.title = 'Restaurar membro';
            btn.setAttribute('aria-label', 'Restaurar membro');
        }
    }

    verificarProgressoAba(tipo);

    const nickElement = card.querySelector('h4');
    const cargoElement = card.querySelector('p.font-mono');
    if (nickElement) {
        const nick = nickElement.textContent;
        const cargo = cargoElement ? cargoElement.textContent : '';
        registrarAcaoNaPlanilha(tipo, nick, cargo, 'desconsiderado', !isDesconsiderado, isDesconsiderado ? 'Membro restaurado' : 'Dado incorreto');
    }
};

window.alternarTab = function (tipo) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
    });
    document.querySelectorAll('.tab-content').forEach(content => content.classList.add('hidden'));

    const tab = document.getElementById('tab-' + tipo);
    const content = document.getElementById('content-' + tipo);
    if (!tab || !content) return;
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    content.classList.remove('hidden');
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

window.registrarCheckbox = function (checkbox, categoria, nickMembro, cargoMembro, tipoAcao) {

    verificarProgressoAba(categoria);

    registrarAcaoNaPlanilha(categoria, nickMembro, cargoMembro, tipoAcao, checkbox.checked);
};

window.atualizarProgressoPorCheckboxId = function (chkId) {
    if (!chkId) return;
    const firstId = chkId.split(',')[0];
    if (firstId.includes('inativos')) verificarProgressoAba('inativos');
    else if (firstId.includes('graduacao')) verificarProgressoAba('graduacao');
    else if (firstId.includes('offline')) verificarProgressoAba('offline');
    else if (firstId.includes('remover-forum')) verificarProgressoAba('remover-forum');
};

function exibirResultados(inativos, offline, graduacao, removerForum = [], retirarDosGrupos = { retirar: [], imunes: [], subgrupos: [] }, errosVerificacao = []) {
    membrosInativos = inativos;
    membrosOffline = offline;
    graduacoesPendentes = graduacao;
    membrosRemoverForum = removerForum;

    const badgeInativos = document.getElementById('badge-count-inativos');
    const badgeGraduacao = document.getElementById('badge-count-graduacao');
    const badgeOffline = document.getElementById('badge-count-offline');
    const badgeRemoverForum = document.getElementById('badge-count-remover-forum');
    const badgeRetirarGrupos = document.getElementById('badge-count-retirar-grupos');

    if (badgeInativos) badgeInativos.innerText = inativos.length;
    if (badgeGraduacao) badgeGraduacao.innerText = graduacao.length;
    if (badgeOffline) badgeOffline.innerText = offline.length;
    if (badgeRemoverForum) badgeRemoverForum.innerText = removerForum.length;
    if (badgeRetirarGrupos) badgeRetirarGrupos.innerText = retirarDosGrupos.retirar.length;

    if (inativos.length > 0 && badgeInativos) badgeInativos.classList.add('pulse-active');
    if (graduacao.length > 0 && badgeGraduacao) badgeGraduacao.classList.add('pulse-active');
    if (offline.length > 0 && badgeOffline) badgeOffline.classList.add('pulse-active');
    if (removerForum.length > 0 && badgeRemoverForum) badgeRemoverForum.classList.add('pulse-active');
    if (retirarDosGrupos.retirar.length > 0 && badgeRetirarGrupos) badgeRetirarGrupos.classList.add('pulse-active');

    const counterInativos = document.getElementById('contador-inativos');
    if (counterInativos) counterInativos.innerText = inativos.length + " encontrados";

    const counterOffline = document.getElementById('contador-offline');
    if (counterOffline) counterOffline.innerText = offline.length + " encontrados";

    const counterGraduacao = document.getElementById('contador-graduacao');
    if (counterGraduacao) counterGraduacao.innerText = graduacao.length + " encontrados";

    const counterRemoverForum = document.getElementById('contador-remover-forum');
    if (counterRemoverForum) counterRemoverForum.innerText = removerForum.length + " encontrados";

    const contadorRetirarGrupos = document.getElementById('contador-retirar-grupos');
    if (contadorRetirarGrupos) contadorRetirarGrupos.innerText = retirarDosGrupos.retirar.length + " encontrados";

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

    const tabErros = document.getElementById('tab-erros');
    const badgeErros = document.getElementById('badge-count-erros');
    const contadorErros = document.getElementById('contador-erros');
    const listaErros = document.getElementById('lista-erros');
    if (tabErros && listaErros) {
        if (errosVerificacao.length > 0) {
            tabErros.classList.remove('hidden');
            tabErros.classList.add('flex');
            if (badgeErros) {
                badgeErros.innerText = errosVerificacao.length;
                badgeErros.classList.add('pulse-active');
            }
            if (contadorErros) contadorErros.innerText = errosVerificacao.length + ' encontrados';
            listaErros.innerHTML = errosVerificacao.map((e, idx) => `
                <li class="bg-red-50/50 dark:bg-red-950/10 border border-red-200/60 dark:border-red-900/30 rounded-xl p-4 flex items-center gap-3 group hover:border-red-400 dark:hover:border-red-700 transition-all">
                    <img src="https://www.habbo.com.br/habbo-imaging/avatarimage?img_format=png&user=${e.nick}&direction=2&head_direction=3&size=s&headonly=1"
                        class="w-10 h-10 rounded-lg border border-red-200 dark:border-red-800 bg-red-100 dark:bg-red-900/30 object-contain scale-150 translate-y-0.5"
                        onerror="this.style.display='none'">
                    <div class="flex-grow min-w-0">
                        <h4 class="font-bold text-sm text-slate-800 dark:text-slate-200 truncate">${e.nick}</h4>
                        <p class="text-[10px] text-slate-400 dark:text-slate-500 font-mono truncate">${e.cargo}</p>
                        <p class="text-[10px] text-red-500 dark:text-red-400 mt-0.5 flex items-center gap-1"><i class="fa-solid fa-circle-xmark text-[8px]"></i>${e.motivo}</p>
                    </div>
                    <a href="https://www.habbo.com.br/profile/${e.nick}" target="_blank"
                        class="shrink-0 w-8 h-8 rounded-lg bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center text-red-500 hover:scale-110 transition-transform"
                        title="Ver perfil no Habbo">
                        <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                    </a>
                </li>
            `).join('');
        } else {
            if (badgeErros) {
                badgeErros.innerText = '0';
                badgeErros.classList.remove('pulse-active');
            }
            if (tabErros.classList.contains('active')) {
                alternarTab('inativos');
            }
            tabErros.classList.add('hidden');
            tabErros.classList.remove('flex');
        }
    }

    const listaRetirarGrupos = document.getElementById('lista-retirar-grupos');
    if (listaRetirarGrupos) {
        if (retirarDosGrupos.retirar.length > 0) {
            listaRetirarGrupos.innerHTML = retirarDosGrupos.retirar.map((m, idx) => criarCardGrupo(m, idx)).join('');
        } else {
            listaRetirarGrupos.innerHTML = `
                <div class="col-span-1 text-center py-8 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                    <i class="fa-solid fa-check-circle text-4xl text-emerald-500 mb-2 opacity-50"></i>
                    <p class="text-slate-500 dark:text-slate-400 text-sm">Nenhum membro excedente encontrado nos grupos.</p>
                </div>
            `;
        }
    }

    const secaoImunes = document.getElementById('secao-imunes');
    const listaImunes = document.getElementById('lista-imunes');
    const contadorImunes = document.getElementById('contador-imunes');
    if (secaoImunes && listaImunes) {
        if (retirarDosGrupos.imunes.length > 0) {
            secaoImunes.classList.remove('hidden');
            if (contadorImunes) contadorImunes.innerText = retirarDosGrupos.imunes.length;
            listaImunes.innerHTML = retirarDosGrupos.imunes.map(m => `
                <li class="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-3 flex items-center gap-3">
                    <img src="https://www.habbo.com.br/habbo-imaging/avatarimage?img_format=png&user=${m.nick}&direction=2&head_direction=3&size=s&headonly=1" class="w-8 h-8 rounded-full border border-emerald-300 dark:border-emerald-600 bg-emerald-100 dark:bg-emerald-900">
                    <div>
                        <p class="font-semibold text-sm text-emerald-700 dark:text-emerald-300">${m.nick}</p>
                        <p class="text-[10px] text-emerald-600 dark:text-emerald-400"><i class="fa-solid fa-shield-halved mr-1"></i>${m.motivoImune}</p>
                    </div>
                </li>
            `).join('');
        } else {
            secaoImunes.classList.add('hidden');
        }
    }

    const secaoSubgrupos = document.getElementById('secao-subgrupos');
    const listaSubgrupos = document.getElementById('lista-subgrupos');
    const contadorSubgrupos = document.getElementById('contador-subgrupos');
    if (secaoSubgrupos && listaSubgrupos) {
        if (retirarDosGrupos.subgrupos.length > 0) {
            secaoSubgrupos.classList.remove('hidden');
            if (contadorSubgrupos) contadorSubgrupos.innerText = retirarDosGrupos.subgrupos.length;
            listaSubgrupos.innerHTML = retirarDosGrupos.subgrupos.map(m => {

                const cores = [];
                if (m.subgrupos.includes('SPP')) cores.push('#2e1065');
                if (m.subgrupos.includes('Dep. Aplicação')) cores.push('#581c87');
                if (m.subgrupos.includes('CDC')) cores.push('#7e22ce');

                let cardStyle = '';
                let cardClass = 'bg-white dark:bg-[#1e293b] border-l-4 border-l-slate-300 dark:border-l-slate-600';

                if (cores.length > 1) {

                    cardStyle = `style="background-image: linear-gradient(135deg, ${cores.join(', ')}); border-left: none;"`;
                    cardClass = 'text-white border-0';
                } else if (cores.length === 1) {

                    if (m.subgrupos.includes('SPP')) {
                        cardClass = 'bg-slate-50 dark:bg-[#0f0518] border-l-4 border-l-[#2e1065]';
                    } else if (m.subgrupos.includes('Dep. Aplicação')) {
                        cardClass = 'bg-purple-50 dark:bg-[#1a0b2e] border-l-4 border-l-[#facc15]';
                    } else if (m.subgrupos.includes('CDC')) {
                        cardClass = 'bg-purple-50 dark:bg-[#150a1f] border-l-4 border-l-[#d8b4fe]';
                    }
                }

                const badges = m.subgrupos.map(sg => {
                    let styleClass = '';
                    let icon = '';
                    let sigla = sg;

                    if (sg === 'SPP') {
                        styleClass = 'bg-[#2e1065] text-white border border-purple-900 shadow-sm shadow-[#2e1065]/30';
                        icon = '<i class="fa-solid fa-shield-cat mr-1.5 text-purple-300"></i>';
                        sigla = 'SPP';
                    } else if (sg === 'Dep. Aplicação') {
                        styleClass = 'bg-[#581c87] text-[#facc15] border border-[#facc15]/40 shadow-sm shadow-[#581c87]/30';
                        icon = '<i class="fa-solid fa-book-open mr-1.5 text-[#facc15]"></i>';
                        sigla = 'DA';
                    } else if (sg === 'CDC') {
                        styleClass = 'bg-[#d8b4fe] text-[#4c1d95] border border-[#c084fc] shadow-sm shadow-[#d8b4fe]/30';
                        icon = '<i class="fa-solid fa-palette mr-1.5 text-[#6b21a8]"></i>';
                        sigla = 'CDC';
                    }
                    return `<div class="${styleClass} px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-wider font-bold flex items-center w-fit transition-transform hover:scale-105">${icon}${sigla}</div>`;
                }).join('');

                const isGradient = cores.length > 1;
                const textColor = isGradient ? 'text-white' : 'text-slate-800 dark:text-slate-200';
                const subTextColor = isGradient ? 'text-white/80' : 'text-slate-500 dark:text-slate-400';
                const avatarBorder = isGradient ? 'border-white/20' : 'border-slate-200 dark:border-slate-700';
                const bgAvatar = isGradient ? 'bg-white/10' : 'bg-slate-100 dark:bg-slate-900';

                return `
                <li ${cardStyle} class="${cardClass} ${!isGradient ? 'border-y border-r border-slate-200 dark:border-slate-800' : ''} rounded-xl p-4 flex flex-col md:flex-row items-center gap-4 shadow-lg hover:shadow-xl transition-all group relative overflow-hidden">
                    ${isGradient ? '<div class="absolute inset-0 bg-black/10 hover:bg-transparent transition-colors"></div>' : ''}
                    <div class="flex items-center gap-4 w-full md:w-auto relative z-10">
                        <div class="w-12 h-12 rounded-full border-2 ${avatarBorder} ${bgAvatar} shrink-0 overflow-hidden flex items-center justify-center backdrop-blur-sm">
                            <img src="https://www.habbo.com.br/habbo-imaging/avatarimage?img_format=png&user=${m.nick}&direction=2&head_direction=3&size=m&headonly=1" class="-mt-2">
                        </div>
                        <div>
                             <p class="font-bold text-base ${textColor}">${m.nick}</p>
                        </div>
                    </div>

                    <div class="flex-grow w-full md:ml-4 border-t md:border-t-0 md:border-l ${isGradient ? 'border-white/20' : 'border-slate-200 dark:border-slate-700'} pt-3 md:pt-0 md:pl-6 relative z-10">
                        <div class="flex flex-wrap gap-2 items-center justify-start md:justify-end">
                            ${badges}
                        </div>
                    </div>
                </li>
            `;
            }).join('');
        } else {
            secaoSubgrupos.classList.add('hidden');
        }
    }

    containerResultados.classList.remove('hidden');
    containerResultados.scrollIntoView({ behavior: 'smooth', block: 'start' });

    if (inativos.length > 0) alternarTab('inativos');
    else if (graduacao.length > 0) alternarTab('graduacao');
    else if (offline.length > 0) alternarTab('offline');
    else if (removerForum.length > 0) alternarTab('remover-forum');
    else if (retirarDosGrupos.retirar.length > 0) alternarTab('retirar-grupos');
}

function criarCardGrupo(m, idx) {
    const urlAvatar = `https://www.habbo.com.br/habbo-imaging/avatarimage?img_format=png&user=${m.nick}&direction=2&head_direction=3&size=l&headonly=0`;

    return `
    <li id="card-retirar-groups-${idx}" class="card-standard group rounded-2xl overflow-hidden animate-fade-in" style="animation-delay: ${idx * 0.05}s">
        <div class="flex flex-col md:flex-row">
            <div class="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-950/20 p-6 flex flex-col items-center justify-center md:w-32 shrink-0 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800">
                <img src="${urlAvatar}" class="w-16 h-24 object-contain drop-shadow-xl transition-transform group-hover:scale-110 duration-500">
            </div>
            <div class="flex-grow p-6">
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
                    <div class="flex items-center gap-3">
                        <h4 class="font-bold text-xl text-slate-800 dark:text-white">${m.nick}</h4>
                        <span class="text-[10px] px-2.5 py-1 rounded-full bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 font-bold uppercase tracking-wider">
                            <i class="fa-solid fa-triangle-exclamation mr-1.5"></i>${m.cargo && m.cargo !== 'Não consta na listagem' ? 'Cargo Irregular' : 'Não é professor'}
                        </span>
                        ${m.isAdminNoGrupo ? `
                        <span class="text-[10px] px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5 animate-pulse">
                            <i class="fa-solid fa-star text-[10px]"></i> ADMIN DO GRUPO
                        </span>` : ''}
                    </div>
                </div>
                ${m.isAdminNoGrupo ? `
                <div class="mb-4 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl text-[11px] text-amber-700 dark:text-amber-400 flex items-start gap-2.5 shadow-sm">
                    <i class="fa-solid fa-circle-exclamation mt-0.5 shrink-0"></i>
                    <span><strong>Atenção:</strong> Este usuário é administrador do grupo no Habbo. Tenha cautela ao realizar a remoção manual ou ignore se considerar necessário.</span>
                </div>` : ''}
                <p class="text-sm text-slate-500 dark:text-slate-400 mb-5 flex items-center gap-2">
                    <i class="fa-solid fa-circle-info text-slate-400"></i>${m.cargo && m.cargo !== 'Não consta na listagem' ? 'Cargo atual: ' + m.cargo : m.status}
                </p>

                <div class="flex flex-wrap gap-3">
                    ${m.grupos.includes('professores') ? `
                    <label class="checkbox-wrapper flex items-center text-xs font-medium text-slate-600 dark:text-slate-300 bg-purple-50/50 dark:bg-purple-900/10 p-3 rounded-xl cursor-pointer hover:bg-purple-100/50 dark:hover:bg-purple-900/20 transition-all border border-purple-100 dark:border-purple-800/30">
                        <input type="checkbox" id="chk-ret-prof-${idx}">
                        <span class="ml-3"><i class="fa-solid fa-users mr-1.5 text-purple-500"></i>Tirei do Grupo Professores</span>
                    </label>` : ''}
                    ${m.grupos.includes('graduadores') ? `
                    <label class="checkbox-wrapper flex items-center text-xs font-medium text-slate-600 dark:text-slate-300 bg-teal-50/50 dark:bg-teal-900/10 p-3 rounded-xl cursor-pointer hover:bg-teal-100/50 dark:hover:bg-teal-900/20 transition-all border border-teal-100 dark:border-teal-800/30">
                        <input type="checkbox" id="chk-ret-grad-${idx}">
                        <span class="ml-3"><i class="fa-solid fa-user-group mr-1.5 text-teal-500"></i>Tirei do Grupo Graduadores</span>
                    </label>` : ''}
                </div>
            </div>
        </div>
    </li>`;
}

function criarCardMembro(m, idx, tipo) {
    const urlAvatar = `https://www.habbo.com.br/habbo-imaging/avatarimage?img_format=png&user=${m.nick}&direction=2&head_direction=3&size=l&headonly=0`;

    const subgruposBadges = (m.subgruposHabbo || []).map(sg => {
        let styleClass = '';
        let icon = '';
        if (sg === 'SPP') {
            styleClass = 'bg-[#2e1065] text-white border border-purple-900/50';
            icon = 'fa-shield-cat text-purple-300';
        } else if (sg === 'Dep. Aplicação') {
            styleClass = 'bg-[#581c87] text-[#facc15] border border-[#facc15]/30';
            icon = 'fa-book-open text-[#facc15]';
        } else if (sg === 'CDC') {
            styleClass = 'bg-[#d8b4fe] text-[#4c1d95] border border-[#c084fc]/50';
            icon = 'fa-palette text-[#6b21a8]';
        }
        return `<span class="${styleClass} px-2.5 py-1 rounded text-[10px] uppercase font-bold flex items-center gap-1.5 shadow-sm"><i class="fa-solid ${icon}"></i>${sg}</span>`;
    }).join('');

    let badgeAdmin = '';
    let avisoAdmin = '';

    if (m.isAdminNoGrupo) {
        badgeAdmin = `
            <span class="text-[10px] px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5 animate-pulse">
                <i class="fa-solid fa-star text-[10px]"></i> ADMIN DO GRUPO
            </span>`;
        avisoAdmin = `
            <div class="mb-4 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl text-[11px] text-amber-700 dark:text-amber-400 flex items-start gap-2.5 shadow-sm">
                <i class="fa-solid fa-circle-exclamation mt-0.5 shrink-0"></i>
                <span><strong>Aviso de Segurança:</strong> Este usuário possui cargo de Administrador no grupo do Habbo. Recomenda-se cautela extra.</span>
            </div>`;
    }

    let badgeStatus = '';
    let tipoAcao = 'rebaixamento';

    if (tipo === 'graduacao') {
        const diasPendentes = Number.isFinite(m.dias) ? m.dias : 0;
        const diasAtraso = Number.isFinite(m.diasAtraso) ? m.diasAtraso : Math.max(0, diasPendentes - 7);
        const textoAtraso = `${diasAtraso} ${diasAtraso === 1 ? 'dia' : 'dias'} após o prazo`;
        const tipoGraduacao = m.tipo === 'expulsao' ? 'Expulsão' : 'Rebaixamento';
        badgeStatus = `<span class="bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">${tipoGraduacao} · ${textoAtraso}</span>`;
        tipoAcao = m.tipo;
    }
    if (tipo === 'offline') {
        let tempoOffline = `${m.dias}d`;
        let acessoInfo = '';
        if (m.ultimoAcesso) {
            const dataAcesso = new Date(m.ultimoAcesso);
            const diffMs = Date.now() - dataAcesso.getTime();
            const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            const diffHoras = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            tempoOffline = diffHoras > 0 ? `${diffDias}d ${diffHoras}h` : `${diffDias}d`;
            const dia = dataAcesso.getDate().toString().padStart(2, '0');
            const mesNum = (dataAcesso.getMonth() + 1).toString().padStart(2, '0');
            const hora = dataAcesso.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
            acessoInfo = `<div class="h-4 w-px bg-purple-500/20"></div>
                <div class="flex items-center gap-1.5 text-[10px] text-slate-400">
                    <i class="fa-regular fa-calendar text-purple-500/50 text-[9px]"></i>
                    <span>${dia}/${mesNum} às ${hora}</span>
                </div>`;
        }
        badgeStatus = `<div class="inline-flex items-center gap-2.5 bg-purple-950/40 dark:bg-purple-950/30 pl-1 pr-3 py-1 rounded-full border border-purple-500/20">
            <span class="bg-purple-500/20 text-purple-400 text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-wide"><i class="fa-solid fa-clock-rotate-left mr-1 text-[8px]"></i>${tempoOffline}</span>
            ${acessoInfo}
        </div>`;
        const ehProfessor = m.cargo.toLowerCase().includes('professor') && !m.cargo.toLowerCase().includes('geral');
        tipoAcao = ehProfessor ? 'expulsao' : 'rebaixamento';
    }
    if (tipo === 'remover-forum') {
        const subforunsBadges = [];
        if (m.subforuns && m.subforuns.length > 0) {
            m.subforuns.forEach(sub => {
                if (sub === 'professores') {
                    subforunsBadges.push('<span class="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider"><i class="fa-solid fa-chalkboard-user mr-1.5"></i>Professores</span>');
                } else if (sub === 'coordenadores') {
                    subforunsBadges.push('<span class="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider"><i class="fa-solid fa-user-tie mr-1.5"></i>Coordenadores</span>');
                } else if (sub === 'graduadores') {
                    subforunsBadges.push('<span class="bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider"><i class="fa-solid fa-graduation-cap mr-1.5"></i>Graduadores</span>');
                }
            });
        }
        badgeStatus = subforunsBadges.length > 0 ? `<div class="flex flex-wrap gap-1.5">${subforunsBadges.join('')}</div>` :
            `<span class="bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300 text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                ${m.cargo && m.cargo !== 'Não consta na listagem' ? 'Cargo Irregular' : 'Não é professor'}
             </span>`;
    }

    const mostrarOpcoesTirar = tipo === 'inativos' || tipo === 'offline' || tipo === 'graduacao';

    const contentHtml = tipo === 'remover-forum' ? `
        <p class="text-[11px] text-slate-500 dark:text-slate-400 font-mono bg-slate-100 dark:bg-slate-800/50 px-2 py-1 rounded-md inline-block mb-4 border border-slate-200 dark:border-slate-700/50">${m.status || 'Verificar manualmente'}</p>
        <div class="space-y-3">
            ${m.subforuns && m.subforuns.includes('professores') ? `
            <div class="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/20 rounded-xl border border-slate-100 dark:border-slate-800/40 transition-all hover:bg-slate-100 dark:hover:bg-slate-800/30">
                <label class="checkbox-wrapper flex items-center text-xs font-medium text-slate-600 dark:text-slate-300 cursor-pointer flex-grow">
                    <input type="checkbox" onchange="registrarCheckbox(this, '${tipo}', '${m.nick}', 'professores', 'remover-prof')" id="chk-remover-prof-${idx}">
                    <span class="ml-3"><i class="fa-solid fa-chalkboard-user mr-1.5 text-purple-500"></i>Removi do Subfórum dos Professores</span>
                </label>
                <a href="https://www.policiarcc.com/g10-professores" target="_blank" class="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center text-purple-500 hover:scale-110 transition-transform">
                    <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                </a>
            </div>` : ''}
            ${m.subforuns && m.subforuns.includes('coordenadores') ? `
            <div class="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/20 rounded-xl border border-slate-100 dark:border-slate-800/40 transition-all hover:bg-slate-100 dark:hover:bg-slate-800/30">
                <label class="checkbox-wrapper flex items-center text-xs font-medium text-slate-600 dark:text-slate-300 cursor-pointer flex-grow">
                    <input type="checkbox" onchange="registrarCheckbox(this, '${tipo}', '${m.nick}', 'coordenadores', 'remover-coord')" id="chk-remover-coord-${idx}">
                    <span class="ml-3"><i class="fa-solid fa-user-tie mr-1.5 text-pink-500"></i>Removi do Subfórum dos Coordenadores</span>
                </label>
                <a href="https://www.policiarcc.com/g458-coordenadores-dos-professores" target="_blank" class="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center text-pink-500 hover:scale-110 transition-transform">
                    <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                </a>
            </div>` : ''}
            ${m.subforuns && m.subforuns.includes('graduadores') ? `
            <div class="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/20 rounded-xl border border-slate-100 dark:border-slate-800/40 transition-all hover:bg-slate-100 dark:hover:bg-slate-800/30">
                <label class="checkbox-wrapper flex items-center text-xs font-medium text-slate-600 dark:text-slate-300 cursor-pointer flex-grow">
                    <input type="checkbox" onchange="registrarCheckbox(this, '${tipo}', '${m.nick}', 'graduadores', 'remover-grad')" id="chk-remover-grad-${idx}">
                    <span class="ml-3"><i class="fa-solid fa-graduation-cap mr-1.5 text-violet-700"></i>Removi do Subfórum dos Graduadores</span>
                </label>
                <a href="https://www.policiarcc.com/g231-graduadores-dos-professores" target="_blank" class="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center text-violet-700 hover:scale-110 transition-transform">
                    <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                </a>
            </div>` : ''}
        </div>
    ` : `
        <p class="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-tighter bg-slate-100 dark:bg-slate-800/50 px-2.5 py-1 rounded-full inline-block mb-4 border border-transparent dark:border-slate-800/50 transition-colors">${m.cargo}</p>

        <div class="space-y-4">

            <div>
                <div class="flex items-center gap-2 mb-2.5">
                    <i class="fa-solid fa-list-check text-slate-400 text-[10px]"></i>
                    <span class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Ações Necessárias</span>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <label class="checkbox-wrapper flex items-center text-[11px] font-medium text-slate-600 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-800/20 p-2.5 rounded-xl cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-800/40 transition-all border border-slate-100 dark:border-slate-800/30">
                        <input type="checkbox" onchange="registrarCheckbox(this, '${tipo}', '${m.nick}', '${m.cargo}', 'req')" id="chk-req-${tipo}-${idx}">
                        <span class="ml-2.5">Requerimento</span>
                    </label>
                    ${tipo !== 'inativos' ? `
                    <label class="checkbox-wrapper flex items-center text-[11px] font-medium text-slate-600 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-800/20 p-2.5 rounded-xl cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-800/40 transition-all border border-slate-100 dark:border-slate-800/30">
                        <input type="checkbox" onchange="registrarCheckbox(this, '${tipo}', '${m.nick}', '${m.cargo}', 'mp')" id="chk-mp-${tipo}-${idx}">
                        <span class="ml-2.5">MP Enviada</span>
                    </label>
                    <label class="checkbox-wrapper flex items-center text-[11px] font-medium text-slate-600 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-800/20 p-2.5 rounded-xl cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-800/40 transition-all border border-slate-100 dark:border-slate-800/30">
                        <input type="checkbox" onchange="registrarCheckbox(this, '${tipo}', '${m.nick}', '${m.cargo}', 'medal')" id="chk-medal-${tipo}-${idx}">
                        <span class="ml-2.5">Medalha postada</span>
                    </label>` : ''}
                </div>
            </div>


            ${mostrarOpcoesTirar ? `
            <div class="pt-1">
                <div class="flex items-center gap-2 mb-2.5">
                    <i class="fa-solid fa-hotel text-purple-500/60 text-[10px]"></i>
                    <span class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Grupos do Habbo</span>
                    ${m.noGrupo ? '<span class="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse ml-1"></span>' : ''}
                </div>
                ${m.noGrupo ? `
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                    ${tipoAcao === 'expulsao' || tipo === 'inativos' ? `
                        ${m.noProfessores ? `
                        <label class="checkbox-wrapper flex items-center text-[11px] font-medium text-slate-600 dark:text-slate-300 bg-purple-50/50 dark:bg-purple-900/10 p-2.5 rounded-xl cursor-pointer hover:bg-purple-100/50 dark:hover:bg-purple-900/20 transition-all border border-purple-100/30 dark:border-purple-800/30">
                            <input type="checkbox" onchange="registrarCheckbox(this, '${tipo}', '${m.nick}', '${m.cargo}', 'grupo-prof')" id="chk-grupo-prof-${tipo}-${idx}">
                            <span class="ml-2.5"><i class="fa-solid fa-users mr-1 text-purple-500"></i>Tirei de Professores</span>
                        </label>` : `<div class="text-[10px] flex items-center gap-2 p-2.5 text-slate-400 bg-slate-50 dark:bg-slate-800/10 rounded-xl italic border border-dashed border-slate-200 dark:border-slate-800"><i class="fa-solid fa-circle-minus"></i>Não está em Professores</div>`}
                        ${m.noGraduadores ? `
                        <label class="checkbox-wrapper flex items-center text-[11px] font-medium text-slate-600 dark:text-slate-300 bg-teal-50/50 dark:bg-teal-900/10 p-2.5 rounded-xl cursor-pointer hover:bg-teal-100/50 dark:hover:bg-teal-900/20 transition-all border border-teal-100/30 dark:border-teal-800/30">
                            <input type="checkbox" onchange="registrarCheckbox(this, '${tipo}', '${m.nick}', '${m.cargo}', 'grupo-grad')" id="chk-grupo-grad-${tipo}-${idx}">
                            <span class="ml-2.5"><i class="fa-solid fa-user-group mr-1 text-teal-500"></i>Tirei de Graduadores</span>
                        </label>` : `<div class="text-[10px] flex items-center gap-2 p-2.5 text-slate-400 bg-slate-50 dark:bg-slate-800/10 rounded-xl italic border border-dashed border-slate-200 dark:border-slate-800"><i class="fa-solid fa-circle-minus"></i>Não está em Graduadores</div>`}
                    ` : `
                        <div class="text-[11px] p-2.5 bg-emerald-50/30 dark:bg-emerald-950/20 rounded-xl border border-emerald-100/50 dark:border-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center gap-2.5">
                            <i class="fa-solid fa-circle-check"></i><span>Mantém em Professores</span>
                        </div>
                        ${m.noGraduadores ? `
                        <label class="checkbox-wrapper flex items-center text-[11px] font-medium text-slate-600 dark:text-slate-300 bg-teal-50/50 dark:bg-teal-900/10 p-2.5 rounded-xl cursor-pointer hover:bg-teal-100/50 dark:hover:bg-teal-900/20 transition-all border border-teal-100/30 dark:border-teal-800/30">
                            <input type="checkbox" onchange="registrarCheckbox(this, '${tipo}', '${m.nick}', '${m.cargo}', 'grupo-grad')" id="chk-grupo-grad-${tipo}-${idx}">
                            <span class="ml-2.5"><i class="fa-solid fa-user-group mr-1 text-teal-500"></i>Tirei de Graduadores</span>
                        </label>` : `<div class="text-[10px] flex items-center gap-2 p-2.5 text-slate-400 bg-slate-50 dark:bg-slate-800/10 rounded-xl italic border border-dashed border-slate-200 dark:border-slate-800"><i class="fa-solid fa-circle-minus"></i>Não está em Graduadores</div>`}
                    `}
                </div>` : `
                <div class="text-[11px] p-2.5 text-slate-400 dark:text-slate-500 bg-slate-50/50 dark:bg-slate-800/20 rounded-xl border border-dashed border-slate-200 dark:border-slate-800/50">
                    <i class="fa-solid fa-circle-minus mr-2"></i>Sem grupos associados no Habbo
                </div>`}
            </div>` : ''}


            ${mostrarOpcoesTirar ? `
            <div class="pt-1">
                <div class="flex items-center gap-2 mb-2.5 text-left">
                    <i class="fa-solid fa-users-rectangle text-slate-400 text-[10px]"></i>
                    <span class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Subfóruns</span>
                    ${m.subforunsDoMembro && m.subforunsDoMembro.length > 0 ? `<span class="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold ml-1">${m.subforunsDoMembro.length} ativo(s)</span>` : ''}
                </div>
                ${m.subforunsDoMembro && m.subforunsDoMembro.length > 0 ? `
                <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
                    ${m.subforunsDoMembro.join('').includes('professores') ? `
                    <label class="checkbox-wrapper flex items-center text-[10px] font-bold text-slate-600 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-800/20 p-2 rounded-lg cursor-pointer hover:bg-purple-100/50 dark:hover:bg-purple-900/20 transition-all border border-slate-200 dark:border-slate-700/50 group">
                        <input type="checkbox" onchange="registrarCheckbox(this, '${tipo}', '${m.nick}', 'professores', 'remover-prof')" id="chk-remover-prof-${tipo}-${idx}">
                        <span class="ml-2 group-hover:text-purple-600">PROFESSORES</span>
                    </label>` : ''}
                    ${m.subforunsDoMembro.join('').includes('coordenadores') ? `
                    <label class="checkbox-wrapper flex items-center text-[10px] font-bold text-slate-600 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-800/20 p-2 rounded-lg cursor-pointer hover:bg-pink-100/50 dark:hover:bg-pink-900/20 transition-all border border-slate-200 dark:border-slate-700/50 group">
                        <input type="checkbox" onchange="registrarCheckbox(this, '${tipo}', '${m.nick}', 'coordenadores', 'remover-coord')" id="chk-remover-coord-${tipo}-${idx}">
                        <span class="ml-2 group-hover:text-pink-600">COORDENADORES</span>
                    </label>` : ''}
                    ${m.subforunsDoMembro.join('').includes('graduadores') ? `
                    <label class="checkbox-wrapper flex items-center text-[10px] font-bold text-slate-600 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-800/20 p-2 rounded-lg cursor-pointer hover:bg-violet-100/50 dark:hover:bg-violet-900/20 transition-all border border-slate-200 dark:border-slate-700/50 group">
                        <input type="checkbox" onchange="registrarCheckbox(this, '${tipo}', '${m.nick}', 'graduadores', 'remover-grad')" id="chk-remover-grad-${tipo}-${idx}">
                        <span class="ml-2 group-hover:text-violet-700">GRADUADORES</span>
                    </label>` : ''}
                </div>` : `
                <div class="text-[11px] p-2.5 text-slate-400 dark:text-slate-500 bg-slate-50/50 dark:bg-slate-800/20 rounded-xl border border-dashed border-slate-200 dark:border-slate-800/50">
                    <i class="fa-solid fa-circle-minus mr-2"></i>Sem subfóruns registrados
                </div>`}
            </div>` : ''}


            ${m.subgruposHabbo && m.subgruposHabbo.length > 0 && (tipo === 'inativos' || tipoAcao === 'expulsao') ? `
            <div class="pt-1">
                <div class="flex items-center gap-2 mb-2.5">
                    <i class="fa-solid fa-bullhorn text-amber-500/80 text-[10px]"></i>
                    <span class="text-[10px] font-bold text-amber-600 dark:text-amber-500 uppercase tracking-widest">Subgrupos (Avisar Liderança)</span>
                </div>
                <div class="flex flex-wrap gap-2">
                     ${subgruposBadges}
                </div>
            </div>` : ''}
        </div>
    `;

    return `
    <div id="card-${tipo}-${idx}" class="card-standard group relative rounded-2xl overflow-hidden p-6 animate-fade-in transition-opacity" style="animation-delay: ${idx * 0.05}s">
        <div class="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <div class="relative shrink-0 flex flex-col items-center gap-4">
                <div class="w-20 h-20 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-center overflow-hidden transition-all group-hover:border-primary/30 avatar-glow relative">
                    <img src="${urlAvatar}" alt="${m.nick}" class="object-contain -mt-2 drop-shadow-lg transition-transform group-hover:scale-110 duration-500">
                </div>
                <button type="button" data-action="desconsiderar" aria-label="Desconsiderar membro" onclick="desconsiderarMembro(this, '${tipo}', ${idx})"
                    class="group/trash w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 transition-all flex items-center justify-center border border-slate-100 dark:border-slate-800 hover:border-red-200 dark:hover:border-red-800 shadow-sm"
                    title="Desconsiderar">
                    <i class="fa-solid fa-trash-can text-sm group-hover/trash:shake transition-transform"></i>
                </button>
            </div>

            <div class="flex-grow text-center md:text-left w-full">
                <div class="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
                    <div class="flex flex-wrap items-center gap-3">
                        <h4 class="font-bold text-2xl text-slate-800 dark:text-white tracking-tight">${m.nick}</h4>
                        ${badgeAdmin}
                    </div>
                    ${badgeStatus}
                </div>

                ${avisoAdmin}

                ${contentHtml}
            </div>
        </div>
    </div>`;
}

function alternarCarregamento(ativo) {
    const containerVerificar = document.getElementById('container-verificar');
    if (ativo) {
        carregador.classList.remove('hidden');
        containerResultados.classList.add('hidden');
        if (containerVerificar) containerVerificar.classList.add('hidden');
        botaoVerificar.disabled = true;
        botaoVerificar.classList.add('opacity-70');
    } else {
        carregador.classList.add('hidden');
        if (containerVerificar) containerVerificar.classList.remove('hidden');
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

function agruparMembrosComIdx(lista, tipoModal) {
    const grupos = {};
    const hoje = new Date().toLocaleDateString('pt-BR');

    lista.forEach(m => {
        const idx = m._idx;
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

    const tipoCard = tipo === 'req-inativos' ? 'inativos' : (tipo === 'req-grad' ? 'graduacao' : 'offline');
    listaFonte = listaFonte.filter(m => {
        const card = document.getElementById(`card-${tipoCard}-${m._idx}`);
        return !card || !card.classList.contains('opacity-40');
    });

    if (listaFonte.length === 0) {
        showToast('Nenhum membro para processar (todos foram desconsiderados ou já processados).', 'error');
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
            const acao = dadosAcao.nome;
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
    if (!resp) { showToast('Digite seu nick no topo do modal.', 'error'); return; }

    const codigo = criarBBCodeMedalha(tipo, nick, motivo, resp, cargo);
    const jaFeito = chkId.split(',').every(id => document.getElementById(id)?.checked);

    if (jaFeito) {
        abrirModalVerificacao(ID_TOPICO_MEDALHA, codigo);
        return;
    }


    const qtdMedalhas = (tipo === 'expulsao') ? -100 : -50;
    btn.dataset.macroData = JSON.stringify({ nick, cargo, motivo, qtd: qtdMedalhas });

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


function enviarDadosMacro(nick, cargo, motivo, quantidadeMedalhas) {
    const responsavel = document.getElementById('nick-responsavel').value;
    const periodo = obterDataMedalha();


    const d = new Date();
    const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    const dataFmt = `${d.getDate().toString().padStart(2, '0')} ${meses[d.getMonth()]} ${d.getFullYear()}`;
    const horaFmt = `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;
    const horarioEnvio = `${dataFmt} ${horaFmt}`;


    const MACRO_URL = "https://script.google.com/macros/s/AKfycbw4EsCXpPs-7ORsxAtcZ4Pul-CaW_01JO0ADw4pwJ9D0PXOxeSMsuCxyxm1WAf1otG9/exec";

    const formData = new FormData();
    formData.append('horario_envio', horarioEnvio);
    formData.append('responsavel_med', responsavel);
    formData.append('grupo_tarefas', 'Professores');
    formData.append('cargo_med', cargo);
    formData.append('periodo_med', periodo);
    formData.append('gratificados_med', nick);
    formData.append('numero_med', quantidadeMedalhas);

    let motivoFinal = motivo;
    if (motivo === 'Cumprimento de meta do cargo de' || motivo === 'Não cumprimento de meta do cargo de') {
        motivoFinal = `${motivo} ${cargo}.`;
    } else {
        motivoFinal = motivo.endsWith('.') ? motivo : `${motivo}.`;
    }
    formData.append('motivo_grat', motivoFinal);

    console.log(`[Macro] Enviando dados para ${nick}...`, Object.fromEntries(formData));

    fetch(MACRO_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: formData
    }).then(() => {
        console.log('[Macro] Dados enviados com sucesso (presumido via no-cors).');

    }).catch(err => {
        console.error('[Macro] Erro ao enviar:', err);

    });
}

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

            if (btnOriginal.dataset.macroData) {
                const data = JSON.parse(btnOriginal.dataset.macroData);
                enviarDadosMacro(data.nick, data.cargo, data.motivo, data.qtd);
            }

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
