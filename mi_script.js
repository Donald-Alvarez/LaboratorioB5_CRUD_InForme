
// Autenticación de Firebase
firebase.initializeApp({
    apiKey: "Tu-API-Key",
    authDomain: "Tu-Dominio.firebaseapp.com",
    projectId: "laboratoriob5-49564",
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
    var softwareInstalado = document.getElementById('softwareInstalado').value;
    var actualizaciones = document.getElementById('actualizaciones').value;
    var usuarios = document.getElementById('usuarios').value;
    var direccionip = document.getElementById('direccionip').value; // Obtener la dirección IP

    db.collection("equipos").add({
        pc: pc,
        observacion: observacion,
        procesador: procesador,
        memoriaRAM: memoriaRAM,
        sistemaOperativo: sistemaOperativo,
        servidor: servidor,
        softwareInstalado: softwareInstalado,
        actualizaciones: actualizaciones,
        usuarios: usuarios,
        direccionip: direccionip // Agregar la dirección IP
    })
.then(function (docRef) {
console.log("Document written with ID: ", docRef.id);
Swal.fire({
    title: "Registro guardado",
    icon: "success", // Ícono de éxito
    timer: 2000, // Duración en milisegundos (2 segundos)
    showConfirmButton: false // No mostrar el botón "OK"
});
document.getElementById('pc').value = '';
document.getElementById('observacion').value = '';
document.getElementById('procesador').value = '';
document.getElementById('memoriaRAM').value = '';
document.getElementById('sistemaOperativo').value = '';
document.getElementById('servidor').value = '';
document.getElementById('softwareInstalado').value = '';
document.getElementById('actualizaciones').value = '';
document.getElementById('usuarios').value = '';
})
.catch(function (error) {
Swal.fire("Error", "Error al agregar documento: " + error, "error");
});
}


// LEER LOS DATOS DE FIRESTORE
var tablaDatos = document.getElementById('tablaDatos');
db.collection("equipos").onSnapshot((querySnapshot) => {
    tablaDatos.innerHTML = '';
    querySnapshot.forEach((doc) => {
        tablaDatos.innerHTML += `
        <tr>
            <td>${doc.data().pc}</td>
            <td>${doc.data().procesador}</td>
            <td>${doc.data().memoriaRAM}</td>
            <td>${doc.data().sistemaOperativo}</td>
            <td>${doc.data().servidor}</td>
            <td>${doc.data().softwareInstalado}</td>
            <td>${doc.data().actualizaciones}</td>
            <td>${doc.data().usuarios}</td>
            <td>${doc.data().direccionip}</td> <!-- Agrega la dirección IP -->
            <td>
                <button class="btn btn-danger" onclick="borrar('${doc.id}')"><i class="bi bi-trash3-fill"></i></button>
                <button class="btn btn-warning" onclick="editar('${doc.id}', '${doc.data().pc}', 
                '${doc.data().observacion}', '${doc.data().procesador}', '${doc.data().memoriaRAM}',
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
    document.getElementById("softwareInstalado_editar").value = softwareInstalado;
    document.getElementById("actualizaciones_editar").value = actualizaciones;
    document.getElementById("usuarios_editar").value = usuarios;
    document.getElementById("direccionip_editar").value = direccionip; // Agregar la dirección IP

    // Abre el modal para editar
    var editarModal = new bootstrap.Modal(document.getElementById("editarDatosModal"));
    editarModal.show();

    // Define la función para guardar los cambios
    document.getElementById("guardarEdicionBtn").onclick = function () {
        const pc_editar = document.getElementById("pc_editar").value;
        const observacion_editar = document.getElementById("observacion_editar").value;
        const procesador_editar = document.getElementById("procesador_editar").value;
        const memoriaRAM_editar = document.getElementById("memoriaRAM_editar").value;
        const sistemaOperativo_editar = document.getElementById("sistemaOperativo_editar").value;
        const servidor_editar = document.getElementById("servidor_editar").value;
        const softwareInstalado_editar = document.getElementById("softwareInstalado_editar").value;
        const actualizaciones_editar = document.getElementById("actualizaciones_editar").value;
        const usuarios_editar = document.getElementById("usuarios_editar").value;
        const direccionip_editar = document.getElementById("direccionip_editar").value; // Obtener la dirección IP editada

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
            direccionip: direccionip_editar // Actualizar la dirección IP
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
