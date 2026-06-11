// logicaBiblioteca.js
export function registrarPrestamo(usuario, libro, prestamosActivos, fechaActual) {
    if (!usuario) throw new Error("Usuario inexistente");
    if (!libro) throw new Error("Libro inexistente");
    
    if (libro.estado === 'prestado') throw new Error("El libro ya está prestado");

    const tieneVencidos = prestamosActivos.some(p => {
        return p.usuario_id === usuario.id && new Date(p.fecha_limite) < new Date(fechaActual);
    });

    if (tieneVencidos) {
        throw new Error("Alerta: El usuario tiene libros vencidos");
    }

    libro.estado = 'prestado';
    return true;
}



export function procesarDevolucion(idPrestamo, prestamosActivos, catalogoLibros) {
    const prestamoIndex = prestamosActivos.findIndex(p => p.id === idPrestamo);
    if (prestamoIndex === -1) return false;
    const prestamo = prestamosActivos[prestamoIndex];
    const libro = catalogoLibros.find(l => l.id === prestamo.libro_id);
    
    if (libro) {
        libro.estado = 'disponible';
        prestamosActivos.splice(prestamoIndex, 1);
        return true;
    }
    return false;

}