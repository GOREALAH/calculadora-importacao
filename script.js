let taxaCambio = 63.90; // Valor padrão caso a internet falhe

// 1. Procurar taxa de câmbio USD -> MZN em tempo real
async function obterCambio() {
    try {
        const resposta = await fetch("https://er-api.com");
        const dados = await resposta.json();
        if(dados.rates && dados.rates.MZN) {
            taxaCambio = dados.rates.MZN;
            document.getElementById("cambio-val").innerText = taxaCambio.toFixed(2);
        }
    } catch (erro) {
        console.error("Erro ao obter câmbio, usando taxa padrão.", erro);
        document.getElementById("cambio-val").innerText = taxaCambio.toFixed(2) + " (Offline)";
    }
}

// 2. Executar o cálculo aduaneiro
function calcularCustos() {
    const valorUSD = parseFloat(document.getElementById("valor-usd").value);
    if (isNaN(valorUSD) || valorUSD <= 0) {
        alert("Por favor, introduza um valor CIF válido.");
        return;
    }

    const select = document.getElementById("dispositivo");
    const opcaoSelecionada = select.options[select.selectedIndex];
    
    // Obter percentagens guardadas nas propriedades do HTML
    const pDireitos = parseFloat(opcaoSelecionada.getAttribute("data-direitos")) / 100;
    const pICE = parseFloat(opcaoSelecionada.getAttribute("data-ice")) / 100;
    const sh = opcaoSelecionada.getAttribute("data-sh");
    
    const custoLogistica = parseFloat(document.getElementById("logistica").value) || 0;
    const tsa Fixa = 3200; // Equivalente estimado a 50 USD

    // Fórmulas de cálculo em Meticais (MT)
    const cifMT = valorUSD * taxaCambio;
    const direitosMT = cifMT * pDireitos;
    const iceMT = cifMT * pICE;
    
    // Base de cálculo do IVA em Moçambique = (CIF + Direitos + ICE)
    const baseIVA = cifMT + direitosMT + iceMT;
    const ivaMT = baseIVA * 0.16;

    // Total de taxas e custo final
    const totalTaxas = direitosMT + iceMT + ivaMT + tsaFixa + custoLogistica;
    const custoFinal = cifMT + totalTaxas;

    // Exibir resultados no ecrã de forma formatada
    document.getElementById("res-sh").innerText = sh;
    document.getElementById("res-cif-mt").innerText = cifMT.toLocaleString('pt-PT', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    document.getElementById("res-direitos").innerText = direitosMT.toLocaleString('pt-PT', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    document.getElementById("res-ice").innerText = iceMT.toLocaleString('pt-PT', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    document.getElementById("res-iva").innerText = ivaMT.toLocaleString('pt-PT', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    document.getElementById("res-log").innerText = custoLogistica.toLocaleString('pt-PT', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    document.getElementById("res-total").innerText = custoFinal.toLocaleString('pt-PT', {minimumFractionDigits: 2, maximumFractionDigits: 2});

    document.getElementById("resultado").style.display = "block";
}

// Chamar a função de câmbio assim que a página abre
obterCambio();
