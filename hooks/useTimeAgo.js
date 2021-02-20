import { useEffect, useState } from "react"

// Guardamos en array la cantidad de segundos que hay en cada unidad de tiempo
const DATE_UNITS = [
  ["day", 86400],
  ["hour", 3600],
  ["minute", 60],
  ["second", 1],
]
// Recuperar la diferencia entre dos fechas (momento actual y momento en el que se escribió el devit pasado por parámetro)
const getDateDiffs = (timestamp) => {
  // Obtener la fecha actual
  const now = Date.now()
  // Calculamos la diferencia y lo dividimos entre 1000 para convertirlos a segundos
  const elapsed = (timestamp - now) / 1000

  // Recorremos la array de unidades para preparar el valor i unidad para API del navegador
  // Deconstruimos los indices unit y secondsInUnit de la array DATE_UNITS
  for (const [unit, secondsInUnit] of DATE_UNITS) {
    // Si el valor absoluto de la diferencia de tiempo es mayor al maximo de segundos de la unidad
    // O la unidad son segundos
    if (Math.abs(elapsed) > secondsInUnit || unit === "seconds") {
      // Dividimos el valor y lo redondeamos (OJO: Dará negativo porque es pasado: hace X xxxxx)
      // Math.floor redondea hacia abajo
      // Math.round redondea hacia arriba
      const value = Math.floor(elapsed / secondsInUnit)
      // Devolvemos la unidad calculada y el nombre de la unidad
      return { value, unit }
    }
  }
}

// Función principal para usar la API Relative time format del navegador
// Cada 5 segundos va a actualizar la información
export default function useTimeAgo(timestamp) {
  // Creamos el state para guardar el timeago y actualizarlo
  // Ponemos por defecto dentro del state la ejecución de la función creada anteriormente para calcular la diferencia de dias
  const [timeago, setTimeago] = useState(() => getDateDiffs(timestamp))

  // Creamos un useEffect para que cada 5 segundos se ejecute la función getDateDiffs y obtengamos el tiempo
  // Se va a ejecutar cada vez que timestamp cambie
  useEffect(() => {
    // Creamos un intervalo que se va a ejecutar cada 10 segundos
    const interval = setInterval(() => {
      // Guardamos dentro de la constante newTimeago el nuevo calculo del tiempo ejecutando la función anterior
      const newTimeago = getDateDiffs(timestamp)

      // Actualizamos el state para que vaya entrando otra vez al useEffect
      setTimeago(newTimeago)
    }, 5000)

    // Limpiamos el intervalo
    return () => clearInterval(interval)
  }, [timestamp])

  // Inicializamos API Relative time format del navegador en el idioma y estilo que queramos (short, narrow o long)
  const rtf = new Intl.RelativeTimeFormat("es", { style: "long" })

  // Obtenemos el valor i unidad del state timeago
  const { value, unit } = timeago

  // Formateamos la fecha mediante el API (parametros ej: -7, "day" = hace 7 días)
  return rtf.format(value, unit)
}
