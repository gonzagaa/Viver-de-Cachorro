

AOS.init(
  {
      duration: 1200,
  }
);

document.addEventListener("DOMContentLoaded", () => {
  // Seleciona todos os botões com a classe .openModal
  const openModalButtons = document.querySelectorAll(".openModal");
  const closeModalButton = document.getElementById("closeModal");
  const modalOverlay = document.getElementById("modalOverlay");
  const modal = modalOverlay.querySelector(".modal");

  // Percorre todos os botões e adiciona o evento para abrir o modal
  openModalButtons.forEach((button) => {
    button.addEventListener("click", () => {
      modalOverlay.style.display = "flex";
      setTimeout(() => {
        modalOverlay.classList.add("active");
        modal.classList.add("active");
      }, 10); // Pequeno delay para acionar a animação
    });
  });

  // Função para fechar o modal
  const closeModal = () => {
    modalOverlay.classList.remove("active");
    modal.classList.remove("active");
    setTimeout(() => {
      modalOverlay.style.display = "none";
    }, 300); // Tempo compatível com a duração da animação
  };

  // Fecha o modal ao clicar no botão de fechar
  closeModalButton.addEventListener("click", closeModal);

  // Fecha o modal ao clicar na área de overlay
  modalOverlay.addEventListener("click", (event) => {
    if (event.target === modalOverlay) {
      closeModal();
    }
  });
});

document.getElementById('leadForm').addEventListener('submit', function (e) {
  e.preventDefault(); // Impede o envio padrão do formulário

  // Captura os dados do formulário
  const nome = e.target.nome.value;
  const email = e.target.email.value;
  const whatsapp = e.target.whatsapp.value;

  // Monta os dados no formato esperado
  const data = {
    Name: nome,
    Email: email,
    Phone: whatsapp,
    MachineCode: 752312,
    EmailSequenceCode: 1818346,  // Novo código atualizado
    SequenceLevelCode: 1
  };

  // Envio para o webhook usando Fetch API
  fetch('https://llapi.leadlovers.com/webapi/lead?token=C9CF203B1F8A491EB6BFDCAA06E97110', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1bmlxdWVfbmFtZSI6IldlYkFwaSIsInN1YiI6IldlYkFwaSIsInJvbGUiOlsicmVhZCIsIndyaXRlIl0sImlzcyI6Imh0dHA6Ly93ZWJhcGlsbC5henVyZXdlYnNpdGVzLm5ldCIsImF1ZCI6IjFhOTE4YzA3NmE1YjQwN2Q5MmJkMjQ0YTUyYjZmYjc0IiwiZXhwIjoxNjA1NDQxMzM4LCJuYmYiOjE0NzU4NDEzMzh9.YIIpOycEAVr_xrJPLlEgZ4628pLt8hvWTCtjqPTaWMs'
    },
    body: JSON.stringify(data)
  })
  .then(response => {
    if (response.ok) {
      // alert('Cadastro enviado com sucesso!');
      e.target.reset(); // Limpa o formulário

      // Redireciona o usuário para o YouTube Live
      window.location.href = 'https://comunidadeadestramento.com.br/viverdecachorro/obrigado';
    } else {
      response.json().then(error => {
        console.error('Erro:', error);
        alert('Erro ao enviar cadastro. Tente novamente.');
      });
    }
  })
  .catch(error => {
    console.error('Erro:', error);
    alert('Erro de conexão. Verifique sua internet.');
  });
});

// document.addEventListener("DOMContentLoaded", function() {
//   const iframe = document.getElementById("panda-d085627b-eb70-4cf7-a1ce-6210b7ca1096");
  
//   // Verifica se a largura da janela é maior que 1080px
//   if (window.innerWidth > 1080) {
//     // Adiciona o parâmetro ?muted=1 ou &muted=1 conforme a existência de outros parâmetros na URL
//     const originalSrc = iframe.src;
//     const hasQuery = originalSrc.includes("?");
//     const newSrc = originalSrc + (hasQuery ? "&muted=1" : "?muted=1");
//     iframe.src = newSrc;
//   }
// });
