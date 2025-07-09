import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import type { CoinProps } from '../home';

interface ResponseData {
    data: CoinProps[]
}

// interface ErrorData {
//     data: CoinProps[]
// }

type dataProps = ResponseData //| ErrorData;

export function Detail(){

    const {cripto} = useParams();
    const navigate = useNavigate();

    const [coin, setCoin] = useState<CoinProps>();

    useEffect(() => {
        try {
            fetch(`https://rest.coincap.io/v3/assets?ids=${cripto}&apiKey=04ed85be2ad375685d2a6680ba6b975039652fd47df96f2a6be85bdb226fbbf2`)
            .then(response => response.json())
            .then((data: dataProps) => {
                
                if(!data.data || data.data.length === 0) {
                    navigate("/");
                    return;
                }

                const price = Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD"
                });
                
                const priceCompact = Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                    notation: "compact"
                });

                const coin = data.data[0];

                const resultData = {
                    ...coin,
                    formatedPrice : price.format(Number(coin.priceUsd)),
                    formatedMarket: priceCompact.format(Number(coin.marketCapUsd)),
                    formatedVolume: priceCompact.format(Number(coin.volumeUsd24Hr))
                }

                setCoin(resultData);
            })

        } catch (error) {
            console.log(error);
            navigate('/');
        }
    }, [cripto])

    return(
        <>
            <h1>Página detalhes da moeda {cripto}</h1>
        </>
    )
}