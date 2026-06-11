import { registrarPrestamo, procesarDevolucion, reservarLibro } from './logicaBiblioteca.js';

describe('HU-02: Registrar el préstamo de un libro físico', () => {
    const fechaActual = '2026-05-23T10:00:00'; 

    test('CA1: Debe registrar el préstamo y cambiar el estado a prestado', () => {
        const usuario = { id: 1, nombre: 'Jeanpol' };
        const libro = { id: 102, titulo: '1984', estado: 'disponible' };
        const prestamos = [];

        const resultado = registrarPrestamo(usuario, libro, prestamos, fechaActual);

        expect(resultado).toBe(true);
        expect(libro.estado).toBe('prestado');
    });

    test('CA2: Debe mostrar alerta de bloqueo si el usuario tiene libros vencidos', () => {
        const usuario = { id: 1, nombre: 'Jeanpol' };
        const libro = { id: 103, titulo: 'Cien años de soledad', estado: 'disponible' };
        const prestamos = [
            { usuario_id: 1, fecha_limite: '2026-05-20T10:00:00' }
        ];

        expect(() => {
            registrarPrestamo(usuario, libro, prestamos, fechaActual);
        }).toThrow('Alerta: El usuario tiene libros vencidos');
    });

    test('Regla de negocio: Debe lanzar error si el libro ya está ocupado', () => {
        const usuario = { id: 2, nombre: 'Enrique' };
        const libro = { id: 101, titulo: 'Harry Potter', estado: 'prestado' };
        
        expect(() => {
            registrarPrestamo(usuario, libro, [], fechaActual);
        }).toThrow('El libro ya está prestado');
    });

    test('Regla de negocio: Debe lanzar error si faltan datos obligatorios', () => {
        expect(() => registrarPrestamo(null, { id: 102 }, [], fechaActual)).toThrow('Usuario inexistente');
        expect(() => registrarPrestamo({ id: 1 }, null, [], fechaActual)).toThrow('Libro inexistente');
    });
});


describe('HU-6: Registrar la devolución de un libro', () => {
    test('CA1: Debe actualizar el estado del libro a disponible al devolver', () => {
        const prestamos = [{ id: 1, libro_id: 101 }];
        const libros = [{ id: 101, estado: 'prestado' }];

        const resultado = procesarDevolucion(1, prestamos, libros);

        expect(resultado).toBe(true);
        expect(libros[0].estado).toBe('disponible');
        expect(prestamos.length).toBe(0);
    });
});


describe('HU-08: Reservar un libro prestado', () => {
    test('CA1: Debe agregar al usuario a la lista de espera si el libro no está disponible', () => {
        const usuario = { id: 3, nombre: 'Fernando' };
        const libro = { id: 101, estado: 'prestado' };
        const listaEspera = [];

        const resultado = reservarLibro(usuario, libro, listaEspera);

        expect(resultado).toBe(true);
        expect(listaEspera.length).toBe(1);
        expect(listaEspera[0].usuario_id).toBe(3);
        expect(listaEspera[0].libro_id).toBe(101);
    });
});