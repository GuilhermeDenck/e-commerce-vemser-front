import { useEffect, useState } from "react";
import { connect, DispatchProp } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CenterCustom, Container } from "../../global.style";
import { isLoggedDTO } from "../../models/UserDTO";
import moment from "moment";

import api from "../../service/api";
import { RootState } from "../../store";
import { redirectToLogin } from "../../utils/utils";
import { ContainerCard, TitleCard, ButtonCard } from "./Home.style";

import { ModalBuyer, ModalCotation } from "../../components"

//listas apenas do colaborador se for usuario tipo colaborador
//lista geral com botao de aprovar ou reprovar pro gestor se tiver mais de duas cotacoes
//lista geral com botao de aprovar ou reprovar pro financeiro se o gestor tiver aprovado
//lista geral pro comprador com modal pra solicitar cotacao

const Home = ({ auth, dispatch }: isLoggedDTO & DispatchProp) => {
  const navigate = useNavigate();
  const hasUser: string | any = localStorage.getItem("token");
  const User = JSON.parse(hasUser);

  const [list, setList] = useState<any>([]);
  const [OpenModalAddCotation, setOpenModalAddCotation] = useState<boolean>(false);
  const [OpenModalCotation, setOpenModalCotation] = useState<boolean>(false);
  const [showItensTopic, setShowItensTopic] = useState<boolean>(false);

  useEffect(() => {
    redirectToLogin(navigate);
  }, []);

  const setup = async () => {
    try {
      const { data } = await api.get("/main-page/topics?page=0");
      setList(data);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setup();
  }, []);

  return (
    <Container>
      <CenterCustom>
        <h1>Seja bem-vindo(a), {User?.fullName}</h1>
      </CenterCustom>
      {
        list?.content?.map((item: any) => (
        <ContainerCard key={item.topicId}>
          <TitleCard>
            <p>Título: {item.title}</p>
            <p>Data: {moment(item.date).format("DD/MM/YYYY")}</p>
            <p>Valor total: R$ {item.totalValue}</p>
            <p>Status: {item.status}</p>
            <ButtonCard onClick={ () => setOpenModalAddCotation(!OpenModalAddCotation) }> Adicinar cotação </ButtonCard>
          </TitleCard>
          <ButtonCard onClick={ () => setShowItensTopic(!showItensTopic)}> Visualizar Itens do tópico </ButtonCard>
          <ButtonCard onClick={ () => setOpenModalCotation(!OpenModalCotation) } > Visualizar cotações </ButtonCard>
          {/* {
            showItensTopic && (
              exemplo.Itens.map((item, index) => (
                <CardItem key={index}>
                  <img src={Image} alt="imagem do iten" />
                  <p>{item.nome}</p>
                  <p>{item.data}</p>
                  <p>{item.valor}</p>
                </CardItem>
              ))
            )
          } */}
        </ContainerCard>
        ))
      }
      
      { OpenModalAddCotation && ( <ModalBuyer onClick={ () => setOpenModalAddCotation(!OpenModalAddCotation) } /> ) }
      { OpenModalCotation && ( <ModalCotation onClick={ () => setOpenModalCotation(!OpenModalCotation) } /> ) }
    </Container>
  );
};

const mapStateToProps = (state: RootState) => ({
  auth: state.authReducer,
});

export default connect(mapStateToProps)(Home);