window.addEventListener('load', () => {
  let contador = 1
  const container = document.getElementById("contenedor-gini")
  const buttonAgregar = document.createElement('button')
  buttonAgregar.textContent = 'Nuevo gini'
  buttonAgregar.type = 'button'
  buttonAgregar.onclick = agregarGini
  container.appendChild(buttonAgregar)

  const buttonEliminar = document.createElement('button')
  buttonEliminar.textContent = 'Eliminar gini'
  buttonEliminar.type = 'button'
  buttonEliminar.onclick = eliminarGini
  container.appendChild(buttonEliminar)

  function agregarGini() {  
    const div = document.createElement("div")
    div.classList.add("item-gini")

    div.innerHTML = `
      <label for="gini[${contador}][anio]">Año</label>
      <input type="number" id="gini[${contador}][anio]" name="gini[${contador}][anio]" placeholder="Ej: 2024" required>
      <label for="gini[${contador}][valor]">Valor</label>
      <input type="number" step="0.1" id="gini[${contador}][valor]" name="gini[${contador}][valor]" placeholder="Ej: 45.4" required>
    `
    container.insertBefore(div, buttonAgregar)
    contador++
  }

  function eliminarGini() {
    if (contador > 1) {
      const items = container.getElementsByClassName('item-gini')
      items[items.length -1].remove()
      contador--
    }
  }
})