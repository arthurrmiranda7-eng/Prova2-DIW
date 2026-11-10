
async function carregarResultado() {
    const placar = document.getElementById("placar");
    const totalVotos = document.getElementById("total-votos");
    const mensagem = document.getElementById("mensagem-resultado");

    try {
        const [participantes, votos] = await Promise.all([
            listarNaRoca(),
            listarVotos()
        ]);

        totalVotos.textContent = votos.length;
        mensagem.className = "d-none";

        if (votos.length === 0) {
            placar.innerHTML = "";

            mensagem.className = "alert alert-warning mt-3 text-center";

            mensagem.innerHTML = `
                <p class="fs-5">
                    Nenhum voto ainda. Escolha quem sai da roça para ver a parcial.
                </p>
                <a href="votacao.html" class="btn btn-danger">
                    Ir para a votação
                </a>
            `;

            return;
        }

        const resultados = participantes.map(p => {
            const quantidade = votos.filter(
                v => Number(v.participanteId) === Number(p.id)
            ).length;

            return {
                ...p,
                quantidade,
                percentual: (quantidade / votos.length) * 100
            };
        }).sort((a, b) => b.quantidade - a.quantidade);

        placar.innerHTML = resultados.map((p, indice) => {
            const lider = indice === 0 && p.quantidade > 0;
            const percentual = p.percentual.toFixed(1).replace(".", ",");

            return `
                <div class="card shadow ${lider ? "border-danger border-3" : ""}">
                    <div class="card-body">
                        <div class="row align-items-center g-3">

                            <div class="col-12 col-sm-3 col-lg-2">
                                <img src="${p.foto}"
                                     alt="${p.nome}"
                                     class="img-fluid rounded w-100 object-fit-cover"
                                     style="max-height: 130px;">
                            </div>

                            <div class="col-12 col-sm-9 col-lg-10">
                                <h2 class="h4 titulo-tema text-dark">
                                    ${p.nome}
                                    ${lider ? '<span class="badge bg-danger fs-6">Sairia hoje</span>' : ""}
                                </h2>

                                <div class="progress"
                                     role="progressbar"
                                     aria-valuenow="${p.percentual}"
                                     aria-valuemin="0"
                                     aria-valuemax="100"
                                     style="height: 24px;">

                                    <div class="progress-bar ${lider ? "bg-danger" : "bg-secondary"}"
                                         style="width: ${p.percentual}%">
                                    </div>
                                </div>

                                <p class="text-dark fw-bold mb-0 mt-2">
                                    ${percentual}% (${p.quantidade} ${p.quantidade === 1 ? "voto" : "votos"})
                                </p>
                            </div>

                        </div>
                    </div>
                </div>
            `;
        }).join("");

    } catch (erro) {
        mensagem.className = "alert alert-danger mt-3";
        mensagem.textContent = "Erro ao carregar o resultado.";
        console.error(erro);
    }
}

document.getElementById("confirmar-zerar").addEventListener("click", async () => {
    const botao = document.getElementById("confirmar-zerar");
    const mensagem = document.getElementById("mensagem-resultado");

    botao.disabled = true;
    botao.textContent = "Zerando...";

    try {
        await zerarVotos();

        const modal = bootstrap.Modal.getInstance(
            document.getElementById("modalZerar")
        );

        if (modal) {
            modal.hide();
        }

        sessionStorage.removeItem("quantidadeDeVotos");

        await carregarResultado();

    } catch (erro) {
        mensagem.className = "alert alert-danger mt-3";
        mensagem.textContent = "Não foi possível zerar a votação.";
        console.error(erro);

    } finally {
        botao.disabled = false;
        botao.textContent = "Sim, zerar votação";
    }
});

carregarResultado();
