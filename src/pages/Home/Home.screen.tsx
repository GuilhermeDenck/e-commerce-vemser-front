import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { connect, DispatchProp } from "react-redux";
import api from "../../service/api";
import { DivSearch, ContainerAllInfo, DivDescriptionTopic } from "./Home.style";
import { isLoggedDTO } from "../../models/UserDTO";
import { RootState } from "../../store";
import { redirectAdmin, redirectToLogin } from "../../utils/utils";
import { getTopics } from "../../store/action/topicActions";
import { ModalDTO } from "../../models/ModalsDTO";
import { IconSearch } from "../../global.style";
import { TopicDTO } from "../../models/TopicDTO";
import { ENDPOINT_TOPICS, TYPE_USERS } from "../../constants";
import {
  CenterCustom,
  Container,
  InputForm,
  Title,
  TitleNotFoundInfo,
} from "../../global.style";
import {
  ModalBuyer,
  Pagination,
  CardTopicHome,
  ModalCardItens,
  ModalQuotation,
} from "../../components";

const Home = ({ user, dispatch }: isLoggedDTO & DispatchProp) => {
  const navigate = useNavigate();
  const hasUser: string | any = localStorage.getItem("token");
  const User = JSON.parse(hasUser);

  const [listTopics, setListTopics] = useState<Array<TopicDTO>>([]);
  const [listSearched, setListSearched] = useState<Array<TopicDTO>>([]);
  
  const [allPages, setAllPages] = useState<number>(0);
  const [allPagesSearch, setAllPagesSearch] = useState<number>(0);

  const [page, setPage] = useState<number>(0);
  const [pageSearch, setPageSeach] = useState<number>(0);
  
  const [isSearch, setIsSearch] = useState<boolean>(false);
  const [descriptionTopic, setDescriptionTopic] = useState("Todos os tópicos");
  const [inputSearch, setInputSearch] = useState<string>("");

  const [OpenModalAddQuotation, setOpenModalAddQuotation] = useState<ModalDTO>({
    open: false,
    id: 0,
  });

  const [OpenModalQuotation, setOpenModalQuotation] = useState<ModalDTO>({
    open: false,
    id: 0,
  });

  const [OpenModalItens, setOpenModalItens] = useState<ModalDTO>({
    open: false,
    id: 0,
  });

  const handleUserSearch = async () => {
    try {
      setPage(0);
      const { data } = await api.get(
        `${ENDPOINT_TOPICS.GET_ALL}=${pageSearch}&title=${inputSearch}`
      );
      setListSearched(data.content);
      setAllPagesSearch(data.totalPages);
      setIsSearch(true);
    } catch (error) {
      console.log(error);
    }
  };

  const getDescriptionTopic = () => {
    if (user.profile === TYPE_USERS.COLAB) {
      setDescriptionTopic("Seus tópicos");
    }
    if (
      user.profile === TYPE_USERS.MANAGER ||
      user.profile === TYPE_USERS.FINANCIER
    ) {
      setDescriptionTopic("Tópicos a aprovar");
    }
    if (user.profile === TYPE_USERS.USER) {
      setDescriptionTopic(
        "Aguarde o administrador registrar seu perfil de usuário."
      );
    }
  };
  useEffect(() => {
    if(User?.token) {
      api.defaults.headers.common['Authorization'] = User?.token;
    }
    redirectToLogin(navigate);
    redirectAdmin(navigate, user.profile);
    getDescriptionTopic();
  }, [user]);

  useEffect(() => {
    handleUserSearch();
  }, [inputSearch, pageSearch]);

  useEffect(() => {
    getTopics(setListTopics, setAllPages, page, setIsSearch);
  }, [page, OpenModalQuotation.open]);

  return (
    <Container>
      <CenterCustom>
        <Title size="24px" spacing="2">
          Seja bem-vindo(a), {User?.fullName}
        </Title>
      </CenterCustom>

      <DivSearch>
        <InputForm
          width={"50%"}
          height={"40px"}
          placeholder="Pesquisar"
          onChange={(e) => setInputSearch(e.target.value)}
        />
        <IconSearch onClick={() => handleUserSearch()} />
      </DivSearch>
      <DivDescriptionTopic>
        <h3>{descriptionTopic}</h3>
      </DivDescriptionTopic>
      <ContainerAllInfo>
        {!isSearch ? (
          listTopics.length ? (
            listTopics?.map((item: TopicDTO, index) => (
              <CardTopicHome
                item={item}
                user={user}
                key={index}
                setOpenModalQuotation={setOpenModalQuotation}
                setOpenModalAddQuotation={setOpenModalAddQuotation}
                setOpenModalItens={setOpenModalItens}
              />
            ))
          ) : (
            <CenterCustom>
              <TitleNotFoundInfo>Nenhum tópico encontrado</TitleNotFoundInfo>
            </CenterCustom>
          )
        ) : listSearched?.length ? (
          listSearched?.map((item: TopicDTO, index) => (
            <CardTopicHome
              item={item}
              user={user}
              key={index}
              setOpenModalQuotation={setOpenModalQuotation}
              setOpenModalAddQuotation={setOpenModalAddQuotation}
              setOpenModalItens={setOpenModalItens}
            />
          ))
        ) : (
          <CenterCustom>
            <TitleNotFoundInfo>Nenhum tópico encontrado</TitleNotFoundInfo>
          </CenterCustom>
        )}

        {OpenModalItens.open && (
          <ModalCardItens
            id={OpenModalItens.id}
            onClick={() => setOpenModalItens({ open: false })}
          />
        )}
        {OpenModalAddQuotation.open && (
          <ModalBuyer
            id={OpenModalAddQuotation.id}
            onClick={() => setOpenModalAddQuotation({ open: false })}
          />
        )}
        {OpenModalQuotation.open && (
          <ModalQuotation
            id={OpenModalQuotation.id}
            onClick={() => setOpenModalQuotation({ open: false })}
          />
        )}
      </ContainerAllInfo>
      <CenterCustom>
        {!isSearch
          ? listTopics?.length > 0 && (
              <Pagination
                page={page}
                onPageChange={(index: number) => setPage(index)}
                allPages={allPages}
              />
            )
          : listSearched?.length > 0 && (
              <Pagination
                page={pageSearch}
                onPageChange={(index: number) => setPageSeach(index)}
                allPages={allPagesSearch}
              />
            )}
      </CenterCustom>
    </Container>
  );
};

const mapStateToProps = (state: RootState) => ({
  user: state.authReducer,
});

export default connect(mapStateToProps)(Home);
