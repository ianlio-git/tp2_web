document.addEventListener('DOMContentLoaded', () => {
    //-----------index-------------///
    // Mobile menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    function ajustarMargen() {
        const navbar = document.querySelector('nav'); 
        const mainContent = document.getElementById('main-content');
        const alturaNavbar = navbar.offsetHeight;
        mainContent.style.marginTop = `${alturaNavbar + 40}px`; 
    }
    
    window.onload = ajustarMargen;
    window.onresize = ajustarMargen;

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    document.addEventListener('click', (event) => {
        if (mobileMenu) {
            const isClickInsideMenu = mobileMenu.contains(event.target) || menuToggle.contains(event.target);
            if (!isClickInsideMenu && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
            }
        }
    });

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
                initPageScripts();
            })
            .catch(error => {
                document.getElementById('main-content').innerHTML = `<h1>Error</h1><p>${error.message}</p>`;
            });
    }

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            loadPage(page);
            
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
            }
        });
    });

    window.addEventListener('load', function() {
        loadPage('inicio'); 
    });
    //-----------fin index-------------///

    // Inicializar scripts específicos de cada página

    //-----------funcion para scripts de cada pagina-------------///
    function initPageScripts() {
        //-----------reservas------------------//
        // Para la página de reservas
        const reservationForm = document.getElementById('reservation-form');
        if (reservationForm) {
            // Cargar materias y docentes
            populateSubjects();

            reservationForm.addEventListener('submit', (e) => {
                e.preventDefault();
                calculateTotal(); // Llama a la función para calcular el total en el envío

                // Mostrar el botón de reservar después de calcular el costo
                const reserveButton = document.getElementById('reserve-button');
                reserveButton.classList.remove('hidden');
                reserveButton.addEventListener('click', () => {
                    alert('Reserva realizada con éxito'); // Aquí puedes agregar la lógica para procesar la reserva
                    //---------------------futura funcionalidad---------------------//
                });
            });

            // Mostrar la sección de pago cuando haya un total calculado
            reservationForm.addEventListener('change', () => {
                document.getElementById('payment-section').classList.remove('hidden');
                calculateTotal(); // Vuelve a calcular el total cuando hay un cambio
            });
        }
    }

    // Función para calcular el total
    function calculateTotal() {
        const pricePerClass = parseFloat(document.querySelector('.subject-select').value) || 0;
        const classCount = parseInt(document.querySelector('.class-count').value) || 0;
        const total = pricePerClass * classCount;

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
        
        // Definir el porcentaje de impuesto
        const taxRate = 0.21; // 21%
        const taxAmount = finalAmount * taxRate; // Calcular el impuesto
        const totalWithTax = finalAmount + taxAmount; // Total después de impuestos

        const resultDiv = document.getElementById('result');
        resultDiv.style.display = 'block';
        resultDiv.innerHTML = `
            <strong>Total: </strong>$${total.toFixed(2)}<br>
            <strong>Cantidad de Cuotas: </strong>${installments}<br>
            <strong>Intereses: </strong>${(interestRate * 100).toFixed(2)}%<br>
            <strong>Pago Final: </strong>$${finalAmount.toFixed(2)}<br>
            <strong>Impuesto (21%): </strong>$${taxAmount.toFixed(2)}<br>
            <strong>Total con Impuestos: </strong>$${totalWithTax.toFixed(2)}
        `;
    }

    // Funciones para cargar materias y docentes
    let subjects = []; // Array para almacenar las materias

    // Cargar las materias desde el archivo JSON
    fetch('../json/clases.json')
        .then(response => response.json())
        .then(data => {
            subjects = data;
            populateSubjects(); // Llamar a la función para llenar las materias
        })
        .catch(error => console.error('Error al cargar el JSON:', error));

    function populateSubjects() {
        const subjectSelect = document.querySelector('.subject-select');
        subjectSelect.innerHTML = `<option disabled selected>Elegir un Curso</option>`;
        subjects.forEach(subject => {
            const option = document.createElement('option');
            option.value = subject.price; 
            option.textContent = `${subject.name} - $${subject.price} por clase`;
            subjectSelect.appendChild(option);
        });

        // Añadir evento para actualizar los docentes cuando se selecciona una materia
        subjectSelect.addEventListener('change', populateTeachers);
    }

    function populateTeachers() {
        const subjectSelect = document.querySelector('.subject-select');
        const teacherSelect = document.querySelector('.teacher-select');

        teacherSelect.innerHTML = `<option disabled selected>Elegir un Profesor</option>`;
        const selectedSubjectPrice = subjectSelect.value; // Obtiene el precio de la materia seleccionada
        const selectedSubject = subjects.find(s => s.price == selectedSubjectPrice);

        if (selectedSubject) {
            selectedSubject.docentes.forEach(teacher => {
                const option = document.createElement('option');
                option.value = teacher;
                option.textContent = teacher;
                teacherSelect.appendChild(option);
            });
        }
    }
    //-----------------fin reservas------------------//
});
