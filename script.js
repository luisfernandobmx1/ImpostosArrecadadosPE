const urlDados2026 = "https://cors-anywhere.herokuapp.com/https://dados.pe.gov.br/dataset/bf9f2030-637c-4ea2-9438-f088c0968a75/resource/3637f927-f821-4b4a-8c23-eff181a64dd4/download/receitas_totais_2026_20260602.json";

// Dicionário para traduzir os códigos da SEFAZ para termos limpos e claros
const tradutorImpostos = {
    "1114501101": "ICMS - Operação Principal",
    "1114501201": "ICMS - Multas e Juros de Mora",
    "1114501301": "ICMS - Dívida Ativa",
    "1114501401": "ICMS - Dívida Ativa - Multas e Juros",
    "1112510101": "IPVA - Imposto s/ Propriedade de Veículos Automotores",
    "1112510201": "IPVA - Multas e Juros de Mora",
    "1112510301": "IPVA - Dívida Ativa",
    "1112510401": "IPVA - Dívida Ativa - Multas e Juros",
    "1114511101": "ITCD - Imposto s/ Transmissão Causa Mortis e Doação",
    "1113031101": "IRRF - Imposto de Renda Retido na Fonte - Trabalho",
    "1113034101": "IRRF - Imposto de Renda Retido na Fonte - Outros Rendimentos",
    "1114502101": "Adicional de até 2% do ICMS (Fecoep)"
};

async function carregarImpostos2026() {
    try {
        const response = await fetch(urlDados2026);
        if (!response.ok) throw new Error("Erro ao obter os dados do servidor.");
        
        const dados = await response.json();
        const registros = dados.campos || [];
        
        const apenasImpostos = registros.filter(item => {
            const especie = (item.especie || "").toUpperCase();
            return especie.includes("IMPOSTO");
        });

        console.clear();
        console.log("%c--- ARRECADÇÃO DETALHADA DE IMPOSTOS EM PE (2026) ---", "color: #00ff00; font-weight: bold;");
        
        let somaTotal = 0;

        apenasImpostos.sort((a, b) =>
            (parseFloat(b.valora_arrecadado) || 0) -
            (parseFloat(a.valora_arrecadado) || 0)
        );

        apenasImpostos.forEach(item => {
            const valor = parseFloat(item.valora_arrecadado) || 0;
            const codigoNatureza = String(item.natureza_receita).trim();
            
            const nomeExibicao = tradutorImpostos[codigoNatureza] || item.especie;

            if (valor > 0) {
                somaTotal += valor;
                // Mudamos de #fff para #222 (cinza escuro) para dar leitura no seu tema claro
                console.log(`%c[Cód: ${codigoNatureza}] %c${nomeExibicao.padEnd(55)} %c-> R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 
                    "color: #777;", "color: #222; font-weight: 500;", "color: #007b8b; font-weight: bold;");
            }
        });


        console.log("%c---------------------------------------------------------------------------------", "color: #888;");
        console.log(`%cSOMA TOTAL DE IMPOSTOS ARRECADADOS: R$ ${somaTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 
            "color: #ff9800; font-weight: bold; font-size: 14px;");

    } catch (erro) {
        console.error("Falha ao processar arrecadação:", erro);
    }
}

carregarImpostos2026();