import Notiflix from "notiflix";
import { useEffect, useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import { connect } from "react-redux";
import api from "../../service/api";
import { StatusEnum } from "../../enums/StatusEnum";
import { RootState } from "../../store";
import { maskMoneyHTML } from "../../utils/utils";
import {
  ModalQuotationDTO,
  ModalQuotationValuesDTO,
} from "../../models/ModalsDTO";
import {
  TYPE_USERS,
  ENDPOINT_MANAGER,
  ENDPOINT_QUOTATION,
  ENDPOINT_FINANCIER,
} from "../../constants";
import {
  Modal,
  BtnClose,
  ContainerModal,
} from "../globalStyleComponents.style"
import {
  TopModal,
  DivButtons,
  DivQuotations,
  BtnModalQuotation,
} from "./ModalQuotation.style";

const ModalQuotation = ({ user, onClick, id }: ModalQuotationDTO) => {
  const [valuesQuotation, setValuesQuotation] = useState<Array<ModalQuotationValuesDTO>>([]);

  const getQuotation = async (id: number | undefined) => {
    try {
      const { data } = await api.get(
        `${ENDPOINT_QUOTATION.MAIN_PAGE_QUOTATION}/${id}`
      );
      setValuesQuotation(data);
    } catch (error) {
      console.log(error);
    }
  };

  const reproveAllQuotations = async () => {
    try {
      const { data } = await api.put(
        `${ENDPOINT_MANAGER.REPROVE_ALL_QUOTATIONS}/${id}`
      );
      Notiflix.Notify.success(`Tópico reprovado.`);
    } catch (error) {
      Notiflix.Notify.failure(`Sinto muito, mas nao foi possível reprovar esse tópico.`);
    } finally {
      onClick();
      getQuotation(id);
    }
  };

  const handleAproveQuotation = async (idQuotation: number) => {
    try {
      const { data } = await api.post(
        `${ENDPOINT_MANAGER.APROVE_QUOTATION}/${idQuotation}`
      );
      Notiflix.Notify.success(`Cotação aprovada.`);
    } catch (error) {
      console.log(error);
      Notiflix.Notify.failure(`Sinto muito, mas nao foi possível aprovar essa cotação.`);
    } finally {
      onClick();
      getQuotation(id);
    }
  };

  const handleAproveByFinancier = async (status: boolean) => {
    try {
      const { data } = await api.put(
        `${ENDPOINT_FINANCIER.UPDATE_STATUS}/${id}/${status}`
      );
      Notiflix.Notify.success(`Cotação aprovada.`);
    } catch (error) {
      Notiflix.Notify.failure(`Sinto muito, mas nao foi possível aprovar essa cotação.`);
    } finally {
      onClick();
    }
  };

  useEffect(() => {
    getQuotation(id);
  }, []);

  return (
    <ContainerModal>
      <Modal>
        <BtnClose onClick={onClick}>
          <AiFillCloseCircle />
        </BtnClose>
        <TopModal>
          <h1>Cotações </h1>
          {user.profile === TYPE_USERS.MANAGER && valuesQuotation.length >= 2 && (
            <BtnModalQuotation
              color={"#f44336"}
              onClick={() => reproveAllQuotations()}
            >
              Reprovar todas as cotações
            </BtnModalQuotation>
          )}
        </TopModal>

        {valuesQuotation.length ? (
          valuesQuotation.map((item: ModalQuotationValuesDTO) => (
            <DivQuotations key={item.quotationId}>
              <p> Status: {StatusEnum[item.quotationStatus]}</p>
              <p> {maskMoneyHTML(item.quotationPrice)}</p>
              <DivButtons>
                {
                  valuesQuotation.length < 2 && user.profile === TYPE_USERS.MANAGER ? (
                    <span>Ainda não há cotações suficientes.</span>
                  ) : (
                    <>
                      {
                        (user.profile === TYPE_USERS.MANAGER ||
                        user.profile === TYPE_USERS.FINANCIER) && (
                          <BtnModalQuotation
                            color={"#04a96d"}
                            onClick={() => { user.profile === TYPE_USERS.MANAGER ? handleAproveQuotation(item.quotationId): handleAproveByFinancier(true)}}
                          >
                          Aprovar
                          </BtnModalQuotation>
                        )
                      }
                      {
                        user.profile === TYPE_USERS.FINANCIER && (
                          <BtnModalQuotation
                            color={"#f44336"}
                            onClick={() => handleAproveByFinancier(false)}
                          >
                            Reprovar
                          </BtnModalQuotation>
                        )
                      }
                    </>
                  )
                }
              </DivButtons>
            </DivQuotations>
          ))
        ) : (
          <p> Não há cotações para exibir </p>
        )}
      </Modal>
    </ContainerModal>
  );
};

const mapStateToProps = (state: RootState) => ({
  user: state.authReducer,
});

export default connect(mapStateToProps)(ModalQuotation);
