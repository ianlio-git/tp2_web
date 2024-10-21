document.addEventListener('DOMContentLoaded', () => {
//-----------index----------------
// Mobile menu toggle
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');

// Ajustar margen del contenido principal para que no se superponga con la barra de navegación
function ajustarMargen() {
    const navbar = document.querySelector('nav'); 
    const mainContent = document.getElementById('main-content');
    const alturaNavbar = navbar.offsetHeight;
    mainContent.style.marginTop = `${alturaNavbar + 40}px`; 
}
window.onload = ajustarMargen;
window.onresize = ajustarMargen;

// Abrir/cerrar menú móvil
if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
}

// Cerrar menú cuando se hace clic fuera de él
document.addEventListener('click', (event) => {
    if (mobileMenu) {
        const isClickInsideMenu = mobileMenu.contains(event.target) || menuToggle.contains(event.target);
        
        if (!isClickInsideMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
        }
    }
});

// Navegación entre páginas
function loadPage(page) {
    const pageUrl = `pages/${page}.html`; 

    fetch(pageUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Página no encontrada');
            }
            return response.text();
        })
        .then(data => {
            document.getElementById('main-content').innerHTML = data; 
        })
        .catch(error => {
            document.getElementById('main-content').innerHTML = `<h1>Error</h1><p>${error.message}</p>`;
        });
}

// Listener para la navegación en los enlaces
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const page = this.getAttribute('data-page');
        loadPage(page);
        
        // Cerrar el menú después de hacer clic en un enlace
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
        }
    });
});

// Carga por defecto la página de inicio
window.addEventListener('load', function() {
    loadPage('inicio'); 
});
//-----------------fin index----------------


//-----------------Inicio calculadora----------------



    
    const subjects = [
      { name: "Matematica", price: 100 },
      { name: "Fisica", price: 150 },
      { name: "Quimica", price: 200 },
      { name: "Ingrel", price: 120 }
    ];
  
   
    function populateSubjects(selectElement) {
      selectElement.innerHTML = `<option disabled selected>Elegir un Curso</option>`;
      subjects.forEach(subject => {
        const option = document.createElement('option');
        option.value = subject.price;
        option.textContent = `${subject.name} - $${subject.price} por clase`;
        selectElement.appendChild(option);
      });
    }
  
   
    document.getElementById('add-course').addEventListener('click', () => {
      const courseRow = document.createElement('div');
      courseRow.classList.add('subject-row', 'row', 'align-items-center');
      courseRow.innerHTML = `
        <div class="col-md-6">
          <select class="form-select subject-select" required></select>
        </div>
        <div class="col-md-3">
          <input type="number" class="form-control class-count" placeholder="Cantidad de Clases" min="1" required>
        </div>
        <div class="col-md-3">
          <button type="button" class="btn btn-danger remove-course">Eliminar</button>
        </div>
      `;
      document.getElementById('course-container').appendChild(courseRow);
  
      const selectElement = courseRow.querySelector('.subject-select');
      populateSubjects(selectElement);
  
   
      courseRow.querySelector('.remove-course').addEventListener('click', () => {
        courseRow.remove();
      });
    });
  
 
    document.querySelectorAll('.remove-course').forEach(button => {
      button.addEventListener('click', (e) => {
        e.target.closest('.subject-row').remove();
      });
    });
  

    document.getElementById('course-form').addEventListener('submit', (e) => {
      e.preventDefault(); 
  
      let total = 0;
      document.querySelectorAll('.subject-row').forEach(row => {
        const pricePerClass = parseFloat(row.querySelector('.subject-select').value) || 0;
        const classCount = parseInt(row.querySelector('.class-count').value) || 0;
        total += pricePerClass * classCount;
      });
  
      const installments = parseInt(document.getElementById('payment-method').value);
      let interestRate = 0;
  
      switch (installments) {
        case 3:
          interestRate = 0.05;
          break;
        case 6:
          interestRate = 0.10;
          break;
        case 12:
          interestRate = 0.15;
          break;
      }
  
      const finalAmount = total + (total * interestRate);
      const resultDiv = document.getElementById('result');
      resultDiv.style.display = 'block';
      resultDiv.innerHTML = `
        Total: $${total.toFixed(2)}<br>
        Cantidad de Cuotas: ${installments}<br>
        Intereses: ${(interestRate * 100).toFixed(2)}%<br>
        Pago Final: $${finalAmount.toFixed(2)}
      `;
    });
  
  
    populateSubjects(document.querySelector('.subject-select'));

  


//-----------------fin calculadora----------------

});