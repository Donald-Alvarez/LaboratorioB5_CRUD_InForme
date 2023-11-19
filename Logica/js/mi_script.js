// Autenticación de Firebase
firebase.initializeApp({
    apiKey: "AIzaSyDrLMma3AOYbDyiSw6pGUWbG-vrW7eEkSI",
    authDomain: "laboratoriob5v2.firebaseapp.com",
    projectId: "laboratoriob5v2",
    storageBucket: "laboratoriob5v2.appspot.com",
    messagingSenderId: "183463752152",
    appId: "1:183463752152:web:c8450f9bb2c475bc2802ad"
});

// Inicializar Firestore
var db = firebase.firestore();

document.getElementById("guardarDatosBtn").addEventListener("click", guardar);

// AGREGAR DATOS A FIREBASE
function guardar() {
    var pc = document.getElementById('pc').value;
    var observacion = document.getElementById('observacion').value;
    var procesador = document.getElementById('procesador').value;
    var memoriaRAM = document.getElementById('memoriaRAM').value;
    var sistemaOperativo = document.getElementById('sistemaOperativo').value;
    var servidor = document.getElementById('servidor').value;
    var actualizaciones = document.getElementById('actualizaciones').value;
    var usuarios = document.getElementById('usuarios').value;

    // Obtener los valores de los cuatro octetos
    var octeto1 = document.getElementById('octeto1').value;
    var octeto2 = document.getElementById('octeto2').value;
    var octeto3 = document.getElementById('octeto3').value;
    var octeto4 = document.getElementById('octeto4').value;

    // Unir los octetos para formar la dirección IP
    var direccionip = octeto1 + '.' + octeto2 + '.' + octeto3 + '.' + octeto4;

    // Obtener software instalado seleccionado
    var checkboxes_seleccionados = document.querySelectorAll('input[name="software"]:checked');
    var softwareInstalado = Array.from(checkboxes_seleccionados).map(checkbox => checkbox.value).join(", ");

    // Verificar si el nombre de la PC ya existe en la tabla
    var pcExistente = Array.from(document.querySelectorAll("#tablaDatos td:first-child"))
        .map(cell => cell.textContent.trim())
        .includes(pc);

    if (pcExistente) {
        // Muestra el mensaje de error si la PC ya existe
        Swal.fire("Error", "El nombre de la PC ya existe. Por favor, elige otro nombre.", "error");
    } else if (pc === '' || procesador === '' || memoriaRAM === '' || sistemaOperativo === '' || servidor === '' || actualizaciones === '' || usuarios === '' || direccionip === '') {
        // Muestra el mensaje de error si hay campos vacíos
        Swal.fire("Campos vacíos", "Por favor, completa todos los campos antes de guardar.", "warning");
    } else {
        // Agrega la PC si no hay errores
        db.collection("equipos").add({
            pc: pc,
            observacion: observacion,
            procesador: procesador,
            memoriaRAM: memoriaRAM,
            sistemaOperativo: sistemaOperativo,
            servidor: servidor,
            actualizaciones: actualizaciones,
            usuarios: usuarios,
            direccionip: direccionip,
            softwareInstalado: softwareInstalado  // Agregar el softwareInstalado
        })
        .then(function (docRef) {
            console.log("Document written with ID: ", docRef.id);

            // Limpiar los campos del formulario
            document.getElementById('formularioDatos').reset();

            Swal.fire({
                title: "Registro guardado",
                icon: "success"
            });
        })
        .catch(function (error) {
            Swal.fire("Error", "Error al agregar documento: " + error, "error");
        });
    }
}


// Fucion validar nombre PC
function validarNombrePC() {
    var pc = document.getElementById('pc').value;

    // Verificar si el nombre de la PC ya existe en la tabla
    var pcExistente = Array.from(document.querySelectorAll("#tablaDatos td:first-child"))
        .map(cell => cell.textContent.trim())
        .includes(pc);

    if (pcExistente) {
        // Muestra el mensaje de error debajo del campo de entrada
        document.getElementById('errorPc').innerText = "El nombre de la PC ya existe";
    } else {
        // Si no hay errores, limpia el mensaje de error
        document.getElementById('errorPc').innerText = "";
    }
}
// LEER LOS DATOS DE FIRESTORE
var tablaDatos = document.getElementById('tablaDatos');
db.collection("equipos")
    .orderBy('pc') // Ordenar por el campo 'pc' de forma ascendente
    .onSnapshot((querySnapshot) => {
        tablaDatos.innerHTML = '';
        querySnapshot.forEach((doc) => {
            // Determinamos si hay observaciones y aplicamos el color rojo si es el caso
            var observacion = doc.data().observacion || '';
            var claseEstilo = observacion.trim() !== '' ? 'table-danger' : '';

            tablaDatos.innerHTML += `
            <tr class="${claseEstilo}">
                <td>${doc.data().pc}</td>
                <td>${doc.data().procesador}</td>
                <td>${doc.data().memoriaRAM}</td>
                <td>${doc.data().sistemaOperativo}</td>
                <td>${doc.data().servidor}</td>
                <td>${doc.data().softwareInstalado}</td>
                <td>${doc.data().actualizaciones}</td>
                <td>${doc.data().usuarios}</td>
                <td>${doc.data().direccionip}</td> 
                <td>${observacion}</td> 
                <td>
                    <button class="btn btn-danger" onclick="borrar('${doc.id}')"><i class="bi bi-trash3-fill"></i></button>
                    <button class="btn btn-warning" onclick="editar('${doc.id}', '${doc.data().pc}', 
                    '${observacion}', '${doc.data().procesador}', '${doc.data().memoriaRAM}',
                     '${doc.data().sistemaOperativo}', '${doc.data().servidor}', '${doc.data().softwareInstalado}',
                      '${doc.data().actualizaciones}', '${doc.data().usuarios}', '${doc.data().direccionip}')"><i class="icon bi bi-pencil-square"></i></button>
                </td>
            </tr>
            `;
        });
    });

// BORRAR LOS DATOS DE FIRESTORE
function borrar(id) {
    Swal.fire({
        title: "¿Está seguro?",
        text: "Una vez eliminado, no podrá recuperar el registro.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            db.collection('equipos').doc(id).delete()
                .then(function() {
                    console.log('Document successfully deleted!');
                    Swal.fire("¡Eliminado!", "El registro ha sido eliminado.", "success");
                })
                .catch(function(error) {
                    console.error("Error removing document: ", error);
                    Swal.fire("Error", "Ha ocurrido un error al eliminar el registro.", "error");
                });
        }
    });
}
function editar(id, pc, observacion, procesador, memoriaRAM, sistemaOperativo, servidor, softwareInstalado, actualizaciones, usuarios, direccionip) {
    // Llenar los campos del formulario de edición con los datos actuales
    document.getElementById("pc_editar").value = pc;
    document.getElementById("observacion_editar").value = observacion;
    document.getElementById("procesador_editar").value = procesador;
    document.getElementById("memoriaRAM_editar").value = memoriaRAM;
    document.getElementById("sistemaOperativo_editar").value = sistemaOperativo;
    document.getElementById("servidor_editar").value = servidor;
    document.getElementById("actualizaciones_editar").value = actualizaciones;
    document.getElementById("usuarios_editar").value = usuarios;

    // Separar la dirección IP en octetos y llenar los campos correspondientes
    var octetos = direccionip.split('.');
    document.getElementById("octeto1_editar").value = octetos[0];
    document.getElementById("octeto2_editar").value = octetos[1];
    document.getElementById("octeto3_editar").value = octetos[2];
    document.getElementById("octeto4_editar").value = octetos[3];

    // Selección de opciones en los campos select y checkboxes del software instalado
    document.getElementById("procesador_editar").value = procesador;
    document.getElementById("sistemaOperativo_editar").value = sistemaOperativo;
    document.getElementById("servidor_editar").value = servidor;

    var checkboxes_editar = document.getElementsByName("software_editar");
    checkboxes_editar.forEach(function (checkbox) {
        checkbox.checked = softwareInstalado.includes(checkbox.value);
    });

    // Abre el modal para editar
    var editarModal = new bootstrap.Modal(document.getElementById("editarDatosModal"));
    editarModal.show();

    // Define la función para guardar los cambios
    document.getElementById("guardarEdicionBtn").onclick = function () {
        // Obtener valores actualizados del formulario
        const pc_editar = document.getElementById("pc_editar").value;
        const observacion_editar = document.getElementById("observacion_editar").value;
        const procesador_editar = document.getElementById("procesador_editar").value;
        const memoriaRAM_editar = document.getElementById("memoriaRAM_editar").value;
        const sistemaOperativo_editar = document.getElementById("sistemaOperativo_editar").value;
        const servidor_editar = document.getElementById("servidor_editar").value;

        // Obtener software instalado seleccionado
        const checkboxes_seleccionados = document.querySelectorAll('input[name="software_editar"]:checked');
        const softwareInstalado_editar = Array.from(checkboxes_seleccionados).map(checkbox => checkbox.value).join(", ");

        const actualizaciones_editar = document.getElementById("actualizaciones_editar").value;
        const usuarios_editar = document.getElementById("usuarios_editar").value;
        const octeto1_editar = document.getElementById("octeto1_editar").value;
        const octeto2_editar = document.getElementById("octeto2_editar").value;
        const octeto3_editar = document.getElementById("octeto3_editar").value;
        const octeto4_editar = document.getElementById("octeto4_editar").value;

        // Unir los octetos para formar la dirección IP
        const direccionip_editar = `${octeto1_editar}.${octeto2_editar}.${octeto3_editar}.${octeto4_editar}`;

        // Actualizar los datos en la base de datos
        var datosRef = db.collection("equipos").doc(id);

        datosRef.update({
            pc: pc_editar,
            observacion: observacion_editar,
            procesador: procesador_editar,
            memoriaRAM: memoriaRAM_editar,
            sistemaOperativo: sistemaOperativo_editar,
            servidor: servidor_editar,
            softwareInstalado: softwareInstalado_editar,
            actualizaciones: actualizaciones_editar,
            usuarios: usuarios_editar,
            direccionip: direccionip_editar
        })
            .then(function () {
                editarModal.hide(); // Cierra el modal después de guardar
                Swal.fire("Registro Editado", "Los cambios se han guardado con éxito.", "success");
            })
            .catch(function (error) {
                Swal.fire("Error", "Error al actualizar: " + error, "error");
            });
    };
}


// BUSCAR LOS DATOS EN LA TABLA
document.querySelector("#busqueda").onkeyup = function() {
    $filtro_tabla("#tablaDatos", this.value);
}

$filtro_tabla = function(id, value) {
    var filas = document.querySelectorAll(id + ' tr');

    for (var i = 0; i < filas.length; i++) {
        var mostrarFila = false;

        var fila = filas[i];
        fila.style.display = 'none';

        for (var x = 0; x < fila.childElementCount; x++) {
            if (fila.children[x].textContent.toLowerCase().indexOf(value.toLowerCase().trim()) > -1) {
                mostrarFila = true;
                break;
            }
        }

        if (mostrarFila) {
            fila.style.display = null;
        }
    }
}
//Campo del software seleccionado 
function actualizarSoftwareInstalado(checkbox) {
    var softwareInstalado = document.getElementById("softwareInstalado");

    if (checkbox.checked) {
        // Agregar el valor del checkbox al campo de texto
        softwareInstalado.value += checkbox.value + ', ';
    } else {
        // Eliminar el valor del checkbox del campo de texto
        softwareInstalado.value = softwareInstalado.value.replace(checkbox.value + ', ', '');
    }
}
 //Campo de Direccion IP
function validarEntrada(input) {
    // Eliminar caracteres no numéricos
    input.value = input.value.replace(/[^0-9]/g, '');

    // Validar la longitud máxima
    if (input.value.length > input.maxLength) {
        input.value = input.value.slice(0, input.maxLength);
    }
}





