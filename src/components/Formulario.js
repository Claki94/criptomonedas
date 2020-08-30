import React, {useEffect, useState} from 'react';
import styled from '@emotion/styled';
import axios from 'axios';
import PropTypes from 'prop-types';

import useMoneda from '../hooks/useMoneda';
import useCriptomoneda from '../hooks/useCriptomoneda';
import Error from './Error';


const Boton = styled.input`
    margin-top: 20px;
    font-weight: bold;
    font-size: 20px;
    padding: 10px;
    background-color: #66A2FE;
    border: none;
    width: 100%;
    border-radius: 10px;
    color: #FFF;
    transition: background-color .3s ease;

    &:hover {
        background-color: #326AC0;
        cursor: pointer;
    }
`;

const Formulario = ({guardarCriptomoneda, guardarMoneda}) => {

    // Opciones de monedas pasadas a useMoneda
    const MONEDAS = [
        {codigo: 'USD', nombre: 'Dolar de Estados Unidos'},
        {codigo: 'MXN', nombre: 'Peso Mexicano'},
        {codigo: 'EUR', nombre: 'Euro'},
        {codigo: 'GBP', nombre: 'Libra Esterlina'}
    ];

    // State de opciones de criptomonedas
    const [listaCripto, actualizarListaCripto] = useState([]);

    // State de error de validacion
    const [error, guardarError] = useState(false);

    // Uso de valores retornados de nuestro hook personalizado useMoneda
    const [moneda, SelectMonedas] = useMoneda('Elige tu Moneda', '', MONEDAS);

    // Uso de valores retornados de nuestro hook personalizado useCriptomoneda
    const [criptomoneda, SelectCripto] = useCriptomoneda('Elige tu criptomoneda', '', listaCripto);

    // useEffect que se ejecuta con la carga del componente para obtener las opciones de criptomonedas de una API
    useEffect(() => {

        // Funcion que consulta a la API (asíncrono)
        const consultarAPI = async () => {
            const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';
            const resultado = await axios.get(url);
            
            actualizarListaCripto(resultado.data.Data);
        }

        consultarAPI();

    }, []);

    // Cuando el usuario presiona en submit cotizamos la moneda
    const handleSubmit = e => {
        e.preventDefault();

        // Validamos el formulario
        if(!moneda.trim() || !criptomoneda.trim()) {
            guardarError(true);
            return;
        }

        guardarError(false);

        // pasar los datos al componente principal
        guardarMoneda(moneda);
        guardarCriptomoneda(criptomoneda);
    }

    return ( 
        <form onSubmit={handleSubmit}>
            {error ? <Error mensaje="Todos los campos son obligatorios" /> : null}

            <SelectMonedas />
            <SelectCripto />
            <Boton 
                type="submit"
                value="Calcular"
            />
        </form>
    );
}

Formulario.propTypes = {
    guardarCriptomoneda: PropTypes.func.isRequired,
    guardarMoneda: PropTypes.func.isRequired
}

export default Formulario;