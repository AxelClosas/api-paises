window.addEventListener('load', () => {
  let contador = 1
  const container = document.getElementById("contenedor-gini")
  const buttonAgregar = document.createElement('button')
  const contenedorBtnGini = document.createElement('div')

  contenedorBtnGini.classList.add('contenedorBtnGini')

  buttonAgregar.textContent = 'Agregar GINI'
  buttonAgregar.type = 'button'
  buttonAgregar.onclick = agregarGini
  buttonAgregar.classList.add('btnAgregarGini')
  contenedorBtnGini.appendChild(buttonAgregar)

  const buttonEliminar = document.createElement('button')
  buttonEliminar.textContent = 'Eliminar GINI'
  buttonEliminar.type = 'button'
  buttonEliminar.onclick = eliminarGini
  buttonEliminar.classList.add('btnEliminarGini')
  contenedorBtnGini.appendChild(buttonEliminar)

  container.appendChild(contenedorBtnGini)

  function agregarGini() {  
    const div = document.createElement("div")
    div.classList.add("item-gini")

    div.innerHTML = `
    
      <div>
        <label for="gini[${contador}][anio]">Año</label>
        <input type="number" id="gini[${contador}][anio]" name="gini[${contador}][anio]" placeholder="Ej: 2024" required>
      </div>
      <div>
        <label for="gini[${contador}][valor]">Valor</label>
        <input type="number" step="0.1" id="gini[${contador}][valor]" name="gini[${contador}][valor]" placeholder="Ej: 45.4" required>
      </div>
    
    `
    container.insertBefore(div, contenedorBtnGini)
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

/*
<div class="item-gini">
  <div>
    <label for="gini[0][anio]">Año</label>
    <input type="number" id="gini[0][anio]" name="gini[0][anio]" placeholder="Ej: 2024">
  </div>
  <div>
    <label for="gini[0][valor]">Valor</label>
    <input type="number" step="0.1" id="gini[0][valor]" name="gini[0][valor]" placeholder="Ej: 45.4">
  </div>
</div>
*/