let indiceVisible = 0;

function alternarImagen() {
    const imagenes = document.querySelectorAll('.image-container img');
    
    imagenes.forEach(img => img.style.display = 'none');
    imagenes[indiceVisible].style.display = 'block';
    
    indiceVisible = (indiceVisible + 1) % imagenes.length;
}

alternarImagen();

setInterval(alternarImagen, 3000);
