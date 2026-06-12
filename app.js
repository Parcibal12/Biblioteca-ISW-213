export const usuarios = [
    { id: 1, nombre: 'Jeanpol', deuda: 0 },
    { id: 2, nombre: 'Enrique', deuda: 0 },
    { id: 3, nombre: 'Fernando', deuda: 0 }
];

export const libros = [
    { id: 101, titulo: 'Harry Potter y la piedra filosofal', autor: 'J.K. Rowling', estado: 'prestado' },
    { id: 102, titulo: 'La rebelión en la granja', autor: 'George Orwell', estado: 'disponible' },
    { id: 103, titulo: '1984', autor: 'George Orwell', estado: 'disponible' },
    { id: 104, titulo: 'Cien años de soledad', autor: 'G. García Márquez', estado: 'disponible' },
    { id: 105, titulo: 'El código Da Vinci', autor: 'Dan Brown', estado: 'disponible' }
];

export let prestamos = [
    {
        id: 1,
        usuario_id: 1,
        libro_id: 101,
        fecha_limite: '2025-02-10',
        usuario_nombre: 'Jeanpol',
        libro_titulo: 'Harry Potter y la piedra filosofal'
    }
];

export let contadorIdPrestamo = 2;


export function usuarioTieneVencidos(idUsuario, listaPrestamos) {
    const hoy = new Date();
    return listaPrestamos.some(p => {
        if (p.usuario_id === idUsuario) {
            const vencimiento = new Date(p.fecha_limite);
            return vencimiento < hoy;
        }
        return false;
    });
}

export function registrarPrestamo(idUsuario, idLibro, listaUsuarios, listaLibros, listaPrestamos) {
    const usuario = listaUsuarios.find(u => u.id === idUsuario);
    const libro = listaLibros.find(l => l.id === idLibro);

    if (!usuario) throw new Error("Usuario no encontrado");
    if (!libro) throw new Error("Libro no encontrado.");
    if (libro.estado === 'prestado') throw new Error("ERROR: El libro ya está prestado");
    if (usuarioTieneVencidos(idUsuario, listaPrestamos)) throw new Error("BLOQUEO: El usuario tiene libros vencidos");



    const fechaVencimiento = new Date();
    const DIAS_PRESTAMO_PERMITIDOS = 7;
    fechaVencimiento.setDate(fechaVencimiento.getDate() + DIAS_PRESTAMO_PERMITIDOS);
    
    const nuevoPrestamo = {
        id: contadorIdPrestamo++,
        usuario_id: usuario.id,
        libro_id: libro.id,
        fecha_limite: fechaVencimiento.toISOString().split('T')[0],
        usuario_nombre: usuario.nombre,
        libro_titulo: libro.titulo
    };
    
    listaPrestamos.push(nuevoPrestamo);
    libro.estado = 'prestado';
    return nuevoPrestamo;
}


export function renderizarCatalogo(filtro = '') {
    const contenedor = document.getElementById('resultados-catalogo');
    if (!contenedor) return;
    
    contenedor.innerHTML = '';
    const librosFiltrados = libros.filter(l => 
        l.titulo.toLowerCase().includes(filtro.toLowerCase()) || 
        l.autor.toLowerCase().includes(filtro.toLowerCase())
    );

    librosFiltrados.forEach(libro => {
        contenedor.innerHTML += `<div class="card"><h3>${libro.titulo}</h3><span class="badge">${libro.estado}</span></div>`;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    if(document.getElementById('resultados-catalogo')) renderizarCatalogo();
});