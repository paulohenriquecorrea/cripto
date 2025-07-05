import {useState, type FormEvent, useEffect} from 'react';
import {BsSearch } from 'react-icons/bs';
import {Link, useNavigate} from 'react-router-dom';
import styles from './home.module.css';

interface CoinProps {
    id: string;
    rank: string;
    symbol: string;
    name: string;
    supply: string;
    maxSupply: string;
    marketCapUsd: string;
    volumeUsd24Hr: string;
    priceUsd: string;
    changePercent24Hr: string;
    vwap24Hr: string;
    explorer: string;
}

interface dataProps{
    data: CoinProps[]
}

export function Home(){
    const [input, setInput] = useState("");
    const [coins, setCoins] = useState<CoinProps[]>([]);

    useEffect( () => {
        getData();
    }, [])

    async function getData() {
        fetch("https://rest.coincap.io/v3/assets?limit=10&offset=0&apiKey=04ed85be2ad375685d2a6680ba6b975039652fd47df96f2a6be85bdb226fbbf2")
        .then(response => response.json())
        .then((data: dataProps) => {
            const coinsData = data.data;

            const price = Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD"
            })

            const formatedResult = coinsData.map((item) => {
                const formated = {
                    ...item,
                    formatedPrice : price.format(Number(item.priceUsd))
                }

                return formated;
            })

            console.log(formatedResult);
        })
    }

    const navigate = useNavigate();

    function handleSubmit(e: FormEvent) {
        e.defaultPrevented;

        if (input === "") return;

        navigate(`/detail/${input}`)
        
    }

    function handleGetMore() {
        alert('teste')
    }

    return(
        <main className={styles.container}>
            <form className={styles.form} onSubmit={handleSubmit} >
                <input 
                    type="text" 
                    placeholder='Digite o nome da moeda... Ex bitcoin'
                    value={input}
                    onChange={(e) => {
                        setInput(e.target.value);
                    }}
                />
                <button type='submit'>
                    <BsSearch size={30} color='#FFF'/>
                </button>
            </form>

            <table>
                <thead>
                    <tr>
                        <th scope='col'>Moeda</th>
                        <th scope='col'>Valor de mercado</th>
                        <th scope='col'>Preço</th>
                        <th scope='col'>Volume</th>
                        <th scope='col'>Mudança 24h</th>
                    </tr>
                </thead>
                <tbody id='tbody'>

                    <tr className={styles.tr}>

                        <td className={styles.tdLabel} data-label="Moeda">
                            <Link to={'/detail/bitcoin'}>
                                <span>Bitcoin</span> | BTC
                            </Link>
                        </td>

                        <td className={styles.tdLabel} data-label="Valor Mercado">
                            1T
                        </td>
                        
                        <td className={styles.tdLabel} data-label="Preço">
                            8.000
                        </td>

                        <td className={styles.tdLabel} data-label="Volume">
                            2B
                        </td>

                        <td className={styles.tdProfit} data-label="Mudança 24h">
                           <span>1.20</span>
                        </td>
                    </tr>

                </tbody>
            </table>

            <button className={styles.buttonMore} onClick={handleGetMore}>
                Carregar mais...
            </button>
        </main>
    )
}