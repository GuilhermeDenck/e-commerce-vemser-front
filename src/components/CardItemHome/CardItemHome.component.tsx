import { useEffect, useState } from "react";
import { ENDPOINT_TOPICS } from "../../constants";
import api from "../../service/api";
import { CardItem, CardItemInfos, CardItemValueName, DescP } from "./CardItemHome.style";

const CardItemHome = ({ id }: any) => {
  const [listItens, setListItens] = useState<any>([]);

  const getItensTopic = async (id: number) => {
    try {
      const { data } = await api.get(
        `${ENDPOINT_TOPICS.GET_ITEMS_TOPIC}/${id}`
      );
      setListItens(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getItensTopic(id);
  }, []);

  return (
    <div>
      {
        listItens.length > 0 ? (
        <CardItem>
          <img
            src={`data:image/jpeg;base64,${listItens[0].file}`}
            alt="imagem do item"
          />
          <CardItemInfos>
            <CardItemValueName>
              <p>Nome: {listItens[0].itemName.toUpperCase()}</p>
              <p>R$ {listItens[0].value}</p>
            </CardItemValueName>
            <DescP>Descrição: {listItens[0].description}</DescP>
          </CardItemInfos>
        </CardItem>
        ) : (
          <CardItem>
            <h2>Não há itens cadastrados.</h2>
          </CardItem>
        )
      }
    </div>
  );
};

export default CardItemHome;
