import React, {useState, useEffect} from 'react';
import styled from '@emotion/styled';
import axios from 'axios';

import imagen from './img/cryptomonedas.png';
import Formulario from './components/Formulario';
import Cotizacion from './components/Cotizacion';
import Spinner from './components/Spinner/Spinner';

const Contenedor = styled.div`
  max-width: 900px;
  margin: 0 auto;
  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    column-gap: 2rem;
  }
`;

const Imagen = styled.img`
  max-width: 100%;
  margin-top: 5rem;
`;

const Heading = styled.h1`
  font-family: 'Bebas Neue', cursive;
  color: #FFF;
  text-align: left;
  font-weight: 700;
  font-size: 50px;
  margin-bottom: 50px;
  margin-top: 80px;

  &:after {
    content: '';
    width: 100px;
    height: 6px;
    background-color: #66A2F3;
    display: block;
  }
`;

function App() {

  // Crear el state
  const [moneda, guardarMoneda] = useState('');
  const [criptomoneda, guardarCriptomoneda] = useState('');
  const [cotizacion, guardarCotizacion] = useState({});
  const [cargando, guardarCargando] = useState(false);

  // Calculo de la cotizacion
  useEffect(() => {

    // evitamos la ejecucion de la primera carga del componente
    if(!moneda || !criptomoneda) return;

    const consultarAPI = async () => {
      const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;
      const resultado = await axios.get(url);

      // mostrar el spinner
      guardarCargando(true);

      // ocultar el spinner y mostrar el resultado
      setTimeout(() => {
        guardarCargando(false);
        guardarCotizacion(resultado.data.DISPLAY[criptomoneda][moneda]);
      }, 3000)

    }

    // consultar la API para obtener la cotizacion
    consultarAPI();

  }, [moneda, criptomoneda]);

  // Mostrar Spinner o Cotizacion
  let componente = (cargando) ? <Spinner /> : <Cotizacion cotizacion={cotizacion}/>;

  return (
    <Contenedor>
      <div>
        <Imagen 
          src={imagen}
          alt="Imagen cripto"
        />
      </div>
      <div>
        <Heading>Cotizar criptomonedas al instante</Heading>
        <Formulario 
          guardarMoneda={guardarMoneda}
          guardarCriptomoneda={guardarCriptomoneda}
        />
        
        {componente}
      </div>
    </Contenedor>
  );
}

export default App;
