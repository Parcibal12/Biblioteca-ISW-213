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


export function reservarLibro(usuario, libro, listaEspera) {
    if (libro.estado === 'prestado') {
        const reservaExistente = listaEspera.some(reserva => 
            reserva.usuario_id === usuario.id && reserva.libro_id === libro.id
        );

        if (!reservaExistente) {
            listaEspera.push({
                usuario_id: usuario.id,
                libro_id: libro.id

            });
            return true;

        }
    }
    return false;
}

export function calcularMultas(prestamosActivos, usuarios, fechaActualStr, montoPorDia) {
    const fechaActual = new Date(fechaActualStr);

    prestamosActivos.forEach(prestamo => {
        const fechaLimite = new Date(prestamo.fecha_limite);
        
        if (fechaActual > fechaLimite) {

            const diferenciaMs = fechaActual - fechaLimite;
            const diasRetraso = Math.floor(diferenciaMs / (1000 * 60 * 60 * 24));
            
            if (diasRetraso > 0) {
                const usuario = usuarios.find(u => u.id === prestamo.usuario_id);
                if (usuario) {
                    usuario.deuda += (diasRetraso * montoPorDia);

                }
            }
        }
        
    });
    
    return true;
}