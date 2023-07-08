
 // Il tipo di aereo , utilizzato in tutta l'app.
function Aereo(
  id,
  tipo,
  numRighe,
  numPostiPerRighe,
  posti = [],
  validoPosti = numRighe * numPostiPerRighe,
) {
  this.id = id;
  this.tipo = tipo;
  this.numRighe = numRighe;
  this.numPostiPerRighe = numPostiPerRighe;
  this.posti = posti;
  this.validoPosti = validoPosti;
}

export { Aereo };

  
  







