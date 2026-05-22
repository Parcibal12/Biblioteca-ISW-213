const usuarios = [
    { id: 1, nombre: 'Jeanpol', deuda: 0 },
    { id: 2, nombre: 'Enrique', deuda: 0 },
    { id: 3, nombre: 'Fernando', deuda: 0 }
];

const libros = [
    { id: 101, titulo: 'Harry Potter y la piedra filosofal', autor: 'J.K. Rowling', estado: 'prestado' },
    { id: 102, titulo: 'La rebelión en la granja', autor: 'George Orwell', estado: 'disponible' },
    { id: 103, titulo: '1984', autor: 'George Orwell', estado: 'disponible' },
    { id: 104, titulo: 'Cien años de soledad', autor: 'G. García Márquez', estado: 'disponible' },
    { id: 105, titulo: 'El código Da Vinci', autor: 'Dan Brown', estado: 'disponible' }
];

let prestamos = [
    {
        id: 1,
        usuario_id: 1,
        libro_id: 101,
        fecha_limite: '2025-02-10',
        usuario_nombre: 'Jeanpol',
        libro_titulo: 'Harry Potter y la piedra filosofal'
    }
];

let contadorIdPrestamo = 2;

function mostrarVista(vista) {
    document.getElementById('vista-catalogo').style.display = 'none';
    document.getElementById('vista-gestion').style.display = 'none';
    document.getElementById('btn-catalogo').classList.remove('active');
    document.getElementById('btn-gestion').classList.remove('active');

    document.getElementById(`vista-${vista}`).style.display = 'block';
    document.getElementById(`btn-${vista}`).classList.add('active');

    if(vista === 'catalogo') renderizarCatalogo();
    if(vista === 'gestion') renderizarPrestamos();
}

function renderizarCatalogo(filtro = '') {
    const contenedor = document.getElementById('resultados-catalogo');
    contenedor.innerHTML = '';

    const librosFiltrados = libros.filter(libro => {
        const texto = filtro.toLowerCase();
        return libro.titulo.toLowerCase().includes(texto) || 
               libro.autor.toLowerCase().includes(texto);
    });

    if (librosFiltrados.length === 0) {
        contenedor.innerHTML = '<p>No se encontraron libros</p>';
        return;
    }

    librosFiltrados.forEach(libro => {
        const claseBadge = libro.estado === 'disponible' ? 'badge-disponible' : 'badge';
        contenedor.innerHTML += `
            <div class="card">
                <div class="card-info">
                    <h3>${libro.titulo} <span style="font-weight:normal; font-size:0.8em;">(ID: ${libro.id})</span></h3>
                    <p>Autor: ${libro.autor}</p>
                </div>
                <div>
                    <span class="badge ${claseBadge}">${libro.estado}</span>
                </div>
            </div>
        `;
    });
}

function buscarLibro() {
    const texto = document.getElementById('busqueda-libro').value;
    renderizarCatalogo(texto);
}

function registrarPrestamo() {
    const idUsuario = parseInt(document.getElementById('input-usuario').value);
    const idLibro = parseInt(document.getElementById('input-libro').value);

    if (!idUsuario || !idLibro) return alert("Ingresa ambos IDs");

    const usuario = usuarios.find(u => u.id === idUsuario);
    const libro = libros.find(l => l.id === idLibro);

    if (!usuario) return alert("Usuario no encontrado");
    if (!libro) return alert("Libro no encontrado.");
    
    if (libro.estado === 'prestado') return alert("ERROR: El libro ya está prestado");

    const tieneVencidos = prestamos.some(p => {
        if (p.usuario_id === idUsuario) {
            const hoy = new Date();
            const vencimiento = new Date(p.fecha_limite);
            return vencimiento < hoy;
        }
        return false;
    });

    if (tieneVencidos) {
        return alert("BLOQUEO: El usuario tiene libros vencidos pendientes");
    }

    const fechaHoy = new Date();
    const fechaVencimiento = new Date();
    fechaVencimiento.setDate(fechaHoy.getDate() + 7);

    prestamos.push({
        id: contadorIdPrestamo++,
        usuario_id: usuario.id,
        libro_id: libro.id,
        fecha_limite: fechaVencimiento.toISOString().split('T')[0], 
        usuario_nombre: usuario.nombre,
        libro_titulo: libro.titulo
    });

    libro.estado = 'prestado';

    alert(`Préstamo registrado con éxito, vence el: ${fechaVencimiento.toISOString().split('T')[0]}`);
    
    document.getElementById('input-usuario').value = '';
    document.getElementById('input-libro').value = '';
    renderizarPrestamos();
}

function renderizarPrestamos() {
    const contenedor = document.getElementById('lista-prestamos');
    contenedor.innerHTML = '';

    if(prestamos.length === 0) {
        contenedor.innerHTML = '<p style="text-align:center;">no hay préstamos activos</p>';
        return;
    }

    prestamos.forEach(p => {
        const hoy = new Date();
        const vencimiento = new Date(p.fecha_limite);
        
        const diferenciaTiempo = vencimiento - hoy;
        
        const MILISEGUNDOS_POR_DIA = 1000 * 60 * 60 * 24;
        const diasRestantes = Math.ceil(diferenciaTiempo / MILISEGUNDOS_POR_DIA);
 
        let estadoEtiqueta = 'A TIEMPO';
        let estiloEstado = 'border: 1px solid black; color: black; background: white;';

        if (diasRestantes < 0) {
            estadoEtiqueta = 'VENCIDO';
            estiloEstado = 'background-color: black; color: white;';
        } else if (diasRestantes <= 2) {
            estadoEtiqueta = 'POR VENCER';
        }

        contenedor.innerHTML += `
            <div class="card">
                <div class="card-info">
                    <h3>${p.libro_titulo}</h3>
                    <p><strong>Usuario:</strong> ${p.usuario_nombre}</p>
                    <p><strong>Vence:</strong> ${p.fecha_limite} (${diasRestantes} días)</p>
                    <div style="margin-top:5px;">
                        <span class="badge" style="${estiloEstado}">${estadoEtiqueta}</span>
                    </div>
                </div>
                <button onclick="devolverLibro(${p.id}, ${p.libro_id})" class="btn" style="font-size:0.8rem;">
                    Devolver
                </button>
            </div>
        `;
    });
}

function devolverLibro(idPrestamo, idLibro) {
    if(!confirm("¿Confirmar recepción del libro?")) return;

    prestamos = prestamos.filter(p => p.id !== idPrestamo);

    const libro = libros.find(l => l.id === idLibro);
    if (libro) libro.estado = 'disponible';

    alert("Devolución registradat stock actualizado");
    renderizarPrestamos();
}

renderizarCatalogo();