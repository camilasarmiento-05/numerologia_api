// Tabla de conversión letra → número (numerología pitagórica)
const TABLA_LETRAS = {
  a: 1, j: 1, s: 1,
  b: 2, k: 2, t: 2,
  c: 3, l: 3, u: 3,
  d: 4, m: 4, v: 4,
  e: 5, n: 5, w: 5,
  f: 6, o: 6, x: 6,
  g: 7, p: 7, y: 7,
  h: 8, q: 8, z: 8,
  i: 9, r: 9
};

const VOCALES = ['a', 'e', 'i', 'o', 'u'];

// Números maestros que no se reducen más (11, 22, 33)
const NUMEROS_MAESTROS = [11, 22, 33];

/**
 * Quita tildes/acentos y pasa a minúsculas, para que "José" se lea igual que "jose".
 */
function normalizarTexto(texto) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/**
 * Suma los dígitos de un número hasta dejarlo en un solo dígito,
 * a menos que en el camino aparezca un número maestro (11, 22, 33).
 */
function reducirNumero(numero) {
  let n = numero;

  while (n > 9 && !NUMEROS_MAESTROS.includes(n)) {
    n = String(n)
      .split('')
      .reduce((suma, digito) => suma + Number(digito), 0);
  }

  return n;
}

/**
 * Número de Camino de Vida: se calcula sumando todos los dígitos
 * de la fecha de nacimiento (día + mes + año) y reduciendo el resultado.
 */
function calcularNumeroVida(fechaNacimiento) {
  const fecha = new Date(fechaNacimiento);

  const dia = fecha.getDate();
  const mes = fecha.getMonth() + 1;
  const anio = fecha.getFullYear();

  const todosLosDigitos = `${dia}${mes}${anio}`
    .split('')
    .reduce((suma, digito) => suma + Number(digito), 0);

  return reducirNumero(todosLosDigitos);
}

/**
 * Número de Expresión: se calcula sumando el valor numérico
 * de TODAS las letras del nombre completo.
 */
function calcularNumeroExpresion(nombreCompleto) {
  const texto = normalizarTexto(nombreCompleto);

  const suma = texto
    .split('')
    .filter((caracter) => TABLA_LETRAS[caracter] !== undefined)
    .reduce((total, letra) => total + TABLA_LETRAS[letra], 0);

  return reducirNumero(suma);
}

/**
 * Número del Alma: se calcula sumando solo el valor numérico
 * de las VOCALES del nombre completo.
 */
function calcularNumeroAlma(nombreCompleto) {
  const texto = normalizarTexto(nombreCompleto);

  const suma = texto
    .split('')
    .filter((caracter) => VOCALES.includes(caracter))
    .reduce((total, letra) => total + TABLA_LETRAS[letra], 0);

  return reducirNumero(suma);
}

module.exports = {
  reducirNumero,
  calcularNumeroVida,
  calcularNumeroExpresion,
  calcularNumeroAlma
};
