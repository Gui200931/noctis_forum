function postar() {
    let titulo = document.getElementById("titulo").value;
    let texto = document.getElementById("texto").value;
    let arquivo = document.getElementById("midia").files[0];

    if (!titulo || !texto) {
        alert("Preencha tudo!");
        return;
    }

    if (arquivo) {
        let reader = new FileReader();
        reader.onload = function(e) {
            salvarPost(titulo, texto, e.target.result, arquivo.type);
        };
        reader.readAsDataURL(arquivo);
    } else {
        salvarPost(titulo, texto, null, null);
    }
}

function salvarPost(titulo, texto, midia, tipo) {
    let posts = JSON.parse(localStorage.getItem("posts") || "[]");

    posts.push({
        titulo: titulo,
        texto: texto,
        midia: midia,
        tipo: tipo,
        comentarios: []
    });

    localStorage.setItem("posts", JSON.stringify(posts));
    document.location.reload();
}

function carregarPosts() {
    let posts = JSON.parse(localStorage.getItem("posts") || "[]");
    let area = document.getElementById("posts");

    posts.forEach((p, i) => {
        area.innerHTML += `
            <div class="post">
                <h3>${p.titulo}</h3>
                <p>${p.texto.substring(0, 120)}...</p>
                <a href="historia.html?id=${i}">Ler mais</a>
            </div>
        `;
    });
}

if (document.location.pathname.includes("index")) {
    carregarPosts();
}

function carregarHistoria() {
    let params = new URLSearchParams(location.search);
    let id = params.get("id");

    let posts = JSON.parse(localStorage.getItem("posts") || "[]");
    let post = posts[id];

    document.getElementById("tituloHistoria").innerText = post.titulo;
    document.getElementById("textoHistoria").innerText = post.texto;

    let areaMidia = document.getElementById("midiaArea");

    if (post.midia) {
        if (post.tipo.startsWith("image")) {
            areaMidia.innerHTML = `<img src="${post.midia}" class="midia">`;
        } else if (post.tipo.startsWith("video")) {
            areaMidia.innerHTML = `
                <video class="midia" controls>
                    <source src="${post.midia}" type="video/mp4">
                </video>`;
        }
    }

    let area = document.getElementById("listaComentarios");
    post.comentarios.forEach(c => {
        area.innerHTML += `<div class="comentario">${c}</div>`;
    });
}

if (document.location.pathname.includes("historia")) {
    carregarHistoria();
}

function comentar() {
    let texto = document.getElementById("comentario").value;

    if (!texto) return;

    let params = new URLSearchParams(location.search);
    let id = params.get("id");

    let posts = JSON.parse(localStorage.getItem("posts") || "[]");

    posts[id].comentarios.push(texto);

    localStorage.setItem("posts", JSON.stringify(posts));
    document.location.reload();
}