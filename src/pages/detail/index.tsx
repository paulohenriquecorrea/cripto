import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { CoinProps } from '../home';
import styles from './detail.module.css'

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
    const [loading, setLoading] = useState(true);

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
                setLoading(false);
            })

        } catch (error) {
            console.log(error);
            navigate('/');
        }
    }, [cripto])

    if(loading || !coin) {
        return(
            <div className={styles.container}>
                <h4 className={styles.center}>Carregando Detalhes...</h4>
            </div>
        )
    }
    return(
        <div className={styles.container}>

            <h1 className={styles.center}>{coin?.name}</h1>
            <h1 className={styles.center}>{coin?.symbol}</h1>

            <section className={styles.content}>
                <img 
                    className={styles.logo}
                    src={`https://assets.coincap.io/assets/icons/${coin.symbol.toLowerCase()}@2x.png`}
                    alt="Imagem bitcoin"
                
                />

                <h1>{coin?.name} | {coin?.symbol}</h1>

                <p><strong>Preço:</strong> {coin?.formatedPrice}</p>

                <a>
                    <strong>Mercado: </strong>{coin?.formatedMarket}
                </a>

                <a>
                    <strong>Volume: </strong>{coin?.formatedVolume}
                </a>
                
                <a>
                    <strong>Mudança 24h: </strong><span className={Number(coin?.changePercent24Hr) > 0 ? styles.profit : styles.loss}>{Number(coin?.changePercent24Hr).toFixed(3)}</span>
                </a>

            </section>
        </div>
    )
}