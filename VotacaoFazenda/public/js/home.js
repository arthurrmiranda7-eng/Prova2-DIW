async function carregarHome() {
    const lista = document.getElementById("lista-roca");
    try {
        const participantes = await listarNaRoca();
        lista.className = "d-flex flex-wrap align-items-center gap-2 mt-3";
        lista.innerHTML = participantes.map(p => `
            <div class="participante-roca">
                <img src="${p.foto}" alt="${p.nome}" class="foto-roca">
                <span class="nome-roca">${p.nome}</span>
            </div>
        `).join("");
    } catch (erro) {
        lista.innerHTML = '<div class="alert alert-danger">Não foi possível carregar os participantes.</div>';
        console.error(erro);
    }
}

carregarHome();
