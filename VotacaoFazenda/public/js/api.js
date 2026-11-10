const API = "http://localhost:3000";

async function listarNaRoca() {
    const resposta = await fetch(`${API}/participantes?naRoca=true`);
    if (!resposta.ok) throw new Error("Erro ao carregar a roça");
    return await resposta.json();
}

async function listarForaDaRoca() {
    const resposta = await fetch(`${API}/participantes?naRoca=false`);
    if (!resposta.ok) throw new Error("Erro ao carregar participantes");
    return await resposta.json();
}

async function listarVotos() {
    const resposta = await fetch(`${API}/votos`);
    if (!resposta.ok) throw new Error("Erro ao carregar votos");
    return await resposta.json();
}

async function registrarVoto(participanteId) {
    const resposta = await fetch(`${API}/votos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participanteId, data: new Date().toISOString() })
    });
    if (!resposta.ok) throw new Error("Erro ao registrar voto");
    return await resposta.json();
}

async function zerarVotos() {
    const votos = await listarVotos();
    for (const voto of votos) {
        const resposta = await fetch(`${API}/votos/${voto.id}`, { method: "DELETE" });
        if (!resposta.ok) throw new Error("Erro ao apagar voto");
    }
}
