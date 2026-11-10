async function carregarVotacao() {
    const listaRoca = document.getElementById("lista-roca");
    const listaDemais = document.getElementById("lista-demais");
    const mensagem = document.getElementById("mensagem-voto");

    try {
        const [roca, demais] = await Promise.all([
            listarNaRoca(),
            listarForaDaRoca()
        ]);

        listaRoca.innerHTML = roca.map(p => `
            <div class="col">
                <div class="card h-100 shadow border-danger border-3">
                    <div class="position-relative">
                        <div class="ratio ratio-16x9">
                            <img src="${p.foto}" class="card-img-top object-fit-cover" alt="${p.nome}">
                        </div>
                        <span class="badge bg-danger position-absolute top-0 end-0 m-2">Na roça</span>
                    </div>
                    <div class="card-body d-flex flex-column text-center">
                        <h3 class="card-title h4 titulo-tema text-dark">${p.nome}</h3>
                        <button class="btn btn-danger w-100 mt-auto" type="button" data-id="${p.id}">Votar para eliminar</button>
                    </div>
                </div>
            </div>
        `).join("");

        listaDemais.innerHTML = demais.map(p => `
            <div class="col">
                <div class="card h-100 shadow-sm">
                    <div class="ratio ratio-16x9">
                        <img src="${p.foto}" class="card-img-top object-fit-cover" alt="${p.nome}">
                    </div>
                    <div class="card-body text-center p-2">
                        <h3 class="card-title h6 text-dark mb-0">${p.nome}</h3>
                    </div>
                </div>
            </div>
        `).join("");

        listaRoca.addEventListener("click", async evento => {
            const botao = evento.target.closest("button[data-id]");
            if (!botao) return;

            const participante = roca.find(p => Number(p.id) === Number(botao.dataset.id));
            if (!participante) return;

            botao.disabled = true;

            try {
                await registrarVoto(participante.id);
                const quantidade = Number(sessionStorage.getItem("quantidadeDeVotos") || "0") + 1;
                sessionStorage.setItem("quantidadeDeVotos", String(quantidade));
                mensagem.textContent = `Voto em ${participante.nome} registrado! Você já votou ${quantidade} ${quantidade === 1 ? "vez" : "vezes"}.`;
                mensagem.classList.remove("alert-danger", "d-none");
                mensagem.classList.add("alert-success");
                mensagem.scrollIntoView({ behavior: "smooth", block: "nearest" });
            } catch (erro) {
                mensagem.textContent = "Não foi possível registrar o voto. Tente novamente.";
                mensagem.classList.remove("alert-success", "d-none");
                mensagem.classList.add("alert-danger");
                console.error(erro);
            } finally {
                botao.disabled = false;
            }
        });

    } catch (erro) {
        listaRoca.innerHTML = '<div class="col-12"><div class="alert alert-danger">Não foi possível carregar os participantes.</div></div>';
        console.error(erro);
    }
}

carregarVotacao();
